/**
 * Akor Belleği - Offline Storage & Local Persistence & Seed Data Engine
 */

import { AppSettings, Card, Review, Section, Session, Song, TransitionStat } from '../types';
import { createInitialFsrsState, DEFAULT_FSRS_WEIGHTS } from './fsrs';
import { computeRomanNumeral } from './parser';

const STORAGE_KEYS = {
  SETTINGS: 'akor_bellegi_settings_v1',
  SONGS: 'akor_bellegi_songs_v1',
  SECTIONS: 'akor_bellegi_sections_v1',
  CARDS: 'akor_bellegi_cards_v1',
  REVIEWS: 'akor_bellegi_reviews_v1',
  TRANSITIONS: 'akor_bellegi_transitions_v1',
  SESSIONS: 'akor_bellegi_sessions_v1',
  INITIALIZED: 'akor_bellegi_init_v1',
};

// Default Application Settings
export const DEFAULT_SETTINGS: AppSettings = {
  language: 'tr',
  sessionLengthMinutes: 20,
  desiredRetention: 0.90,
  maxNewCardsPerDay: 8,
  maxReviewsPerDay: 60,
  metronomeSound: 'click',
  metronomeVolume: 0.8,
  handsFreePedalEnabled: true,
  calibrationWarningEnabled: true,
  autoAdvanceSeconds: 0,
  theme: 'dark',
  fsrsWeights: DEFAULT_FSRS_WEIGHTS,
};

