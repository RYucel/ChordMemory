/**
 * Akor Belleği - Memory & Calibration Statistics Component
 */

import React from 'react';
import { AppSettings, Card, Review, Session, TransitionStat } from '../types';
import { getTranslation } from '../lib/i18n';
import { calculateRetrievability } from '../lib/fsrs';
import { BarChart3, AlertTriangle, TrendingUp, ShieldCheck, Activity } from 'lucide-react';

interface StatsViewProps {
  settings: AppSettings;
  cards: Card[];
  reviews: Review[];
  sessions: Session[];
  transitions: TransitionStat[];
}

export const StatsView: React.FC<StatsViewProps> = ({
  settings,
  cards,
  reviews,
  sessions,
  transitions,
}) => {
  const t = getTranslation(settings.language);

  // Calibration Deviation Detector (§3.10)
  // Compares self-ratings (Easy/Good) against objective transition drill speeds
  const easyReviews = reviews.filter(r => r.grade === 4);
  const slowTransitions = transitions.filter(tr => tr.avgMs > 1200);
  const showCalibrationAlert = settings.calibrationWarningEnabled && easyReviews.length > 0 && slowTransitions.length > 0;

  // Average Retrievability
  const avgStability = cards.length > 0 ? (cards.reduce((acc, c) => acc + c.fsrsState.stability, 0) / cards.length) : 1;
  const currentAvgR = calculateRetrievability(1, avgStability);

  // Generate Forgetting Curve Data Points (Days 1 to 30)
  const days = [1, 2, 3, 5, 7, 10, 14, 21, 30];
  const curvePoints = days.map(d => ({
    day: d,
    retrievability: Math.round(calculateRetrievability(d, avgStability) * 100),
  }));

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-[#0F0F11] border border-[#2A2A2C] p-6 rounded-3xl space-y-2">
        <h2 className="text-2xl font-serif text-stone-100 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-[#D4AF37]" />
          <span>{t.statsTitle}</span>
        </h2>
        <p className="text-xs text-stone-400 font-sans">
          FSRS 4.5 bellek kararlılığı, unutma eğrisi ve kalibrasyon ölçümleri.
        </p>
      </div>

      {/* Calibration Warning Alert Banner */}
      {showCalibrationAlert && (
        <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/40 p-5 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-[#D4AF37] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-serif text-[#D4AF37] text-sm">{t.calibrationAlert}</h4>
            <p className="text-xs text-stone-300 mt-1 font-sans">{t.calibrationMsg}</p>
          </div>
        </div>
      )}

      {/* Stats KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0F0F11] border border-[#2A2A2C] p-5 rounded-2xl">
          <div className="text-[10px] text-stone-500 font-semibold uppercase tracking-widest mb-1">Ortalama Geri Çağırma (R)</div>
          <div className="text-3xl font-serif italic text-[#D4AF37]">%{Math.round(currentAvgR * 100)}</div>
        </div>
        <div className="bg-[#0F0F11] border border-[#2A2A2C] p-5 rounded-2xl">
          <div className="text-[10px] text-stone-500 font-semibold uppercase tracking-widest mb-1">Ortalama Kararlılık (S)</div>
          <div className="text-3xl font-serif italic text-emerald-400">{avgStability.toFixed(1)} gün</div>
        </div>
        <div className="bg-[#0F0F11] border border-[#2A2A2C] p-5 rounded-2xl">
          <div className="text-[10px] text-stone-500 font-semibold uppercase tracking-widest mb-1">Toplam İnceleme</div>
          <div className="text-3xl font-serif italic text-white">{reviews.length}</div>
        </div>
        <div className="bg-[#0F0F11] border border-[#2A2A2C] p-5 rounded-2xl">
          <div className="text-[10px] text-stone-500 font-semibold uppercase tracking-widest mb-1">Tamamlanan Seans</div>
          <div className="text-3xl font-serif italic text-stone-300">{sessions.length}</div>
        </div>
      </div>

      {/* Forgetting Curve Graph Section */}
      <div className="bg-[#0F0F11] border border-[#2A2A2C] p-6 rounded-3xl space-y-4">
        <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-widest flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
          <span>{t.forgettingCurve}</span>
        </h3>

        <div className="space-y-3 pt-2">
          {curvePoints.map(p => (
            <div key={p.day} className="space-y-1">
              <div className="flex justify-between text-xs font-mono font-semibold">
                <span className="text-stone-400">{p.day}. Gün</span>
                <span className="text-[#D4AF37]">%{p.retrievability} R</span>
              </div>
              <div className="w-full bg-[#161618] rounded-full h-2 border border-[#2A2A2C] overflow-hidden">
                <div
                  className="bg-[#D4AF37] h-2 rounded-full"
                  style={{ width: `${p.retrievability}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
