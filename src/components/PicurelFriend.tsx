import React from 'react';
import { Volume2, Droplets, Plus, Minus } from 'lucide-react';
import { playWaterDropSound, speakText } from '../utils/audio';

interface PicurelFriendProps {
  rainCm: number;
  onChangeRain: (cm: number) => void;
  interactive?: boolean;
}

export const PicurelFriend: React.FC<PicurelFriendProps> = ({
  rainCm,
  onChangeRain,
  interactive = true,
}) => {
  const maxCm = 15;

  const getSpeechText = () => {
    if (rainCm === 0) {
      return 'Sunt uscat și curat! N-a căzut nicio picătură de ploaie.';
    } else if (rainCm <= 2) {
      return `Am adunat ${rainCm} cm de apă. A fost doar o burniță ușoară!`;
    } else if (rainCm <= 6) {
      return `Am adunat ${rainCm} cm de ploaie! A plouat bine peste noapte!`;
    } else {
      return `Uau, ${rainCm} cm! Sunt aproape plin! A fost o ploaie torențială!`;
    }
  };

  const handleSpeak = () => {
    speakText(`Picurel spune: ${getSpeechText()}`);
  };

  const handleAddRain = (amount: number) => {
    playWaterDropSound();
    const newRain = Math.max(0, Math.min(maxCm, rainCm + amount));
    onChangeRain(newRain);
  };

  // Water height percentage
  const waterPercentage = Math.min(100, Math.max(8, (rainCm / maxCm) * 100));

  return (
    <div
      id="picurel-friend-card"
      className="bg-blue-50/90 border-3 border-blue-300 rounded-3xl p-5 shadow-sm flex flex-col items-center relative transition-all"
    >
      {/* Character Header */}
      <div className="flex items-center justify-between w-full mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💧</span>
          <span className="font-fun text-xl font-bold text-blue-900">Picurel</span>
        </div>
        <button
          id="picurel-audio-btn"
          onClick={handleSpeak}
          title="Ascultă ce spune Picurel"
          className="p-2 bg-blue-200 hover:bg-blue-300 rounded-full text-blue-800 transition-colors shadow-xs"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Speech bubble */}
      <div className="bg-white border-2 border-blue-200 rounded-2xl p-3 text-sm text-blue-950 font-semibold mb-4 text-center shadow-xs w-full min-h-[52px] flex items-center justify-center">
        "{getSpeechText()}"
      </div>

      {/* Visual illustration of Picurel (cut plastic bottle with stones & cm scale) */}
      <div className="relative w-48 h-64 flex items-center justify-center">
        {/* The Plastic Bottle Gauge */}
        <div className="w-32 h-56 bg-sky-100/50 border-2 border-blue-300/80 rounded-b-3xl relative overflow-hidden flex flex-col justify-end shadow-inner">
          {/* Top smooth tape band */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-sky-300/40 border-b border-sky-400/50 flex items-center justify-center">
            <span className="text-[10px] text-blue-800 font-bold tracking-wider">MARGINE SIGURĂ</span>
          </div>

          {/* Water Fill */}
          <div
            className="w-full bg-gradient-to-t from-blue-500/80 to-sky-400/75 transition-all duration-500 relative flex flex-col items-center justify-center"
            style={{ height: `${waterPercentage}%` }}
          >
            {/* Wavy water surface */}
            <div className="absolute -top-2 left-0 right-0 h-3 overflow-hidden">
              <div className="w-[200%] h-full flex animate-pulse">
                <svg viewBox="0 0 100 20" className="w-full h-full fill-sky-400/80" preserveAspectRatio="none">
                  <path d="M0 10 Q 25 0, 50 10 T 100 10 L 100 20 L 0 20 Z" />
                </svg>
              </div>
            </div>

            {/* Cute Face on Water if rain > 0 */}
            {rainCm > 0 && (
              <div className="relative z-10 flex flex-col items-center select-none">
                <div className="flex gap-2.5 mb-1">
                  <div className="w-2 h-2 bg-blue-900 rounded-full"></div>
                  <div className="w-2 h-2 bg-blue-900 rounded-full"></div>
                </div>
                <div className="w-3.5 h-2 border-b-2 border-blue-950 rounded-full"></div>
              </div>
            )}
          </div>

          {/* Stones at the bottom for stability */}
          <div className="absolute bottom-0 left-0 right-0 h-6 flex items-end justify-center gap-1 pb-1 z-10 pointer-events-none opacity-80">
            <div className="w-5 h-4 bg-stone-400 rounded-full border border-stone-500"></div>
            <div className="w-6 h-5 bg-stone-500 rounded-full border border-stone-600 -mx-1"></div>
            <div className="w-4 h-3.5 bg-stone-400 rounded-full border border-stone-500"></div>
            <div className="w-5 h-4.5 bg-stone-600 rounded-full border border-stone-700"></div>
          </div>

          {/* Centimeter scale ticks printed on the right */}
          <div className="absolute top-5 right-1 bottom-6 w-7 flex flex-col justify-between items-end pr-1 z-20 pointer-events-none">
            {[15, 12, 9, 6, 3, 0].map((mark) => (
              <div key={mark} className="flex items-center gap-1">
                <span className="text-[10px] font-extrabold text-blue-950">{mark}</span>
                <div className="w-2.5 h-[1.5px] bg-blue-800"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Water Droplet mascot beside bottle */}
        <div className="absolute -left-2 top-10 flex flex-col items-center animate-bounce duration-1000">
          <div className="w-9 h-9 bg-sky-400 rounded-full rounded-tr-none rotate-45 border-2 border-sky-600 flex items-center justify-center shadow-xs">
            <div className="-rotate-45 text-xs font-bold text-white">💧</div>
          </div>
          <span className="text-[10px] font-bold text-blue-900 bg-white/90 px-1.5 py-0.5 rounded-full mt-1 border border-blue-200">
            {rainCm} cm
          </span>
        </div>
      </div>

      {/* Interactive Controls */}
      {interactive && (
        <div className="w-full mt-4 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <button
              id="picurel-minus-btn"
              onClick={() => handleAddRain(-1)}
              disabled={rainCm <= 0}
              className="py-2 px-3 bg-blue-200 hover:bg-blue-300 disabled:opacity-40 disabled:cursor-not-allowed text-blue-900 font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-transform active:scale-95 shadow-xs"
              title="Golește 1 cm"
            >
              <Minus className="w-4 h-4" />
              <span className="text-xs">1 cm</span>
            </button>

            <button
              id="picurel-add-btn"
              onClick={() => handleAddRain(2)}
              disabled={rainCm >= maxCm}
              className="flex-1 py-2 px-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-transform active:scale-95 shadow-xs"
            >
              <Droplets className="w-4 h-4" />
              <span className="text-xs">A plouat! (+2 cm)</span>
            </button>

            <button
              id="picurel-plus-btn"
              onClick={() => handleAddRain(1)}
              disabled={rainCm >= maxCm}
              className="py-2 px-3 bg-blue-200 hover:bg-blue-300 disabled:opacity-40 disabled:cursor-not-allowed text-blue-900 font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-transform active:scale-95 shadow-xs"
              title="Adaugă 1 cm"
            >
              <Plus className="w-4 h-4" />
              <span className="text-xs">1 cm</span>
            </button>
          </div>

          <div className="flex justify-between items-center bg-white/70 rounded-xl p-1.5 border border-blue-200">
            {[0, 3, 7, 12].map((preset) => (
              <button
                key={preset}
                id={`picurel-preset-${preset}`}
                onClick={() => {
                  playWaterDropSound();
                  onChangeRain(preset);
                }}
                className={`py-1 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  rainCm === preset
                    ? 'bg-blue-600 text-white shadow-xs scale-105'
                    : 'text-blue-800 hover:bg-blue-100'
                }`}
              >
                {preset === 0 && '0 cm (Uscat)'}
                {preset === 3 && '3 cm (Lin)'}
                {preset === 7 && '7 cm (Mult)'}
                {preset === 12 && '12 cm (Potop!)'}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
