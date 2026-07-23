/**
 * Akor Belleği - Add & Import Paste Parser Component
 */

import React, { useState } from 'react';
import { AppSettings, Card, Section, Song } from '../types';
import { getTranslation } from '../lib/i18n';
import { parseSongContent, ParsedImportResult } from '../lib/parser';
import { createInitialFsrsState } from '../lib/fsrs';
import { FileText, Sparkles, Check, ArrowLeft, Layers } from 'lucide-react';

interface AddSongViewProps {
  settings: AppSettings;
  onSaveNewSong: (song: Song, sections: Section[], cards: Card[]) => void;
  onCancel: () => void;
}

export const AddSongView: React.FC<AddSongViewProps> = ({
  settings,
  onSaveNewSong,
  onCancel,
}) => {
  const t = getTranslation(settings.language);

  const [songTitle, setSongTitle] = useState('');
  const [artistName, setArtistName] = useState('');
  const [rawContent, setRawContent] = useState('');
  const [parsedData, setParsedData] = useState<ParsedImportResult | null>(null);

  const handleParse = () => {
    if (!rawContent.trim()) return;
    const result = parseSongContent(rawContent, {
      title: songTitle,
      artist: artistName,
    });
    setParsedData(result);
  };

  const handleTitleChange = (newTitle: string) => {
    setSongTitle(newTitle);
    if (parsedData) {
      setParsedData({
        ...parsedData,
        songInfo: {
          ...parsedData.songInfo,
          title: newTitle || 'Yeni Şarkı',
        },
      });
    }
  };

  const handleArtistChange = (newArtist: string) => {
    setArtistName(newArtist);
    if (parsedData) {
      setParsedData({
        ...parsedData,
        songInfo: {
          ...parsedData.songInfo,
          artist: newArtist || 'Bilinmeyen Sanatçı',
        },
      });
    }
  };

  const handleSave = () => {
    if (!parsedData) return;

    const now = Date.now();
    const songId = `song-${now}`;

    const newSong: Song = {
      id: songId,
      title: parsedData.songInfo.title || 'Yeni Şarkı',
      artist: parsedData.songInfo.artist || 'Bilinmeyen Sanatçı',
      language: parsedData.songInfo.language || 'TR',
      key: parsedData.songInfo.key || 'Am',
      mode: parsedData.songInfo.mode || 'minor',
      capo: parsedData.songInfo.capo || 0,
      tempoBpm: parsedData.songInfo.tempoBpm || 90,
      timeSignature: '4/4',
      tuning: 'E A D G B E',
      createdAt: now,
    };

    const newSections: Section[] = [];
    const newCards: Card[] = [];

    parsedData.sections.forEach((sec, idx) => {
      const secId = `sec-${songId}-${idx}`;
      
      const chordSlots = sec.chords.map(c => ({
        root: c.slice(0, 1),
        quality: c.slice(1),
        beats: 4,
        fullChord: c,
        romanNumeral: '',
      }));

      const sectionRecord: Section = {
        id: secId,
        songId: songId,
        order: idx + 1,
        label: sec.label,
        customLabel: sec.customLabel,
        bars: Math.max(2, Math.ceil(sec.chords.length)),
        lyricCue: sec.lyricCue,
        chordSequence: chordSlots,
      };

      newSections.push(sectionRecord);

      // Create sequence recall card for section
      const cardRecord: Card = {
        id: `card-${secId}-seq`,
        sectionId: secId,
        songId: songId,
        type: 'SEQUENCE_RECALL',
        cueLevel: 0,
        fsrsState: createInitialFsrsState(),
        createdAt: now,
      };
      newCards.push(cardRecord);
    });

    onSaveNewSong(newSong, newSections, newCards);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-stone-400 hover:text-[#D4AF37] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>İptal</span>
        </button>
        <h2 className="text-xl font-serif text-stone-100 flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#D4AF37]" />
          <span>{t.addSongTitle}</span>
        </h2>
      </div>

      {/* Input Form Box */}
      <div className="bg-[#0F0F11] border border-[#2A2A2C] rounded-3xl p-6 md:p-8 space-y-5 shadow-xl">
        
        {/* Title & Artist Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-widest">
              Şarkı Adı
            </label>
            <input
              type="text"
              value={songTitle}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="örn: Yanarım / Aç Kapıyı"
              className="w-full bg-[#161618] border border-[#2A2A2C] rounded-xl px-4 py-3 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#D4AF37]/60"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-widest">
              Grup / Sanatçı İsmi
            </label>
            <input
              type="text"
              value={artistName}
              onChange={(e) => handleArtistChange(e.target.value)}
              placeholder="örn: Mavi Gri"
              className="w-full bg-[#161618] border border-[#2A2A2C] rounded-xl px-4 py-3 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#D4AF37]/60"
            />
          </div>
        </div>

        {/* Textarea Paste Notice */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-widest">
              Akor Metni (repertuarim.com kopyası)
            </label>
            <span className="text-[10px] text-stone-500 italic">
              repertuarim.com ve benzeri sitelerden kopyaladığınız akor metnini buraya yapıştırın
            </span>
          </div>

          <textarea
            rows={11}
            value={rawContent}
            onChange={(e) => setRawContent(e.target.value)}
            placeholder={`Örnek (repertuarim.com formatı):\n\nFm             Bbm    Eb                           Fm\nNe olur aç kapıyı yine tat yüreğim acıyı\nDb                         Cm            Fm\nYenildik mi biz maziye aç kapıyı\n\nN\n\nFm \nGecelere sor beni`}
            className="w-full bg-[#161618] border border-[#2A2A2C] rounded-2xl p-4 font-mono text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#D4AF37]/60"
          />
        </div>

        <button
          onClick={handleParse}
          disabled={!rawContent.trim()}
          className="w-full bg-[#D4AF37] hover:bg-[#C4A130] text-black font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all disabled:opacity-50"
        >
          {t.parseButton}
        </button>
      </div>

      {/* Parsed Preview Section */}
      {parsedData && (
        <div className="bg-[#0F0F11] border border-[#2A2A2C] rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#2A2A2C] pb-4">
            <div>
              <h3 className="text-xl font-serif text-stone-100">{parsedData.songInfo.title}</h3>
              <p className="text-xs text-stone-400">{parsedData.songInfo.artist}</p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-stone-500 uppercase tracking-widest block">{t.autoDetectedKey}</span>
              <span className="font-mono text-lg font-bold text-[#D4AF37]">{parsedData.songInfo.key}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-widest">{t.parsedSectionsCount}: {parsedData.sections.length}</h4>

            {parsedData.sections.map((sec, idx) => (
              <div key={idx} className="bg-[#161618] border border-[#2A2A2C] p-4 rounded-2xl space-y-2">
                <div className="text-xs font-serif italic text-[#D4AF37] uppercase">
                  [{sec.customLabel || sec.label}]
                </div>
                {sec.lyricCue && (
                  <p className="text-xs text-stone-400 italic font-serif">"{sec.lyricCue}"</p>
                )}
                <div className="flex flex-wrap gap-2 pt-1">
                  {sec.chords.map((c, cIdx) => (
                    <span key={cIdx} className="font-mono text-xs font-bold bg-[#0F0F11] text-stone-200 border border-[#2A2A2C] px-2.5 py-1 rounded-md">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-[#D4AF37] hover:bg-[#C4A130] text-black font-bold py-4 rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5 stroke-[2.5]" />
            <span>Repertuvara Kaydet ve Kartları Oluştur</span>
          </button>
        </div>
      )}

    </div>
  );
};
