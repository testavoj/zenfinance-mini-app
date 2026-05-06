import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Languages,
  Coins,
  Sun,
  Moon,
  EyeOff,
  Eye,
  Crown,
  Trash2,
  Check,
  ShieldCheck,
  Volume2,
  FileText,
  ChevronDown,
  Fingerprint,
  Bell,
  Activity,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../AppContext';
import { cn } from '../lib/utils';
import { getTelegram } from '../lib/telegram';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'am', name: 'Հայերեն', flag: '🇦🇲' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', name: 'العربية', flag: '🇦🇪' },
];

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
  { code: 'AMD', name: 'Armenian Dram', symbol: '֏' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
];

const LEGAL = {
  tos: { title: 'Terms of Service', body: 'By using ZenFinance you agree to use it as a personal finance tool. Data lives on your device unless you opt-in to sync. You are responsible for the accuracy of the entries you log.' },
  privacy: { title: 'Privacy Policy', body: 'ZenFinance does not collect personal data. Photos you scan are sent only to Google\'s Gemini API (per their terms) and are not stored by us. AI chat messages are sent to Gemini for the response and discarded.' },
  ccpa: { title: 'CCPA Notice', body: 'California residents may request deletion of personal data. Since data is stored locally on your device, use Settings → Reset all data to delete everything.' },
  gdpr: { title: 'GDPR Notice', body: 'EU users: this app stores data locally. There is no remote profile to delete. Reset all data wipes everything from this device.' },
};

