/**
 * Akor Belleği - App Settings & Backup/Restore Component
 */

import React, { useState } from 'react';
import { AppSettings } from '../types';
import { getTranslation, Language } from '../lib/i18n';
import { exportDatabaseToJson, importDatabaseFromJson } from '../lib/storage';
import { Settings as SettingsIcon, Save, Download, Upload, Check, AlertCircle } from 'lucide-react';

interface SettingsViewProps {
  settings: AppSettings;
  onSaveSettings: (newSettings: AppSettings) => void;
  onRefreshDatabase: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  onRefreshDatabase,
}) => {
  const t = getTranslation(settings.language);

  const [form, setForm] = useState<AppSettings>({ ...settings });
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSave = () => {
    onSaveSettings(form);
  };

  const handleExport = () => {
    const jsonStr = exportDatabaseToJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `akor_bellegi_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const ok = importDatabaseFromJson(content);
      if (ok) {
        setImportStatus('Veritabanı başarıyla yüklendi!');
        onRefreshDatabase();
      } else {
        setImportStatus('Hata: Geçersiz JSON yedek dosyası.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-[#0F0F11] border border-[#2A2A2C] p-6 rounded-3xl space-y-2">
        <h2 className="text-2xl font-serif text-stone-100 flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-[#D4AF37]" />
          <span>{t.settingsTitle}</span>
        </h2>
        <p className="text-xs text-stone-400 font-sans">
          Çalışma süresi, FSRS zamanlama parametreleri ve yedekleme ayarları.
        </p>
      </div>

      {/* Settings Form */}
      <div className="bg-[#0F0F11] border border-[#2A2A2C] rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
        
        {/* Language Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-stone-400 uppercase tracking-widest">{t.languageLabel}</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setForm(f => ({ ...f, language: 'tr' }))}
              className={`flex-1 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-colors ${
                form.language === 'tr'
                  ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                  : 'bg-[#161618] text-stone-300 border-[#2A2A2C]'
              }`}
            >
              Türkçe (Varsayılan)
            </button>
            <button
              onClick={() => setForm(f => ({ ...f, language: 'en' }))}
              className={`flex-1 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-colors ${
                form.language === 'en'
                  ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                  : 'bg-[#161618] text-stone-300 border-[#2A2A2C]'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Session Length & Desired Retention */}
        <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-[#2A2A2C]">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-stone-400 uppercase tracking-widest">{t.sessionLength}</label>
            <input
              type="number"
              value={form.sessionLengthMinutes}
              onChange={(e) => setForm(f => ({ ...f, sessionLengthMinutes: parseInt(e.target.value, 10) || 20 }))}
              className="w-full bg-[#161618] border border-[#2A2A2C] rounded-xl px-4 py-2.5 font-mono text-sm text-stone-100 focus:outline-none focus:border-[#D4AF37]/60"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-stone-400 uppercase tracking-widest">{t.desiredRetentionTarget}</label>
            <input
              type="number"
              step="0.01"
              min="0.80"
              max="0.98"
              value={form.desiredRetention}
              onChange={(e) => setForm(f => ({ ...f, desiredRetention: parseFloat(e.target.value) || 0.90 }))}
              className="w-full bg-[#161618] border border-[#2A2A2C] rounded-xl px-4 py-2.5 font-mono text-sm text-stone-100 focus:outline-none focus:border-[#D4AF37]/60"
            />
          </div>
        </div>

        {/* Daily Limits */}
        <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-[#2A2A2C]">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-stone-400 uppercase tracking-widest">{t.maxNewCards}</label>
            <input
              type="number"
              value={form.maxNewCardsPerDay}
              onChange={(e) => setForm(f => ({ ...f, maxNewCardsPerDay: parseInt(e.target.value, 10) || 8 }))}
              className="w-full bg-[#161618] border border-[#2A2A2C] rounded-xl px-4 py-2.5 font-mono text-sm text-stone-100 focus:outline-none focus:border-[#D4AF37]/60"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-stone-400 uppercase tracking-widest">{t.maxReviews}</label>
            <input
              type="number"
              value={form.maxReviewsPerDay}
              onChange={(e) => setForm(f => ({ ...f, maxReviewsPerDay: parseInt(e.target.value, 10) || 60 }))}
              className="w-full bg-[#161618] border border-[#2A2A2C] rounded-xl px-4 py-2.5 font-mono text-sm text-stone-100 focus:outline-none focus:border-[#D4AF37]/60"
            />
          </div>
        </div>

        {/* Pedal Mode */}
        <div className="pt-4 border-t border-[#2A2A2C] space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.handsFreePedalEnabled}
              onChange={(e) => setForm(f => ({ ...f, handsFreePedalEnabled: e.target.checked }))}
              className="w-5 h-5 accent-[#D4AF37] rounded"
            />
            <span className="font-serif text-sm text-stone-200">{t.pedalModeLabel}</span>
          </label>
          <p className="text-xs text-stone-400 pl-8 font-sans">{t.pedalModeDesc}</p>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-[#D4AF37] hover:bg-[#C4A130] text-black font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all"
        >
          {t.saveSettingsBtn}
        </button>
      </div>

      {/* Backup & Export/Import Box */}
      <div className="bg-[#0F0F11] border border-[#2A2A2C] rounded-3xl p-6 md:p-8 space-y-4 shadow-xl">
        <h3 className="text-lg font-serif text-stone-100">Yedekleme & Veri Transferi</h3>
        <p className="text-xs text-stone-400 font-sans">
          Uygulama veritabanınız tamamen cihazınızda saklanır. JSON olarak dışa aktarabilir veya başka cihazdan yükleyebilirsiniz.
        </p>

        {importStatus && (
          <div className="p-3 bg-[#161618] border border-[#2A2A2C] rounded-xl text-xs text-[#D4AF37] font-semibold">
            {importStatus}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleExport}
            className="flex-1 flex items-center justify-center gap-2 bg-[#161618] hover:bg-[#1f1f22] text-stone-200 font-bold py-3 rounded-xl text-xs uppercase tracking-wider border border-[#2A2A2C] transition-colors"
          >
            <Download className="w-4 h-4 text-[#D4AF37]" />
            <span>{t.backupExport}</span>
          </button>

          <label className="flex-1 flex items-center justify-center gap-2 bg-[#161618] hover:bg-[#1f1f22] text-stone-200 font-bold py-3 rounded-xl text-xs uppercase tracking-wider border border-[#2A2A2C] transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-[#D4AF37]" />
            <span>{t.backupImport}</span>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>
      </div>

    </div>
  );
};
