/**
 * Akor Belleği - Main Application Entry Point
 */

import React, { useState, useEffect } from 'react';
import {
  AppSettings,
  Card,
  Review,
  Section,
  Session,
  Song,
  TransitionStat,
} from './types';
import {
  loadSettings,
  saveSettings,
  loadSongs,
  saveSongs,
  loadSections,
  saveSections,
  loadCards,
  saveCards,
  loadTransitions,
  saveTransitions,
  loadReviews,
  saveReviews,
  loadSessions,
  saveSessions,
  initializeStorage,
} from './lib/storage';
import { runFsrsSelfTests } from './lib/fsrs';
import { runParserSelfTests } from './lib/parser';

import { Navbar } from './components/Navbar';
import { TodayView } from './components/TodayView';
import { SessionView } from './components/SessionView';
import { RepertoireView } from './components/RepertoireView';
import { SongDetailView } from './components/SongDetailView';
import { AddSongView } from './components/AddSongView';
import { DrillView } from './components/DrillView';
import { StatsView } from './components/StatsView';
import { SettingsView } from './components/SettingsView';

export default function App() {
  // Application Data States
  const [settings, setSettings] = useState<AppSettings>(loadSettings());
  const [songs, setSongs] = useState<Song[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [transitions, setTransitions] = useState<TransitionStat[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);

  // Active Tab & Selection States
  const [currentTab, setCurrentTab] = useState<string>('today');
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);

  // Initialize Storage & Self-Tests on Mount
  useEffect(() => {
    initializeStorage();
    refreshAllData();

    // Execute unit self-tests for FSRS & Parser engines
    const fsrsTests = runFsrsSelfTests();
    console.log('FSRS Self Tests:', fsrsTests.passed ? 'PASSED' : 'FAILED', fsrsTests.logs);

    const parserTests = runParserSelfTests();
    console.log('Parser Self Tests:', parserTests.passed ? 'PASSED' : 'FAILED', parserTests.logs);
  }, []);

  const refreshAllData = () => {
    setSettings(loadSettings());
    setSongs(loadSongs());
    setSections(loadSections());
    setCards(loadCards());
    setReviews(loadReviews());
    setTransitions(loadTransitions());
    setSessions(loadSessions());
  };

  // State Updates & Persistence Wrappers
  const handleSaveCardReview = (
    originalCard: Card,
    reviewRecord: Review,
    nextCardState: Card
  ) => {
    const updatedCards = cards.map((c) =>
      c.id === originalCard.id ? nextCardState : c
    );
    setCards(updatedCards);
    saveCards(updatedCards);

    const updatedReviews = [reviewRecord, ...reviews];
    setReviews(updatedReviews);
    saveReviews(updatedReviews);
  };

  const handleSaveTransitionStat = (stat: TransitionStat) => {
    const updated = transitions.map((t) => (t.id === stat.id ? stat : t));
    if (!transitions.some((t) => t.id === stat.id)) {
      updated.push(stat);
    }
    setTransitions(updated);
    saveTransitions(updated);
  };

  const handleSaveSession = (session: Session) => {
    const updated = [session, ...sessions];
    setSessions(updated);
    saveSessions(updated);
  };

  const handleSaveNewSong = (
    newSong: Song,
    newSections: Section[],
    newCards: Card[]
  ) => {
    const updatedSongs = [newSong, ...songs];
    setSongs(updatedSongs);
    saveSongs(updatedSongs);

    const updatedSections = [...sections, ...newSections];
    setSections(updatedSections);
    saveSections(updatedSections);

    const updatedCards = [...cards, ...newCards];
    setCards(updatedCards);
    saveCards(updatedCards);

    setCurrentTab('repertoire');
  };

  const handleUpdateSong = (
    updatedSong: Song,
    updatedSections?: Section[],
    updatedCards?: Card[]
  ) => {
    const newSongs = songs.map((s) => (s.id === updatedSong.id ? updatedSong : s));
    setSongs(newSongs);
    saveSongs(newSongs);

    if (updatedSections) {
      const otherSections = sections.filter((s) => s.songId !== updatedSong.id);
      const newSectionsList = [...otherSections, ...updatedSections];
      setSections(newSectionsList);
      saveSections(newSectionsList);
    }

    if (updatedCards) {
      const otherCards = cards.filter((c) => c.songId !== updatedSong.id);
      const newCardsList = [...otherCards, ...updatedCards];
      setCards(newCardsList);
      saveCards(newCardsList);
    }
  };

  const handleDeleteSong = (songId: string) => {
    const updatedSongs = songs.filter((s) => s.id !== songId);
    setSongs(updatedSongs);
    saveSongs(updatedSongs);

    const updatedSections = sections.filter((s) => s.songId !== songId);
    setSections(updatedSections);
    saveSections(updatedSections);

    const updatedCards = cards.filter((c) => c.songId !== songId);
    setCards(updatedCards);
    saveCards(updatedCards);

    const updatedReviews = reviews.filter((r) => r.songId !== songId);
    setReviews(updatedReviews);
    saveReviews(updatedReviews);

    if (selectedSongId === songId) {
      setSelectedSongId(null);
    }
    setCurrentTab('repertoire');
  };

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Compute Streak
  const streakCount = Math.max(1, sessions.length);

  const selectedSong = songs.find((s) => s.id === selectedSongId);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-stone-100 font-sans antialiased selection:bg-[#D4AF37]/30 selection:text-[#D4AF37]">
      
      {/* Navbar Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'songDetail') setSelectedSongId(null);
        }}
        settings={settings}
        onStartSession={() => setCurrentTab('session')}
        streakCount={streakCount}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-8">
        
        {currentTab === 'today' && (
          <TodayView
            settings={settings}
            songs={songs}
            sections={sections}
            cards={cards}
            transitions={transitions}
            onStartSession={() => setCurrentTab('session')}
            onNavigateTab={(tab) => setCurrentTab(tab)}
            streakCount={streakCount}
          />
        )}

        {currentTab === 'session' && (
          <SessionView
            settings={settings}
            songs={songs}
            sections={sections}
            cards={cards}
            transitions={transitions}
            onSaveCardReview={handleSaveCardReview}
            onSaveTransitionStat={handleSaveTransitionStat}
            onSaveSession={handleSaveSession}
            onFinishSession={() => setCurrentTab('today')}
          />
        )}

        {currentTab === 'repertoire' && (
          <RepertoireView
            settings={settings}
            songs={songs}
            sections={sections}
            cards={cards}
            onSelectSong={(songId) => {
              setSelectedSongId(songId);
              setCurrentTab('songDetail');
            }}
            onAddSong={() => setCurrentTab('addSong')}
            onUpdateSong={handleUpdateSong}
            onDeleteSong={handleDeleteSong}
          />
        )}

        {currentTab === 'songDetail' && selectedSong && (
          <SongDetailView
            settings={settings}
            song={selectedSong}
            sections={sections}
            onBack={() => setCurrentTab('repertoire')}
            onStartSongPractice={(songId) => {
              setCurrentTab('session');
            }}
            onUpdateSong={handleUpdateSong}
            onDeleteSong={handleDeleteSong}
          />
        )}

        {currentTab === 'addSong' && (
          <AddSongView
            settings={settings}
            onSaveNewSong={handleSaveNewSong}
            onCancel={() => setCurrentTab('repertoire')}
          />
        )}

        {currentTab === 'drill' && (
          <DrillView
            settings={settings}
            transitions={transitions}
            onSaveTransitionStat={handleSaveTransitionStat}
          />
        )}

        {currentTab === 'stats' && (
          <StatsView
            settings={settings}
            cards={cards}
            reviews={reviews}
            sessions={sessions}
            transitions={transitions}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            settings={settings}
            onSaveSettings={handleSaveSettings}
            onRefreshDatabase={refreshAllData}
          />
        )}

      </main>

    </div>
  );
}
