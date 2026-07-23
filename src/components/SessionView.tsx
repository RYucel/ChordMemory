/**
 * Akor Belleği - Core 5-Stage Practice Session View
 */

import React, { useState, useEffect } from 'react';
import { AppSettings, Card, Review, Section, Session, Song, TransitionStat, Grade } from '../types';
import { getTranslation } from '../lib/i18n';
import { scheduleReview } from '../lib/fsrs';
import { computeRomanNumeral } from '../lib/parser';
import { globalMetronome } from '../lib/metronome';
import { Play, Pause, Check, Volume2, Eye, HelpCircle, ChevronRight, RotateCcw, Award, Flame, AlertCircle } from 'lucide-react';

interface SessionViewProps {
  settings: AppSettings;
  songs: Song[];
  sections: Section[];
  cards: Card[];
  transitions: TransitionStat[];
  onSaveCardReview: (card: Card, review: Review, nextCardState: Card) => void;
  onSaveTransitionStat: (stat: TransitionStat) => void;
  onSaveSession: (session: Session) => void;
  onFinishSession: () => void;
}

export const SessionView: React.FC<SessionViewProps> = ({
  settings,
  songs,
  sections,
  cards,
  transitions,
  onSaveCardReview,
  onSaveTransitionStat,
  onSaveSession,
  onFinishSession,
}) => {
  const t = getTranslation(settings.language);

  // 5-Stage Session State
  const [phase, setPhase] = useState<'WARMUP' | 'REVIEW' | 'NEW' | 'PERFORMANCE' | 'DONE'>('WARMUP');

  // Warmup Drill State
  const [drillTimeLeft, setDrillTimeLeft] = useState(60);
  const [drillActive, setDrillActive] = useState(false);
  const [drillPasses, setDrillPasses] = useState(0);
  const [warmupPair, setWarmupPair] = useState<TransitionStat | null>(null);

  // Review Queue State (Interleaved)
  const [reviewQueue, setReviewQueue] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [revealDelayActive, setRevealDelayActive] = useState(false);
  const [cardStartTime, setCardStartTime] = useState(Date.now());
  const [showRomanOverride, setShowRomanOverride] = useState(false);
  const [metronomeActive, setMetronomeActive] = useState(false);

  // Session Results Stats
  const [reviewedCount, setReviewedCount] = useState(0);
  const [successfulCount, setSuccessfulCount] = useState(0);

  // Initialize Warmup and Interleaved Queue on Mount
  useEffect(() => {
    // 1. Pick weakest transition pair for Warmup
    if (transitions.length > 0) {
      const sorted = [...transitions].sort((a, b) => (a.cleanCount / (a.attempts || 1)) - (b.cleanCount / (b.attempts || 1)));
      setWarmupPair(sorted[0]);
    }

    // 2. Build Interleaved Review Queue (no 2 cards from same song back-to-back)
    const now = Date.now();
    let due = cards.filter(c => c.fsrsState.dueAt <= now);
    if (due.length === 0) {
      due = [...cards].sort((a, b) => a.fsrsState.dueAt - b.fsrsState.dueAt).slice(0, 10);
    }

    // Interleaving algorithm
    const interleaved: Card[] = [];
    const pool = [...due];
    let lastSongId = '';

    while (pool.length > 0) {
      let candidateIdx = pool.findIndex(c => c.songId !== lastSongId);
      if (candidateIdx === -1) candidateIdx = 0; // fallback if only one song left
      const chosen = pool.splice(candidateIdx, 1)[0];
      interleaved.push(chosen);
      lastSongId = chosen.songId;
    }

    setReviewQueue(interleaved);
  }, [cards, transitions]);

  // Warmup Timer Effect
  useEffect(() => {
    let timer: number | null = null;
    if (drillActive && drillTimeLeft > 0) {
      timer = window.setInterval(() => {
        setDrillTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (drillTimeLeft === 0 && drillActive) {
      setDrillActive(false);
      globalMetronome.stop();
      // Record transition stat update
      if (warmupPair) {
        onSaveTransitionStat({
          ...warmupPair,
          attempts: warmupPair.attempts + drillPasses,
          cleanCount: warmupPair.cleanCount + drillPasses,
          lastDrilledAt: Date.now(),
        });
      }
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [drillActive, drillTimeLeft, warmupPair, drillPasses, onSaveTransitionStat]);

  // Hands-free Bluetooth Pedal / Keyboard Handler (Space = reveal, 1/2/3/4 = rate)
  useEffect(() => {
    if (!settings.handsFreePedalEnabled || phase !== 'REVIEW') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (!isAnswerRevealed) handleRevealAnswer();
      } else if (isAnswerRevealed && !revealDelayActive) {
        if (e.key === '1') handleRateCard(1);
        if (e.key === '2') handleRateCard(2);
        if (e.key === '3') handleRateCard(3);
        if (e.key === '4') handleRateCard(4);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, isAnswerRevealed, revealDelayActive, settings.handsFreePedalEnabled]);

  // Current Active Card and Related Data
  const currentCard = reviewQueue[currentCardIndex];
  const currentSection = currentCard ? sections.find(s => s.id === currentCard.sectionId) : null;
  const currentSong = currentCard ? songs.find(s => s.id === currentCard.songId) : null;

  // Reveal Answer with 1-second Delayed Feedback (§3.3)
  const handleRevealAnswer = () => {
    setIsAnswerRevealed(true);
    setRevealDelayActive(true);
    globalMetronome.playCueSound('reveal');

    // Unlock rating buttons after 1.0 second delay
    setTimeout(() => {
      setRevealDelayActive(false);
    }, 1000);
  };

  // Grade Card Handler
  const handleRateCard = (grade: Grade) => {
    if (!currentCard || revealDelayActive) return;

    const elapsedMs = Date.now() - cardStartTime;
    const now = Date.now();

    // Schedule next state with FSRS 4.5
    const { nextState, nextCueLevelChange } = scheduleReview(
      currentCard.fsrsState,
      grade,
      now,
      settings.desiredRetention,
      settings.fsrsWeights
    );

    // Update cue level (0 to 5)
    const newCueLevel = Math.max(0, Math.min(5, currentCard.cueLevel + nextCueLevelChange));

    const updatedCard: Card = {
      ...currentCard,
      cueLevel: newCueLevel,
      fsrsState: nextState,
    };

    const reviewRecord: Review = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      cardId: currentCard.id,
      songId: currentCard.songId,
      reviewedAt: now,
      grade,
      elapsedMs,
      cueLevelAtReview: currentCard.cueLevel,
    };

    onSaveCardReview(currentCard, reviewRecord, updatedCard);

    setReviewedCount(prev => prev + 1);
    if (grade >= 3) setSuccessfulCount(prev => prev + 1);

    // Audio Cue Feedback
    globalMetronome.playCueSound(grade >= 3 ? 'success' : 'failure');

    // Advance queue
    if (currentCardIndex + 1 < reviewQueue.length) {
      setCurrentCardIndex(prev => prev + 1);
      setIsAnswerRevealed(false);
      setCardStartTime(Date.now());
    } else {
      // Review phase finished -> Move to Phase 3
      setPhase('NEW');
    }
  };

  // Render Cue Presentation based on Level L0-L5 (§3.7)
  const renderCueContent = () => {
    if (!currentSection || !currentSong) return null;

    const cueLevel = currentCard ? currentCard.cueLevel : 0;
    const chords = currentSection.chordSequence;

    // L5: Audio / Zero Visual Cue
    if (cueLevel === 5 && !isAnswerRevealed) {
      return (
        <div className="text-center py-12 space-y-4 bg-[#161618] border border-[#2A2A2C] rounded-2xl p-8">
          <Volume2 className="w-16 h-16 text-[#D4AF37] animate-pulse mx-auto" />
          <h4 className="text-2xl font-serif text-stone-100">{t.cueLevel5}</h4>
          <p className="text-stone-400 text-sm font-sans">Hiçbir görsel ipucu yok. Metronoma uyup hafızandan bas.</p>
        </div>
      );
    }

    // L4: Lyrics Line Only
    if (cueLevel === 4 && !isAnswerRevealed) {
      return (
        <div className="text-center py-10 bg-[#161618] border border-[#2A2A2C] rounded-2xl p-8 space-y-4">
          <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">{t.cueLevel4}</p>
          <div className="text-2xl font-serif text-stone-100 italic">
            "{currentSection.lyricCue || 'Söz satırı'}"
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Lyric Cue Header */}
        {currentSection.lyricCue && (
          <div className="text-sm text-stone-400 italic text-center border-b border-[#2A2A2C] pb-3 font-serif">
            "{currentSection.lyricCue}"
          </div>
        )}

        {/* Chord Sequence Display */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {chords.map((chord, idx) => {
            let chordText = chord.fullChord;

            if (!isAnswerRevealed) {
              if (cueLevel === 2) {
                // L2: First Letter Only
                chordText = `${chord.root}_`;
              } else if (cueLevel === 3 || showRomanOverride) {
                // L3: Roman Numerals Degree
                chordText = chord.romanNumeral || computeRomanNumeral(chord.fullChord, currentSong.key);
              }
            }

            return (
              <div
                key={idx}
                className={`p-5 rounded-2xl border text-center transition-all ${
                  isAnswerRevealed
                    ? 'bg-[#D4AF37]/10 border-[#D4AF37]/40 text-[#D4AF37] shadow-md'
                    : 'bg-[#161618] border-[#2A2A2C] text-stone-100'
                }`}
              >
                <div className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
                  {chordText}
                </div>
                <div className="text-[10px] text-stone-500 mt-1 uppercase tracking-widest">
                  {chord.beats} Vuruş
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">

      {/* Phase Indicator Header */}
      <div className="bg-[#0F0F11] border border-[#2A2A2C] p-4 rounded-2xl flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-stone-300">
        <div className="flex items-center gap-2 text-[#D4AF37]">
          <Flame className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]" />
          <span>
            {phase === 'WARMUP' && t.sessionPhaseWarmup}
            {phase === 'REVIEW' && t.sessionPhaseReview}
            {phase === 'NEW' && t.sessionPhaseNew}
            {phase === 'PERFORMANCE' && t.sessionPhasePerf}
            {phase === 'DONE' && t.sessionPhaseDone}
          </span>
        </div>

        {phase === 'REVIEW' && (
          <div className="text-xs text-stone-500 font-mono">
            Kart: {currentCardIndex + 1} / {reviewQueue.length}
          </div>
        )}
      </div>

      {/* STAGE 1: WARMUP DRILL */}
      {phase === 'WARMUP' && (
        <div className="bg-[#0F0F11] border border-[#2A2A2C] rounded-3xl p-6 md:p-8 space-y-6 text-center">
          <div className="space-y-2">
            <h3 className="text-2xl font-serif text-stone-100">{t.sessionPhaseWarmup}</h3>
            <p className="text-stone-400 text-sm max-w-lg mx-auto font-sans">{t.drillSubtitle}</p>
          </div>

          {warmupPair && (
            <div className="bg-[#161618] border border-[#2A2A2C] p-6 rounded-3xl max-w-md mx-auto flex items-center justify-around">
              <div className="text-center">
                <div className="text-3xl font-serif text-[#D4AF37]">{warmupPair.fromChord}</div>
                <div className="text-[10px] text-stone-500 uppercase tracking-widest mt-1">Akor 1</div>
              </div>
              <div className="text-2xl font-serif text-stone-500">↔</div>
              <div className="text-center">
                <div className="text-3xl font-serif text-[#D4AF37]">{warmupPair.toChord}</div>
                <div className="text-[10px] text-stone-500 uppercase tracking-widest mt-1">Akor 2</div>
              </div>
            </div>
          )}

          {/* Timer Display */}
          <div className="text-5xl font-mono italic text-[#D4AF37] my-4">
            {drillTimeLeft} <span className="text-base text-stone-500 font-sans">saniye</span>
          </div>

          <div className="flex items-center justify-center gap-4">
            {!drillActive ? (
              <button
                onClick={() => {
                  setDrillActive(true);
                  globalMetronome.start();
                }}
                className="bg-[#D4AF37] hover:bg-[#C4A130] text-black font-bold px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-lg"
              >
                Tatbikatı Başlat
              </button>
            ) : (
              <button
                onClick={() => setDrillPasses(prev => prev + 1)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-10 py-5 rounded-2xl text-lg shadow-xl active:scale-95 transition-all"
              >
                +1 Temiz Geçiş ({drillPasses})
              </button>
            )}

            <button
              onClick={() => {
                globalMetronome.stop();
                setPhase('REVIEW');
              }}
              className="bg-[#161618] hover:bg-[#1f1f22] text-stone-300 font-bold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider border border-[#2A2A2C]"
            >
              Atla & Tekrarlara Geç
            </button>
          </div>
        </div>
      )}

      {/* STAGE 2: FSRS REVIEW CARD DISPLAY */}
      {phase === 'REVIEW' && currentCard && currentSong && (
        <div className="bg-[#0F0F11] border border-[#2A2A2C] rounded-3xl p-6 md:p-8 space-y-8 shadow-2xl relative">
          
          {/* Card Top Info Header */}
          <div className="flex items-center justify-between border-b border-[#2A2A2C] pb-4">
            <div>
              <h3 className="text-xl font-serif text-stone-100">{currentSong.title}</h3>
              <p className="text-xs text-stone-400">{currentSong.artist} • Ton: <span className="font-mono text-[#D4AF37]">{currentSong.key}</span></p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowRomanOverride(prev => !prev)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
                  showRomanOverride
                    ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40'
                    : 'bg-[#161618] text-stone-300 border-[#2A2A2C]'
                }`}
              >
                {t.showRoman}
              </button>

              <button
                onClick={() => {
                  const running = globalMetronome.getIsRunning();
                  if (running) globalMetronome.stop();
                  else {
                    globalMetronome.setBpm(currentSong.tempoBpm || 90);
                    globalMetronome.start();
                  }
                  setMetronomeActive(!running);
                }}
                className={`p-2 rounded-lg border transition-colors ${
                  metronomeActive
                    ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                    : 'bg-[#161618] text-stone-300 border-[#2A2A2C]'
                }`}
                title={t.toggleMetronome}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cue Content Area */}
          <div className="min-h-[160px] flex items-center justify-center">
            {renderCueContent()}
          </div>

          {/* Action Reveal & Rating Area */}
          <div className="pt-6 border-t border-[#2A2A2C] text-center space-y-4">
            {!isAnswerRevealed ? (
              <button
                onClick={handleRevealAnswer}
                className="w-full bg-[#D4AF37] hover:bg-[#C4A130] text-black font-bold py-4 rounded-2xl text-sm uppercase tracking-wider shadow-xl shadow-[#D4AF37]/10 transition-all active:scale-98"
              >
                {t.revealAnswer}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="text-[10px] text-stone-500 font-semibold uppercase tracking-widest">
                  {t.evaluatePerformance}
                </div>

                {/* 4-Grade Rating Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    disabled={revealDelayActive}
                    onClick={() => handleRateCard(1)}
                    className="p-3.5 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-300 rounded-xl text-left transition-all disabled:opacity-50"
                  >
                    <div className="font-bold text-xs uppercase tracking-wider">{t.gradeAgain} (1)</div>
                    <div className="text-[10px] text-rose-300/80 mt-0.5">{t.gradeAgainSub}</div>
                  </button>

                  <button
                    disabled={revealDelayActive}
                    onClick={() => handleRateCard(2)}
                    className="p-3.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20 text-[#D4AF37] rounded-xl text-left transition-all disabled:opacity-50"
                  >
                    <div className="font-bold text-xs uppercase tracking-wider">{t.gradeHard} (2)</div>
                    <div className="text-[10px] text-[#D4AF37]/80 mt-0.5">{t.gradeHardSub}</div>
                  </button>

                  <button
                    disabled={revealDelayActive}
                    onClick={() => handleRateCard(3)}
                    className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-300 rounded-xl text-left transition-all disabled:opacity-50"
                  >
                    <div className="font-bold text-xs uppercase tracking-wider">{t.gradeGood} (3)</div>
                    <div className="text-[10px] text-emerald-300/80 mt-0.5">{t.gradeGoodSub}</div>
                  </button>

                  <button
                    disabled={revealDelayActive}
                    onClick={() => handleRateCard(4)}
                    className="p-3.5 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300 rounded-xl text-left transition-all disabled:opacity-50"
                  >
                    <div className="font-bold text-xs uppercase tracking-wider">{t.gradeEasy} (4)</div>
                    <div className="text-[10px] text-cyan-300/80 mt-0.5">{t.gradeEasySub}</div>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* STAGE 3: NEW MATERIAL */}
      {phase === 'NEW' && (
        <div className="bg-[#0F0F11] border border-[#2A2A2C] rounded-3xl p-6 md:p-8 text-center space-y-6">
          <h3 className="text-2xl font-serif text-stone-100">{t.sessionPhaseNew}</h3>
          <p className="text-stone-400 text-sm max-w-lg mx-auto font-sans">
            Yeni bir bölüm tanıtılıyor. Roman rakamı harmonik şemasıyla incele ve ilk L0 tekrarı olarak kaydet.
          </p>

          <button
            onClick={() => setPhase('PERFORMANCE')}
            className="bg-[#D4AF37] hover:bg-[#C4A130] text-black font-bold px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-lg"
          >
            Performans Aşamasına Geç →
          </button>
        </div>
      )}

      {/* STAGE 4: PERFORMANCE */}
      {phase === 'PERFORMANCE' && (
        <div className="bg-[#0F0F11] border border-[#2A2A2C] rounded-3xl p-6 md:p-8 text-center space-y-6">
          <h3 className="text-2xl font-serif text-stone-100">{t.sessionPhasePerf}</h3>
          <p className="text-stone-400 text-sm max-w-lg mx-auto font-sans">
            Görsel ipucu olmadan rastgele seçilen olgun bir şarkıyı metronom eşliğinde baştan sona çal.
          </p>

          <button
            onClick={() => {
              setPhase('DONE');
              const finalRetention = reviewedCount > 0 ? (successfulCount / reviewedCount) : 1.0;
              onSaveSession({
                id: `ses-${Date.now()}`,
                startedAt: Date.now() - 20 * 60 * 1000,
                endedAt: Date.now(),
                cardsReviewed: reviewedCount,
                retentionRate: finalRetention,
                drillScore: drillPasses,
                completedPhase: 'DONE',
              });
            }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-lg"
          >
            Seansı Tamamla & Raporu Gör
          </button>
        </div>
      )}

      {/* STAGE 5: DONE & WRAP-UP */}
      {phase === 'DONE' && (
        <div className="bg-[#0F0F11] border border-[#2A2A2C] rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full flex items-center justify-center text-[#D4AF37] mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-3xl font-serif text-stone-100">{t.sessionPhaseDone}</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto pt-4">
            <div className="bg-[#161618] border border-[#2A2A2C] p-4 rounded-2xl">
              <div className="text-[10px] text-stone-500 uppercase tracking-widest mb-1">Gözden Geçirilen</div>
              <div className="text-2xl font-serif italic text-[#D4AF37]">{reviewedCount}</div>
            </div>
            <div className="bg-[#161618] border border-[#2A2A2C] p-4 rounded-2xl">
              <div className="text-[10px] text-stone-500 uppercase tracking-widest mb-1">Başarı Oranı</div>
              <div className="text-2xl font-serif italic text-emerald-400">
                %{reviewedCount > 0 ? Math.round((successfulCount / reviewedCount) * 100) : 100}
              </div>
            </div>
            <div className="bg-[#161618] border border-[#2A2A2C] p-4 rounded-2xl col-span-2 sm:col-span-1">
              <div className="text-[10px] text-stone-500 uppercase tracking-widest mb-1">Tatbikat Skoru</div>
              <div className="text-2xl font-serif italic text-stone-300">{drillPasses} geçiş</div>
            </div>
          </div>

          <button
            onClick={onFinishSession}
            className="bg-[#D4AF37] hover:bg-[#C4A130] text-black font-bold px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-lg"
          >
            Ana Ekrana Dön
          </button>
        </div>
      )}

    </div>
  );
};
