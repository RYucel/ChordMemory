/**
 * Akor Belleği - Pre-loaded Hardcoded Seed Songs
 * Includes Pink Floyd, Guns N' Roses, Cem Karaca, and Turkish/Global Acoustic Classics.
 */

import { Card, Section, Song } from '../types';
import { createInitialFsrsState } from '../lib/fsrs';

export function getHardcodedSeedData(): {
  songs: Song[];
  sections: Section[];
  cards: Card[];
} {
  const now = Date.now();

  const rawSeedSongsData: {
    id: string;
    title: string;
    artist: string;
    year: number;
    language: 'TR' | 'EN' | 'OTHER';
    key: string;
    capo: number;
    tempoBpm: number;
    tuning?: string;
    notes?: string;
    sections: {
      id: string;
      label: string;
      customLabel?: string;
      lyricCue: string;
      chords: string[];
    }[];
  }[] = [
    // --- HALUK LEVENT ---
    {
      id: 'song-elfida',
      title: 'Elfida',
      artist: 'Haluk Levent',
      year: 2004,
      language: 'TR',
      key: 'Am',
      capo: 0,
      tempoBpm: 85,
      tuning: 'E A D G B E',
      notes: 'Klasik gitar arpej (p-i-m-a-m-i) ritmiyle çalınır.',
      sections: [
        {
          id: 'sec-elfida-intro',
          label: 'INTRO',
          lyricCue: 'Gitar Arpej Girişi',
          chords: ['Am', 'Dm', 'G', 'C'],
        },
        {
          id: 'sec-elfida-verse',
          label: 'VERSE',
          lyricCue: 'Yüzün geçmişe dönük, gözlerin dolu dolu',
          chords: ['Am', 'Dm', 'G', 'C', 'F', 'Dm', 'E7'],
        },
        {
          id: 'sec-elfida-chorus',
          label: 'CHORUS',
          lyricCue: 'Elfida, beni bırakıp gitme',
          chords: ['Am', 'Dm', 'G', 'C', 'F', 'E7', 'Am'],
        },
      ],
    },

    // --- PINK FLOYD ---
    {
      id: 'song-hey-you',
      title: 'Hey You',
      artist: 'Pink Floyd',
      year: 1979,
      language: 'EN',
      key: 'Em',
      capo: 0,
      tempoBpm: 58,
      tuning: 'E A D G B E (Nashville / Standard)',
      notes: 'Arpej başlar, ardından sert ritim basları devreye girer.',
      sections: [
        {
          id: 'sec-heyyou-intro',
          label: 'INTRO',
          lyricCue: 'Acoustic Guitar Arpeggio Hook',
          chords: ['Em', 'Em9', 'Em', 'Em9'],
        },
        {
          id: 'sec-heyyou-verse1',
          label: 'VERSE',
          lyricCue: 'Hey you, out there in the cold, getting lonely getting old...',
          chords: ['Em', 'Bm', 'Em', 'Bm', 'Am', 'Em', 'G', 'C', 'D', 'Em'],
        },
        {
          id: 'sec-heyyou-chorus',
          label: 'CHORUS',
          lyricCue: 'Don\'t give in without a fight...',
          chords: ['C', 'D', 'G', 'D', 'C', 'Bm', 'Am', 'Em'],
        },
      ],
    },
    {
      id: 'song-wish-you-were-here',
      title: 'Wish You Were Here',
      artist: 'Pink Floyd',
      year: 1975,
      language: 'EN',
      key: 'G',
      capo: 0,
      tempoBpm: 60,
      tuning: 'E A D G B E',
      notes: 'Efsanevi akustik gitar solosu ve ritim geçişi.',
      sections: [
        {
          id: 'sec-wywh-intro',
          label: 'INTRO',
          lyricCue: '12-String Radio Intro Riff',
          chords: ['Em7', 'G', 'Em7', 'G', 'Em7', 'A7sus4', 'Em7', 'A7sus4', 'G'],
        },
        {
          id: 'sec-wywh-verse',
          label: 'VERSE',
          lyricCue: 'So, so you think you can tell Heaven from Hell...',
          chords: ['C', 'D', 'Am', 'G', 'D', 'C', 'Am', 'G'],
        },
        {
          id: 'sec-wywh-chorus',
          label: 'CHORUS',
          lyricCue: 'How I wish, how I wish you were here...',
          chords: ['C', 'D', 'Am', 'G'],
        },
      ],
    },
    {
      id: 'song-comfortably-numb',
      title: 'Comfortably Numb',
      artist: 'Pink Floyd',
      year: 1979,
      language: 'EN',
      key: 'Bm',
      capo: 0,
      tempoBpm: 63,
      tuning: 'E A D G B E',
      notes: 'Roger Waters verse bölümlerinde Bm, Gilmour nakaratta D majör geçer.',
      sections: [
        {
          id: 'sec-cnumb-verse',
          label: 'VERSE',
          lyricCue: 'Hello? Is there anybody in there? Just nod if you can hear me...',
          chords: ['Bm', 'A', 'G', 'Em', 'Bm'],
        },
        {
          id: 'sec-cnumb-chorus',
          label: 'CHORUS',
          lyricCue: 'There is no pain you are receding, a distant ship smoke on the horizon...',
          chords: ['D', 'A', 'D', 'A', 'C', 'G', 'C', 'G'],
        },
      ],
    },
    {
      id: 'song-high-hopes',
      title: 'High Hopes',
      artist: 'Pink Floyd',
      year: 1994,
      language: 'EN',
      key: 'Cm',
      capo: 0,
      tempoBpm: 75,
      tuning: 'E A D G B E',
      notes: 'Kilise çanı sesleri ve duygusal neoklasik arpejler.',
      sections: [
        {
          id: 'sec-hhopes-intro',
          label: 'INTRO',
          lyricCue: 'Bell tolling & Spanish guitar motif',
          chords: ['Cm', 'Fm', 'Bb', 'Eb', 'Ab', 'Fm', 'G'],
        },
        {
          id: 'sec-hhopes-verse',
          label: 'VERSE',
          lyricCue: 'Beyond the horizon of the place we lived when we were young...',
          chords: ['Cm', 'Fm', 'Bb', 'Cm', 'Ab', 'Fm', 'G7'],
        },
        {
          id: 'sec-hhopes-chorus',
          label: 'CHORUS',
          lyricCue: 'The grass was greener, the light was brighter...',
          chords: ['Cm', 'Bb', 'Ab', 'Fm', 'Eb', 'Fm', 'G7', 'Cm'],
        },
      ],
    },
    {
      id: 'song-another-brick',
      title: 'Another Brick in the Wall (Part 2)',
      artist: 'Pink Floyd',
      year: 1979,
      language: 'EN',
      key: 'Dm',
      capo: 0,
      tempoBpm: 104,
      tuning: 'E A D G B E',
      notes: 'Funk ritimli staccato Dm vuruşları ve ritmik funk kasnak duyumu.',
      sections: [
        {
          id: 'sec-abrick-verse',
          label: 'VERSE',
          lyricCue: 'We don\'t need no education, we don\'t need no thought control...',
          chords: ['Dm', 'Dm', 'Dm', 'G', 'Dm'],
        },
        {
          id: 'sec-abrick-chorus',
          label: 'CHORUS',
          lyricCue: 'Hey! Teachers! Leave them kids alone!',
          chords: ['C', 'G', 'Dm', 'C', 'G', 'Dm'],
        },
      ],
    },

    // --- GUNS N' ROSES ---
    {
      id: 'song-dont-cry',
      title: 'Don\'t Cry',
      artist: 'Guns N\' Roses',
      year: 1991,
      language: 'EN',
      key: 'Am',
      capo: 0,
      tempoBpm: 60,
      tuning: 'E A D G B E (Half-step down Eb in original)',
      notes: 'Temiz tonlu elektro/akustik arpej kalıbı.',
      sections: [
        {
          id: 'sec-dcry-intro',
          label: 'INTRO',
          lyricCue: 'Acoustic Arpeggio Opening',
          chords: ['Am', 'Dm', 'G', 'C', 'G/B'],
        },
        {
          id: 'sec-dcry-verse',
          label: 'VERSE',
          lyricCue: 'Talk to me softly, there\'s something in your eyes...',
          chords: ['Am', 'Dm', 'G', 'C', 'G/B', 'Am', 'Dm', 'G', 'C'],
        },
        {
          id: 'sec-dcry-chorus',
          label: 'CHORUS',
          lyricCue: 'Don\'t you cry tonight, I still love you baby...',
          chords: ['F', 'G', 'Am', 'F', 'G', 'C', 'G/B', 'Am', 'F', 'G', 'Am'],
        },
      ],
    },
    {
      id: 'song-november-rain',
      title: 'November Rain',
      artist: 'Guns N\' Roses',
      year: 1991,
      language: 'EN',
      key: 'C',
      capo: 0,
      tempoBpm: 78,
      tuning: 'E A D G B E',
      notes: 'Piyano ağırlıklı destansı ballad, akustik gitar ritmi ile eşlik edilir.',
      sections: [
        {
          id: 'sec-nrain-verse',
          label: 'VERSE',
          lyricCue: 'When I look into your eyes, I can see a love restrained...',
          chords: ['F', 'Dm', 'C', 'C', 'F', 'Dm', 'C'],
        },
        {
          id: 'sec-nrain-chorus',
          label: 'CHORUS',
          lyricCue: 'Nothin\' lasts forever, and we both know hearts can change...',
          chords: ['C', 'Em', 'Am', 'G', 'F', 'G', 'C'],
        },
        {
          id: 'sec-nrain-outro',
          label: 'OUTRO',
          lyricCue: 'Don\'t ya need somebody, don\'t ya need somebody...',
          chords: ['Cm', 'Ab', 'Bb', 'Cm'],
        },
      ],
    },

    // --- CEM KARACA ---
    {
      id: 'song-cok-yorgunum',
      title: 'Çok Yorgunum',
      artist: 'Cem Karaca',
      year: 1980,
      language: 'TR',
      key: 'Am',
      capo: 0,
      tempoBpm: 70,
      tuning: 'E A D G B E',
      notes: 'Nazım Hikmet şiiri. Ağır, vakur ve duygusal yürüyüş.',
      sections: [
        {
          id: 'sec-cyorgun-intro',
          label: 'INTRO',
          lyricCue: 'Piyano & Gitar Melodik Girişi',
          chords: ['Am', 'Dm', 'G', 'C', 'F', 'E7', 'Am'],
        },
        {
          id: 'sec-cyorgun-verse1',
          label: 'VERSE',
          lyricCue: 'Çok yorgunum, beni bekleme kaptan...',
          chords: ['Am', 'Dm', 'G', 'C', 'F', 'Dm', 'E7'],
        },
        {
          id: 'sec-cyorgun-verse2',
          label: 'VERSE',
          lyricCue: 'Çaresiz bir akşam çıkarım bir gün yola...',
          chords: ['Am', 'Dm', 'G', 'C', 'F', 'E7', 'Am'],
        },
      ],
    },
    {
      id: 'sec-islak-islak',
      title: 'Islak Islak',
      artist: 'Cem Karaca',
      year: 1978,
      language: 'TR',
      key: 'Em',
      capo: 0,
      tempoBpm: 92,
      tuning: 'E A D G B E',
      notes: 'Anadolu Rock klasiği, enerjik ritim vuruşları.',
      sections: [
        {
          id: 'sec-islak-intro',
          label: 'INTRO',
          lyricCue: 'Anadolu Rock Ritmik Gitar Girişi',
          chords: ['Em', 'Am', 'D', 'G', 'C', 'Am', 'B7', 'Em'],
        },
        {
          id: 'sec-islak-verse',
          label: 'VERSE',
          lyricCue: 'Gecenin nemi mi çekilmiş gözlerine...',
          chords: ['Em', 'Am', 'D', 'G', 'C', 'Am', 'B7'],
        },
        {
          id: 'sec-islak-chorus',
          label: 'CHORUS',
          lyricCue: 'Sürerim bulutları yağmur yağdırırım ıslak ıslak bakma öyle...',
          chords: ['Em', 'Am', 'D', 'G', 'C', 'Am', 'B7', 'Em'],
        },
      ],
    },
    {
      id: 'song-herkes-gibisin',
      title: 'Herkes Gibisin',
      artist: 'Cem Karaca',
      year: 1980,
      language: 'TR',
      key: 'Am',
      capo: 0,
      tempoBpm: 80,
      tuning: 'E A D G B E',
      notes: 'Nazım Hikmet şiiri, dramatik akor geçişleri.',
      sections: [
        {
          id: 'sec-herkes-verse1',
          label: 'VERSE',
          lyricCue: 'Gözlerim gözünde aşkı seçmedi, onlar ki her zaman gözümde idiler...',
          chords: ['Am', 'Dm', 'G', 'C', 'F', 'E7'],
        },
        {
          id: 'sec-herkes-chorus',
          label: 'CHORUS',
          lyricCue: 'Büsbütün unuttum seni eminim, bende bir fırtına koptu ki sen de herkes gibisin...',
          chords: ['Am', 'Dm', 'G', 'C', 'Dm', 'E7', 'Am'],
        },
      ],
    },
    {
      id: 'song-basini-alip-gitme',
      title: 'Sen de Başını Alıp Gitme',
      artist: 'Cem Karaca',
      year: 1988,
      language: 'TR',
      key: 'Dm',
      capo: 0,
      tempoBpm: 84,
      tuning: 'E A D G B E',
      notes: 'Bora Ayanoğlu bestesi. Muazzam bir hüzün ve melodi.',
      sections: [
        {
          id: 'sec-basini-intro',
          label: 'INTRO',
          lyricCue: 'Slow Arpeggio Strings & Acoustic Guitar',
          chords: ['Dm', 'Gm', 'C', 'F', 'Bb', 'Gm', 'A7', 'Dm'],
        },
        {
          id: 'sec-basini-verse',
          label: 'VERSE',
          lyricCue: 'Sen de başını alıp gitme ne olur, ne olur bir adresi çok görme...',
          chords: ['Dm', 'Gm', 'C', 'F', 'Bb', 'Gm', 'A7'],
        },
        {
          id: 'sec-basini-chorus',
          label: 'CHORUS',
          lyricCue: 'Ağlama bebeğim ağlama sen de, benim kadar ıslanmışsın güneşinde...',
          chords: ['Dm', 'Gm', 'C', 'F', 'Bb', 'A7', 'Dm'],
        },
      ],
    },

    // --- KANSAS / GÖNÜL CLASSICS ---
    {
      id: 'song-dust-wind',
      title: 'Dust in the Wind',
      artist: 'Kansas',
      year: 1977,
      language: 'EN',
      key: 'C',
      capo: 0,
      tempoBpm: 94,
      tuning: 'E A D G B E',
      notes: 'Travis picking fingerstyle pattern.',
      sections: [
        {
          id: 'sec-dust-intro',
          label: 'INTRO',
          lyricCue: 'Fingerstyle Travis Picking Hook',
          chords: ['C', 'Cmaj7', 'Cadd9', 'Am', 'Asus2', 'G/B'],
        },
        {
          id: 'sec-dust-verse',
          label: 'VERSE',
          lyricCue: 'I close my eyes, only for a moment and the moment\'s gone...',
          chords: ['C', 'G/B', 'Am', 'G', 'Dm', 'Am', 'G'],
        },
      ],
    },
    {
      id: 'song-gonul',
      title: 'Gönül',
      artist: 'Fikret Kızılok',
      year: 1983,
      language: 'TR',
      key: 'Em',
      capo: 2,
      tempoBpm: 76,
      tuning: 'E A D G B E',
      notes: 'Kapo 2. frette (Görünürde Dm). Sakin ve içli çalınır.',
      sections: [
        {
          id: 'sec-gonul-verse',
          label: 'VERSE',
          lyricCue: 'Gönül sen bu hallere düşecek adam mıydın?',
          chords: ['Em', 'Am', 'D', 'G', 'C', 'B7'],
        },
      ],
    },

    // --- FATİH ERKOÇ ---
    {
      id: 'song-ellerim-bombos',
      title: 'Ellerim Bomboş',
      artist: 'Fatih Erkoç',
      year: 1992,
      language: 'TR',
      key: 'Am',
      capo: 0,
      tempoBpm: 82,
      tuning: 'E A D G B E',
      notes: 'Türk pop müziğinin efsanevi klasiği, duygusal caz/pop akor yürüyüşü.',
      sections: [
        {
          id: 'sec-bombos-intro',
          label: 'INTRO',
          lyricCue: 'Piyano & Saksafon Açılış Melodisi',
          chords: ['Am', 'Dm', 'G', 'C', 'F', 'E7', 'Am'],
        },
        {
          id: 'sec-bombos-verse',
          label: 'VERSE',
          lyricCue: 'Gözlerimde yaşlar, ellerim bomboş, yüreğimde sızı...',
          chords: ['Am', 'Dm', 'G', 'C', 'F', 'Dm', 'E7'],
        },
        {
          id: 'sec-bombos-chorus',
          label: 'CHORUS',
          lyricCue: 'Ellerim bomboş, gözlerimde yaş, bana sen gereksin...',
          chords: ['Am', 'Dm', 'G', 'C', 'F', 'E7', 'Am'],
        },
      ],
    },

    // --- SERTAB ERENER ---
    {
      id: 'song-yanarim',
      title: 'Yanarım',
      artist: 'Sertab Erener',
      year: 1999,
      language: 'TR',
      key: 'Am',
      capo: 0,
      tempoBpm: 98,
      tuning: 'E A D G B E',
      notes: 'Flamenko ritim kalıpları ve hareketli bas geçişleri.',
      sections: [
        {
          id: 'sec-yanarim-intro',
          label: 'INTRO',
          lyricCue: 'Flamenko Gitar Solosu & Ritim Girişi',
          chords: ['Am', 'G', 'F', 'E7'],
        },
        {
          id: 'sec-yanarim-verse',
          label: 'VERSE',
          lyricCue: 'Rüzgar esip geçse de, anılar unutulsa da...',
          chords: ['Am', 'Dm', 'G', 'C', 'F', 'Dm', 'E7'],
        },
        {
          id: 'sec-yanarim-chorus',
          label: 'CHORUS',
          lyricCue: 'Yanarım yanarım, tutuşur yanarım, kavurur ah bu sevda...',
          chords: ['Am', 'G', 'F', 'E7', 'Am', 'G', 'F', 'E7', 'Am'],
        },
      ],
    },

    // --- PENTAGRAM ---
    {
      id: 'song-sonsuz',
      title: 'Sonsuz',
      artist: 'Pentagram',
      year: 1997,
      language: 'TR',
      key: 'Em',
      capo: 0,
      tempoBpm: 72,
      tuning: 'E A D G B E',
      notes: 'Anadolu Heavy Metal/Akustik ballad klasiği, arpej ve güç akorları.',
      sections: [
        {
          id: 'sec-sonsuz-intro',
          label: 'INTRO',
          lyricCue: 'Derin Akustik Gitar Arpeji',
          chords: ['Em', 'C', 'G', 'D', 'Em', 'C', 'B7'],
        },
        {
          id: 'sec-sonsuz-verse',
          label: 'VERSE',
          lyricCue: 'Bir gün daha biter, karanlık çökerken sahile...',
          chords: ['Em', 'C', 'G', 'D', 'Em', 'C', 'B7'],
        },
        {
          id: 'sec-sonsuz-chorus',
          label: 'CHORUS',
          lyricCue: 'Sonsuz bir masal geçer zaman, kalır anılar...',
          chords: ['Em', 'Am', 'D', 'G', 'C', 'Am', 'B7', 'Em'],
        },
      ],
    },

    // --- RADIOHEAD ---
    {
      id: 'song-creep',
      title: 'Creep',
      artist: 'Radiohead',
      year: 1992,
      language: 'EN',
      key: 'G',
      capo: 0,
      tempoBpm: 92,
      tuning: 'E A D G B E',
      notes: '4 Akorluk ikonik döngü (G - B - C - Cm). Jonny Greenwood sert gitar kesmeleri.',
      sections: [
        {
          id: 'sec-creep-verse',
          label: 'VERSE',
          lyricCue: 'When you were here before, couldn\'t look you in the eye...',
          chords: ['G', 'B', 'C', 'Cm'],
        },
        {
          id: 'sec-creep-chorus',
          label: 'CHORUS',
          lyricCue: 'But I\'m a creep, I\'m a weirdo, what the hell am I doing here?...',
          chords: ['G', 'B', 'C', 'Cm'],
        },
      ],
    },

    // --- EAGLES ---
    {
      id: 'song-hotel-california',
      title: 'Hotel California',
      artist: 'Eagles',
      year: 1976,
      language: 'EN',
      key: 'Bm',
      capo: 7,
      tempoBpm: 75,
      tuning: 'E A D G B E',
      notes: '7. Frette Kapo ile Bm tonunda (Eam formunda) 8 barlık eşsiz akor dizilimi.',
      sections: [
        {
          id: 'sec-hcal-intro',
          label: 'INTRO',
          lyricCue: '12-String Acoustic Arpeggio Walkthrough',
          chords: ['Bm', 'F#7', 'A', 'E', 'G', 'D', 'Em', 'F#7'],
        },
        {
          id: 'sec-hcal-verse',
          label: 'VERSE',
          lyricCue: 'On a dark desert highway, cool wind in my hair...',
          chords: ['Bm', 'F#7', 'A', 'E', 'G', 'D', 'Em', 'F#7'],
        },
        {
          id: 'sec-hcal-chorus',
          label: 'CHORUS',
          lyricCue: 'Welcome to the Hotel California, such a lovely place...',
          chords: ['G', 'D', 'F#7', 'Bm', 'G', 'D', 'Em', 'F#7'],
        },
      ],
    },
  ];

  const songsList: Song[] = [];
  const sectionsList: Section[] = [];
  const cardsList: Card[] = [];

  rawSeedSongsData.forEach((rawSong, songIdx) => {
    const songRecord: Song = {
      id: rawSong.id,
      title: rawSong.title,
      artist: rawSong.artist,
      year: rawSong.year,
      language: rawSong.language,
      key: rawSong.key,
      mode: rawSong.key.endsWith('m') ? 'minor' : 'major',
      capo: rawSong.capo,
      tempoBpm: rawSong.tempoBpm,
      timeSignature: '4/4',
      tuning: rawSong.tuning || 'E A D G B E',
      notes: rawSong.notes || '',
      createdAt: now - (songIdx + 1) * 86400000,
      lastPlayedAt: now - (songIdx + 1) * 43200000,
    };
    songsList.push(songRecord);

    rawSong.sections.forEach((sec, secIdx) => {
      const chordSlots = sec.chords.map((c) => ({
        root: c.slice(0, 1),
        quality: c.slice(1),
        beats: 4,
        fullChord: c,
        romanNumeral: '',
      }));

      const sectionRecord: Section = {
        id: sec.id,
        songId: rawSong.id,
        order: secIdx + 1,
        label: sec.label as any,
        customLabel: sec.customLabel || sec.label,
        bars: Math.max(2, sec.chords.length),
        lyricCue: sec.lyricCue,
        chordSequence: chordSlots,
      };
      sectionsList.push(sectionRecord);

      // Card for Sequence Recall
      const c1: Card = {
        id: `card-${sec.id}-seq`,
        sectionId: sec.id,
        songId: rawSong.id,
        type: 'SEQUENCE_RECALL',
        cueLevel: secIdx % 2 === 0 ? 1 : 2,
        fsrsState: createInitialFsrsState(),
        createdAt: now - (songIdx * 10 + secIdx) * 3600000,
      };
      c1.fsrsState.dueAt = now - 1000;
      cardsList.push(c1);

      // Card for Roman Numeral Analysis
      const c2: Card = {
        id: `card-${sec.id}-roman`,
        sectionId: sec.id,
        songId: rawSong.id,
        type: 'ROMAN_ANALYSIS',
        cueLevel: 3,
        fsrsState: createInitialFsrsState(),
        createdAt: now - (songIdx * 10 + secIdx) * 3600000,
      };
      c2.fsrsState.dueAt = now - 2000;
      cardsList.push(c2);
    });
  });

  return { songs: songsList, sections: sectionsList, cards: cardsList };
}
