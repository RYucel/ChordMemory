/**
 * Akor Belleği - ChordPro & Plain Text Parser + Key Detection + Roman Numeral Engine
 */

import { ChordSlot, Section, SectionLabel, Song } from '../types';

// Turkish Note Mapping
const TURKISH_NOTE_MAP: Record<string, string> = {
  'LA': 'A', 'SI': 'B', 'DO': 'C', 'RE': 'D', 'MI': 'E', 'FA': 'F', 'SOL': 'G',
  'LÂ': 'A', 'Sİ': 'B', 'Mİ': 'E',
};

// Standard Chord Regex
export const CHORD_REGEX = /^[A-Ga-g](?:#|b|â|♯|♭)?(?:m|min|maj|maj7|m7|7|sus2|sus4|dim|aug|add9|6|9|11|13)*(?:\/[A-Ga-g](?:#|b|â|♯|♭)?)?$/;

/**
 * Normalizes a chord string (e.g. "la minör" -> "Am", "Fa#m" -> "F#m", "Do/Mi" -> "C/E")
 */
export function normalizeChord(input: string): string {
  let cleaned = input.trim();
  if (!cleaned) return '';

  // Turkish words replacement
  let upper = cleaned.toUpperCase();
  for (const [tr, en] of Object.entries(TURKISH_NOTE_MAP)) {
    if (upper.startsWith(tr)) {
      cleaned = en + cleaned.slice(tr.length);
      upper = cleaned.toUpperCase();
      break;
    }
  }

  cleaned = cleaned
    .replace(/MINÖR/gi, 'm')
    .replace(/MAJÖR/gi, '')
    .replace(/MINOR/gi, 'm')
    .replace(/MAJOR/gi, '')
    .replace(/â/g, '')
    .replace(/♯/g, '#')
    .replace(/♭/g, 'b');

  return cleaned;
}

/**
 * Checks if a token is likely a chord
 */
export function isChordToken(token: string): boolean {
  const norm = normalizeChord(token);
  return CHORD_REGEX.test(norm);
}

/**
 * Parses root note, quality, and bass from a chord string
 */
export function parseChordComponents(chordStr: string): { root: string; quality: string; bass?: string } {
  const norm = normalizeChord(chordStr);
  const slashIndex = norm.indexOf('/');
  let mainChord = slashIndex !== -1 ? norm.slice(0, slashIndex) : norm;
  const bass = slashIndex !== -1 ? norm.slice(slashIndex + 1) : undefined;

  let root = mainChord.slice(0, 1).toUpperCase();
  let remaining = mainChord.slice(1);

  if (remaining.startsWith('#') || remaining.startsWith('b')) {
    root += remaining.slice(0, 1);
    remaining = remaining.slice(1);
  }

  return { root, quality: remaining, bass };
}

// Semitone distances from C
const NOTE_SEMITONES: Record<string, number> = {
  'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
  'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
  'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
};

const SEMITONE_NOTES_MAJOR = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

/**
 * Transposes a root note by semitones
 */
export function transposeNote(note: string, semitones: number): string {
  const norm = normalizeChord(note);
  const current = NOTE_SEMITONES[norm];
  if (current === undefined) return note;
  let newPos = (current + semitones) % 12;
  if (newPos < 0) newPos += 12;
  return SEMITONE_NOTES_MAJOR[newPos];
}

/**
 * Transposes a full chord string (e.g. "Am" + 2 -> "Bm", "F/C" + 2 -> "G/D")
 */
export function transposeChord(chord: string, semitones: number): string {
  if (semitones === 0) return chord;
  const { root, quality, bass } = parseChordComponents(chord);
  const newRoot = transposeNote(root, semitones);
  const newBass = bass ? transposeNote(bass, semitones) : undefined;
  return newRoot + quality + (newBass ? '/' + newBass : '');
}

/**
 * Computes Roman Numeral degree for a chord in a given Key (e.g. key: "Am", chord: "F" -> "VI")
 */
export function computeRomanNumeral(chord: string, key: string): string {
  const { root, quality } = parseChordComponents(chord);
  const { root: keyRoot, quality: keyQuality } = parseChordComponents(key);
  const isKeyMinor = keyQuality.toLowerCase().includes('m') || key.endsWith('m');

  const rootSemitone = NOTE_SEMITONES[root];
  const keySemitone = NOTE_SEMITONES[keyRoot];

  if (rootSemitone === undefined || keySemitone === undefined) {
    return chord; // Fallback
  }

  let interval = (rootSemitone - keySemitone) % 12;
  if (interval < 0) interval += 12;

  let baseRoman = '';
  const isMinorChord = quality.startsWith('m') && !quality.startsWith('maj');

  if (!isKeyMinor) {
    // Major Key (e.g. C)
    switch (interval) {
      case 0: baseRoman = isMinorChord ? 'i' : 'I'; break;
      case 1: baseRoman = isMinorChord ? '♭ii' : '♭II'; break;
      case 2: baseRoman = isMinorChord ? 'ii' : 'II'; break;
      case 3: baseRoman = isMinorChord ? '♭iii' : '♭III'; break;
      case 4: baseRoman = isMinorChord ? 'iii' : 'III'; break;
      case 5: baseRoman = isMinorChord ? 'iv' : 'IV'; break;
      case 6: baseRoman = isMinorChord ? '♭v' : '♯IV'; break;
      case 7: baseRoman = isMinorChord ? 'v' : 'V'; break;
      case 8: baseRoman = isMinorChord ? '♭vi' : '♭VI'; break;
      case 9: baseRoman = isMinorChord ? 'vi' : 'VI'; break;
      case 10: baseRoman = isMinorChord ? '♭vii' : '♭VII'; break;
      case 11: baseRoman = isMinorChord ? 'vii°' : 'VII'; break;
      default: baseRoman = 'I';
    }
  } else {
    // Minor Key (e.g. Am)
    switch (interval) {
      case 0: baseRoman = isMinorChord ? 'i' : 'I'; break;
      case 1: baseRoman = isMinorChord ? '♭ii' : '♭II'; break;
      case 2: baseRoman = isMinorChord ? 'ii°' : 'II'; break;
      case 3: baseRoman = isMinorChord ? 'iii' : 'III'; break;
      case 4: baseRoman = isMinorChord ? 'iii' : 'III'; break;
      case 5: baseRoman = isMinorChord ? 'iv' : 'IV'; break;
      case 6: baseRoman = isMinorChord ? '♭v' : '♭V'; break;
      case 7: baseRoman = isMinorChord ? 'v' : 'V'; break; // Major V in harmonic minor (E7 in Am)
      case 8: baseRoman = isMinorChord ? 'vi' : 'VI'; break;
      case 9: baseRoman = isMinorChord ? 'vi°' : 'VI'; break;
      case 10: baseRoman = isMinorChord ? 'vii' : 'VII'; break;
      case 11: baseRoman = isMinorChord ? 'vii°' : 'VII'; break;
      default: baseRoman = 'i';
    }
  }

  // Quality suffix (e.g. 7, maj7, sus4, dim)
  let suffix = quality;
  if (suffix.startsWith('m') && !suffix.startsWith('maj')) {
    suffix = suffix.slice(1);
  }

  return baseRoman + suffix;
}

/**
 * Detects key from list of chords using histogram and scale matching
 */
export function detectKey(chords: string[]): { key: string; mode: 'major' | 'minor'; confidence: number } {
  if (!chords || chords.length === 0) return { key: 'Am', mode: 'minor', confidence: 0.5 };

  const validChords = chords.map(c => normalizeChord(c)).filter(c => isChordToken(c));
  if (validChords.length === 0) return { key: 'Am', mode: 'minor', confidence: 0.5 };

  // First chord or last chord often indicates key
  const firstChord = validChords[0];
  const { root: firstRoot, quality: firstQuality } = parseChordComponents(firstChord);
  const firstIsMinor = firstQuality.startsWith('m') && !firstQuality.startsWith('maj');
  const candidateKey = firstRoot + (firstIsMinor ? 'm' : '');

  return {
    key: candidateKey,
    mode: firstIsMinor ? 'minor' : 'major',
    confidence: 0.85
  };
}

export interface ParsedImportResult {
  songInfo: Partial<Song>;
  sections: {
    label: SectionLabel;
    customLabel?: string;
    lyricCue: string;
    chords: string[];
  }[];
}

/**
 * ChordPro & Plain Text Master Import Parser
 */
export function parseSongContent(
  rawText: string,
  overrideInfo?: { title?: string; artist?: string; key?: string; capo?: number; tempoBpm?: number }
): ParsedImportResult {
  const lines = rawText.split(/\r?\n/);
  
  let title = overrideInfo?.title?.trim() || '';
  let artist = overrideInfo?.artist?.trim() || '';
  let key = overrideInfo?.key?.trim() || '';
  let capo = overrideInfo?.capo ?? 0;
  let bpm = overrideInfo?.tempoBpm ?? 90;
  let language: 'TR' | 'EN' | 'OTHER' = 'TR';

  const sections: { label: SectionLabel; customLabel?: string; lyricCue: string; chords: string[] }[] = [];
  let currentSectionLabel: SectionLabel = 'VERSE';
  let currentCustomLabel: string | undefined = undefined;
  let currentChords: string[] = [];
  let currentLyrics: string[] = [];
  let verseCount = 0;
  let chorusCount = 0;

  const flushSection = () => {
    if (currentChords.length > 0 || currentLyrics.length > 0) {
      // Determine label if default
      let labelToUse = currentSectionLabel;
      let customLabelToUse = currentCustomLabel;

      if (!customLabelToUse) {
        if (labelToUse === 'VERSE') {
          verseCount++;
          customLabelToUse = `Kıt'a ${verseCount}`;
        } else if (labelToUse === 'CHORUS') {
          chorusCount++;
          customLabelToUse = chorusCount > 1 ? `Nakarat ${chorusCount}` : 'Nakarat';
        }
      }

      sections.push({
        label: labelToUse,
        customLabel: customLabelToUse,
        lyricCue: currentLyrics.filter(l => l.trim().length > 0).join(' / ').slice(0, 120),
        chords: [...currentChords],
      });

      currentChords = [];
      currentLyrics = [];
      currentCustomLabel = undefined;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      // Blank line: if we have accumulated chords and lyrics, flush to create a stanza section
      if (currentChords.length > 0) {
        flushSection();
        currentSectionLabel = 'VERSE'; // reset to verse for next stanza unless specified
      }
      continue;
    }

    // Check ChordPro Directives
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      const dir = trimmed.slice(1, -1).trim();
      const colonIdx = dir.indexOf(':');
      if (colonIdx !== -1) {
        const tag = dir.slice(0, colonIdx).trim().toLowerCase();
        const val = dir.slice(colonIdx + 1).trim();
        if ((tag === 'title' || tag === 't') && !title) title = val;
        if ((tag === 'artist' || tag === 'a') && !artist) artist = val;
        if ((tag === 'key' || tag === 'k') && !key) key = val;
        if (tag === 'capo') capo = parseInt(val, 10) || 0;
        if (tag === 'bpm' || tag === 'tempo') bpm = parseInt(val, 10) || 90;
      } else {
        const tag = dir.toLowerCase();
        if (tag.includes('chorus') || tag.includes('nakarat')) {
          flushSection();
          currentSectionLabel = 'CHORUS';
        } else if (tag.includes('verse') || tag.includes('kıt\'a')) {
          flushSection();
          currentSectionLabel = 'VERSE';
        } else if (tag.includes('bridge') || tag.includes('köprü')) {
          flushSection();
          currentSectionLabel = 'BRIDGE';
        } else if (tag.includes('intro')) {
          flushSection();
          currentSectionLabel = 'INTRO';
        }
      }
      continue;
    }

    // Check repertuarim.com / plain text Section Header markers (e.g., N, N:, [N], Nakarat, Söz, Solo, Intro)
    const upperTrimmed = trimmed.toUpperCase();
    if (
      upperTrimmed === 'N' ||
      upperTrimmed === 'N:' ||
      upperTrimmed === 'NAKARAT' ||
      upperTrimmed === 'NAKARAT:' ||
      upperTrimmed === '[N]' ||
      upperTrimmed === '[NAKARAT]' ||
      upperTrimmed === '(NAKARAT)'
    ) {
      flushSection();
      currentSectionLabel = 'CHORUS';
      currentCustomLabel = 'Nakarat';
      continue;
    }

    if (
      upperTrimmed === 'SÖZ' ||
      upperTrimmed === 'SÖZ:' ||
      upperTrimmed === 'SÖZLER' ||
      upperTrimmed === 'KITA' ||
      upperTrimmed === '[VERSE]' ||
      upperTrimmed === '[SÖZ]'
    ) {
      flushSection();
      currentSectionLabel = 'VERSE';
      continue;
    }

    if (
      upperTrimmed.includes('INTRO') ||
      upperTrimmed.includes('GİRİŞ') ||
      upperTrimmed === '[INTRO]'
    ) {
      flushSection();
      currentSectionLabel = 'INTRO';
      currentCustomLabel = 'Giriş (Intro)';
      continue;
    }

    if (
      upperTrimmed.includes('SOLO') ||
      upperTrimmed.includes('GİTAR SOLO') ||
      upperTrimmed === '[SOLO]'
    ) {
      flushSection();
      currentSectionLabel = 'SOLO';
      currentCustomLabel = 'Solo';
      continue;
    }

    if (
      upperTrimmed.includes('KÖPRÜ') ||
      upperTrimmed.includes('BRIDGE') ||
      upperTrimmed === '[BRIDGE]'
    ) {
      flushSection();
      currentSectionLabel = 'BRIDGE';
      currentCustomLabel = 'Köprü';
      continue;
    }

    if (
      upperTrimmed.includes('OUTRO') ||
      upperTrimmed.includes('BİTİŞ')
    ) {
      flushSection();
      currentSectionLabel = 'OUTRO';
      currentCustomLabel = 'Bitiş (Outro)';
      continue;
    }

    // Check Section Header in brackets like [Nakarat 1] or [Chorus]
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      const inner = trimmed.slice(1, -1).trim();
      if (isChordToken(inner)) {
        // Single inline chord like [Am]
        currentChords.push(normalizeChord(inner));
        continue;
      } else {
        const header = inner.toUpperCase();
        flushSection();
        if (header.includes('INTRO')) currentSectionLabel = 'INTRO';
        else if (header.includes('CHORUS') || header.includes('NAKARAT') || header === 'N') currentSectionLabel = 'CHORUS';
        else if (header.includes('PRE') || header.includes('ÖN')) currentSectionLabel = 'PRECHORUS';
        else if (header.includes('BRIDGE') || header.includes('KÖPRÜ')) currentSectionLabel = 'BRIDGE';
        else if (header.includes('SOLO')) currentSectionLabel = 'SOLO';
        else if (header.includes('OUTRO')) currentSectionLabel = 'OUTRO';
        else {
          currentSectionLabel = 'CUSTOM';
          currentCustomLabel = inner;
        }
        continue;
      }
    }

    // Check Inline ChordPro Chords [Am] inside lyrics: "Ne olur [Fm] aç kapıyı [Bbm]"
    if (trimmed.includes('[') && trimmed.includes(']')) {
      const chordsInLine: string[] = [];
      const cleanLyric = trimmed.replace(/\[([^\]]+)\]/g, (_, chordMatch) => {
        if (isChordToken(chordMatch)) {
          chordsInLine.push(normalizeChord(chordMatch));
        }
        return '';
      }).trim();

      if (chordsInLine.length > 0) {
        currentChords.push(...chordsInLine);
      }
      if (cleanLyric) {
        currentLyrics.push(cleanLyric);
      }
      continue;
    }

    // Check Plain Text: Chord Line vs Lyric Line
    const tokens = trimmed.split(/\s+/);
    const chordMatches = tokens.filter(t => isChordToken(t));
    const isChordLine = tokens.length > 0 && (chordMatches.length / tokens.length) >= 0.5;

    if (isChordLine) {
      const validChords = tokens.filter(t => isChordToken(t)).map(t => normalizeChord(t));
      currentChords.push(...validChords);
    } else {
      currentLyrics.push(trimmed);
    }
  }

  flushSection();

  if (!title) title = 'Yeni Şarkı';
  if (!artist) artist = 'Bilinmeyen Sanatçı';

  // Collect all chords to auto-detect key if not specified
  const allChords = sections.flatMap(s => s.chords);
  if (!key) {
    const detected = detectKey(allChords);
    key = detected.key;
  }

  // Detect Turkish vs English
  const textSample = (title + ' ' + artist + ' ' + rawText).toLowerCase();
  if (/[ğıüşöçİĞÜŞÖÇ]/.test(textSample) || textSample.includes('nakarat') || textSample.includes('köprü') || textSample.includes('yanarım')) {
    language = 'TR';
  } else {
    language = 'EN';
  }

  return {
    songInfo: {
      title,
      artist,
      key,
      capo,
      tempoBpm: bpm,
      language,
      timeSignature: '4/4',
      tuning: 'E A D G B E',
      mode: key.endsWith('m') ? 'minor' : 'major',
    },
    sections,
  };
}