export default function Settings() {
  const { t } = useTranslation();
  const { preferences, setPreferences, security, setSecurity, isPrivacyMode, togglePrivacyMode, resetAllData } = useApp();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [legalKey, setLegalKey] = useState<keyof typeof LEGAL | null>(null);

  const set = <K extends keyof typeof preferences>(key: K, val: typeof preferences[K]) =>
    setPreferences({ ...preferences, [key]: val });

  const onReset = () => {
    const tg = getTelegram();
    const msg = 'Reset everything? All your transactions, settings, and quotas on this device will be erased.';
    if (tg?.showConfirm) {
      tg.showConfirm(msg, ok => { if (ok) resetAllData(); });
    } else if (window.confirm(msg)) {
      resetAllData();
    }
  };

  const onUpgrade = () => {
    const tg = getTelegram();
    const msg = 'Premium plans are coming soon. For now, you can watch ads to refill your AI and photo quotas.';
    if (tg?.showAlert) tg.showAlert(msg);
    else alert(msg);
  };

  return (
    <div className="max-w-md mx-auto pb-12 space-y-5">
      <header className="space-y-1 px-1">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">{t('settings')}</h2>
        <p className="text-sm text-zinc-500">Tweak your preferences below.</p>
      </header>

      {/* Language */}
      <Section icon={Languages} title="Language">
        <div className="grid grid-cols-4 gap-2">
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => set('language', l.code)}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-xl border transition-all text-[10px] font-bold",
                preferences.language === l.code
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "bg-white dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:border-indigo-500/40"
              )}
            >
              <span className="text-lg leading-none">{l.flag}</span>
              <span className="truncate w-full text-center">{l.name}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* Currency */}
      <Section icon={Coins} title="Currency">
        <div className="space-y-1.5">
          {CURRENCIES.map(c => (
            <button
              key={c.code}
              onClick={() => set('baseCurrency', c.code)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all",
                preferences.baseCurrency === c.code
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "bg-white dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:border-indigo-500/40"
              )}
            >
              <span className="flex items-center gap-3">
                <span className="font-mono text-base w-5">{c.symbol}</span>
                <span className="text-sm font-semibold">{c.code}</span>
                <span className="text-xs opacity-70">{c.name}</span>
              </span>
              {preferences.baseCurrency === c.code && <Check size={14} />}
            </button>
          ))}
        </div>
      </Section>

      {/* Toggles */}
      <Section icon={ShieldCheck} title="Display & Privacy">
        <Toggle
          label="Dark mode"
          icon={preferences.theme === 'dark' ? Moon : Sun}
          on={preferences.theme === 'dark'}
          onChange={v => set('theme', v ? 'dark' : 'light')}
        />
        <Toggle
          label="Privacy mode (hide amounts)"
          icon={isPrivacyMode ? EyeOff : Eye}
          on={isPrivacyMode}
          onChange={() => togglePrivacyMode()}
        />
      </Section>

      {/* Plan */}
      <Section icon={Crown} title="Plan">
        <div className="flex items-center justify-between p-3 rounded-xl border-2 border-indigo-600 bg-indigo-600/5 mb-2">
          <div>
            <p className="text-sm font-bold text-zinc-900 dark:text-white">Free tier</p>
            <p className="text-xs text-zinc-500">10 photos · 10 AI chats · ads · refill via watching ads</p>
          </div>
          <Check className="text-indigo-600" size={18} />
        </div>
        <button
          onClick={onUpgrade}
          className="w-full flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors"
        >
          <div className="flex items-center gap-2 text-left">
            <Crown size={16} className="text-amber-500" />
            <div>
              <p className="text-sm font-bold text-zinc-900 dark:text-white">Premium</p>
              <p className="text-xs text-zinc-500">Unlimited · no ads</p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Coming soon</span>
        </button>
      </Section>

      {/* Sound — collapsible */}
      <Collapsible
        icon={Volume2}
        title="Sound"
        open={openSection === 'sound'}
        onToggle={() => setOpenSection(openSection === 'sound' ? null : 'sound')}
      >
        <Toggle
          label="All sounds"
          icon={Volume2}
          on={preferences.soundSettings.enabled}
          onChange={v => set('soundSettings', { ...preferences.soundSettings, enabled: v })}
        />
        <Toggle
          label="On income"
          icon={Activity}
          on={preferences.soundSettings.income}
          onChange={v => set('soundSettings', { ...preferences.soundSettings, income: v })}
        />
        <Toggle
          label="On expense"
          icon={Activity}
          on={preferences.soundSettings.expense}
          onChange={v => set('soundSettings', { ...preferences.soundSettings, expense: v })}
        />
        <Toggle
          label="System tones"
          icon={Bell}
          on={preferences.soundSettings.system}
          onChange={v => set('soundSettings', { ...preferences.soundSettings, system: v })}
        />
      </Collapsible>

      {/* Security — collapsible */}
      <Collapsible
        icon={Fingerprint}
        title="Security"
        open={openSection === 'security'}
        onToggle={() => setOpenSection(openSection === 'security' ? null : 'security')}
      >
        <Toggle
          label="Biometric (device-managed)"
          icon={Fingerprint}
          on={security.biometric}
          onChange={v => setSecurity(s => ({ ...s, biometric: v }))}
        />
        <Toggle
          label="Two-factor reminders"
          icon={ShieldCheck}
          on={security.twoFactor}
          onChange={v => setSecurity(s => ({ ...s, twoFactor: v }))}
        />
        <Toggle
          label="Anomaly alerts"
          icon={Bell}
          on={security.anomaly}
          onChange={v => setSecurity(s => ({ ...s, anomaly: v }))}
        />
      </Collapsible>

      {/* Legal — collapsible */}
      <Collapsible
        icon={FileText}
        title="Legal & compliance"
        open={openSection === 'legal'}
        onToggle={() => setOpenSection(openSection === 'legal' ? null : 'legal')}
      >
        {(Object.keys(LEGAL) as Array<keyof typeof LEGAL>).map(key => (
          <button
            key={key}
            onClick={() => setLegalKey(legalKey === key ? null : key)}
            className="w-full text-left p-3 rounded-xl bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors"
          >
            <p className="text-sm font-bold text-zinc-900 dark:text-white">{LEGAL[key].title}</p>
            {legalKey === key && (
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">{LEGAL[key].body}</p>
            )}
          </button>
        ))}
      </Collapsible>

      {/* Danger zone */}
      <Section icon={Trash2} title="Danger zone" tone="danger">
        <button
          onClick={onReset}
          className="w-full flex items-center justify-between p-3 rounded-xl border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 transition-colors"
        >
          <div className="text-left">
            <p className="text-sm font-bold">Reset all data</p>
            <p className="text-xs opacity-80">Erase transactions, settings, and quotas on this device.</p>
          </div>
          <Trash2 size={16} />
        </button>
      </Section>
    </div>
  );
}

function Section({
  icon: Icon, title, tone = 'default', children,
}: { icon: any; title: string; tone?: 'default' | 'danger'; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 space-y-3"
    >
      <div className={cn(
        "flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest",
        tone === 'danger' ? "text-rose-500" : "text-zinc-500"
      )}>
        <Icon size={12} />
        {title}
      </div>
      {children}
    </motion.section>
  );
}

function Collapsible({
  icon: Icon, title, open, onToggle, children,
}: { icon: any; title: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors"
      >
        <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          <Icon size={12} />
          {title}
        </span>
        <ChevronDown size={14} className={cn("text-zinc-400 transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 space-y-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

function Toggle({ label, icon: Icon, on, onChange }: { label: string; icon: any; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors"
    >
      <span className="flex items-center gap-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-200">
        <Icon size={16} className="text-zinc-500" />
        {label}
      </span>
      <span className={cn(
        "w-9 h-5 rounded-full relative transition-colors",
        on ? "bg-indigo-600" : "bg-zinc-300 dark:bg-zinc-700"
      )}>
        <span className={cn(
          "absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all",
          on ? "left-[18px]" : "left-0.5"
        )} />
      </span>
    </button>
  );
}
