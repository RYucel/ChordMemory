/**
 * Akor Belleği - Edit & Delete Song Modal / View Component
 */

import React, { useState } from 'react';
import { AppSettings, Card, Section, Song } from '../types';
import { parseSongContent } from '../lib/parser';
import { createInitialFsrsState } from '../lib/fsrs';
import { X, Save, Trash2, Plus, RefreshCw, FileText, AlertTriangle, Music } from 'lucide-react';

interface EditSongModalProps {
  settings: AppSettings;
  song: Song;
  sections: Section[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateSong: (updatedSong: Song, updatedSections: Section[], updatedCards?: Card[]) => void;
  onDeleteSong: (songId: string) => void;
}

export const EditSongModal: React.FC<EditSongModalProps> = ({
  settings,
  song,
  sections,
  isOpen,
  onClose,
  onUpdateSong,
  onDeleteSong,
}) => {
  if (!isOpen) return null;

  // Editable Song Metadata State
  const [title, setTitle] = useState(song.title);
  const [artist, setArtist] = useState(song.artist);
  const [key, setKey] = useState(song.key);
  const [capo, setCapo] = useState(song.capo);
  const [tempoBpm, setTempoBpm] = useState(song.tempoBpm);
  const [language, setLanguage] = useState<'TR' | 'EN' | 'OTHER'>(song.language);
  const [tuning, setTuning] = useState(song.tuning || 'E A D G B E');
  const [notes, setNotes] = useState(song.notes || '');

  // Active Tab inside Edit Modal
  const [editTab, setEditTab] = useState<'DETAILS' | 'SECTIONS' | 'REPARSE'>('DETAILS');

  // Sections State
  const [editableSections, setEditableSections] = useState<
    { id: string; customLabel: string; lyricCue: string; chordsText: string }[]
  >(() => {
    const songSections = sections.filter((s) => s.songId === song.id);
    return songSections.map((s) => ({
      id: s.id,
      customLabel: s.customLabel || s.label,
      lyricCue: s.lyricCue || '',
      chordsText: s.chordSequence.map((c) => c.fullChord).join(' '),
    }));
  });

  // Reparse Raw Text State
  const [rawText, setRawText] = useState('');

  // Delete Confirmation Dialog State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Add new blank section
  const handleAddSection = () => {
    setEditableSections((prev) => [
      ...prev,
      {
        id: `sec-new-${Date.now()}-${prev.length}`,
        customLabel: `Bölüm ${prev.length + 1}`,
        lyricCue: '',
        chordsText: 'Am C G D',
      },
    ]);
  };

  // Remove section
  const handleRemoveSection = (index: number) => {
    setEditableSections((prev) => prev.filter((_, i) => i !== index));
  };

  // Reparse raw chord text
  const handleReparseRawText = () => {
    if (!rawText.trim()) return;
    const parsed = parseSongContent(rawText, {
      title,
      artist,
      key,
      capo,
      tempoBpm,
    });

    if (parsed.songInfo.title && parsed.songInfo.title !== 'Yeni Şarkı') {
      setTitle(parsed.songInfo.title);
    }
    if (parsed.songInfo.artist && parsed.songInfo.artist !== 'Bilinmeyen Sanatçı') {
      setArtist(parsed.songInfo.artist);
    }
    if (parsed.songInfo.key) {
      setKey(parsed.songInfo.key);
    }

    const newEditSections = parsed.sections.map((sec, idx) => ({
      id: `sec-reparsed-${Date.now()}-${idx}`,
      customLabel: sec.customLabel || sec.label,
      lyricCue: sec.lyricCue || '',
      chordsText: sec.chords.join(' '),
    }));

    setEditableSections(newEditSections);
    setEditTab('SECTIONS');
  };

  // Save changes
  const handleSave = () => {
    const now = Date.now();

    const updatedSong: Song = {
      ...song,
      title: title.trim() || 'Yeni Şarkı',
      artist: artist.trim() || 'Bilinmeyen Sanatçı',
      key: key.trim() || 'Am',
      capo: Number(capo) || 0,
      tempoBpm: Number(tempoBpm) || 90,
      language,
      tuning: tuning.trim() || 'E A D G B E',
      notes: notes.trim(),
    };

    const newSectionsList: Section[] = [];
    const newCardsList: Card[] = [];

    editableSections.forEach((sec, idx) => {
      const chordsArr = sec.chordsText
        .split(/[\s,]+/)
        .map((c) => c.trim())
        .filter(Boolean);

      const chordSlots = chordsArr.map((c) => ({
        root: c.slice(0, 1),
        quality: c.slice(1),
        beats: 4,
        fullChord: c,
        romanNumeral: '',
      }));

      const sectionId = sec.id.startsWith('sec-') ? sec.id : `sec-${song.id}-${idx}`;

      const sectionRecord: Section = {
        id: sectionId,
        songId: song.id,
        order: idx + 1,
        label: 'CUSTOM',
        customLabel: sec.customLabel,
        bars: Math.max(2, Math.ceil(chordsArr.length)),
        lyricCue: sec.lyricCue,
        chordSequence: chordSlots,
      };

      newSectionsList.push(sectionRecord);

      // Card for section
      const cardRecord: Card = {
        id: `card-${sectionId}-seq`,
        sectionId: sectionId,
        songId: song.id,
        type: 'SEQUENCE_RECALL',
        cueLevel: 0,
        fsrsState: createInitialFsrsState(),
        createdAt: now,
      };
      newCardsList.push(cardRecord);
    });

    onUpdateSong(updatedSong, newSectionsList, newCardsList);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0F0F11] border border-[#2A2A2C] rounded-3xl w-full max-w-2xl p-6 md:p-8 space-y-6 shadow-2xl relative my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2A2A2C] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 rounded-2xl">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl text-stone-100">Şarkıyı Düzenle</h3>
              <p className="text-xs text-stone-400">{song.title} - {song.artist}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-[#161618] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Edit Sub-Tabs */}
        <div className="flex items-center gap-2 border-b border-[#2A2A2C] pb-3">
          <button
            onClick={() => setEditTab('DETAILS')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
              editTab === 'DETAILS'
                ? 'bg-[#D4AF37] text-black'
                : 'text-stone-400 hover:text-stone-200 bg-[#161618]'
            }`}
          >
            Genel Bilgiler
          </button>
          <button
            onClick={() => setEditTab('SECTIONS')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
              editTab === 'SECTIONS'
                ? 'bg-[#D4AF37] text-black'
                : 'text-stone-400 hover:text-stone-200 bg-[#161618]'
            }`}
          >
            Bölümler ({editableSections.length})
          </button>
          <button
            onClick={() => setEditTab('REPARSE')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
              editTab === 'REPARSE'
                ? 'bg-[#D4AF37] text-black'
                : 'text-stone-400 hover:text-stone-200 bg-[#161618]'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Metinden Yeniden Yükle</span>
          </button>
        </div>

        {/* Tab Content: Details */}
        {editTab === 'DETAILS' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-widest">
                  Şarkı Adı
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#161618] border border-[#2A2A2C] rounded-xl px-4 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-[#D4AF37]/60"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-widest">
                  Grup / Sanatçı İsmi
                </label>
                <input
                  type="text"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className="w-full bg-[#161618] border border-[#2A2A2C] rounded-xl px-4 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-[#D4AF37]/60"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-widest">
                  Anahtar Akor (Key)
                </label>
                <input
                  type="text"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="Fm, Am, C"
                  className="w-full bg-[#161618] border border-[#2A2A2C] rounded-xl px-3 py-2.5 font-mono text-sm text-stone-100 focus:outline-none focus:border-[#D4AF37]/60"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-widest">
                  Capo (Fret)
                </label>
                <input
                  type="number"
                  value={capo}
                  onChange={(e) => setCapo(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-[#161618] border border-[#2A2A2C] rounded-xl px-3 py-2.5 font-mono text-sm text-stone-100 focus:outline-none focus:border-[#D4AF37]/60"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-widest">
                  Tempo (BPM)
                </label>
                <input
                  type="number"
                  value={tempoBpm}
                  onChange={(e) => setTempoBpm(parseInt(e.target.value, 10) || 90)}
                  className="w-full bg-[#161618] border border-[#2A2A2C] rounded-xl px-3 py-2.5 font-mono text-sm text-stone-100 focus:outline-none focus:border-[#D4AF37]/60"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-widest">
                  Dil
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'TR' | 'EN' | 'OTHER')}
                  className="w-full bg-[#161618] border border-[#2A2A2C] rounded-xl px-3 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-[#D4AF37]/60"
                >
                  <option value="TR">Türkçe</option>
                  <option value="EN">İngilizce</option>
                  <option value="OTHER">Diğer</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-widest">
                Akort (Tuning)
              </label>
              <input
                type="text"
                value={tuning}
                onChange={(e) => setTuning(e.target.value)}
                placeholder="E A D G B E"
                className="w-full bg-[#161618] border border-[#2A2A2C] rounded-xl px-4 py-2.5 font-mono text-sm text-stone-100 focus:outline-none focus:border-[#D4AF37]/60"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-widest">
                Özel Notlar
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Şarkı çalma teknikleri, ritim vuruşu, arpej notları vb."
                className="w-full bg-[#161618] border border-[#2A2A2C] rounded-xl p-3 text-sm text-stone-100 focus:outline-none focus:border-[#D4AF37]/60"
              />
            </div>
          </div>
        )}

        {/* Tab Content: Sections */}
        {editTab === 'SECTIONS' && (
          <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
            {editableSections.map((sec, idx) => (
              <div key={sec.id} className="bg-[#161618] border border-[#2A2A2C] p-4 rounded-2xl space-y-3 relative">
                <div className="flex items-center justify-between gap-3">
                  <input
                    type="text"
                    value={sec.customLabel}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditableSections((prev) =>
                        prev.map((s, i) => (i === idx ? { ...s, customLabel: val } : s))
                      );
                    }}
                    placeholder="Bölüm Adı (örn: Nakarat, Giriş)"
                    className="font-serif italic text-[#D4AF37] bg-[#0F0F11] border border-[#2A2A2C] rounded-lg px-3 py-1.5 text-sm font-semibold focus:outline-none focus:border-[#D4AF37]"
                  />

                  <button
                    onClick={() => handleRemoveSection(idx)}
                    className="text-stone-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-[#0F0F11] transition-colors"
                    title="Bölümü Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] text-stone-500 uppercase tracking-widest">Söz İpucu / Söz Satırı</label>
                  <input
                    type="text"
                    value={sec.lyricCue}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditableSections((prev) =>
                        prev.map((s, i) => (i === idx ? { ...s, lyricCue: val } : s))
                      );
                    }}
                    placeholder="örn: Yanarım yanarım gün geçer..."
                    className="w-full bg-[#0F0F11] border border-[#2A2A2C] rounded-lg px-3 py-1.5 text-xs text-stone-300 italic focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] text-stone-500 uppercase tracking-widest">Akor Dizilimi (boşluk veya virgülle ayırın)</label>
                  <input
                    type="text"
                    value={sec.chordsText}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditableSections((prev) =>
                        prev.map((s, i) => (i === idx ? { ...s, chordsText: val } : s))
                      );
                    }}
                    placeholder="örn: Fm Bbm Eb Fm"
                    className="w-full bg-[#0F0F11] border border-[#2A2A2C] rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-[#D4AF37] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            ))}

            <button
              onClick={handleAddSection}
              className="w-full bg-[#161618] hover:bg-[#1f1f22] border border-dashed border-[#2A2A2C] hover:border-[#D4AF37] text-stone-300 hover:text-[#D4AF37] py-3 rounded-2xl text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Bölüm Ekle</span>
            </button>
          </div>
        )}

