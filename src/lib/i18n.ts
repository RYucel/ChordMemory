/**
 * Akor Belleği - Internationalization (i18n) Engine (TR / EN)
 */

export type Language = 'tr' | 'en';

export const TRANSLATIONS = {
  tr: {
    appName: 'Akor Belleği',
    tagline: 'Klasik Gitarist İçin Akor Hafıza Antrenörü',
    
    // Navigation
    navToday: 'Bugün',
    navSession: 'Seans',
    navRepertoire: 'Repertuvar',
    navDrill: 'Tatbikat',
    navStats: 'İstatistik',
    navSettings: 'Ayarlar',

    // Today / Dashboard
    todayTitle: 'Günün Seansı',
    startSession: 'Seansı Başlat (20 dk)',
    dueQueue: 'Vadesi Gelen Kartlar',
    newCards: 'Yeni Bölümler',
    reviewCards: 'Tekrarlar',
    streakDays: 'Günlük Seri',
    daysUnit: 'gün',
    workloadForecast: 'Günlük Çalışma Yükü',
    quickStartDrill: 'Geçiş Hızlandırma Tatbikatı',
    repertoireMaturity: 'Repertuvar Olgunluğu',
    noDueCards: 'Bugünlük tüm tekrarlar tamamlandı! Yeni bir şarkı ekleyebilir veya serbest tatbikat yapabilirsiniz.',
    readyToStudy: 'Gitarını hazırla. Seans 5 aşamadan oluşur: Isınma, Tekrarlar, Yeni Materyal, Performans, Kapanış.',

    // Session Screen
    sessionPhaseWarmup: 'Aşama 1: Isınma (60s Geçiş Tatbikatı)',
    sessionPhaseReview: 'Aşama 2: Aralıklı Tekrar (FSRS)',
    sessionPhaseNew: 'Aşama 3: Yeni Materyal (Roman Analizi)',
    sessionPhasePerf: 'Aşama 4: Baştan Sona Performans',
    sessionPhaseDone: 'Aşama 5: Seans Tamamlandı',
    
    cueLevel: 'İpucu Seviyesi',
    cueLevel0: 'L0: Akorlar + Sözler + Şema',
    cueLevel1: 'L1: Akorlar Söz Üstünde',
    cueLevel2: 'L2: Sadece İlk Harf',
    cueLevel3: 'L3: Roman Rakamları Derece',
    cueLevel4: 'L4: Sadece Söz Satırı',
    cueLevel5: 'L5: Sadece Ses/Sıfır Görsel',

    revealAnswer: 'Cevabı Göster (Gitarla Çaldıktan Sonra)',
    playingGuitar: 'Gitarınla Akor Dizisini Çal...',
    evaluatePerformance: 'Hatırlama Zorluğunu Derecelendir:',
    
    gradeAgain: 'Tekrar (Again)',
    gradeAgainSub: 'Hatırlayamadım / Hata',
    gradeHard: 'Zor (Hard)',
    gradeHardSub: 'Duraksayarak Hatırladım',
    gradeGood: 'İyi (Good)',
    gradeGoodSub: 'Doğru Zamanlamayla Çaldım',
    gradeEasy: 'Kolay (Easy)',
    gradeEasySub: 'Zahmetsizce Hatırlandı',

    showRoman: 'Roman Rakamları Göster',
    showChords: 'Akorları Göster',
    toggleMetronome: 'Metronom Aç/Kapat',

    // Repertoire
    repertoireTitle: 'Repertuvarım',
    addSong: 'Yeni Şarkı Ekle',
    searchSong: 'Şarkı veya sanatçı ara...',
    filterAll: 'Tümü',
    filterTurkish: 'Türkçe',
    filterEnglish: 'İngilizce',
    filterMature: 'Olgunlaşmış',
    filterLearning: 'Öğrenilmekte',
    songsCount: 'şarkı',
    keyLabel: 'Ton',
    capoLabel: 'Kapo',
    bpmLabel: 'BPM',
    maturityLabel: 'Olgunluk',
    lastPlayed: 'Son Çalış',
    neverPlayed: 'Henüz çalışılmadı',

    // Song Detail
    songDetailTitle: 'Şarkı Detayı',
    startSongPractice: 'Bu Şarkıyı Şimdi Çalış',
    sectionsHeader: 'Öğrenme Bölümleri (Chunking)',
    transposeCalculator: 'Transpoze & Kapo Hesaplayıcı',
    originalKey: 'Orijinal Ton',
    currentKey: 'Mevcut Ton',
    capoPosition: 'Kapo Pozisyonu',
    romanAnalysisHeader: 'Harmonik Şema Analizi',

    // Add Song
    addSongTitle: 'Şarkı Ekle & Ayrıştır',
    pasteFormatNotice: 'ChordPro (.cho) veya Söz Üstü Akor Metnini Buraya Yapıştırın:',
    pastePlaceholder: 'Örnek ChordPro:\n{title: Elfida}\n{artist: Haluk Levent}\n{key: Am}\n\n[Verse]\n[Am] Yüzün [Dm] geçmişe dönük\n[G] Gözlerin [C] dolu',
    parseButton: 'Ayrıştır ve Önizle',
    saveSongButton: 'Şarkıyı Kaydet & Kartları Oluştur',
    autoDetectedKey: 'Otomatik Tespit Edilen Ton',
    parsedSectionsCount: 'Ayrıştırılan Bölüm Sayısı',

    // Transition Drill
    drillTitle: 'Akor Geçiş Matrisi & Tatbikat',
    drillSubtitle: 'Motor/Prosedürel bellek geliştirme - 60 saniyelik zamanlı geçiş antrenmanı.',
    weakestTransitions: 'En Zayıf Akor Geçişleri',
    startDrill: '60s Tatbikatı Başlat',
    transitionsPerMin: 'Geçiş / Dakika',
    cleanPasses: 'Temiz Basış',
    drillInstructions: 'İki akor arasında sürekli geçiş yapın ve gitarla temiz ses elde ettikçe ritme uyun.',

    // Stats
    statsTitle: 'Hafıza & Kalibrasyon İstatistikleri',
    retentionRate: 'Hedef Tutma Oranı',
    forgettingCurve: 'FSRS Unutma Eğrisi (R = (1 + F*t/S)^-0.5)',
    calibrationAlert: 'Kalibrasyon Uyarısı',
    calibrationMsg: 'Dikkat! Bazı bölümleri "Kolay" derecelendiriyorsunuz ancak son geçiş tatbikatı hızınız düşüyor.',

    // Settings
    settingsTitle: 'Uygulama Ayarları',
    sessionLength: 'Günlük Seans Süresi (dk)',
    desiredRetentionTarget: 'Hedef Tutma Oranı (Desired Retention)',
    maxNewCards: 'Maks. Günlük Yeni Kart Limiti',
    maxReviews: 'Maks. Günlük Tekrar Limiti',
    metronomeSoundLabel: 'Metronom Sesi',
    pedalModeLabel: 'Bluetooth Pedalı / Klavyeli Hands-Free',
    pedalModeDesc: 'Boşluk (Space) tuşu ile cevabı göster, 1-4 tuşları ile derecelendir.',
    backupExport: 'Veritabanını JSON Olarak Dışa Aktar',
    backupImport: 'JSON Veritabanını İçeri Aktar',
    languageLabel: 'Arayüz Dili',
    saveSettingsBtn: 'Ayarları Kaydet',

    // Common
    cancel: 'İptal',
    close: 'Kapat',
    success: 'İşlem Başarılı',
    error: 'Hata Oluştu',
  },
  en: {
    appName: 'Chord Memory',
    tagline: 'Chord Progressions Spaced Repetition Coach',
    
    // Navigation
    navToday: 'Today',
    navSession: 'Session',
    navRepertoire: 'Repertoire',
    navDrill: 'Drills',
    navStats: 'Stats',
    navSettings: 'Settings',

    // Today / Dashboard
    todayTitle: 'Today\'s Session',
    startSession: 'Start Session (20 min)',
    dueQueue: 'Due Review Cards',
    newCards: 'New Sections',
    reviewCards: 'Reviews',
    streakDays: 'Daily Streak',
    daysUnit: 'days',
    workloadForecast: 'Daily Review Workload',
    quickStartDrill: 'Quick Transition Drill',
    repertoireMaturity: 'Repertoire Maturity',
    noDueCards: 'All reviews completed for today! You can add a new song or run a transition drill.',
    readyToStudy: 'Get your guitar ready. The session consists of 5 stages: Warmup, Reviews, New Material, Performance, Summary.',

    // Session Screen
    sessionPhaseWarmup: 'Stage 1: Warmup (60s Transition Drill)',
    sessionPhaseReview: 'Stage 2: Spaced Repetition (FSRS)',
    sessionPhaseNew: 'Stage 3: New Material (Roman Analysis)',
    sessionPhasePerf: 'Stage 4: Full Song Performance',
    sessionPhaseDone: 'Stage 5: Session Completed',

    cueLevel: 'Cue Level',
    cueLevel0: 'L0: Chords + Lyrics + Diagrams',
    cueLevel1: 'L1: Chords Above Lyrics',
    cueLevel2: 'L2: First Letter Only',
    cueLevel3: 'L3: Roman Numerals Degree',
    cueLevel4: 'L4: Lyrics Only Line',
    cueLevel5: 'L5: Audio/Zero Visual Cues',

    revealAnswer: 'Reveal Answer (After Playing on Guitar)',
    playingGuitar: 'Play the chord sequence on your guitar...',
    evaluatePerformance: 'Rate Retrieval Difficulty:',

    gradeAgain: 'Again',
    gradeAgainSub: 'Forgot / Mistake',
    gradeHard: 'Hard',
    gradeHardSub: 'Recalled with hesitation',
    gradeGood: 'Good',
    gradeGoodSub: 'Played with correct timing',
    gradeEasy: 'Easy',
    gradeEasySub: 'Effortless recall',

    showRoman: 'Show Roman Numerals',
    showChords: 'Show Absolute Chords',
    toggleMetronome: 'Toggle Metronome',

    // Repertoire
    repertoireTitle: 'My Repertoire',
    addSong: 'Add New Song',
    searchSong: 'Search song or artist...',
    filterAll: 'All',
    filterTurkish: 'Turkish',
    filterEnglish: 'English',
    filterMature: 'Mature',
    filterLearning: 'Learning',
    songsCount: 'songs',
    keyLabel: 'Key',
    capoLabel: 'Capo',
    bpmLabel: 'BPM',
    maturityLabel: 'Maturity',
    lastPlayed: 'Last Played',
    neverPlayed: 'Never studied',

    // Song Detail
    songDetailTitle: 'Song Details',
    startSongPractice: 'Practice This Song Now',
    sectionsHeader: 'Learning Sections (Chunking)',
    transposeCalculator: 'Transpose & Capo Calculator',
    originalKey: 'Original Key',
    currentKey: 'Current Key',
    capoPosition: 'Capo Position',
    romanAnalysisHeader: 'Harmonic Schema Analysis',

    // Add Song
    addSongTitle: 'Add & Parse Song',
    pasteFormatNotice: 'Paste ChordPro (.cho) or Plain Text Chord Sheet Here:',
    pastePlaceholder: 'Example ChordPro:\n{title: Dust in the Wind}\n{artist: Kansas}\n{key: C}\n\n[Verse]\n[C] I close my [G/B] eyes [Am] only for a moment',
    parseButton: 'Parse and Preview',
    saveSongButton: 'Save Song & Generate Cards',
    autoDetectedKey: 'Auto-Detected Key',
    parsedSectionsCount: 'Parsed Sections Count',

    // Transition Drill
    drillTitle: 'Chord Transition Matrix & Drill',
    drillSubtitle: 'Motor/Procedural skill practice - 60-second timed transition drill.',
    weakestTransitions: 'Weakest Chord Transitions',
    startDrill: 'Start 60s Drill',
    transitionsPerMin: 'Transitions / Min',
    cleanPasses: 'Clean Passes',
    drillInstructions: 'Continuously switch between the two chords on your guitar in rhythm.',

    // Stats
    statsTitle: 'Memory & Calibration Statistics',
    retentionRate: 'Target Retention Rate',
    forgettingCurve: 'FSRS Forgetting Curve (R = (1 + F*t/S)^-0.5)',
    calibrationAlert: 'Calibration Alert',
    calibrationMsg: 'Warning! You rate some sections as "Easy" but your transition drill speed is decreasing.',

    // Settings
    settingsTitle: 'App Settings',
    sessionLength: 'Daily Session Length (min)',
    desiredRetentionTarget: 'Desired Retention Target',
    maxNewCards: 'Max New Cards Per Day',
    maxReviews: 'Max Reviews Per Day',
    metronomeSoundLabel: 'Metronome Sound',
    pedalModeLabel: 'Bluetooth Pedal / Keyboard Hands-Free',
    pedalModeDesc: 'Press Space to reveal answer, 1-4 keys to rate.',
    backupExport: 'Export Database as JSON',
    backupImport: 'Import JSON Database',
    languageLabel: 'Interface Language',
    saveSettingsBtn: 'Save Settings',

    // Common
    cancel: 'Cancel',
    close: 'Close',
    success: 'Operation Successful',
    error: 'Error Occurred',
  }
};

export function getTranslation(lang: Language) {
  return TRANSLATIONS[lang] || TRANSLATIONS.tr;
}
