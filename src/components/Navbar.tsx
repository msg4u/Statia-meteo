import React from 'react';
import { CloudSun, BookOpen, Scissors, Calendar, Compass, Volume2 } from 'lucide-react';
import { playPopSound, speakText } from '../utils/audio';

export type ActiveTab = 'station' | 'story' | 'craft' | 'calendar' | 'guide';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab }) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'station',
      label: 'Stația Meteo',
      icon: <CloudSun className="w-5 h-5 text-amber-500" />,
      badge: 'Interactiv',
    },
    {
      id: 'story',
      label: 'Povestea Sofiei',
      icon: <BookOpen className="w-5 h-5 text-rose-500" />,
    },
    {
      id: 'craft',
      label: 'Atelier de Meșterit',
      icon: <Scissors className="w-5 h-5 text-emerald-500" />,
      badge: 'DIY',
    },
    {
      id: 'calendar',
      label: 'Calendar & Raport',
      icon: <Calendar className="w-5 h-5 text-purple-500" />,
    },
    {
      id: 'guide',
      label: 'Ghid Părinți & Educatori',
      icon: <Compass className="w-5 h-5 text-orange-500" />,
    },
  ];

  const handleTabClick = (tabId: ActiveTab) => {
    playPopSound();
    onSelectTab(tabId);
  };

  const handleWelcomeSpeech = () => {
    speakText('Bine ai venit la Stația Meteo a Sofiei! Învață să asculți semnele naturii alături de Morișca, Picurel și Termi!');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-3 border-amber-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={handleWelcomeSpeech}>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 border-2 border-amber-500 shadow-xs flex items-center justify-center text-2xl transform hover:rotate-6 transition-transform">
            ⛅
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-fun text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Stația Meteo a Sofiei
              </h1>
              <span className="text-[11px] font-black bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                4-7 ani
              </span>
            </div>
            <p className="text-xs font-bold text-slate-700">
              Morișca 🌀 • Picurel 💧 • Termi 🌡️
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => handleTabClick(item.id)}
                className={`py-2 px-3 sm:px-4 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-amber-950 shadow-xs scale-102 ring-2 ring-amber-300'
                    : 'text-slate-700 hover:bg-amber-50 hover:text-slate-900'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] bg-white/70 px-1.5 py-0.2 rounded-full font-black text-amber-950 border border-amber-200">
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