        {/* Tab Content: Reparse from Text */}
        {editTab === 'REPARSE' && (
          <div className="space-y-3">
            <p className="text-xs text-stone-400">
              repertuarim.com sitesinden kopyaladığınız yeni metni buraya yapıştırıp <span className="text-[#D4AF37] font-semibold">"Ayrıştır ve Bölümleri Güncelle"</span> butonuna tıklayarak bölümleri otomatik güncelleyebilirsiniz.
            </p>

            <textarea
              rows={8}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Fm             Bbm    Eb                           Fm&#10;Ne olur aç kapıyı yine tat yüreğim acıyı&#10;Db                         Cm            Fm&#10;Yenildik mi biz maziye aç kapıyı&#10;&#10;N&#10;&#10;Fm &#10;Gecelere sor beni..."
              className="w-full bg-[#161618] border border-[#2A2A2C] rounded-2xl p-4 font-mono text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#D4AF37]/60"
            />

            <button
              onClick={handleReparseRawText}
              disabled={!rawText.trim()}
              className="w-full bg-[#D4AF37] hover:bg-[#C4A130] text-black font-bold py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all disabled:opacity-50"
            >
              Ayrıştır ve Bölümleri Güncelle
            </button>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#2A2A2C]">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full sm:w-auto text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/30 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Şarkıyı Sil</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-[#2A2A2C] text-stone-400 hover:text-stone-100 text-xs uppercase tracking-wider font-semibold transition-colors"
            >
              İptal
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#C4A130] text-black font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Değişiklikleri Kaydet</span>
            </button>
          </div>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#0F0F11] border border-red-500/40 rounded-3xl w-full max-w-md p-6 space-y-5 text-center shadow-2xl">
            <div className="w-12 h-12 bg-red-500/10 text-red-400 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h4 className="font-serif text-xl text-stone-100">Şarkıyı Silmek İstiyor musunuz?</h4>
              <p className="text-xs text-stone-400">
                <strong className="text-stone-200">{song.title}</strong> eseri ve bu esere ait tüm bölüm kartları ile çalışma geçmişi kalıcı olarak silinecektir.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-xl border border-[#2A2A2C] text-stone-300 hover:text-white text-xs uppercase tracking-wider font-semibold transition-colors"
              >
                Vazgeç
              </button>
              <button
                onClick={() => {
                  onDeleteSong(song.id);
                  onClose();
                }}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
