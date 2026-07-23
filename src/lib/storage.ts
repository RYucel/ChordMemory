/**
 * Akor Belleği - Offline Storage & Local Persistence & Seed Data Engine
 */

import { AppSettings, Card, Review, Section, Session, Song, TransitionStat } from '../types';
import { createInitialFsrsState, DEFAULT_FSRS_WEIGHTS } from './fsrs';
import { getHardcodedSeedData } from '../data/seedSongs';

const STORAGE_KEYS = {
  SETTINGS: 'akor_bellegi_settings_v1',
  SONGS: 'akor_bellegi_songs_v2',
  SECTIONS: 'akor_bellegi_sections_v2',
  CARDS: 'akor_bellegi_cards_v2',
  REVIEWS: 'akor_bellegi_reviews_v1',
  TRANSITIONS: 'akor_bellegi_transitions_v1',
  SESSIONS: 'akor_bellegi_sessions_v1',
  INITIALIZED: 'akor_bellegi_init_v2',
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

/**
 * Initialize storage with default settings & seed data if empty
 */
export function initializeStorage(): void {
  try {
    if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
      const seed = getHardcodedSeedData();
      const defaultTransitions: TransitionStat[] = [
        { id: 'Am-Dm', fromChord: 'Am', toChord: 'Dm', attempts: 18, cleanCount: 16, avgMs: 820, lastDrilledAt: Date.now() - 86400000 },
        { id: 'Dm-G', fromChord: 'Dm', toChord: 'G', attempts: 15, cleanCount: 12, avgMs: 1100, lastDrilledAt: Date.now() - 86400000 },
        { id: 'G-C', fromChord: 'G', toChord: 'C', attempts: 20, cleanCount: 19, avgMs: 750, lastDrilledAt: Date.now() - 2 * 86400000 },
        { id: 'C-F', fromChord: 'C', toChord: 'F', attempts: 25, cleanCount: 14, avgMs: 1450, lastDrilledAt: Date.now() - 86400000 },
        { id: 'F-E7', fromChord: 'F', toChord: 'E7', attempts: 22, cleanCount: 13, avgMs: 1320, lastDrilledAt: Date.now() - 86400000 },
        { id: 'E7-Am', fromChord: 'E7', toChord: 'Am', attempts: 30, cleanCount: 28, avgMs: 690, lastDrilledAt: Date.now() - 86400000 },
      ];

      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      localStorage.setItem(STORAGE_KEYS.SONGS, JSON.stringify(seed.songs));
      localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(seed.sections));
      localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(seed.cards));
      localStorage.setItem(STORAGE_KEYS.TRANSITIONS, JSON.stringify(defaultTransitions));
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
    const storedSongs: Song[] = raw ? JSON.parse(raw) : [];
    const seed = getHardcodedSeedData();

    // Ensure all hardcoded seed songs exist in local storage
    const storedIds = new Set(storedSongs.map((s) => s.id));
    const missingSeedSongs = seed.songs.filter((s) => !storedIds.has(s.id));

    if (missingSeedSongs.length > 0) {
      const mergedSongs = [...storedSongs, ...missingSeedSongs];
      saveSongs(mergedSongs);
      return mergedSongs;
    }

    return storedSongs;
  } catch {
    return getHardcodedSeedData().songs;
  }
}

export function saveSongs(songs: Song[]): void {
  localStorage.setItem(STORAGE_KEYS.SONGS, JSON.stringify(songs));
}

export function loadSections(): Section[] {
  initializeStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SECTIONS);
    const storedSections: Section[] = raw ? JSON.parse(raw) : [];
    const seed = getHardcodedSeedData();

    const storedIds = new Set(storedSections.map((s) => s.id));
    const missingSeedSections = seed.sections.filter((s) => !storedIds.has(s.id));

    if (missingSeedSections.length > 0) {
      const mergedSections = [...storedSections, ...missingSeedSections];
      saveSections(mergedSections);
      return mergedSections;
    }

    return storedSections;
  } catch {
    return getHardcodedSeedData().sections;
  }
}

export function saveSections(sections: Section[]): void {
  localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(sections));
}

export function loadCards(): Card[] {
  initializeStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CARDS);
    const storedCards: Card[] = raw ? JSON.parse(raw) : [];
    const seed = getHardcodedSeedData();

    const storedIds = new Set(storedCards.map((c) => c.id));
    const missingSeedCards = seed.cards.filter((c) => !storedIds.has(c.id));

    if (missingSeedCards.length > 0) {
      const mergedCards = [...storedCards, ...missingSeedCards];
      saveCards(mergedCards);
      return mergedCards;
    }

    return storedCards;
  } catch {
    return getHardcodedSeedData().cards;
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
