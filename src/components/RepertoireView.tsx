/**
 * Akor Belleği - Repertoire Song List Component
 */

import React, { useState } from 'react';
import { AppSettings, Card, Section, Song } from '../types';
import { getTranslation } from '../lib/i18n';
import { Search, Plus, Music, BookOpen, ChevronRight, Filter, Edit3, Trash2 } from 'lucide-react';
import { EditSongModal } from './EditSongModal';

interface RepertoireViewProps {
  settings: AppSettings;
  songs: Song[];
  sections: Section[];
  cards: Card[];
  onSelectSong: (songId: string) => void;
  onAddSong: () => void;
  onUpdateSong: (updatedSong: Song, updatedSections: Section[], updatedCards?: Card[]) => void;
  onDeleteSong: (songId: string) => void;
}

export const RepertoireView: React.FC<RepertoireViewProps> = ({
  settings,
  songs,
  sections,
  cards,
  onSelectSong,
  onAddSong,
  onUpdateSong,
  onDeleteSong,
}) => {
  const t = getTranslation(settings.language);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterLang, setFilterLang] = useState<'ALL' | 'TR' | 'EN'>('ALL');
  const [editingSong, setEditingSong] = useState<Song | null>(null);

  // Filter songs
  const filteredSongs = songs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          song.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLang = filterLang === 'ALL' || song.language === filterLang;
    return matchesSearch && matchesLang;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0F0F11] border border-[#2A2A2C] p-6 rounded-3xl">
        <div>
          <h2 className="text-2xl font-serif text-stone-100 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#D4AF37]" />
            <span>{t.repertoireTitle}</span>
          </h2>
          <p className="text-xs text-stone-400 mt-1 font-sans">
            Ezberlenen ve çalışılan klasik gitar eserleri ({songs.length} {t.songsCount})
          </p>
        </div>

        <button
          onClick={onAddSong}
          className="flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#C4A130] text-black font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-[#D4AF37]/10 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{t.addSong}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchSong}
            className="w-full bg-[#0F0F11] border border-[#2A2A2C] rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-[#D4AF37]/60"
          />
        </div>

        {/* Language Filter */}
        <div className="flex items-center gap-1 bg-[#0F0F11] border border-[#2A2A2C] p-1 rounded-xl">
          <button
            onClick={() => setFilterLang('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterLang === 'ALL' ? 'bg-[#D4AF37] text-black' : 'text-stone-400 hover:text-stone-100'
            }`}
          >
            {t.filterAll}
          </button>
          <button
            onClick={() => setFilterLang('TR')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterLang === 'TR' ? 'bg-[#D4AF37] text-black' : 'text-stone-400 hover:text-stone-100'
            }`}
          >
            {t.filterTurkish}
          </button>
          <button
            onClick={() => setFilterLang('EN')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterLang === 'EN' ? 'bg-[#D4AF37] text-black' : 'text-stone-400 hover:text-stone-100'
            }`}
          >
            {t.filterEnglish}
          </button>
        </div>
      </div>

      {/* Song Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSongs.map((song) => {
          // Calculate song maturity based on its cards
          const songCards = cards.filter(c => c.songId === song.id);
          const matureCount = songCards.filter(c => c.fsrsState.stability > 21).length;
          const maturityPercent = songCards.length > 0 ? Math.round((matureCount / songCards.length) * 100) : 0;

          return (
            <div
              key={song.id}
              onClick={() => onSelectSong(song.id)}
              className="bg-[#0F0F11] border border-[#2A2A2C] hover:border-[#D4AF37]/50 p-6 rounded-3xl cursor-pointer group transition-all hover:shadow-xl hover:shadow-[#D4AF37]/5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif text-xl text-stone-100 group-hover:text-[#D4AF37] transition-colors">
                      {song.title}
                    </h3>
                    <p className="text-xs text-stone-400">{song.artist}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingSong(song);
                      }}
                      className="p-1.5 bg-[#161618] hover:bg-[#222225] text-stone-400 hover:text-[#D4AF37] border border-[#2A2A2C] rounded-lg transition-colors opacity-80 group-hover:opacity-100"
                      title="Şarkıyı Düzenle"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-xs font-bold bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 px-2.5 py-1 rounded-md">
                      {song.key}
                    </span>
                  </div>
                </div>

                {song.notes && (
                  <p className="text-xs text-stone-500 line-clamp-2 italic font-serif">
                    "{song.notes}"
                  </p>
                )}
              </div>

              {/* Badges & Maturity */}
              <div className="space-y-3 pt-3 border-t border-[#2A2A2C]">
                <div className="flex items-center justify-between text-xs text-stone-400 font-medium">
                  <span>{t.capoLabel}: {song.capo ? `${song.capo}. Fret` : 'Yok'}</span>
                  <span className="font-mono">{t.bpmLabel}: {song.tempoBpm}</span>
                  <span className="uppercase text-[10px] bg-[#161618] text-stone-400 border border-[#2A2A2C] px-1.5 py-0.5 rounded">
                    {song.language}
                  </span>
                </div>

                {/* Maturity Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-semibold">
                    <span className="text-stone-500 uppercase tracking-widest">{t.maturityLabel}</span>
                    <span className="text-[#D4AF37] font-mono">%{maturityPercent}</span>
                  </div>
                  <div className="w-full bg-[#161618] rounded-full h-1.5 border border-[#2A2A2C] overflow-hidden">
                    <div 
                      className="bg-[#D4AF37] h-1.5 rounded-full" 
                      style={{ width: `${maturityPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Edit Song Modal */}
      {editingSong && (
        <EditSongModal
          settings={settings}
          song={editingSong}
          sections={sections}
          isOpen={!!editingSong}
          onClose={() => setEditingSong(null)}
          onUpdateSong={onUpdateSong}
          onDeleteSong={onDeleteSong}
        />
      )}

    </div>
  );
};
