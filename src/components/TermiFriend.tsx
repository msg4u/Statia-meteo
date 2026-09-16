import React from 'react';
import { TempLevel } from '../types';
import { ThermometerSnowflake, Sun, Sparkles } from 'lucide-react';
import { playChimeSound } from '../utils/audio';
import { SpeakButton } from './SpeakButton';

interface TermiFriendProps {
  temperature: number; // in degrees Celsius (-5 to 35)
  onChangeTemp: (temp: number) => void;
  interactive?: boolean;
}

export const TermiFriend: React.FC<TermiFriendProps> = ({
  temperature,
  onChangeTemp,
  interactive = true,
}) => {
  const getTempLevel = (t: number): TempLevel => {
    if (t <= 5) return 'freezing';
    if (t <= 14) return 'chilly';
    if (t <= 22) return 'mild';
    if (t <= 28) return 'warm';
    return 'hot';
  };

  const level = getTempLevel(temperature);

  const getSpeechText = () => {
    switch (level) {
      case 'freezing':
        return `Dârdâi de frig! Sunt ${temperature}°C! Pune-ți căciulă, fular și geacă groasă!`;
      case 'chilly':
        return `E răcoare afară, ${temperature}°C. E bine să ai un hanorac sau pulover.`;
      case 'mild':
        return `Vreme plăcută, ${temperature}°C! Nici prea cald, nici prea frig!`;
      case 'warm':
        return `E cald și frumos, ${temperature}°C! Soarele ne cheamă la joacă în tricou!`;
      case 'hot':
        return `Uau, ce zăpușeală, ${temperature}°C! Nu uita șapca și apa de băut!`;
    }
  };

  const handleSlide = (newTemp: number) => {
    playChimeSound();
    onChangeTemp(newTemp);
  };

  // Convert temperature (-5 to 35) to percentage from bottom (0% to 100%)
  const minT = -5;
  const maxT = 35;
  const tempPercent = Math.max(0, Math.min(100, ((temperature - minT) / (maxT - minT)) * 100));

  return (
    <div
      id="termi-friend-card"
      className="bg-rose-50/90 border-3 border-rose-300 rounded-3xl p-5 shadow-sm flex flex-col items-center relative transition-all"
    >
      {/* Character Header */}
      <div className="flex items-center justify-between w-full mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌡️</span>
          <span className="font-fun text-xl font-bold text-rose-900">Termi</span>
        </div>
        <SpeakButton
          id="termi-audio-btn"
          text={`Termi spune: ${getSpeechText()}`}
          variant="icon"
          size="sm"
          color="rose"
          label="Ascultă Termi"
        />
      </div>

      {/* Speech bubble */}
      <div className="bg-white border-2 border-rose-200 rounded-2xl p-3 text-sm text-rose-950 font-semibold mb-4 text-center shadow-xs w-full min-h-[52px] flex items-center justify-center">
        "{getSpeechText()}"
      </div>

      {/* Visual illustration of Termi (Cardboard backing + Straw + Red moving button on string) */}
      <div className="relative w-48 h-64 flex items-center justify-center">
        {/* Cardboard Plate */}
        <div className="w-36 h-56 bg-amber-100/90 border-2 border-amber-300 rounded-2xl shadow-md relative p-2 flex flex-col justify-between items-center overflow-hidden">
          {/* Background temperature gradient bar */}
          <div className="absolute inset-y-3 left-4 w-6 rounded-full bg-gradient-to-t from-blue-400 via-amber-300 to-rose-500 opacity-30"></div>

          {/* Top Sun Icon & Label */}
          <div className="flex items-center justify-between w-full px-2 z-10">
            <div className="flex items-center gap-1">
              <Sun className="w-4 h-4 text-amber-500 animate-spin-slow" />
              <span className="text-[11px] font-black text-rose-700">CALD</span>
            </div>
            <span className="text-[10px] font-bold text-rose-600">+35°C</span>
          </div>

          {/* Center: The Transparent Plastic Straw with string & Red Marker Button */}
          <div className="relative w-7 h-36 flex justify-center items-center z-20">
            {/* The string passing through */}
            <div className="absolute inset-y-0 w-0.5 bg-stone-400 border-dashed"></div>

            {/* The Clear Straw Tube */}
            <div className="w-4 h-full bg-white/60 border border-slate-300 rounded-full shadow-inner relative flex flex-col justify-end overflow-hidden">
              {/* Colored liquid fill inside straw */}
              <div
                className="w-full bg-gradient-to-t from-blue-500 via-amber-400 to-rose-500 transition-all duration-300 rounded-b-full"
                style={{ height: `${tempPercent}%` }}
              ></div>
            </div>

            {/* Movable Red Button / Bead on string */}
            <div
              className="absolute w-8 h-8 bg-rose-500 border-2 border-white rounded-full shadow-md transition-all duration-300 flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95"
              style={{ bottom: `calc(${tempPercent}% - 16px)` }}
              title="Trage nasturele roșu!"
            >
              {/* Center dot of button */}
              <div className="w-2.5 h-2.5 bg-rose-200 rounded-full"></div>
            </div>

            {/* Base Bulb of Thermometer made of Playdough */}
            <div className="absolute -bottom-3 w-8 h-8 bg-rose-600 rounded-full border-2 border-rose-300 shadow-md flex items-center justify-center">
              <div className="w-2 h-2 bg-white/70 rounded-full -mt-2 -ml-2"></div>
            </div>
          </div>

          {/* Bottom Snowflake Icon & Label */}
          <div className="flex items-center justify-between w-full px-2 z-10">
            <div className="flex items-center gap-1">
              <ThermometerSnowflake className="w-4 h-4 text-blue-500" />
              <span className="text-[11px] font-black text-blue-700">FRIG</span>
            </div>
            <span className="text-[10px] font-bold text-blue-600">-5°C</span>
          </div>
        </div>

        {/* Termi's cute mascot head floating on the side */}
        <div className="absolute -right-3 top-6 flex flex-col items-center">
          <div
            className={`w-12 h-12 rounded-full border-2 shadow-md flex items-center justify-center transition-all ${
              level === 'freezing'
                ? 'bg-blue-200 border-blue-400'
                : level === 'chilly'
                ? 'bg-sky-200 border-sky-400'
                : level === 'mild'
                ? 'bg-amber-100 border-amber-400'
                : 'bg-rose-200 border-rose-400'
            }`}
          >
            {level === 'freezing' && <span className="text-xl">🥶</span>}
            {level === 'chilly' && <span className="text-xl">🙂</span>}
            {level === 'mild' && <span className="text-xl">😊</span>}
            {level === 'warm' && <span className="text-xl">😄</span>}
            {level === 'hot' && <span className="text-xl">😎</span>}
          </div>
          <span className="text-xs font-black text-rose-950 bg-white px-2 py-0.5 rounded-full mt-1 border border-rose-200 shadow-xs">
            {temperature}°C
          </span>
        </div>
      </div>

      {/* Interactive Controls */}
      {interactive && (
        <div className="w-full mt-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-800">❄️ Frig</span>
            <input
              type="range"
              id="termi-temp-slider"
              min={minT}
              max={maxT}
              step={1}
              value={temperature}
              onChange={(e) => handleSlide(Number(e.target.value))}
              className="w-full accent-rose-500 h-2 bg-gradient-to-r from-blue-300 via-amber-200 to-rose-400 rounded-lg cursor-pointer"
            />
            <span className="text-xs font-bold text-rose-800">☀️ Cald</span>
          </div>

          <div className="flex justify-between items-center bg-white/70 rounded-xl p-1.5 border border-rose-200">
            {[0, 12, 20, 30].map((preset) => (
              <button
                key={preset}
                id={`termi-preset-${preset}`}
                onClick={() => handleSlide(preset)}
                className={`py-1 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  temperature === preset
                    ? 'bg-rose-500 text-white shadow-xs scale-105'
                    : 'text-rose-800 hover:bg-rose-100'
                }`}
              >
                {preset === 0 && '0°C (Ger)'}
                {preset === 12 && '12°C (Răcoare)'}
                {preset === 20 && '20°C (Plăcut)'}
                {preset === 30 && '30°C (Căldură)'}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
