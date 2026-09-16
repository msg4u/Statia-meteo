import React, { useState, useEffect } from 'react';
import { WeatherLog, WeatherType } from '../types';
import { WEATHER_BADGES } from '../data/weatherData';
import { Calendar as CalendarIcon, BarChart3, Plus, Sparkles, Check } from 'lucide-react';
import { playPopSound, playSuccessFanfare, preloadSpeech } from '../utils/audio';
import confetti from 'canvas-confetti';
import { SpeakButton } from './SpeakButton';

interface CalendarViewProps {
  logs: WeatherLog[];
  onAddOrUpdateLog: (log: WeatherLog) => void;
  currentDayWeather: WeatherType;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  logs,
  onAddOrUpdateLog,
  currentDayWeather,
}) => {
  const [selectedDayLog, setSelectedDayLog] = useState<WeatherLog | null>(null);
  const [showReport, setShowReport] = useState<boolean>(true);

  // Count occurrences of each weather type
  const counts: Record<WeatherType, number> = {
    sunny: 0,
    partly_cloudy: 0,
    cloudy: 0,
    rainy: 0,
    windy: 0,
    snowy: 0,
  };

  logs.forEach((log) => {
    if (counts[log.weatherType] !== undefined) {
      counts[log.weatherType]++;
    }
  });

  const totalDays = logs.length;
  const reportText = `Raportul Sofiei: În cele ${totalDays} zile observate, am avut ${counts.sunny + counts.partly_cloudy} zile cu soare, ${counts.cloudy} zile înnorate, ${counts.rainy} zile cu ploaie și ${counts.windy} zile cu vânt puternic! Sofia a analizat datele exact ca un om de știință!`;

  useEffect(() => {
    preloadSpeech(reportText);
  }, [reportText]);

  const handleDayClick = (log: WeatherLog) => {
    playPopSound();
    setSelectedDayLog(log);
  };

  const handleUpdateWeatherForLog = (log: WeatherLog, newWeather: WeatherType) => {
    playPopSound();
    const updated = { ...log, weatherType: newWeather };
    onAddOrUpdateLog(updated);
    setSelectedDayLog(updated);
  };

  return (
    <div id="calendar-view-container" className="max-w-5xl mx-auto flex flex-col gap-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-3xl p-6 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Calendarul Sofiei</span>
          </div>
          <h2 className="font-fun text-2xl sm:text-3xl font-black">
            Calendarul Meteo & Primul Raport de Date
          </h2>
          <p className="text-purple-100 font-semibold text-sm sm:text-base mt-1 max-w-xl">
            Lipește cartonașele zilelor, observă tiparele vremii și numără bulinele colorate împreună!
          </p>
        </div>

        <div className="flex gap-2">
          <button
            id="toggle-report-btn"
            onClick={() => {
              playPopSound();
              setShowReport(!showReport);
            }}
            className="py-2.5 px-4 bg-white/20 hover:bg-white/30 backdrop-blur-xs border border-white/30 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <BarChart3 className="w-4 h-4" />
            <span>{showReport ? 'Ascunde Raportul' : 'Vezi Raportul Sofiei'}</span>
          </button>
        </div>
      </div>

      {/* 7-Day Calendar Grid */}
      <div className="bg-white border-3 border-purple-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🗓️</span>
            <h3 className="font-fun text-xl font-bold text-purple-950">
              Săptămâna Sofiei
            </h3>
          </div>
          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            Apasă pe o zi pentru detalii și haine
          </span>
        </div>

        {/* The 7-day responsive grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {logs.map((log) => {
            const badge = WEATHER_BADGES[log.weatherType];
            const isSelected = selectedDayLog?.id === log.id;

            return (
              <button
                key={log.id}
                id={`calendar-day-card-${log.id}`}
                onClick={() => handleDayClick(log)}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-between text-center min-h-[140px] transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-300 scale-102 shadow-md'
                    : 'border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-50/40'
                }`}
              >
                {/* Day name */}
                <div className="w-full pb-1 border-b border-slate-100">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wide">
                    {log.dayName}
                  </span>
                </div>

                {/* Removable Weather Badge Token (simulates Velcro token) */}
                <div className="my-2 flex flex-col items-center">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm border ${badge.bgColor} ${badge.borderColor} transform transition-transform hover:rotate-6`}
                    title={badge.label}
                  >
                    <span>{badge.emoji}</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 mt-1">
                    {badge.label}
                  </span>
                </div>

                {/* Temperature & Rain mini info */}
                <div className="w-full flex justify-between items-center text-[10px] font-extrabold text-slate-700 pt-1 border-t border-slate-100">
                  <span className="text-rose-600">{log.tempDegrees}°C</span>
                  {log.rainCm > 0 ? (
                    <span className="text-blue-600">{log.rainCm}cm 💧</span>
                  ) : (
                    <span className="text-amber-700">0cm</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details Card (if active) */}
      {selectedDayLog && (
        <div className="bg-purple-50 border-2 border-purple-300 rounded-3xl p-5 shadow-sm animate-fade-in flex flex-col md:flex-row gap-6 items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-purple-700 bg-white px-2.5 py-0.5 rounded-full border border-purple-200">
                  {selectedDayLog.dayName}
                </span>
                <h4 className="font-fun text-lg font-black text-purple-950">
                  Jurnalul Sofiei pentru această zi
                </h4>
              </div>
              <SpeakButton
                id={`speak-day-${selectedDayLog.id}`}
                text={`${selectedDayLog.dayName}: Vreme ${WEATHER_BADGES[selectedDayLog.weatherType].label}, ${selectedDayLog.tempDegrees} grade Celsius. ${selectedDayLog.notes}`}
                label="Ascultă ziua"
                variant="pill"
                size="sm"
                color="purple"
              />
            </div>

            <p className="text-sm font-semibold text-slate-700 mt-1 mb-3">
              {selectedDayLog.notes || 'Sofia a observat cerul alături de Morișca, Picurel și Termi.'}
            </p>

            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs font-bold text-slate-700">Schimbă cartonașul:</span>
              {(Object.keys(WEATHER_BADGES) as WeatherType[]).map((type) => {
                const b = WEATHER_BADGES[type];
                const active = selectedDayLog.weatherType === type;
                return (
                  <button
                    key={type}
                    onClick={() => handleUpdateWeatherForLog(selectedDayLog, type)}
                    className={`py-1 px-2 rounded-xl text-xs font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                      active
                        ? `${b.bgColor} ${b.textColor} border-purple-500 scale-105 shadow-2xs`
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>{b.emoji}</span>
                    <span>{b.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Outfit Sofia wore that day */}
          <div className="bg-white p-4 rounded-2xl border border-purple-200 w-full md:w-64 shadow-2xs">
            <span className="text-xs font-black uppercase text-purple-800 block mb-2">
              👗 Hainele alese de Sofia:
            </span>
            <ul className="text-xs font-semibold text-slate-700 space-y-1">
              {selectedDayLog.outfit.hat && <li>👒 {selectedDayLog.outfit.hat}</li>}
              <li>👕 {selectedDayLog.outfit.top}</li>
              <li>👖 {selectedDayLog.outfit.bottom}</li>
              <li>👟 {selectedDayLog.outfit.shoes}</li>
              {selectedDayLog.outfit.accessory && <li>☂️ {selectedDayLog.outfit.accessory}</li>}
            </ul>
          </div>
        </div>
      )}

      {/* Raportul Sofiei: Simple Data Analysis Chart with Colored Dots! */}
      {showReport && (
        <div
          id="sofia-data-report-card"
          className="bg-white border-3 border-amber-300 rounded-3xl p-6 sm:p-8 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b-2 border-amber-100">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-100 px-3 py-1 rounded-full text-xs font-black uppercase text-amber-900 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Extensie: Fixarea Conceptului</span>
              </div>
              <h3 className="font-fun text-2xl sm:text-3xl font-black text-slate-900">
                Primul «Raport al Sofiei» (Grafic cu Buline Colorate)
              </h3>
              <p className="text-slate-700 font-medium text-sm sm:text-base mt-1">
                Copilul analizează date reale fără să știe că face matematică și știință!
              </p>
            </div>

            <SpeakButton
              id="speak-report-btn"
              text={reportText}
              label="Ascultă Raportul"
              variant="pill"
              color="amber"
              size="md"
            />
          </div>

          {/* Dots Visualization Rows */}
          <div className="flex flex-col gap-4">
            {(
              [
                { type: 'sunny' as WeatherType, label: 'Zile cu Soare ☀️', color: 'bg-amber-400', count: counts.sunny + counts.partly_cloudy },
                { type: 'cloudy' as WeatherType, label: 'Zile Înnorate ☁️', color: 'bg-slate-400', count: counts.cloudy },
                { type: 'rainy' as WeatherType, label: 'Zile cu Ploaie 🌧️', color: 'bg-blue-400', count: counts.rainy },
                { type: 'windy' as WeatherType, label: 'Zile cu Vânt 💨', color: 'bg-teal-400', count: counts.windy },
                { type: 'snowy' as WeatherType, label: 'Zile cu Ninsoare ❄️', color: 'bg-indigo-300', count: counts.snowy },
              ]
            ).map((row) => (
              <div
                key={row.type}
                className="bg-amber-50/50 p-3.5 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="w-44 shrink-0">
                  <span className="font-fun font-bold text-sm text-slate-900 block">
                    {row.label}
                  </span>
                  <span className="text-xs font-semibold text-slate-700">
                    Total: {row.count} {row.count === 1 ? 'zi' : 'zile'}
                  </span>
                </div>

                {/* Dot Stickers (Sticker Bulinuțe) */}
                <div className="flex-1 flex flex-wrap items-center gap-2 min-h-[32px]">
                  {row.count === 0 ? (
                    <span className="text-xs italic text-slate-700">Nicio zi înregistrată</span>
                  ) : (
                    [...Array(row.count)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-7 h-7 rounded-full ${row.color} border-2 border-white shadow-xs flex items-center justify-center text-xs font-black text-white transform transition-transform hover:scale-125`}
                        title={`Bulina numărul ${i + 1}`}
                      >
                        {i + 1}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Sofia's scientific conclusion */}
          <div className="mt-6 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-2xl flex items-start gap-3">
            <span className="text-3xl">🎉</span>
            <div>
              <h5 className="font-fun font-bold text-emerald-950 text-base">
                Concluzia Micului Meteorolog:
              </h5>
              <p className="text-xs sm:text-sm font-semibold text-emerald-900 mt-0.5">
                "În această săptămână, cele mai multe zile au fost cu soare! Sofia a avut dreptate când a ascultat semnele naturii și Morișca veselă!"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
