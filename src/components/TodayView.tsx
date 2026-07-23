/**
 * Akor Belleği - Today Dashboard View Component
 */

import React from 'react';
import { AppSettings, Card, Section, Song, TransitionStat } from '../types';
import { getTranslation } from '../lib/i18n';
import { Play, Sparkles, Flame, Activity, BookOpen, CheckCircle2, Clock, AlertTriangle, ChevronRight } from 'lucide-react';

interface TodayViewProps {
  settings: AppSettings;
  songs: Song[];
  sections: Section[];
  cards: Card[];
  transitions: TransitionStat[];
  onStartSession: () => void;
  onNavigateTab: (tab: string) => void;
  streakCount: number;
}

export const TodayView: React.FC<TodayViewProps> = ({
  settings,
  songs,
  sections,
  cards,
  transitions,
  onStartSession,
  onNavigateTab,
  streakCount,
}) => {
  const t = getTranslation(settings.language);
  const now = Date.now();

  // Due Cards
  const dueCards = cards.filter(c => c.fsrsState.dueAt <= now);
  const newCards = cards.filter(c => c.fsrsState.state === 'NEW');
  const reviewCards = dueCards.filter(c => c.fsrsState.state !== 'NEW');

  // Weakest 3 Transitions
  const sortedTransitions = [...transitions].sort((a, b) => (a.cleanCount / (a.attempts || 1)) - (b.cleanCount / (b.attempts || 1)));
  const weakTransitions = sortedTransitions.slice(0, 3);

  // Mature Cards (Stability > 21 days)
  const matureCardsCount = cards.filter(c => c.fsrsState.stability > 21).length;
  const maturityPercent = cards.length > 0 ? Math.round((matureCardsCount / cards.length) * 100) : 0;

  return (
    <div className="space-y-8 pb-12">
      
      {/* Main Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-[#161618] border border-[#2A2A2C] p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#D4AF37] font-semibold text-xs tracking-widest uppercase">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>{t.todayTitle}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-stone-100 tracking-tight">
              {dueCards.length > 0 ? `${dueCards.length} Kart Vadesi Geldi` : t.noDueCards}
            </h2>
            <p className="text-stone-400 text-sm md:text-base max-w-xl font-sans">
              {t.readyToStudy}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={onStartSession}
              className="h-16 w-full sm:w-64 bg-[#D4AF37] hover:bg-[#C4A130] text-black font-bold text-base rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-[#D4AF37]/10 transition-all active:scale-95"
            >
              <Play className="w-5 h-5 fill-black" />
              <span className="uppercase tracking-wider">{t.startSession}</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#2A2A2C]">
          <div className="bg-[#0F0F11] border border-[#2A2A2C] p-4 rounded-2xl">
            <div className="text-[10px] text-stone-500 font-semibold uppercase tracking-widest mb-1">{t.dueQueue}</div>
            <div className="text-2xl font-serif italic text-[#D4AF37]">{dueCards.length}</div>
          </div>
          <div className="bg-[#0F0F11] border border-[#2A2A2C] p-4 rounded-2xl">
            <div className="text-[10px] text-stone-500 font-semibold uppercase tracking-widest mb-1">{t.reviewCards}</div>
            <div className="text-2xl font-serif italic text-white">{reviewCards.length}</div>
          </div>
          <div className="bg-[#0F0F11] border border-[#2A2A2C] p-4 rounded-2xl">
            <div className="text-[10px] text-stone-500 font-semibold uppercase tracking-widest mb-1">{t.newCards}</div>
            <div className="text-2xl font-serif italic text-stone-300">{newCards.length}</div>
          </div>
          <div className="bg-[#0F0F11] border border-[#2A2A2C] p-4 rounded-2xl">
            <div className="text-[10px] text-stone-500 font-semibold uppercase tracking-widest mb-1">{t.streakDays}</div>
            <div className="text-2xl font-serif italic text-emerald-400 flex items-center gap-1.5">
              <Flame className="w-5 h-5 fill-emerald-500 text-emerald-500" />
              <span>{streakCount} {t.daysUnit}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid md:grid-cols-2 gap-8">

        {/* Weakest Transitions Box */}
        <div className="bg-[#0F0F11] border border-[#2A2A2C] rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-widest">{t.weakestTransitions}</h3>
              </div>
              <button
                onClick={() => onNavigateTab('drill')}
                className="text-[10px] text-[#D4AF37] border border-[#D4AF37]/30 px-2.5 py-1 rounded-full hover:bg-[#D4AF37]/10 transition-colors flex items-center gap-1"
              >
                Tümü <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-stone-400 mb-5 font-sans">
              Geçiş motor hafızasında hız/temizlik oranı en düşük olan akor çiftleri.
            </p>

            <div className="space-y-3">
              {weakTransitions.map((tr) => {
                const passRate = tr.attempts > 0 ? Math.round((tr.cleanCount / tr.attempts) * 100) : 0;
                return (
                  <div key={tr.id} className="flex items-center justify-between bg-[#161618] border border-[#2A2A2C] px-4 py-3.5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-lg text-white">{tr.fromChord}</span>
                      <span className="text-[#D4AF37] font-serif text-lg">→</span>
                      <span className="font-serif text-lg text-white">{tr.toChord}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono text-[#D4AF37]">{tr.avgMs} ms / geçiş</div>
                      <div className="text-[10px] text-stone-500 uppercase tracking-wider">Temizlik: %{passRate}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('drill')}
            className="w-full mt-6 bg-[#161618] hover:bg-[#1f1f22] text-[#D4AF37] font-bold py-3 rounded-xl text-xs uppercase tracking-wider border border-[#2A2A2C] transition-colors flex items-center justify-center gap-2"
          >
            <Activity className="w-4 h-4" />
            <span>{t.quickStartDrill}</span>
          </button>
        </div>

        {/* Repertoire Summary Box */}
        <div className="bg-[#0F0F11] border border-[#2A2A2C] rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-widest">{t.repertoireTitle} ({songs.length})</h3>
              </div>
              <button
                onClick={() => onNavigateTab('repertoire')}
                className="text-[10px] text-[#D4AF37] border border-[#D4AF37]/30 px-2.5 py-1 rounded-full hover:bg-[#D4AF37]/10 transition-colors flex items-center gap-1"
              >
                Yönet <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Maturity Bar */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[10px] text-stone-500 uppercase tracking-widest">{t.repertoireMaturity}</span>
                <span className="text-[#D4AF37] font-mono">%{maturityPercent}</span>
              </div>
              <div className="w-full bg-[#161618] rounded-full h-2 border border-[#2A2A2C] overflow-hidden">
                <div 
                  className="bg-[#D4AF37] h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${maturityPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Recent Songs List */}
            <div className="space-y-3">
              {songs.slice(0, 3).map((song) => (
                <div key={song.id} className="flex items-center justify-between bg-[#161618] border border-[#2A2A2C] p-3.5 rounded-xl">
                  <div>
                    <div className="font-medium text-stone-100 text-sm">{song.title}</div>
                    <div className="text-xs text-stone-400">{song.artist}</div>
                  </div>
                  <span className="text-xs font-mono font-bold bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 px-2.5 py-1 rounded-md">
                    {song.key}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('repertoire')}
            className="w-full mt-6 bg-[#161618] hover:bg-[#1f1f22] text-stone-200 font-bold py-3 rounded-xl text-xs uppercase tracking-wider border border-[#2A2A2C] transition-colors"
          >
            {t.addSong}
          </button>
        </div>

      </div>

    </div>
  );
};
