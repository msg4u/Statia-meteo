import express from "express";
import path from "path";
import fs from "fs";
import https from "https";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { CORE_SPEECH_TEXTS } from "./src/data/speechTexts";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Disk cache directory for persistent audio playback (survives restarts)
const CACHE_DIR = path.join(process.cwd(), "audio_cache");
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// In-memory cache for 0ms sub-millisecond audio delivery
const ttsCache = new Map<string, Buffer>();
const MAX_MEMORY_CACHE = 500;

// Sanitize text for clear spoken Romanian without emojis or symbols
function cleanTextForSpeech(text: string): string {
  return text
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    .replace(/[«»""'']/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

// Split long text into natural sentence chunks for smooth speech synthesis
function splitIntoSentenceChunks(text: string, maxLen = 160): string[] {
  const sentences = text.match(/[^.!?;:]+[.!?;:]+|[^.!?;:]+$/g) || [text];
  const chunks: string[] = [];
  let current = "";

  for (const s of sentences) {
    const trimmed = s.trim();
    if (!trimmed) continue;

    if ((current + " " + trimmed).trim().length <= maxLen) {
      current = (current + " " + trimmed).trim();
    } else {
      if (current) chunks.push(current);
      if (trimmed.length <= maxLen) {
        current = trimmed;
      } else {
        const parts = trimmed.split(/, /);
        let sub = "";
        for (const p of parts) {
          if ((sub ? `${sub}, ${p}` : p).length <= maxLen) {
            sub = sub ? `${sub}, ${p}` : p;
          } else {
            if (sub) chunks.push(sub);
            sub = p;
          }
        }
        if (sub) current = sub;
        else current = "";
      }
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

// Fetch a single audio chunk from the Romanian female TTS engine
function fetchRomanianAudioChunk(textChunk: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const url =
      "https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=ro&q=" +
      encodeURIComponent(textChunk);

    https
      .get(
        url,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        },
        (res) => {
          if (res.statusCode && res.statusCode >= 400) {
            return reject(new Error(`TTS stream failed with HTTP ${res.statusCode}`));
          }
          const dataChunks: Buffer[] = [];
          res.on("data", (chunk) => dataChunks.push(chunk));
          res.on("end", () => resolve(Buffer.concat(dataChunks)));
          res.on("error", reject);
        }
      )
      .on("error", reject);
  });
}

// Generate complete speech audio with disk and memory caching
async function getOrGenerateTTS(text: string): Promise<Buffer> {
  const cleaned = cleanTextForSpeech(text);
  if (!cleaned) {
    throw new Error("Text is empty after sanitization");
  }

  const cacheKey = crypto.createHash("md5").update(`ro_female:${cleaned}`).digest("hex");

  // 1. In-memory cache (0ms instant response)
  if (ttsCache.has(cacheKey)) {
    return ttsCache.get(cacheKey)!;
  }

  // 2. Disk cache (<1ms response)
  const diskPath = path.join(CACHE_DIR, `${cacheKey}.mp3`);
  if (fs.existsSync(diskPath)) {
    try {
      const diskBuffer = await fs.promises.readFile(diskPath);
      ttsCache.set(cacheKey, diskBuffer);
      return diskBuffer;
    } catch {
      // If disk read failed, fall through to regenerate
    }
  }

  // 3. Synthesize natural Romanian female speech in parallel chunks
  const chunks = splitIntoSentenceChunks(cleaned);
  const audioBuffers = await Promise.all(chunks.map(fetchRomanianAudioChunk));
  const fullMp3Buffer = Buffer.concat(audioBuffers);

  // Write to disk for future instant re-use
  fs.promises.writeFile(diskPath, fullMp3Buffer).catch((err) => {
    console.error("Failed to write to disk cache:", err?.message || err);
  });

  // Store in memory cache
  if (ttsCache.size >= MAX_MEMORY_CACHE) {
    const firstKey = ttsCache.keys().next().value;
    if (firstKey) ttsCache.delete(firstKey);
  }
  ttsCache.set(cacheKey, fullMp3Buffer);

  return fullMp3Buffer;
}

// Pre-warm all core speech texts at server startup so all user clicks have 0ms latency
async function prewarmCoreAudio() {
  console.log("Pre-warming core speech audio in background...");
  const entries = Object.entries(CORE_SPEECH_TEXTS);
  let cached = 0;
  let generated = 0;

  for (const [key, text] of entries) {
    try {
      const cleaned = cleanTextForSpeech(text);
      const cacheKey = crypto.createHash("md5").update(`ro_female:${cleaned}`).digest("hex");
      const diskPath = path.join(CACHE_DIR, `${cacheKey}.mp3`);

      if (fs.existsSync(diskPath)) {
        cached++;
        const buf = await fs.promises.readFile(diskPath);
        ttsCache.set(cacheKey, buf);
      } else {
        await getOrGenerateTTS(text);
        generated++;
        await new Promise((r) => setTimeout(r, 100));
      }
    } catch (err: any) {
      console.warn(`Could not prewarm [${key}]:`, err?.message || err);
    }
  }

  console.log(`Core speech ready! (Already cached: ${cached}, Newly generated: ${generated})`);
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Cache status endpoint
app.get("/api/tts/status", (req, res) => {
  const diskFiles = fs.existsSync(CACHE_DIR) ? fs.readdirSync(CACHE_DIR).length : 0;
  res.json({
    inMemoryCached: ttsCache.size,
    diskCached: diskFiles,
  });
});

// GET /api/tts?text=...
app.get("/api/tts", async (req, res) => {
  try {
    const text = (req.query.text as string) || "";
    if (!text.trim()) {
      return res.status(400).json({ error: "Missing text parameter" });
    }

    const mp3Buffer = await getOrGenerateTTS(text);
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.send(mp3Buffer);
  } catch (error: any) {
    console.error("TTS GET error:", error?.message || error);
    res.status(500).json({ error: error?.message || "Failed to generate TTS" });
  }
});

// POST /api/tts
app.post("/api/tts", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "Text is required" });
    }

    const mp3Buffer = await getOrGenerateTTS(text);
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.send(mp3Buffer);
  } catch (error: any) {
    console.error("TTS POST error:", error?.message || error);
    res.status(500).json({ error: error?.message || "Failed to generate TTS" });
  }
});

// POST /api/tts/preload - Batch pre-generation endpoint
app.post("/api/tts/preload", (req, res) => {
  const { texts } = req.body;
  if (Array.isArray(texts)) {
    (async () => {
      for (const t of texts) {
        if (typeof t === "string" && t.trim()) {
          try {
            await getOrGenerateTTS(t);
            await new Promise((r) => setTimeout(r, 80));
          } catch {
            // ignore
          }
        }
      }
    })();
    return res.json({ status: "started", count: texts.length });
  }
  res.status(400).json({ error: "texts must be an array" });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    prewarmCoreAudio().catch((err) => {
      console.warn("Prewarm core audio error:", err?.message || err);
    });
  });
}

startServer();
