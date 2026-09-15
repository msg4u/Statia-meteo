import React from 'react';
import { CloudSun, BookOpen, Scissors, Calendar, Compass, Volume2 } from 'lucide-react';
import { playPopSound, speakText } from '../utils/audio';

export type ActiveTab = 'station' | 'story' | 'craft' | 'calendar' | 'guide';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab }) => {
  const navItems: { id: ActiveTab; label: string; shortLabel?: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'station',
      label: 'Stația Meteo',
      icon: <CloudSun className="w-4 h-4 text-amber-500 shrink-0" />,
    },
    {
      id: 'story',
      label: 'Povestea Sofiei',
      shortLabel: 'Povestea',
      icon: <BookOpen className="w-4 h-4 text-rose-500 shrink-0" />,
    },
    {
      id: 'craft',
      label: 'Atelier de Meșterit',
      shortLabel: 'Atelier DIY',
      icon: <Scissors className="w-4 h-4 text-emerald-500 shrink-0" />,
    },
    {
      id: 'calendar',
      label: 'Calendar & Raport',
      shortLabel: 'Calendar',
      icon: <Calendar className="w-4 h-4 text-purple-500 shrink-0" />,
    },
    {
      id: 'guide',
      label: 'Pentru Părinți & Educatori',
      shortLabel: 'Părinți & Educatori',
      icon: <Compass className="w-4 h-4 text-orange-500 shrink-0" />,
    },
  ];

  const handleTabClick = (tabId: ActiveTab) => {
    playPopSound();
    onSelectTab(tabId);
  };

  const handleWelcomeSpeech = () => {
    speakText('Bine ai venit la Stația Meteo! Învață să asculți semnele naturii alături de Morișca, Picurel și Termi!');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-amber-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 flex flex-col xl:flex-row items-center justify-between gap-2.5">
        {/* Brand Logo & Title */}
        <div
          className="flex items-center gap-2.5 cursor-pointer shrink-0"
          onClick={handleWelcomeSpeech}
          title="Apasă pentru a asculta"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 border-2 border-amber-500 shadow-xs flex items-center justify-center text-xl sm:text-2xl transform hover:rotate-6 transition-transform shrink-0">
            ⛅
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-fun text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                Stația Meteo
              </h1>
              <span className="text-[10px] font-black bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300 leading-none">
                4-7 ani
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-600 mt-0.5">
              Morișca 🌀 • Picurel 💧 • Termi 🌡️
            </p>
          </div>
        </div>

        {/* Navigation Tabs - fully responsive with wrapping so no tab is cut off */}
        <nav className="flex items-center flex-wrap justify-center xl:justify-end gap-1.5 w-full xl:w-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => handleTabClick(item.id)}
                className={`py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-amber-400 text-amber-950 shadow-xs scale-102 ring-2 ring-amber-300'
                    : 'text-slate-700 hover:bg-amber-50 hover:text-slate-900'
                }`}
              >
                {item.icon}
                <span className="hidden md:inline">{item.label}</span>
                <span className="md:hidden">{item.shortLabel || item.label}</span>
                {item.badge && (
                  <span className="text-[9px] bg-white/70 px-1 py-0.2 rounded-full font-black text-amber-950 border border-amber-200">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
