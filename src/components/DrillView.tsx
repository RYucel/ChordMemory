/**
 * Akor Belleği - Transition Matrix & Timed 60s Drill Component
 */

import React, { useState, useEffect } from 'react';
import { AppSettings, TransitionStat } from '../types';
import { getTranslation } from '../lib/i18n';
import { globalMetronome } from '../lib/metronome';
import { Activity, Play, Check, Flame, RotateCcw } from 'lucide-react';

interface DrillViewProps {
  settings: AppSettings;
  transitions: TransitionStat[];
  onSaveTransitionStat: (stat: TransitionStat) => void;
}

export const DrillView: React.FC<DrillViewProps> = ({
  settings,
  transitions,
  onSaveTransitionStat,
}) => {
  const t = getTranslation(settings.language);

  const [selectedPair, setSelectedPair] = useState<TransitionStat | null>(transitions[0] || null);
  const [drillActive, setDrillActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [passCount, setPassCount] = useState(0);

  useEffect(() => {
    let timer: number | null = null;
    if (drillActive && timeLeft > 0) {
      timer = window.setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && drillActive) {
      setDrillActive(false);
      globalMetronome.stop();
      if (selectedPair) {
        onSaveTransitionStat({
          ...selectedPair,
          attempts: selectedPair.attempts + passCount,
          cleanCount: selectedPair.cleanCount + passCount,
          lastDrilledAt: Date.now(),
        });
      }
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [drillActive, timeLeft, selectedPair, passCount, onSaveTransitionStat]);

  const startDrill = () => {
    setTimeLeft(60);
    setPassCount(0);
    setDrillActive(true);
    globalMetronome.setBpm(80);
    globalMetronome.start();
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-[#0F0F11] border border-[#2A2A2C] p-6 rounded-3xl space-y-2">
        <h2 className="text-2xl font-serif text-stone-100 flex items-center gap-2">
          <Activity className="w-6 h-6 text-[#D4AF37]" />
          <span>{t.drillTitle}</span>
        </h2>
        <p className="text-xs text-stone-400 font-sans">{t.drillSubtitle}</p>
      </div>

      {/* Active Drill Runner Box */}
      {selectedPair && (
        <div className="bg-[#0F0F11] border border-[#2A2A2C] rounded-3xl p-6 md:p-8 text-center space-y-6 shadow-2xl">
          <div className="bg-[#161618] border border-[#2A2A2C] p-6 rounded-3xl max-w-md mx-auto flex items-center justify-around">
            <div className="text-center">
              <div className="text-4xl font-serif text-[#D4AF37]">{selectedPair.fromChord}</div>
              <div className="text-[10px] text-stone-500 uppercase tracking-widest mt-1">Akor A</div>
            </div>
            <div className="text-3xl font-serif text-stone-500">→</div>
            <div className="text-center">
              <div className="text-4xl font-serif text-[#D4AF37]">{selectedPair.toChord}</div>
              <div className="text-[10px] text-stone-500 uppercase tracking-widest mt-1">Akor B</div>
            </div>
          </div>

          <div className="text-5xl font-mono italic text-[#D4AF37]">
            {timeLeft} <span className="text-base text-stone-500 font-sans">sn</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {!drillActive ? (
              <button
                onClick={startDrill}
                className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#C4A130] text-black font-bold px-10 py-4 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-[#D4AF37]/10"
              >
                {t.startDrill}
              </button>
            ) : (
              <button
                onClick={() => setPassCount(prev => prev + 1)}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-12 py-5 rounded-2xl text-lg shadow-2xl active:scale-95 transition-all"
              >
                +1 Temiz Basış ({passCount})
              </button>
            )}
          </div>
        </div>
      )}

      {/* Transitions List Matrix */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-widest">Akor Çiftleri Hız Listesi</h3>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {transitions.map((tr) => {
            const isSelected = selectedPair?.id === tr.id;
            const passRate = tr.attempts > 0 ? Math.round((tr.cleanCount / tr.attempts) * 100) : 0;

            return (
              <div
                key={tr.id}
                onClick={() => {
                  setSelectedPair(tr);
                  setDrillActive(false);
                }}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#D4AF37]/10 border-[#D4AF37] shadow-lg'
                    : 'bg-[#0F0F11] border-[#2A2A2C] hover:border-[#2A2A2C]/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-serif text-lg text-stone-100">
                    {tr.fromChord} <span className="text-[#D4AF37]">→</span> {tr.toChord}
                  </div>
                  <span className="text-xs font-mono text-[#D4AF37]">{tr.avgMs} ms</span>
                </div>
                <div className="text-[10px] text-stone-500 uppercase tracking-wider mt-2 flex justify-between">
                  <span>Deneme: {tr.attempts}</span>
                  <span>Temizlik: %{passRate}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