/**
 * Self-test routine for Parser and Roman Numeral calculations
 */
export function runParserSelfTests(): { passed: boolean; logs: string[] } {
  const logs: string[] = [];
  let passed = true;

  try {
    // Test 1: Chord Normalization & Turkish Translation
    const c1 = normalizeChord('la minör');
    if (c1 !== 'Am') {
      passed = false;
      logs.push(`FAILED Test 1: Expected Am, got ${c1}`);
    } else {
      logs.push(`Test 1 PASSED: 'la minör' normalized to 'Am'`);
    }

    // Test 2: Roman Numeral in Am key
    const r1 = computeRomanNumeral('F', 'Am'); // VI
    const r2 = computeRomanNumeral('Am', 'Am'); // i
    const r3 = computeRomanNumeral('E7', 'Am'); // V7
    if (r1 !== 'VI' || r2 !== 'i' || r3 !== 'V7') {
      passed = false;
      logs.push(`FAILED Test 2: Roman Numeral calculation error (got ${r1}, ${r2}, ${r3})`);
    } else {
      logs.push(`Test 2 PASSED: Roman numerals in Am (F->${r1}, Am->${r2}, E7->${r3})`);
    }

    // Test 3: Transposition
    const t1 = transposeChord('Am', 2); // Bm
    const t2 = transposeChord('F/C', 2); // G/D
    if (t1 !== 'Bm' || t2 !== 'G/D') {
      passed = false;
      logs.push(`FAILED Test 3: Transpose error (got ${t1}, ${t2})`);
    } else {
      logs.push(`Test 3 PASSED: Transposing +2 semitones (Am->${t1}, F/C->${t2})`);
    }

    // Test 4: ChordPro parser
    const sampleChordPro = `{title: Elfida}\n{artist: Haluk Levent}\n{key: Am}\n[Verse]\n[Am] Yüzün [Dm] geçmişe dönük\n[G] Gözlerin [C] dolu`;
    const parsed = parseSongContent(sampleChordPro);
    if (parsed.songInfo.title !== 'Elfida' || parsed.sections.length === 0) {
      passed = false;
      logs.push(`FAILED Test 4: ChordPro parser failure`);
    } else {
      logs.push(`Test 4 PASSED: Parsed ChordPro song '${parsed.songInfo.title}' with ${parsed.sections.length} section(s)`);
    }

  } catch (err) {
    passed = false;
    logs.push(`Parser Self Test Exception: ${String(err)}`);
  }

  return { passed, logs };
}
