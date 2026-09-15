import React, { useState } from 'react';
import { OutfitState } from './SofiaCharacter';
import { OUTFIT_OPTIONS, OutfitOption } from '../data/weatherData';
import { playPopSound, playSuccessFanfare, speakText } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Check, Sparkles, Shirt, Footprints, ShieldCheck } from 'lucide-react';

interface DressUpGameProps {
  outfit: OutfitState;
  onSelectOutfit: (newOutfit: OutfitState) => void;
  temperature: number;
  windSpeed: 'calm' | 'gentle' | 'fast' | 'strong';
  rainCm: number;
}

export const DressUpGame: React.FC<DressUpGameProps> = ({
  outfit,
  onSelectOutfit,
  temperature,
  windSpeed,
  rainCm,
}) => {
  const [activeCategory, setActiveCategory] = useState<'top' | 'bottom' | 'shoes' | 'hat' | 'accessory'>('top');

  const categories: { id: 'top' | 'bottom' | 'shoes' | 'hat' | 'accessory'; label: string; icon: string }[] = [
    { id: 'top', label: 'Hăinuțe', icon: '👕' },
    { id: 'bottom', label: 'Pantaloni', icon: '👖' },
    { id: 'shoes', label: 'Încălțări', icon: '👟' },
    { id: 'hat', label: 'Căciuli / Pălării', icon: '👒' },
    { id: 'accessory', label: 'Accesorii', icon: '☂️' },
  ];

  const handleChooseItem = (item: OutfitOption) => {
    playPopSound();
    const updated = { ...outfit };
    if (item.category === 'hat') {
      updated.hat = updated.hat === item.id ? undefined : item.id;
    } else if (item.category === 'accessory') {
      updated.accessory = updated.accessory === item.id ? undefined : item.id;
    } else if (item.category === 'top') {
      updated.top = item.id;
    } else if (item.category === 'bottom') {
      updated.bottom = item.id;
    } else if (item.category === 'shoes') {
      updated.shoes = item.id;
    }
    onSelectOutfit(updated);
  };

  const handleCheckOutfit = () => {
    const isRaining = rainCm > 2;
    const isFreezing = temperature <= 6;
    const isWarm = temperature >= 22;

    const hasRainProtection = outfit.shoes === 'shoes-rainboots' || outfit.accessory === 'acc-umbrella' || outfit.top === 'top-raincoat';
    const isWarmClothedInCold = outfit.top === 'top-wintercoat' || outfit.top === 'top-sweater' || outfit.hat === 'hat-winter';
    const isLightClothedInWarm = outfit.top === 'top-tshirt' || outfit.bottom === 'bottom-shorts' || outfit.shoes === 'shoes-sandals';

    let success = false;
    let message = '';

    if (isRaining) {
      if (hasRainProtection) {
        success = true;
        message = 'Bravo! Sofia are protecție împotriva ploii măsurate de Picurel!';
      } else {
        message = 'Mai încearcă! Picurel e plin de ploaie, pune-i cizme de cauciuc sau umbrelă!';
      }
    } else if (isFreezing) {
      if (isWarmClothedInCold) {
        success = true;
        message = 'Minunat! Termi e mulțumit, Sofia este bine înfofolită și nu va îngheța!';
      } else {
        message = 'E prea frig afară! Pune-i geacă groasă și căciulă!';
      }
    } else if (isWarm) {
      if (isLightClothedInWarm) {
        success = true;
        message = 'Foarte bine! Termi arată cald, Sofia se va simți comod la soare!';
      } else {
        message = 'E cald afară! Sofia nu are nevoie de haine groase de iarnă azi.';
      }
    } else {
      success = true;
      message = 'Excelent! Sofia e pregătită de ieșit la plimbare!';
    }

    if (success) {
      playSuccessFanfare();
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
      });
    }
    speakText(message);
  };

  const filteredItems = OUTFIT_OPTIONS.filter((item) => item.category === activeCategory);

  const isSelected = (itemId: string, cat: string) => {
    if (cat === 'top') return outfit.top === itemId;
    if (cat === 'bottom') return outfit.bottom === itemId;
    if (cat === 'shoes') return outfit.shoes === itemId;
    if (cat === 'hat') return outfit.hat === itemId;
    if (cat === 'accessory') return outfit.accessory === itemId;
    return false;
  };

  return (
    <div id="dress-up-game-container" className="bg-white/95 border-2 border-purple-200 rounded-3xl p-4 shadow-sm w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-fun text-lg font-bold text-purple-900 flex items-center gap-2">
          <span>👗</span>
          <span>Dulăpiorul Sofiei</span>
        </h3>
        <button
          id="verify-outfit-btn"
          onClick={handleCheckOutfit}
          className="py-1.5 px-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-extrabold rounded-xl shadow-xs flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Verifică dacă e bine!</span>
        </button>
      </div>

      {/* Category selector */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            id={`category-tab-${cat.id}`}
            onClick={() => {
              playPopSound();
              setActiveCategory(cat.id);
            }}
            className={`py-2 px-3 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-purple-600 text-white shadow-xs scale-102'
                : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Items list */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3">
        {filteredItems.map((item) => {
          const selected = isSelected(item.id, item.category);
          return (
            <button
              key={item.id}
              id={`outfit-item-${item.id}`}
              onClick={() => handleChooseItem(item)}
              className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative ${
                selected
                  ? 'border-purple-600 bg-purple-50 shadow-md scale-102 ring-2 ring-purple-300'
                  : 'border-slate-200 bg-white hover:border-purple-300 hover:bg-slate-50'
              }`}
            >
              {selected && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-purple-600 text-white rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
              <span className="text-3xl mb-1 drop-shadow-xs">{item.emoji}</span>
              <span className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight">
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
