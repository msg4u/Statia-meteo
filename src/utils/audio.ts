// Sound synthesizer using Web Audio API and Speech Synthesis

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playPopSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch {
    // Audio context not allowed or blocked
  }
}

export function playChimeSound() {
  try {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.08);

      gain.gain.setValueAtTime(0.2, ctx.currentTime + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.08 + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + index * 0.08);
      osc.stop(ctx.currentTime + index * 0.08 + 0.35);
    });
  } catch {
    // ignore
  }
}

export function playWaterDropSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch {
    // ignore
  }
}

export function playWindSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(320, ctx.currentTime + 0.2);
    osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.15);
    gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  } catch {
    // ignore
  }
}

export function playSuccessFanfare() {
  try {
    const ctx = getAudioContext();
    const notes = [
      { f: 523.25, d: 0.15, delay: 0 },
      { f: 659.25, d: 0.15, delay: 0.12 },
      { f: 783.99, d: 0.15, delay: 0.24 },
      { f: 1046.5, d: 0.4, delay: 0.36 },
    ];

    notes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, ctx.currentTime + n.delay);

      gain.gain.setValueAtTime(0.25, ctx.currentTime + n.delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + n.delay + n.d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + n.delay);
      osc.stop(ctx.currentTime + n.delay + n.d);
    });
  } catch {
    // ignore
  }
}

// Text to speech with warm, female Romanian narrator voice
// Tier 1: Gemini AI TTS ('gemini-3.1-flash-tts-preview' with voice 'Kore' - natural, warm female Romanian)
// Tier 2: Enhanced Web Speech Synthesis with dedicated female voice selection and pitch tuning

export interface NarratorState {
  isSpeaking: boolean;
  isLoading: boolean;
  activeText: string | null;
}

let currentAudio: HTMLAudioElement | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let activeSpeechId = 0;
const clientAudioCache = new Map<string, string>(); // cleaned text -> ObjectURL
const pendingPreloads = new Map<string, Promise<string | null>>(); // deduplicate ongoing fetches

// Listeners for global narrator status (enables reactive UI on buttons)
let narratorStatus: NarratorState = {
  isSpeaking: false,
  isLoading: false,
  activeText: null,
};
const statusListeners = new Set<(status: NarratorState) => void>();

function notifyStatus(update: Partial<NarratorState>) {
  narratorStatus = { ...narratorStatus, ...update };
  statusListeners.forEach((fn) => {
    try {
      fn(narratorStatus);
    } catch {
      // ignore listener errors
    }
  });
}

export function subscribeNarrator(listener: (status: NarratorState) => void): () => void {
  statusListeners.add(listener);
  listener(narratorStatus);
  return () => {
    statusListeners.delete(listener);
  };
}

export function getNarratorStatus(): NarratorState {
  return narratorStatus;
}

// Clean text for speech synthesis (strip emojis and decorative characters)
export function sanitizeText(text: string): string {
  return text
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    .replace(/[«»""'']/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

// Check if a text is already in the fast client audio cache
export function isAudioCached(text: string): boolean {
  const cleaned = sanitizeText(text);
  return clientAudioCache.has(cleaned);
}

// Preload a speech text in the background so it plays with 0ms delay when clicked
export async function preloadSpeech(text: string): Promise<string | null> {
  const cleaned = sanitizeText(text);
  if (!cleaned) return null;

  if (clientAudioCache.has(cleaned)) {
    return clientAudioCache.get(cleaned)!;
  }

  if (pendingPreloads.has(cleaned)) {
    return pendingPreloads.get(cleaned)!;
  }

  const fetchPromise = (async () => {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleaned, voice: 'Kore' }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        clientAudioCache.set(cleaned, url);
        return url;
      }
    } catch {
      // ignore preload failures, fallback will handle at play time
    } finally {
      pendingPreloads.delete(cleaned);
    }
    return null;
  })();

  pendingPreloads.set(cleaned, fetchPromise);
  return fetchPromise;
}

// Preload multiple speech texts in sequence/background
export function preloadBatch(texts: string[]) {
  // Fire preload requests in small staggered batches to avoid network congestion
  let delay = 0;
  texts.forEach((txt) => {
    setTimeout(() => {
      preloadSpeech(txt);
    }, delay);
    delay += 250;
  });
}

