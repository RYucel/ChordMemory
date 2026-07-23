/**
 * Akor Belleği - Song Detail & Transpose Calculator Component
 */

import React, { useState } from 'react';
import { AppSettings, Card, Section, Song } from '../types';
import { getTranslation } from '../lib/i18n';
import { computeRomanNumeral, transposeChord } from '../lib/parser';
import { ArrowLeft, Play, Music, Sparkles, Sliders, Edit3, Trash2 } from 'lucide-react';
import { EditSongModal } from './EditSongModal';

interface SongDetailViewProps {
  settings: AppSettings;
  song: Song;
  sections: Section[];
  onBack: () => void;
  onStartSongPractice: (songId: string) => void;
  onUpdateSong: (updatedSong: Song, updatedSections: Section[], updatedCards?: Card[]) => void;
  onDeleteSong: (songId: string) => void;
}

export const SongDetailView: React.FC<SongDetailViewProps> = ({
  settings,
  song,
  sections,
  onBack,
  onStartSongPractice,
  onUpdateSong,
  onDeleteSong,
}) => {
  const t = getTranslation(settings.language);

  const [transposeOffset, setTransposeOffset] = useState(0); // semitones (-6 to +6)
  const [showRomanNumerals, setShowRomanNumerals] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const transposedKey = transposeChord(song.key, transposeOffset);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Bar with Back & Edit Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-stone-400 hover:text-[#D4AF37] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Repertuvara Dön</span>
        </button>

        <button
          onClick={() => setIsEditModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#161618] hover:bg-[#1f1f22] border border-[#2A2A2C] hover:border-[#D4AF37] text-stone-300 hover:text-[#D4AF37] rounded-xl text-xs font-semibold uppercase tracking-wider transition-all"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Şarkıyı Düzenle</span>
        </button>
      </div>

      {/* Hero Song Banner */}
      <div className="bg-[#161618] border border-[#2A2A2C] rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-[10px] font-semibold text-[#D4AF37] uppercase tracking-widest bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-2.5 py-1 rounded-md">
              {song.language} • {song.year || 'Klasik'}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-stone-100 tracking-tight mt-2">{song.title}</h2>
            <p className="text-stone-400 text-base font-sans">{song.artist}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-[#0F0F11] hover:bg-[#1f1f22] border border-[#2A2A2C] hover:border-[#D4AF37] text-stone-200 hover:text-[#D4AF37] font-semibold px-4 py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all"
            >
              <Edit3 className="w-4 h-4" />
              <span>Düzenle</span>
            </button>

            <button
              onClick={() => onStartSongPractice(song.id)}
              className="flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#C4A130] text-black font-bold px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-[#D4AF37]/10 transition-all active:scale-95"
            >
              <Play className="w-5 h-5 fill-black" />
              <span>{t.startSongPractice}</span>
            </button>
          </div>
        </div>

        {/* Key & Capo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#2A2A2C]">
          <div className="bg-[#0F0F11] border border-[#2A2A2C] p-4 rounded-2xl">
            <div className="text-[10px] text-stone-500 uppercase tracking-widest">{t.keyLabel}</div>
            <div className="text-2xl font-serif italic text-[#D4AF37] mt-1">{transposedKey}</div>
          </div>
          <div className="bg-[#0F0F11] border border-[#2A2A2C] p-4 rounded-2xl">
            <div className="text-[10px] text-stone-500 uppercase tracking-widest">{t.capoLabel}</div>
            <div className="text-xl font-serif text-white mt-1">{song.capo ? `${song.capo}. Fret` : 'Yok'}</div>
          </div>
          <div className="bg-[#0F0F11] border border-[#2A2A2C] p-4 rounded-2xl">
            <div className="text-[10px] text-stone-500 uppercase tracking-widest">{t.bpmLabel}</div>
            <div className="text-xl font-mono text-white mt-1">{song.tempoBpm} BPM</div>
          </div>
          <div className="bg-[#0F0F11] border border-[#2A2A2C] p-4 rounded-2xl">
            <div className="text-[10px] text-stone-500 uppercase tracking-widest">Akort</div>
            <div className="text-sm font-mono text-stone-300 mt-1">{song.tuning}</div>
          </div>
        </div>
      </div>

      {/* Transpose Calculator Bar */}
      <div className="bg-[#0F0F11] border border-[#2A2A2C] p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-stone-200 font-bold text-xs uppercase tracking-widest">
          <Sliders className="w-4 h-4 text-[#D4AF37]" />
          <span>{t.transposeCalculator}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#161618] border border-[#2A2A2C] rounded-xl p-1">
            <button
              onClick={() => setTransposeOffset(prev => prev - 1)}
              className="px-3 py-1 font-mono font-bold text-stone-300 hover:text-[#D4AF37] text-base"
            >
              -1
            </button>
            <span className="px-3 py-1 text-xs font-mono font-bold text-[#D4AF37] min-w-[60px] text-center">
              {transposeOffset > 0 ? `+${transposeOffset}` : transposeOffset} Yarım Ton
            </span>
            <button
              onClick={() => setTransposeOffset(prev => prev + 1)}
              className="px-3 py-1 font-mono font-bold text-stone-300 hover:text-[#D4AF37] text-base"
            >
              +1
            </button>
          </div>

          <button
            onClick={() => setShowRomanNumerals(prev => !prev)}
            className={`px-3.5 py-2 rounded-xl border text-xs uppercase tracking-wider font-semibold transition-colors ${
              showRomanNumerals
                ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                : 'bg-[#161618] text-stone-300 border-[#2A2A2C]'
            }`}
          >
            {t.showRoman}
          </button>
        </div>
      </div>

      {/* Sections Breakdown */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-widest">{t.sectionsHeader}</h3>

        <div className="space-y-4">
          {sections.filter(s => s.songId === song.id).map((sec) => (
            <div key={sec.id} className="bg-[#0F0F11] border border-[#2A2A2C] p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#2A2A2C] pb-3">
                <span className="font-serif italic text-[#D4AF37] text-base uppercase">
                  [{sec.customLabel || sec.label}]
                </span>
                <span className="text-xs font-mono text-stone-500">{sec.bars} Ölçü</span>
              </div>

              {sec.lyricCue && (
                <p className="text-xs text-stone-400 italic font-serif">
                  "{sec.lyricCue}"
                </p>
              )}

              {/* Chords Sequence Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {sec.chordSequence.map((chord, idx) => {
                  const transposed = transposeChord(chord.fullChord, transposeOffset);
                  const roman = chord.romanNumeral || computeRomanNumeral(transposed, transposedKey);

                  return (
                    <div key={idx} className="bg-[#161618] border border-[#2A2A2C] p-3.5 rounded-2xl text-center">
                      <div className="text-xl font-serif text-white">
                        {showRomanNumerals ? roman : transposed}
                      </div>
                      <div className="text-[10px] text-stone-500 uppercase tracking-wider mt-1">{chord.beats} vuruş</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Song Modal */}
      <EditSongModal
        settings={settings}
        song={song}
        sections={sections}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdateSong={onUpdateSong}
        onDeleteSong={onDeleteSong}
      />

    </div>
  );
};
