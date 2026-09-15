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

let currentAudio: HTMLAudioElement | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let activeSpeechId = 0;
const clientAudioCache = new Map<string, string>(); // text -> ObjectURL

// Clean text for speech synthesis (strip emojis and decorative characters)
function sanitizeText(text: string): string {
  return text
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    .replace(/[«»""'']/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function fallbackWebSpeech(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
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

  utterance.onend = () => {
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    currentUtterance = null;
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

  // Try Server-Side Gemini TTS for genuine, warm female Romanian voice across all devices & browsers
  try {
    let audioUrl = clientAudioCache.get(cleaned);

    if (!audioUrl) {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleaned, voice: 'Kore' }),
      });

      if (response.ok) {
        const blob = await response.blob();
        audioUrl = URL.createObjectURL(blob);
        clientAudioCache.set(cleaned, audioUrl);
      }
    }

    // Check if another speech request was triggered while fetching
    if (speechId !== activeSpeechId) {
      return;
    }

    if (audioUrl) {
      const audio = new Audio(audioUrl);
      currentAudio = audio;

      audio.onended = () => {
        if (currentAudio === audio) {
          currentAudio = null;
        }
        if (onEnd && speechId === activeSpeechId) {
          onEnd();
        }
      };

      audio.onerror = () => {
        if (currentAudio === audio) {
          currentAudio = null;
        }
        if (speechId === activeSpeechId) {
          fallbackWebSpeech(cleaned, onEnd);
        }
      };

      await audio.play();
      return;
    }
  } catch (err) {
    console.warn('Gemini TTS endpoint not reachable, falling back to Web Speech:', err);
  }

  // Fallback to local synthesizer if offline or server is starting up
  if (speechId === activeSpeechId) {
    fallbackWebSpeech(cleaned, onEnd);
  }
}

export function stopSpeaking() {
  activeSpeechId++;
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