// Seed Songs Data
function generateSeedData(): {
  songs: Song[];
  sections: Section[];
  cards: Card[];
  transitions: TransitionStat[];
} {
  const now = Date.now();

  // Song 1: Elfida - Haluk Levent (Turkish Rock Classic)
  const song1: Song = {
    id: 'song-elfida',
    title: 'Elfida',
    artist: 'Haluk Levent',
    year: 2004,
    language: 'TR',
    key: 'Am',
    mode: 'minor',
    capo: 0,
    tempoBpm: 85,
    timeSignature: '4/4',
    tuning: 'E A D G B E',
    notes: 'Klasik gitar arpej (p-i-m-a-m-i) ritmiyle çalınır.',
    createdAt: now - 7 * 86400000,
    lastPlayedAt: now - 86400000,
  };

  const song1Sections: Section[] = [
    {
      id: 'sec-elfida-intro',
      songId: 'song-elfida',
      order: 1,
      label: 'INTRO',
      bars: 4,
      lyricCue: 'Gitar Arpej Girişi',
      chordSequence: [
        { root: 'A', quality: 'm', beats: 4, fullChord: 'Am', romanNumeral: 'i' },
        { root: 'D', quality: 'm', beats: 4, fullChord: 'Dm', romanNumeral: 'iv' },
        { root: 'G', quality: '', beats: 4, fullChord: 'G', romanNumeral: 'VII' },
        { root: 'C', quality: '', beats: 4, fullChord: 'C', romanNumeral: 'III' },
      ],
    },
    {
      id: 'sec-elfida-verse',
      songId: 'song-elfida',
      order: 2,
      label: 'VERSE',
      bars: 8,
      lyricCue: 'Yüzün geçmişe dönük, gözlerin dolu dolu',
      chordSequence: [
        { root: 'A', quality: 'm', beats: 4, fullChord: 'Am', romanNumeral: 'i' },
        { root: 'D', quality: 'm', beats: 4, fullChord: 'Dm', romanNumeral: 'iv' },
        { root: 'G', quality: '', beats: 4, fullChord: 'G', romanNumeral: 'VII' },
        { root: 'C', quality: '', beats: 4, fullChord: 'C', romanNumeral: 'III' },
        { root: 'F', quality: '', beats: 4, fullChord: 'F', romanNumeral: 'VI' },
        { root: 'D', quality: 'm', beats: 4, fullChord: 'Dm', romanNumeral: 'iv' },
        { root: 'E', quality: '7', beats: 8, fullChord: 'E7', romanNumeral: 'V7' },
      ],
    },
    {
      id: 'sec-elfida-chorus',
      songId: 'song-elfida',
      order: 3,
      label: 'CHORUS',
      bars: 8,
      lyricCue: 'Elfida, beni bırakıp gitme',
      chordSequence: [
        { root: 'A', quality: 'm', beats: 4, fullChord: 'Am', romanNumeral: 'i' },
        { root: 'D', quality: 'm', beats: 4, fullChord: 'Dm', romanNumeral: 'iv' },
        { root: 'G', quality: '', beats: 4, fullChord: 'G', romanNumeral: 'VII' },
        { root: 'C', quality: '', beats: 4, fullChord: 'C', romanNumeral: 'III' },
        { root: 'F', quality: '', beats: 4, fullChord: 'F', romanNumeral: 'VI' },
        { root: 'E', quality: '7', beats: 4, fullChord: 'E7', romanNumeral: 'V7' },
        { root: 'A', quality: 'm', beats: 8, fullChord: 'Am', romanNumeral: 'i' },
      ],
    },
  ];

  // Song 2: Dust in the Wind - Kansas (80s Acoustic Fingerstyle Classic)
  const song2: Song = {
    id: 'song-dust-wind',
    title: 'Dust in the Wind',
    artist: 'Kansas',
    year: 1977,
    language: 'EN',
    key: 'C',
    mode: 'major',
    capo: 0,
    tempoBpm: 94,
    timeSignature: '4/4',
    tuning: 'E A D G B E',
    notes: 'Travis picking fingerstyle pattern.',
    createdAt: now - 5 * 86400000,
    lastPlayedAt: now - 2 * 86400000,
  };

  const song2Sections: Section[] = [
    {
      id: 'sec-dust-intro',
      songId: 'song-dust-wind',
      order: 1,
      label: 'INTRO',
      bars: 6,
      lyricCue: 'Fingerstyle Travis Picking Hook',
      chordSequence: [
        { root: 'C', quality: '', beats: 4, fullChord: 'C', romanNumeral: 'I' },
        { root: 'C', quality: 'maj7', beats: 4, fullChord: 'Cmaj7', romanNumeral: 'Imaj7' },
        { root: 'C', quality: 'add9', beats: 4, fullChord: 'Cadd9', romanNumeral: 'Iadd9' },
        { root: 'A', quality: 'm', beats: 4, fullChord: 'Am', romanNumeral: 'vi' },
        { root: 'A', quality: 'sus2', beats: 4, fullChord: 'Asus2', romanNumeral: 'visus2' },
        { root: 'G', quality: '', bass: 'B', beats: 4, fullChord: 'G/B', romanNumeral: 'V/iii' },
      ],
    },
    {
      id: 'sec-dust-verse',
      songId: 'song-dust-wind',
      order: 2,
      label: 'VERSE',
      bars: 8,
      lyricCue: 'I close my eyes, only for a moment and the moment\'s gone',
      chordSequence: [
        { root: 'C', quality: '', beats: 4, fullChord: 'C', romanNumeral: 'I' },
        { root: 'G', quality: '', bass: 'B', beats: 4, fullChord: 'G/B', romanNumeral: 'V/iii' },
        { root: 'A', quality: 'm', beats: 4, fullChord: 'Am', romanNumeral: 'vi' },
        { root: 'G', quality: '', beats: 4, fullChord: 'G', romanNumeral: 'V' },
        { root: 'D', quality: 'm', beats: 4, fullChord: 'Dm', romanNumeral: 'ii' },
        { root: 'A', quality: 'm', beats: 4, fullChord: 'Am', romanNumeral: 'vi' },
        { root: 'G', quality: '', beats: 8, fullChord: 'G', romanNumeral: 'V' },
      ],
    },
  ];

  // Song 3: Gönül - Fikret Kızılok (Turkish Acoustic Ballad)
  const song3: Song = {
    id: 'song-gonul',
    title: 'Gönül',
    artist: 'Fikret Kızılok',
    year: 1983,
    language: 'TR',
    key: 'Em',
    mode: 'minor',
    capo: 2,
    tempoBpm: 76,
    timeSignature: '4/4',
    tuning: 'E A D G B E',
    notes: 'Kapo 2. frette (Görünürde Dm). Sakin ve içli çalınır.',
    createdAt: now - 3 * 86400000,
    lastPlayedAt: now - 3 * 86400000,
  };

  const song3Sections: Section[] = [
    {
      id: 'sec-gonul-verse',
      songId: 'song-gonul',
      order: 1,
      label: 'VERSE',
      bars: 8,
      lyricCue: 'Gönül sen bu hallere düşecek adam mıydın?',
      chordSequence: [
        { root: 'E', quality: 'm', beats: 4, fullChord: 'Em', romanNumeral: 'i' },
        { root: 'A', quality: 'm', beats: 4, fullChord: 'Am', romanNumeral: 'iv' },
        { root: 'D', quality: '', beats: 4, fullChord: 'D', romanNumeral: 'VII' },
        { root: 'G', quality: '', beats: 4, fullChord: 'G', romanNumeral: 'III' },
        { root: 'C', quality: '', beats: 4, fullChord: 'C', romanNumeral: 'VI' },
        { root: 'B', quality: '7', beats: 8, fullChord: 'B7', romanNumeral: 'V7' },
      ],
    },
  ];

  const allSongs = [song1, song2, song3];
  const allSections = [...song1Sections, ...song2Sections, ...song3Sections];

  // Generate Cards for each Section
  const cards: Card[] = [];
  allSections.forEach((sec, idx) => {
    // Basic Sequence Recall Card
    const c1: Card = {
      id: `card-${sec.id}-seq`,
      sectionId: sec.id,
      songId: sec.songId,
      type: 'SEQUENCE_RECALL',
      cueLevel: idx % 2 === 0 ? 1 : 2, // L1 or L2 cue
      fsrsState: createInitialFsrsState(),
      createdAt: now - idx * 3600000,
    };
    c1.fsrsState.dueAt = now - 1000; // Due right now
    cards.push(c1);

    // Roman Numeral Analysis Card
    const c2: Card = {
      id: `card-${sec.id}-roman`,
      sectionId: sec.id,
      songId: sec.songId,
      type: 'ROMAN_ANALYSIS',
      cueLevel: 3,
      fsrsState: createInitialFsrsState(),
      createdAt: now - idx * 3600000,
    };
    c2.fsrsState.dueAt = now - 2000;
    cards.push(c2);
  });

  // Seed Transition Matrix
  const transitions: TransitionStat[] = [
    { id: 'Am-Dm', fromChord: 'Am', toChord: 'Dm', attempts: 18, cleanCount: 16, avgMs: 820, lastDrilledAt: now - 86400000 },
    { id: 'Dm-G', fromChord: 'Dm', toChord: 'G', attempts: 15, cleanCount: 12, avgMs: 1100, lastDrilledAt: now - 86400000 },
    { id: 'G-C', fromChord: 'G', toChord: 'C', attempts: 20, cleanCount: 19, avgMs: 750, lastDrilledAt: now - 2 * 86400000 },
    { id: 'C-F', fromChord: 'C', toChord: 'F', attempts: 25, cleanCount: 14, avgMs: 1450, lastDrilledAt: now - 86400000 }, // Weak pair
    { id: 'F-E7', fromChord: 'F', toChord: 'E7', attempts: 22, cleanCount: 13, avgMs: 1320, lastDrilledAt: now - 86400000 }, // Weak pair
    { id: 'E7-Am', fromChord: 'E7', toChord: 'Am', attempts: 30, cleanCount: 28, avgMs: 690, lastDrilledAt: now - 86400000 },
    { id: 'Em-Am', fromChord: 'Em', toChord: 'Am', attempts: 10, cleanCount: 8, avgMs: 950, lastDrilledAt: now - 3 * 86400000 },
    { id: 'C-G/B', fromChord: 'C', toChord: 'G/B', attempts: 14, cleanCount: 12, avgMs: 880, lastDrilledAt: now - 2 * 86400000 },
  ];

  return { songs: allSongs, sections: allSections, cards, transitions };
}

