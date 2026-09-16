import React from 'react';
import { WindSpeed } from '../types';
import { Wind } from 'lucide-react';
import { playWindSound } from '../utils/audio';
import { SpeakButton } from './SpeakButton';

interface MoriscaFriendProps {
  windSpeed: WindSpeed;
  onChangeSpeed: (speed: WindSpeed) => void;
  interactive?: boolean;
}

export const MoriscaFriend: React.FC<MoriscaFriendProps> = ({
  windSpeed,
  onChangeSpeed,
  interactive = true,
}) => {
  // Determine rotation duration
  const getSpinDuration = () => {
    switch (windSpeed) {
      case 'calm':
        return '20s'; // almost still
      case 'gentle':
        return '4s';
      case 'fast':
        return '1.2s';
      case 'strong':
        return '0.4s';
    }
  };

  const getSpeechText = () => {
    switch (windSpeed) {
      case 'calm':
        return 'Stau liniștită, aerul e foarte calm azi!';
      case 'gentle':
        return 'Simt o adiere plăcută și mă rotesc domol!';
      case 'fast':
        return 'Vântul suflă vioi! Mă învârt repede!';
      case 'strong':
        return 'Uau, ce vijelie! Vântul este foarte puternic!';
    }
  };

  const handleBlowWind = () => {
    playWindSound();
    const speeds: WindSpeed[] = ['calm', 'gentle', 'fast', 'strong'];
    const nextIdx = (speeds.indexOf(windSpeed) + 1) % speeds.length;
    onChangeSpeed(speeds[nextIdx]);
  };

  const speechContent = `Morișca spune: ${getSpeechText()}`;

  return (
    <div
      id="morisca-friend-card"
      className="bg-amber-50/90 border-3 border-amber-300 rounded-3xl p-5 shadow-sm flex flex-col items-center relative transition-all"
    >
      {/* Character Header */}
      <div className="flex items-center justify-between w-full mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌀</span>
          <span className="font-fun text-xl font-bold text-amber-900">Morișca</span>
        </div>
        <SpeakButton
          id="morisca-audio-btn"
          text={speechContent}
          variant="icon"
          size="sm"
          color="amber"
          label="Ascultă Morișca"
        />
      </div>

      {/* Speech bubble */}
      <div className="bg-white border-2 border-amber-200 rounded-2xl p-3 text-sm text-amber-950 font-semibold mb-4 text-center shadow-xs w-full min-h-[52px] flex items-center justify-center">
        "{getSpeechText()}"
      </div>

      {/* Visual illustration of Morisca */}
      <div className="relative w-48 h-64 flex flex-col items-center justify-center">
        {/* Paper Pinwheel blades */}
        <div
          className="w-36 h-36 relative z-10 transition-transform cursor-pointer"
          onClick={handleBlowWind}
          style={{
            animation: `spin-pinwheel ${getSpinDuration()} linear infinite`,
            animationPlayState: windSpeed === 'calm' ? 'paused' : 'running',
          }}
          title="Apasă pentru a sufla spre Morișcă!"
        >
          <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-md">
            {/* 4 Pinwheel blades folded towards center */}
            {/* Blade 1 - Red */}
            <path
              d="M 80 80 L 10 20 Q 50 10 80 80 Z"
              fill="#ef4444"
              stroke="#b91c1c"
              strokeWidth="2"
            />
            {/* Blade 2 - Yellow */}
            <path
              d="M 80 80 L 140 10 Q 150 50 80 80 Z"
              fill="#eab308"
              stroke="#a16207"
              strokeWidth="2"
            />
            {/* Blade 3 - Blue */}
            <path
              d="M 80 80 L 150 140 Q 110 150 80 80 Z"
              fill="#3b82f6"
              stroke="#1d4ed8"
              strokeWidth="2"
            />
            {/* Blade 4 - Green */}
            <path
              d="M 80 80 L 20 150 Q 10 110 80 80 Z"
              fill="#10b981"
              stroke="#047857"
              strokeWidth="2"
            />

            {/* Central Pin & Cute Face */}
            <circle cx="80" cy="80" r="18" fill="#fef08a" stroke="#ca8a04" strokeWidth="2.5" />
            {/* Eyes */}
            <circle cx="74" cy="77" r="2.5" fill="#1e293b" />
            <circle cx="86" cy="77" r="2.5" fill="#1e293b" />
            <circle cx="75" cy="75" r="0.9" fill="#ffffff" />
            <circle cx="87" cy="75" r="0.9" fill="#ffffff" />
            {/* Cheeks */}
            <circle cx="71" cy="81" r="2" fill="#f87171" opacity="0.6" />
            <circle cx="89" cy="81" r="2" fill="#f87171" opacity="0.6" />
            {/* Smile */}
            <path
              d="M 76 83 Q 80 87 84 83"
              fill="none"
              stroke="#1e293b"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Pencil with Eraser as Stand */}
        <div className="w-4 h-32 bg-amber-400 border-x-2 border-amber-600 relative -mt-6 z-0 rounded-b-md flex flex-col justify-between">
          {/* Metal band and Pink Eraser at top where pin attaches */}
          <div className="w-full h-6 bg-slate-300 border-b border-slate-400 flex flex-col items-center justify-start">
            <div className="w-full h-3 bg-pink-400 rounded-t-sm"></div>
          </div>
          {/* Pencil body stripes */}
          <div className="h-full flex justify-between px-0.5 opacity-40">
            <div className="w-0.5 bg-amber-700 h-full"></div>
            <div className="w-0.5 bg-amber-700 h-full"></div>
          </div>
          {/* Sharpened tip at bottom */}
          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[14px] border-t-amber-200 self-center -mb-3 relative">
            <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[5px] border-t-slate-800 absolute -top-[14px] -left-[3px]"></div>
          </div>
        </div>
      </div>

      {/* Interactive Controls */}
      {interactive && (
        <div className="w-full mt-4 flex flex-col gap-2">
          <button
            id="morisca-blow-btn"
            onClick={handleBlowWind}
            className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-500 active:scale-95 text-amber-950 font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-transform cursor-pointer"
          >
            <Wind className="w-5 h-5 text-amber-900" />
            <span>Suflă spre Morișcă!</span>
          </button>

          <div className="flex justify-between items-center bg-white/70 rounded-xl p-1.5 border border-amber-200">
            {(['calm', 'gentle', 'fast', 'strong'] as WindSpeed[]).map((spd) => (
              <button
                key={spd}
                id={`morisca-speed-${spd}`}
                onClick={() => {
                  playWindSound();
                  onChangeSpeed(spd);
                }}
                className={`py-1 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  windSpeed === spd
                    ? 'bg-amber-500 text-white shadow-xs scale-105'
                    : 'text-amber-800 hover:bg-amber-100'
                }`}
              >
                {spd === 'calm' && 'Liniște'}
                {spd === 'gentle' && 'Adiere'}
                {spd === 'fast' && 'Sprinten'}
                {spd === 'strong' && 'Vijelie!'}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
