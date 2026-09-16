/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { InteractiveStation } from './components/InteractiveStation';
import { StoryBook } from './components/StoryBook';
import { CraftWorkshop } from './components/CraftWorkshop';
import { CalendarView } from './components/CalendarView';
import { EducatorGuide } from './components/EducatorGuide';
import { INITIAL_CALENDAR_LOGS } from './data/weatherData';
import { WeatherLog } from './types';
import { Heart, Sparkles, BookOpen, Scissors, CloudSun, Calendar } from 'lucide-react';
import { playPopSound, preloadCoreAudios } from './utils/audio';

const STORAGE_KEY = 'sofia_weather_station_logs_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('station');
  const [logs, setLogs] = useState<WeatherLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_CALENDAR_LOGS;
  });

  // Preload priority narration audios on startup so all voice buttons react instantly
  useEffect(() => {
    preloadCoreAudios();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    } catch {
      // ignore
    }
  }, [logs]);

  const handleSaveToCalendar = (newLog: WeatherLog) => {
    setLogs((prev) => {
      // Check if log for this date exists, update or prepend
      const existingIdx = prev.findIndex((l) => l.date === newLog.date);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = newLog;
        return updated;
      }
      return [newLog, ...prev.slice(0, 13)]; // keep last two weeks
    });
  };

  const handleAddOrUpdateLog = (updatedLog: WeatherLog) => {
    setLogs((prev) =>
      prev.map((l) => (l.id === updatedLog.id ? updatedLog : l))
    );
  };

  return (
    <div className="min-h-screen bg-[#f0f9ff] text-slate-800 flex flex-col selection:bg-amber-200">
      {/* Navbar */}
      <Navbar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:py-8">
        {activeTab === 'station' && (
          <InteractiveStation onSaveToCalendar={handleSaveToCalendar} />
        )}

        {activeTab === 'story' && <StoryBook />}

        {activeTab === 'craft' && <CraftWorkshop />}

        {activeTab === 'calendar' && (
          <CalendarView
            logs={logs}
            onAddOrUpdateLog={handleAddOrUpdateLog}
            currentDayWeather="sunny"
          />
        )}

        {activeTab === 'guide' && <EducatorGuide />}
      </main>

      {/* Friendly Bottom Activity Bar (Quick jump for kids) */}
      <footer className="bg-white border-t-2 border-amber-200 py-6 px-4 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👧</span>
            <div>
              <p className="text-sm font-bold text-slate-800 font-fun">
                Stația Meteo • Educație prin Curiozitate & Joacă
              </p>
              <p className="text-xs text-slate-700">
                Inspirat de povestea Sofiei și cei 3 prieteni de nădejde: Morișca, Picurel și Termi.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => {
                playPopSound();
                setActiveTab('story');
              }}
              className="py-1.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold rounded-xl border border-rose-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Citește Povestea</span>
            </button>

            <button
              onClick={() => {
                playPopSound();
                setActiveTab('craft');
              }}
              className="py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Meșterește Prietenii</span>
            </button>

            <button
              onClick={() => {
                playPopSound();
                setActiveTab('station');
              }}
              className="py-1.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-xl border border-amber-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <CloudSun className="w-3.5 h-3.5" />
              <span>Joacă la Stație</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
