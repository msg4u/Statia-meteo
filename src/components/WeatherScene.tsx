import React from 'react';
import { WeatherType } from '../types';
import { WEATHER_BADGES } from '../data/weatherData';
import { Sparkles } from 'lucide-react';
import { playPopSound } from '../utils/audio';
import { SpeakButton } from './SpeakButton';

interface WeatherSceneProps {
  weatherType: WeatherType;
  onChangeWeather: (type: WeatherType) => void;
}

export const WeatherScene: React.FC<WeatherSceneProps> = ({
  weatherType,
  onChangeWeather,
}) => {
  const currentBadge = WEATHER_BADGES[weatherType];

  return (
    <div id="weather-sky-window" className="bg-white rounded-3xl p-5 border-3 border-sky-300 shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🪟</span>
          <h2 className="font-fun text-xl font-bold text-sky-900">
            Fereastra Sofiei: Observă Cerul!
          </h2>
        </div>

        <SpeakButton
          id="window-audio-btn"
          text={`Privim pe geam: ${currentBadge.description}`}
          label="Ascultă cerul"
          variant="pill"
          size="sm"
          color="sky"
        />
      </div>

      {/* The Animated Window View */}
      <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden border-4 border-amber-200 shadow-inner">
        {/* Sky gradient depending on weather */}
        <div
          className={`absolute inset-0 transition-colors duration-700 ${
            weatherType === 'sunny'
              ? 'bg-gradient-to-b from-sky-400 via-sky-200 to-amber-100'
              : weatherType === 'partly_cloudy'
              ? 'bg-gradient-to-b from-sky-300 via-blue-200 to-slate-100'
              : weatherType === 'cloudy'
              ? 'bg-gradient-to-b from-slate-400 via-slate-300 to-slate-200'
              : weatherType === 'rainy'
              ? 'bg-gradient-to-b from-slate-600 via-blue-400 to-slate-300'
              : weatherType === 'windy'
              ? 'bg-gradient-to-b from-teal-400 via-sky-300 to-teal-100'
              : 'bg-gradient-to-b from-indigo-300 via-slate-200 to-white'
          }`}
        >
          {/* Sun element for sunny / partly cloudy */}
          {(weatherType === 'sunny' || weatherType === 'partly_cloudy') && (
            <div className="absolute top-4 right-10 w-20 h-20 bg-amber-300 border-4 border-amber-400 rounded-full shadow-lg animate-pulse-slow flex items-center justify-center">
              <div className="w-12 h-12 bg-amber-400 rounded-full"></div>
            </div>
          )}

          {/* Clouds */}
          {(weatherType === 'partly_cloudy' || weatherType === 'cloudy' || weatherType === 'rainy') && (
            <div className="absolute top-6 left-8 flex gap-3 animate-float">
              <div className={`w-28 h-12 rounded-full shadow-md relative ${weatherType === 'rainy' ? 'bg-slate-400' : 'bg-white'}`}>
                <div className={`w-14 h-14 rounded-full absolute -top-6 left-4 ${weatherType === 'rainy' ? 'bg-slate-400' : 'bg-white'}`}></div>
                <div className={`w-12 h-12 rounded-full absolute -top-4 right-3 ${weatherType === 'rainy' ? 'bg-slate-400' : 'bg-white'}`}></div>
              </div>
            </div>
          )}

          {/* Second cloud */}
          {(weatherType === 'cloudy' || weatherType === 'rainy' || weatherType === 'windy') && (
            <div className="absolute top-12 right-12 flex gap-3">
              <div className={`w-36 h-14 rounded-full shadow-md relative ${weatherType === 'rainy' ? 'bg-slate-500' : 'bg-white/90'}`}>
                <div className={`w-16 h-16 rounded-full absolute -top-7 left-6 ${weatherType === 'rainy' ? 'bg-slate-500' : 'bg-white/90'}`}></div>
              </div>
            </div>
          )}

          {/* Rain drops falling animation */}
          {weatherType === 'rainy' && (
            <div className="absolute inset-0 pointer-events-none flex justify-around overflow-hidden">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-6 bg-sky-200/90 rounded-full animate-bounce"
                  style={{
                    animationDuration: `${0.4 + (i % 5) * 0.15}s`,
                    animationDelay: `${(i % 4) * 0.1}s`,
                  }}
                ></div>
              ))}
            </div>
          )}

          {/* Snowflakes falling */}
          {weatherType === 'snowy' && (
            <div className="absolute inset-0 pointer-events-none flex justify-around">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="text-white text-lg animate-bounce duration-1000"
                  style={{ animationDelay: `${(i % 6) * 0.2}s` }}
                >
                  ❄️
                </div>
              ))}
            </div>
          )}

          {/* Wind streaks */}
          {weatherType === 'windy' && (
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-around py-4">
              <div className="w-40 h-1.5 bg-white/70 rounded-full translate-x-12 animate-pulse"></div>
              <div className="w-56 h-1 bg-white/60 rounded-full translate-x-4"></div>
              <div className="w-32 h-1.5 bg-white/70 rounded-full translate-x-28"></div>
              <div className="text-xl translate-x-16">🍂</div>
            </div>
          )}

          {/* Window Sill & Panes Grid */}
          <div className="absolute inset-0 pointer-events-none grid grid-cols-2 grid-rows-2 border-8 border-amber-300/80">
            <div className="border-r-4 border-b-4 border-amber-300/80"></div>
            <div className="border-b-4 border-amber-300/80"></div>
            <div className="border-r-4 border-amber-300/80"></div>
            <div></div>
          </div>
        </div>
      </div>

      {/* Description caption */}
      <div className="mt-3 flex items-center justify-between">
        <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <span className="text-xl">{currentBadge.emoji}</span>
          <span>{currentBadge.description}</span>
        </p>
      </div>

      {/* Quick weather selector buttons */}
      <div className="mt-3 flex flex-wrap gap-2">
        {(Object.keys(WEATHER_BADGES) as WeatherType[]).map((type) => {
          const badge = WEATHER_BADGES[type];
          const active = weatherType === type;
          return (
            <button
              key={type}
              id={`weather-select-${type}`}
              onClick={() => {
                playPopSound();
                onChangeWeather(type);
              }}
              className={`py-1.5 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                active
                  ? `${badge.bgColor} ${badge.textColor} ring-2 ring-sky-400 scale-105 shadow-xs`
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{badge.emoji}</span>
              <span>{badge.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
