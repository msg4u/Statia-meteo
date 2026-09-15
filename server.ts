import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import crypto from "crypto";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// In-memory cache for generated TTS WAV audio to ensure instant replay
const ttsCache = new Map<string, Buffer>();
const MAX_CACHE_SIZE = 300;

// Lazy initialized Gemini client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

// Convert 24kHz 16-bit mono PCM into standard WAV format
function pcmToWav(pcmData: Buffer, sampleRate = 24000, channels = 1): Buffer {
  const header = Buffer.alloc(44);
  const byteRate = sampleRate * channels * 2;
  const blockAlign = channels * 2;

  // "RIFF" chunk
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcmData.length, 4);
  header.write("WAVE", 8);

  // "fmt " sub-chunk
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  header.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
  header.writeUInt16LE(channels, 22); // NumChannels (1 = Mono)
  header.writeUInt32LE(sampleRate, 24); // SampleRate (24000)
  header.writeUInt32LE(byteRate, 28); // ByteRate
  header.writeUInt16LE(blockAlign, 32); // BlockAlign
  header.writeUInt16LE(16, 34); // BitsPerSample (16 bits)

  // "data" sub-chunk
  header.write("data", 36);
  header.writeUInt32LE(pcmData.length, 40);

  return Buffer.concat([header, pcmData]);
}

// Sanitize text for clear spoken Romanian without emojis
function cleanTextForSpeech(text: string): string {
  return text
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    .replace(/[«»""'']/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

// Handler for TTS generation
async function generateTTSAudio(text: string, voiceName = "Kore"): Promise<Buffer> {
  const cleaned = cleanTextForSpeech(text);
  if (!cleaned) {
    throw new Error("Text is empty after sanitization");
  }

  const cacheKey = crypto.createHash("md5").update(`${voiceName}:${cleaned}`).digest("hex");
  if (ttsCache.has(cacheKey)) {
    return ttsCache.get(cacheKey)!;
  }

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-tts-preview",
    contents: cleaned,
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            // 'Kore' is a warm, friendly female voice ideal for children narration
            voiceName: voiceName,
          },
        },
      },
    },
  });

  const part = response.candidates?.[0]?.content?.parts?.[0];
  const b64Data = part?.inlineData?.data;

  if (!b64Data) {
    throw new Error("No audio data received from Gemini TTS model");
  }

  const pcmBuffer = Buffer.from(b64Data, "base64");
  const wavBuffer = pcmToWav(pcmBuffer, 24000, 1);

  if (ttsCache.size >= MAX_CACHE_SIZE) {
    const firstKey = ttsCache.keys().next().value;
    if (firstKey) ttsCache.delete(firstKey);
  }
  ttsCache.set(cacheKey, wavBuffer);

  return wavBuffer;
}

// Health check API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// GET /api/tts?text=...
app.get("/api/tts", async (req, res) => {
  try {
    const text = (req.query.text as string) || "";
    const voice = (req.query.voice as string) || "Kore";
    if (!text.trim()) {
      return res.status(400).json({ error: "Missing text parameter" });
    }

    const wavBuffer = await generateTTSAudio(text, voice);
    res.setHeader("Content-Type", "audio/wav");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(wavBuffer);
  } catch (error: any) {
    console.error("TTS GET error:", error?.message || error);
    res.status(500).json({ error: error?.message || "Failed to generate TTS" });
  }
});

// POST /api/tts
app.post("/api/tts", async (req, res) => {
  try {
    const { text, voice = "Kore" } = req.body;
    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "Text is required" });
    }

    const wavBuffer = await generateTTSAudio(text, voice);
    res.setHeader("Content-Type", "audio/wav");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(wavBuffer);
  } catch (error: any) {
    console.error("TTS POST error:", error?.message || error);
    res.status(500).json({ error: error?.message || "Failed to generate TTS" });
  }
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
  });
}

startServer();
