/**
 * Akor Belleği - Header Navigation Component
 */

import React from 'react';
import { AppSettings } from '../types';
import { getTranslation } from '../lib/i18n';
import { Music, Flame, Calendar, BookOpen, Activity, BarChart3, Settings as SettingsIcon, Play } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  settings: AppSettings;
  onStartSession: () => void;
  streakCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  settings,
  onStartSession,
  streakCount,
}) => {
  const t = getTranslation(settings.language);

  const navItems = [
    { id: 'today', label: t.navToday, icon: Calendar },
    { id: 'repertoire', label: t.navRepertoire, icon: BookOpen },
    { id: 'drill', label: t.navDrill, icon: Activity },
    { id: 'stats', label: t.navStats, icon: BarChart3 },
    { id: 'settings', label: t.navSettings, icon: SettingsIcon },
  ];

  return (
    <header className="bg-[#0F0F11] border-b border-[#2A2A2C] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            onClick={() => setCurrentTab('today')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37] flex items-center justify-center text-black font-bold shadow-lg shadow-[#D4AF37]/10 group-hover:scale-105 transition-transform">
              <Music className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl font-serif italic text-[#D4AF37] tracking-tight flex items-center gap-2">
                {t.appName}
                <span className="text-[10px] font-sans uppercase tracking-widest font-semibold bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                  FSRS 4.5
                </span>
              </h1>
              <p className="text-[10px] text-stone-500 uppercase tracking-widest hidden sm:block">{t.tagline}</p>
            </div>
          </div>

          {/* Nav Items Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs uppercase tracking-widest font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30'
                      : 'text-stone-400 hover:text-stone-100 hover:bg-[#161618]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action & Streak */}
          <div className="flex items-center gap-3">
            {/* Streak Badge */}
            <div 
              className="flex items-center gap-1.5 bg-[#161618] border border-[#2A2A2C] px-3.5 py-1.5 rounded-xl text-sm font-semibold text-[#D4AF37]"
              title={`${streakCount} ${t.daysUnit} ${t.streakDays}`}
            >
              <Flame className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
              <span className="font-serif italic text-white font-bold">{streakCount}</span>
              <span className="text-xs text-stone-500 font-normal hidden xs:inline">{t.daysUnit}</span>
            </div>

            {/* Quick Session Start Button */}
            <button
              onClick={onStartSession}
              className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#C4A130] text-black font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-[#D4AF37]/10 transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-black" />
              <span className="hidden sm:inline">{t.startSession}</span>
              <span className="sm:hidden">{t.navSession}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden flex items-center justify-around bg-[#0F0F11] border-t border-[#2A2A2C] px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center gap-1 p-1.5 rounded-md text-[10px] uppercase tracking-widest font-semibold transition-colors ${
                isActive ? 'text-[#D4AF37]' : 'text-stone-400 hover:text-stone-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
