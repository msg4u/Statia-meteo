import React from 'react';
import { Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SpeakButton } from './SpeakButton';

export interface OutfitState {
  hat?: string;
  top: string;
  bottom: string;
  shoes: string;
  accessory?: string;
}

interface SofiaCharacterProps {
  temperature: number;
  windSpeed: 'calm' | 'gentle' | 'fast' | 'strong';
  rainCm: number;
  outfit: OutfitState;
  onAutoDressSuggestion?: () => void;
}

export const SofiaCharacter: React.FC<SofiaCharacterProps> = ({
  temperature,
  windSpeed,
  rainCm,
  outfit,
  onAutoDressSuggestion,
}) => {
  // Validate outfit suitability
  const isRaining = rainCm > 2;
  const isFreezing = temperature <= 6;
  const isChilly = temperature > 6 && temperature <= 15;
  const isWarm = temperature >= 22;
  const isWindy = windSpeed === 'fast' || windSpeed === 'strong';

  let feedback = 'Sofia este fericită și gata de o nouă zi!';
  let statusType: 'success' | 'warning' | 'neutral' = 'success';

  if (isRaining && outfit.shoes !== 'shoes-rainboots' && outfit.accessory !== 'acc-umbrella' && outfit.top !== 'top-raincoat') {
    feedback = 'Atenție! Picurel ne-a arătat că plouă! Sofia are nevoie de cizme de cauciuc sau o umbrelă!';
    statusType = 'warning';
  } else if (isFreezing && (outfit.top === 'top-tshirt' || outfit.bottom === 'bottom-shorts' || outfit.shoes === 'shoes-sandals')) {
    feedback = 'Brrr! Termi ne arată că e foarte frig! Pune-i Sofiei geacă groasă și căciulă!';
    statusType = 'warning';
  } else if (isWarm && (outfit.top === 'top-wintercoat' || outfit.hat === 'hat-winter' || outfit.shoes === 'shoes-winterboots')) {
    feedback = 'Uf! Termi ne arată că e cald! Sofia se va supraîncălzi cu haine de iarnă!';
    statusType = 'warning';
  } else if (isWindy && outfit.hat === 'hat-sun') {
    feedback = 'Morișca se învârte sprinten! Vântul i-ar putea zbura pălăria de soare a Sofiei!';
    statusType = 'neutral';
  } else {
    feedback = 'Excelent! Sofia este îmbrăcată perfect pentru vremea de azi!';
    statusType = 'success';
  }

  return (
    <div
      id="sofia-character-box"
      className="bg-purple-50/90 border-3 border-purple-300 rounded-3xl p-5 shadow-sm flex flex-col items-center relative transition-all"
    >
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👧</span>
          <span className="font-fun text-xl font-bold text-purple-900">Sofia</span>
        </div>
        <SpeakButton
          id="sofia-audio-btn"
          text={feedback}
          variant="pill"
          size="sm"
          color="purple"
          label="Ce zice Sofia?"
        />
      </div>

      {/* Feedback banner */}
      <div
        className={`w-full p-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 mb-4 shadow-xs border ${
          statusType === 'warning'
            ? 'bg-amber-100 border-amber-300 text-amber-900'
            : statusType === 'success'
            ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
            : 'bg-sky-100 border-sky-300 text-sky-900'
        }`}
      >
        {statusType === 'warning' && <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />}
        {statusType === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
        {statusType === 'neutral' && <Sparkles className="w-5 h-5 text-sky-600 shrink-0" />}
        <span className="flex-1">{feedback}</span>
      </div>

      {/* Sofia SVG Avatar */}
      <div className="relative w-48 h-64 flex flex-col items-center justify-center select-none">
        {/* Accessory: Umbrella in hand (if selected) */}
        {outfit.accessory === 'acc-umbrella' && (
          <div className="absolute -left-6 top-6 z-30 animate-bounce duration-1000">
            <svg viewBox="0 0 80 80" className="w-20 h-20 drop-shadow-md">
              <path d="M 10 45 Q 40 10 70 45 Z" fill="#ec4899" stroke="#be185d" strokeWidth="2" />
              {/* White dots on umbrella */}
              <circle cx="28" cy="35" r="3" fill="#ffffff" />
              <circle cx="40" cy="25" r="3" fill="#ffffff" />
              <circle cx="52" cy="35" r="3" fill="#ffffff" />
              {/* Handle */}
              <line x1="40" y1="45" x2="40" y2="70" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
              <path d="M 40 70 Q 40 76 34 76" fill="none" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        )}

        {/* Sofia's Head & Face */}
        <div className="relative w-28 h-28 flex flex-col items-center z-20">
          {/* Pigtails / Hair behind */}
          <div className="absolute -left-3 top-3 w-8 h-12 bg-amber-800 rounded-full rotate-[-25deg] border-2 border-amber-950">
            {/* Ribbon */}
            <div className="w-4 h-3 bg-pink-500 rounded-full mx-auto -mt-1 border border-pink-700"></div>
          </div>
          <div className="absolute -right-3 top-3 w-8 h-12 bg-amber-800 rounded-full rotate-[25deg] border-2 border-amber-950">
            {/* Ribbon */}
            <div className="w-4 h-3 bg-pink-500 rounded-full mx-auto -mt-1 border border-pink-700"></div>
          </div>

          {/* Hat (if selected) */}
          {outfit.hat === 'hat-sun' && (
            <div className="absolute -top-4 w-32 h-10 bg-amber-300 border-2 border-amber-500 rounded-full z-40 shadow-xs flex items-center justify-center">
              <div className="w-16 h-8 bg-amber-400 border border-amber-600 rounded-t-full -mt-4"></div>
              <div className="absolute bottom-2 w-full h-1 bg-pink-400"></div>
            </div>
          )}

          {outfit.hat === 'hat-cap' && (
            <div className="absolute -top-2 w-24 h-10 z-40 flex flex-col items-center">
              <div className="w-20 h-9 bg-sky-500 border border-sky-700 rounded-t-full shadow-xs"></div>
              <div className="w-24 h-2.5 bg-sky-600 rounded-full -mt-1"></div>
            </div>
          )}

          {outfit.hat === 'hat-winter' && (
            <div className="absolute -top-6 w-24 h-14 z-40 flex flex-col items-center">
              <div className="w-5 h-5 bg-rose-200 border border-rose-400 rounded-full -mb-1 shadow-xs"></div>
              <div className="w-20 h-10 bg-rose-500 border border-rose-700 rounded-t-full flex items-end justify-center">
                <div className="w-full h-3 bg-rose-300 rounded-sm"></div>
              </div>
            </div>
          )}

          {/* Face skin */}
          <div className="w-24 h-24 bg-[#fed7aa] border-2 border-amber-800/40 rounded-full relative shadow-xs flex flex-col items-center justify-center overflow-hidden">
            {/* Front bangs */}
            <div className="absolute top-0 inset-x-0 h-7 bg-amber-800 rounded-b-xl border-b border-amber-950 flex justify-around px-1">
              <div className="w-3 h-5 bg-amber-800 rounded-b-md"></div>
              <div className="w-4 h-6 bg-amber-800 rounded-b-md"></div>
              <div className="w-3 h-5 bg-amber-800 rounded-b-md"></div>
            </div>

            {/* Accessory: Sunglasses (if active) */}
            {outfit.accessory === 'acc-sunglasses' ? (
              <div className="relative z-30 flex items-center gap-1 mt-4">
                <div className="w-6 h-5 bg-slate-900 rounded-md border border-slate-700"></div>
                <div className="w-3 h-1 bg-slate-900"></div>
                <div className="w-6 h-5 bg-slate-900 rounded-md border border-slate-700"></div>
              </div>
            ) : (
              /* Big cute curious eyes */
              <div className="flex gap-4 mt-4 z-10">
                <div className="w-3.5 h-4 bg-amber-950 rounded-full relative flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full -mt-1 -ml-1"></div>
                </div>
                <div className="w-3.5 h-4 bg-amber-950 rounded-full relative flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full -mt-1 -ml-1"></div>
                </div>
              </div>
            )}

            {/* Rosy cheeks */}
            <div className="flex justify-between w-16 px-1 mt-1 z-10">
              <div className="w-3 h-1.5 bg-rose-400/70 rounded-full"></div>
              <div className="w-3 h-1.5 bg-rose-400/70 rounded-full"></div>
            </div>

            {/* Smiling mouth */}
            <div className="w-4 h-2 border-b-2 border-amber-950 rounded-full -mt-1 z-10"></div>
          </div>
        </div>

        {/* Accessory: Scarf around neck */}
        {outfit.accessory === 'acc-scarf' && (
          <div className="w-16 h-5 bg-emerald-500 border border-emerald-700 rounded-full z-30 -mt-2 shadow-xs flex items-center justify-center">
            <div className="w-4 h-8 bg-emerald-600 border border-emerald-800 rounded-b-md -ml-6 mt-4"></div>
          </div>
        )}

        {/* Body & Clothes */}
        <div className="relative -mt-2 z-10 flex flex-col items-center">
          {/* Top Clothing */}
          {outfit.top === 'top-tshirt' && (
            <div className="w-16 h-14 bg-pink-400 border border-pink-600 rounded-t-xl relative shadow-xs flex items-center justify-center">
              <span className="text-xs">☀️</span>
            </div>
          )}

          {outfit.top === 'top-sweater' && (
            <div className="w-18 h-16 bg-amber-600 border border-amber-800 rounded-t-xl relative shadow-xs flex items-center justify-center">
              <div className="w-full h-full border-t-2 border-amber-400/40 rounded-t-xl flex items-center justify-center">
                <span className="text-xs text-amber-100 font-bold">🍁</span>
              </div>
            </div>
          )}

          {outfit.top === 'top-raincoat' && (
            <div className="w-20 h-16 bg-yellow-400 border border-yellow-600 rounded-t-xl relative shadow-xs flex items-center justify-center">
              <div className="w-0.5 h-full bg-yellow-600 absolute"></div>
              <div className="w-2 h-2 bg-yellow-700 rounded-full absolute top-3 left-7"></div>
              <div className="w-2 h-2 bg-yellow-700 rounded-full absolute top-7 left-7"></div>
            </div>
          )}

          {outfit.top === 'top-wintercoat' && (
            <div className="w-22 h-18 bg-sky-600 border-2 border-sky-800 rounded-t-xl relative shadow-md flex items-center justify-center">
              <div className="w-full h-3 bg-white border-y border-slate-300 absolute top-0 rounded-t-md"></div>
              <span className="text-xs text-white">❄️</span>
            </div>
          )}

          {/* Bottom Clothing */}
          {outfit.bottom === 'bottom-shorts' && (
            <div className="w-14 h-8 bg-blue-500 border border-blue-700 flex justify-between px-1">
              <div className="w-5 h-full bg-blue-500 border-r border-blue-700"></div>
              <div className="w-5 h-full bg-blue-500 border-l border-blue-700"></div>
            </div>
          )}

          {outfit.bottom === 'bottom-pants' && (
            <div className="w-14 h-14 bg-indigo-600 border border-indigo-800 flex justify-between px-1">
              <div className="w-5 h-full bg-indigo-600 border-r border-indigo-800 rounded-b-xs"></div>
              <div className="w-5 h-full bg-indigo-600 border-l border-indigo-800 rounded-b-xs"></div>
            </div>
          )}

          {outfit.bottom === 'bottom-waterproof' && (
            <div className="w-16 h-14 bg-teal-600 border border-teal-800 flex justify-between px-1 shadow-xs">
              <div className="w-6 h-full bg-teal-600 border-r border-teal-800 rounded-b-sm"></div>
              <div className="w-6 h-full bg-teal-600 border-l border-teal-800 rounded-b-sm"></div>
            </div>
          )}

          {/* Shoes */}
          <div className="flex gap-4 -mt-1">
            {outfit.shoes === 'shoes-sandals' && (
              <>
                <div className="w-5 h-2.5 bg-amber-400 border border-amber-600 rounded-full"></div>
                <div className="w-5 h-2.5 bg-amber-400 border border-amber-600 rounded-full"></div>
              </>
            )}

            {outfit.shoes === 'shoes-sneakers' && (
              <>
                <div className="w-6 h-3 bg-red-500 border border-red-700 rounded-lg"></div>
                <div className="w-6 h-3 bg-red-500 border border-red-700 rounded-lg"></div>
              </>
            )}

            {outfit.shoes === 'shoes-rainboots' && (
              <>
                <div className="w-6 h-7 bg-yellow-400 border border-yellow-600 rounded-t-sm rounded-b-md shadow-xs -mt-3"></div>
                <div className="w-6 h-7 bg-yellow-400 border border-yellow-600 rounded-t-sm rounded-b-md shadow-xs -mt-3"></div>
              </>
            )}

            {outfit.shoes === 'shoes-winterboots' && (
              <>
                <div className="w-7 h-7 bg-stone-700 border border-stone-900 rounded-t-sm rounded-b-md shadow-xs -mt-3 flex items-start justify-center">
                  <div className="w-full h-2 bg-stone-200 rounded-t-sm"></div>
                </div>
                <div className="w-7 h-7 bg-stone-700 border border-stone-900 rounded-t-sm rounded-b-md shadow-xs -mt-3 flex items-start justify-center">
                  <div className="w-full h-2 bg-stone-200 rounded-t-sm"></div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Suggestion helper button */}
      {onAutoDressSuggestion && (
        <button
          id="sofia-suggest-dress-btn"
          onClick={onAutoDressSuggestion}
          className="mt-3 py-2 px-4 bg-purple-200 hover:bg-purple-300 text-purple-900 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-purple-700" />
          <span>Ajut-o pe Sofia să aleagă repede!</span>
        </button>
      )}
    </div>
  );
};
