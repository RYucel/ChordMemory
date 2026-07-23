/**
 * Akor Belleği - Core Data Types & Interfaces
 */

export type SectionLabel = 
  | 'INTRO' 
  | 'VERSE' 
  | 'PRECHORUS' 
  | 'CHORUS' 
  | 'BRIDGE' 
  | 'SOLO' 
  | 'OUTRO' 
  | 'CUSTOM';

export type CardType = 
  | 'SEQUENCE_RECALL' 
  | 'NEXT_CHORD' 
  | 'LYRIC_TO_CHORD' 
  | 'AUDIO_TO_CHORD' 
  | 'ROMAN_ANALYSIS' 
  | 'SHAPE_RECALL' 
  | 'TRANSPOSE';

export type FsrsStateEnum = 'NEW' | 'LEARNING' | 'REVIEW' | 'RELEARNING';

export type Grade = 1 | 2 | 3 | 4; // 1: Again, 2: Hard, 3: Good, 4: Easy

export interface ChordSlot {
  root: string;           // e.g. "A", "C#", "Bb"
  quality: string;        // e.g. "m", "maj7", "7", "sus4", ""
  bass?: string;          // e.g. "E" for Am/E
  beats: number;          // duration in beats (default 4)
  romanNumeral: string;   // e.g. "i", "VI", "V7"
  fullChord: string;      // e.g. "Am", "C#m7", "F/C"
}

export interface Section {
  id: string;
  songId: string;
  order: number;
  label: SectionLabel;
  customLabel?: string;
  bars: number;
  lyricCue?: string;
  chordSequence: ChordSlot[];
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  year?: number;
  language: 'TR' | 'EN' | 'OTHER';
  key: string;            // e.g. "Am", "G", "Em"
  mode: 'major' | 'minor';
  capo: number;           // 0 for no capo
  tempoBpm: number;
  timeSignature: string;  // e.g. "4/4", "3/4"
  tuning: string;         // e.g. "E A D G B E"
  sourceUrl?: string;
  notes?: string;
  createdAt: number;      // timestamp
  lastPlayedAt?: number;  // timestamp
}

export interface FsrsState {
  stability: number;       // S (days)
  difficulty: number;      // D (1..10)
  dueAt: number;           // timestamp in ms
  lastReviewAt: number | null;
  reps: number;
  lapses: number;
  state: FsrsStateEnum;
}

export interface Card {
  id: string;
  sectionId: string;
  songId: string;
  type: CardType;
  cueLevel: number;        // 0 to 5
  fsrsState: FsrsState;
  createdAt: number;
}

export interface Review {
  id: string;
  cardId: string;
  songId: string;
  reviewedAt: number;
  grade: Grade;
  elapsedMs: number;
  cueLevelAtReview: number;
}

export interface TransitionStat {
  id: string;             // e.g. "Am-F"
  fromChord: string;
  toChord: string;
  attempts: number;
  cleanCount: number;
  avgMs: number;
  lastDrilledAt: number;
}

export interface Session {
  id: string;
  startedAt: number;
  endedAt?: number;
  cardsReviewed: number;
  retentionRate: number;   // 0.0 to 1.0
  drillScore: number;      // transitions per minute
  completedPhase: 'WARMUP' | 'REVIEW' | 'NEW' | 'PERFORMANCE' | 'DONE';
}

export interface AppSettings {
  language: 'tr' | 'en';
  sessionLengthMinutes: number; // default 20
  desiredRetention: number;    // default 0.90 (0.85 - 0.95)
  maxNewCardsPerDay: number;   // default 8
  maxReviewsPerDay: number;    // default 60
  metronomeSound: 'click' | 'woodblock' | 'beep';
  metronomeVolume: number;     // 0.0 to 1.0
  handsFreePedalEnabled: boolean;
  calibrationWarningEnabled: boolean;
  autoAdvanceSeconds: number;  // 0 for disabled
  theme: 'dark' | 'light';
  fsrsWeights: number[];      // 19 parameters for FSRS v4.5
}
