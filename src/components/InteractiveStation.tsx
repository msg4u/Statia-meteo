import React, { useState } from 'react';
import { WeatherType, WindSpeed, WeatherLog } from '../types';
import { WeatherScene } from './WeatherScene';
import { MoriscaFriend } from './MoriscaFriend';
import { PicurelFriend } from './PicurelFriend';
import { TermiFriend } from './TermiFriend';
import { SofiaCharacter, OutfitState } from './SofiaCharacter';
import { DressUpGame } from './DressUpGame';
import { CheckCircle, Save, Sparkles, Check, ArrowRight } from 'lucide-react';
import { playSuccessFanfare, playPopSound, speakText } from '../utils/audio';
import confetti from 'canvas-confetti';

interface InteractiveStationProps {
  onSaveToCalendar: (log: WeatherLog) => void;
}

export const InteractiveStation: React.FC<InteractiveStationProps> = ({
  onSaveToCalendar,
}) => {
  const [weatherType, setWeatherType] = useState<WeatherType>('sunny');
  const [windSpeed, setWindSpeed] = useState<WindSpeed>('gentle');
  const [rainCm, setRainCm] = useState<number>(0);
  const [temperature, setTemperature] = useState<number>(22);

  // Active routine step (1 to 5)
  const [activeStep, setActiveStep] = useState<number>(1);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Sofia's outfit state
  const [outfit, setOutfit] = useState<OutfitState>({
    hat: 'hat-cap',
    top: 'top-tshirt',
    bottom: 'bottom-shorts',
    shoes: 'shoes-sneakers',
    accessory: 'acc-sunglasses',
  });

  // When weather changes from presets, auto-adjust friends intelligently as a playful start
  const handleWeatherChange = (newWeather: WeatherType) => {
    setWeatherType(newWeather);
    switch (newWeather) {
      case 'sunny':
        setTemperature(26);
        setRainCm(0);
        setWindSpeed('calm');
        break;
      case 'partly_cloudy':
        setTemperature(20);
        setRainCm(0);
        setWindSpeed('gentle');
        break;
      case 'cloudy':
        setTemperature(16);
        setRainCm(1);
        setWindSpeed('gentle');
        break;
      case 'rainy':
        setTemperature(13);
        setRainCm(6);
        setWindSpeed('fast');
        break;
      case 'windy':
        setTemperature(17);
        setRainCm(0);
        setWindSpeed('strong');
        break;
      case 'snowy':
        setTemperature(0);
        setRainCm(0);
        setWindSpeed('gentle');
        break;
    }
  };

  const handleAutoDressSuggestion = () => {
    playPopSound();
    if (rainCm > 2) {
      setOutfit({
        hat: undefined,
        top: 'top-raincoat',
        bottom: 'bottom-waterproof',
        shoes: 'shoes-rainboots',
        accessory: 'acc-umbrella',
      });
      speakText('I-am pus Sofiei pelerină galbenă, pantaloni impermeabili, cizme de cauciuc și umbrelă!');
    } else if (temperature <= 6) {
      setOutfit({
        hat: 'hat-winter',
        top: 'top-wintercoat',
        bottom: 'bottom-pants',
        shoes: 'shoes-winterboots',
        accessory: 'acc-scarf',
      });
      speakText('I-am pus Sofiei căciulă călduroasă, geacă de iarnă, fular și ghete îmblănite!');
    } else if (temperature <= 17) {
      setOutfit({
        hat: undefined,
        top: 'top-sweater',
        bottom: 'bottom-pants',
        shoes: 'shoes-sneakers',
        accessory: windSpeed === 'fast' || windSpeed === 'strong' ? 'acc-scarf' : undefined,
      });
      speakText('I-am pus Sofiei un pulover comod și pantaloni lungi!');
    } else {
      setOutfit({
        hat: 'hat-sun',
        top: 'top-tshirt',
        bottom: 'bottom-shorts',
        shoes: 'shoes-sandals',
        accessory: 'acc-sunglasses',
      });
      speakText('I-am pus Sofiei haine lejere de vară, pălărie de soare și ochelari!');
    }
  };

  const handleSaveToCalendar = () => {
    playSuccessFanfare();
    confetti({
      particleCount: 75,
      spread: 80,
      origin: { y: 0.6 },
    });

    const now = new Date();
    const daysRo = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'];
    const dayName = daysRo[now.getDay()];
    const dateStr = now.toISOString().split('T')[0];

    const newLog: WeatherLog = {
      id: `log-${Date.now()}`,
      date: dateStr,
      dayName: dayName,
      weatherType: weatherType,
      tempLevel: temperature <= 6 ? 'freezing' : temperature <= 15 ? 'chilly' : temperature <= 22 ? 'mild' : 'warm',
      tempDegrees: temperature,
      windSpeed: windSpeed,
      rainCm: rainCm,
      outfit: {
        hat: outfit.hat ? 'Pălărie / Căciulă' : undefined,
        top: outfit.top,
        bottom: outfit.bottom,
        shoes: outfit.shoes,
        accessory: outfit.accessory,
      },
      notes: `Sofia a consultat cei 3 prieteni: Morișca (${windSpeed}), Picurel (${rainCm}cm), Termi (${temperature}°C).`,
    };

    onSaveToCalendar(newLog);
    setSavedSuccess(true);
    speakText('Super! Ai notat observația de azi pe Calendarul Sofiei! Sofia este mândră de tine!');
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const routineSteps = [
    { num: 1, title: 'Observă cerul', icon: '🪟' },
    { num: 2, title: 'Întreabă Morișca', icon: '🌀' },
    { num: 3, title: 'Întreabă Picurel', icon: '💧' },
    { num: 4, title: 'Uită-te la Termi', icon: '🌡️' },
    { num: 5, title: 'Îmbrac-o pe Sofia!', icon: '👧' },
  ];

  return (
    <div id="interactive-station-container" className="max-w-6xl mx-auto flex flex-col gap-6">
      {/* Top Banner: Routine Guide */}
      <div className="bg-white rounded-3xl p-5 border-3 border-amber-300 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <span className="text-xs font-black uppercase text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              Rutina Zilnică a Sofiei
            </span>
            <h2 className="font-fun text-2xl font-black text-slate-900 mt-1">
              "Sofia își întreabă prietenii în fiecare dimineață"
            </h2>
          </div>

          <button
            id="routine-save-btn"
            onClick={handleSaveToCalendar}
            className={`py-2.5 px-5 rounded-2xl font-black text-sm flex items-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer ${
              savedSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-amber-950'
            }`}
          >
            {savedSuccess ? <CheckCircle className="w-5 h-5" /> : <Save className="w-5 h-5 text-amber-900" />}
            <span>{savedSuccess ? 'Salvat în Calendar!' : 'Lipește în Calendarul de Azi'}</span>
          </button>
        </div>

        {/* Stepper Buttons for Kids */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-100">
          {routineSteps.map((step) => {
            const active = activeStep === step.num;
            return (
              <button
                key={step.num}
                id={`routine-step-${step.num}`}
                onClick={() => {
                  playPopSound();
                  setActiveStep(step.num);
                }}
                className={`py-2 px-3 rounded-2xl border-2 flex items-center gap-2 text-left transition-all cursor-pointer ${
                  active
                    ? 'border-amber-500 bg-amber-50 shadow-xs scale-102 ring-2 ring-amber-200'
                    : 'border-slate-200 bg-white hover:border-amber-300'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                    active ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {step.num}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block line-clamp-1">
                    {step.icon} {step.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Section 1: Window to Sky */}
      <WeatherScene
        weatherType={weatherType}
        onChangeWeather={handleWeatherChange}
      />

      {/* Main Section 2: The Three Friends Side by Side */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="font-fun text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>🤝</span>
            <span>Cei Trei Prieteni Meteo</span>
          </h3>
          <span className="text-xs font-bold text-slate-700">
            Atinge instrumentele pentru a le mișca!
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Friend 1: Morișca */}
          <MoriscaFriend
            windSpeed={windSpeed}
            onChangeSpeed={setWindSpeed}
          />

          {/* Friend 2: Picurel */}
          <PicurelFriend
            rainCm={rainCm}
            onChangeRain={setRainCm}
          />

          {/* Friend 3: Termi */}
          <TermiFriend
            temperature={temperature}
            onChangeTemp={setTemperature}
          />
        </div>
      </div>

      {/* Main Section 3: Dress Sofia for the Day */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sofia Character Visual Display */}
        <div className="lg:col-span-5">
          <SofiaCharacter
            temperature={temperature}
            windSpeed={windSpeed}
            rainCm={rainCm}
            outfit={outfit}
            onAutoDressSuggestion={handleAutoDressSuggestion}
          />
        </div>

        {/* Sofia's Wardrobe / Dress Up Controls */}
        <div className="lg:col-span-7">
          <DressUpGame
            outfit={outfit}
            onSelectOutfit={setOutfit}
            temperature={temperature}
            windSpeed={windSpeed}
            rainCm={rainCm}
          />
        </div>
      </div>
    </div>
  );
};