// Preload priority audios on application start so buttons play in 0ms
export function preloadCoreAudios() {
  import('../data/speechTexts').then(({ CORE_SPEECH_TEXTS }) => {
    const priorityTexts = [
      CORE_SPEECH_TEXTS.welcome,
      CORE_SPEECH_TEXTS.story_1,
      CORE_SPEECH_TEXTS.story_2,
      CORE_SPEECH_TEXTS.instrument_termi,
      CORE_SPEECH_TEXTS.instrument_morisca,
      CORE_SPEECH_TEXTS.instrument_picurel,
      CORE_SPEECH_TEXTS.sofia_helper,
    ];
    preloadBatch(priorityTexts);
  }).catch(() => {});
}

function fallbackWebSpeech(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    notifyStatus({ isSpeaking: false, isLoading: false, activeText: null });
    if (onEnd) onEnd();
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ro-RO';
  utterance.rate = 0.92; // Warm, steady storytelling pace for children
  utterance.pitch = 1.25; // Gentle, cheerful, maternal tone

  // Select Romanian female voice if available
  const voices = window.speechSynthesis.getVoices();
  const roFemaleVoice = voices.find(
    (v) =>
      v.lang.toLowerCase().startsWith('ro') &&
      (v.name.toLowerCase().includes('ioana') ||
        v.name.toLowerCase().includes('carmen') ||
        v.name.toLowerCase().includes('female') ||
        v.name.toLowerCase().includes('alina') ||
        v.name.toLowerCase().includes('google română') ||
        v.name.toLowerCase().includes('natural'))
  );

  const roVoice = roFemaleVoice || voices.find((v) => v.lang.toLowerCase().startsWith('ro'));
  if (roVoice) {
    utterance.voice = roVoice;
  }

  utterance.onstart = () => {
    notifyStatus({ isSpeaking: true, isLoading: false, activeText: text });
  };

  utterance.onend = () => {
    currentUtterance = null;
    notifyStatus({ isSpeaking: false, isLoading: false, activeText: null });
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    currentUtterance = null;
    notifyStatus({ isSpeaking: false, isLoading: false, activeText: null });
    if (onEnd) onEnd();
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export async function speakText(text: string, onEnd?: () => void) {
  stopSpeaking();
  const speechId = ++activeSpeechId;

  const cleaned = sanitizeText(text);
  if (!cleaned) {
    if (onEnd) onEnd();
    return;
  }

  // If already in client cache, play immediately (0ms delay!)
  const cachedUrl = clientAudioCache.get(cleaned);
  if (cachedUrl) {
    playAudioUrl(cachedUrl, speechId, text, cleaned, onEnd);
    return;
  }

  // Not in client cache: notify that we are preparing the audio
  notifyStatus({ isLoading: true, isSpeaking: false, activeText: text });

  try {
    const audioUrl = await preloadSpeech(cleaned);

    // Check if another speech request was triggered in the meantime
    if (speechId !== activeSpeechId) {
      return;
    }

    if (audioUrl) {
      playAudioUrl(audioUrl, speechId, text, cleaned, onEnd);
      return;
    }
  } catch (err) {
    console.warn('Gemini TTS endpoint not reachable, falling back to Web Speech:', err);
  }

  // Fallback if network failed or server offline
  if (speechId === activeSpeechId) {
    fallbackWebSpeech(cleaned, onEnd);
  }
}

function playAudioUrl(
  audioUrl: string,
  speechId: number,
  originalText: string,
  cleanedText: string,
  onEnd?: () => void
) {
  const audio = new Audio(audioUrl);
  currentAudio = audio;

  audio.onplay = () => {
    if (speechId === activeSpeechId) {
      notifyStatus({ isSpeaking: true, isLoading: false, activeText: originalText });
    }
  };

  audio.onended = () => {
    if (currentAudio === audio) {
      currentAudio = null;
    }
    if (speechId === activeSpeechId) {
      notifyStatus({ isSpeaking: false, isLoading: false, activeText: null });
      if (onEnd) onEnd();
    }
  };

  audio.onerror = () => {
    if (currentAudio === audio) {
      currentAudio = null;
    }
    if (speechId === activeSpeechId) {
      fallbackWebSpeech(cleanedText, onEnd);
    }
  };

  audio.play().catch((err) => {
    console.warn('Audio play error, falling back:', err);
    if (speechId === activeSpeechId) {
      fallbackWebSpeech(cleanedText, onEnd);
    }
  });
}

export function stopSpeaking() {
  activeSpeechId++;
  notifyStatus({ isSpeaking: false, isLoading: false, activeText: null });

  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch {
      // ignore
    }
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
    currentUtterance = null;
  }
}