/**
 * Initialize storage with default settings & seed data if empty
 */
export function initializeStorage(): void {
  try {
    if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
      const seed = generateSeedData();
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      localStorage.setItem(STORAGE_KEYS.SONGS, JSON.stringify(seed.songs));
      localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(seed.sections));
      localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(seed.cards));
      localStorage.setItem(STORAGE_KEYS.TRANSITIONS, JSON.stringify(seed.transitions));
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
  } catch (e) {
    console.error('Storage initialization failed:', e);
  }
}

// Data Accessors
export function loadSettings(): AppSettings {
  initializeStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export function loadSongs(): Song[] {
  initializeStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SONGS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSongs(songs: Song[]): void {
  localStorage.setItem(STORAGE_KEYS.SONGS, JSON.stringify(songs));
}

export function loadSections(): Section[] {
  initializeStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SECTIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSections(sections: Section[]): void {
  localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(sections));
}

export function loadCards(): Card[] {
  initializeStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CARDS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCards(cards: Card[]): void {
  localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
}

export function loadTransitions(): TransitionStat[] {
  initializeStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSITIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTransitions(transitions: TransitionStat[]): void {
  localStorage.setItem(STORAGE_KEYS.TRANSITIONS, JSON.stringify(transitions));
}

export function loadReviews(): Review[] {
  initializeStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveReviews(reviews: Review[]): void {
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
}

export function loadSessions(): Session[] {
  initializeStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSessions(sessions: Session[]): void {
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
}

/**
 * Full JSON Database Backup Export
 */
export function exportDatabaseToJson(): string {
  const data = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    settings: loadSettings(),
    songs: loadSongs(),
    sections: loadSections(),
    cards: loadCards(),
    transitions: loadTransitions(),
    reviews: loadReviews(),
    sessions: loadSessions(),
  };
  return JSON.stringify(data, null, 2);
}

/**
 * Full JSON Database Restore
 */
export function importDatabaseFromJson(jsonStr: string): boolean {
  try {
    const parsed = JSON.parse(jsonStr);
    if (!parsed.songs || !parsed.cards) return false;

    if (parsed.settings) saveSettings(parsed.settings);
    if (parsed.songs) saveSongs(parsed.songs);
    if (parsed.sections) saveSections(parsed.sections);
    if (parsed.cards) saveCards(parsed.cards);
    if (parsed.transitions) saveTransitions(parsed.transitions);
    if (parsed.reviews) saveReviews(parsed.reviews);
    if (parsed.sessions) saveSessions(parsed.sessions);

    return true;
  } catch (err) {
    console.error('Import database JSON error:', err);
    return false;
  }
}
