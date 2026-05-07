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
  Upload,
  Play,
  X as XIcon,
} from 'lucide-react';
import { isTelegramWebApp } from '../lib/telegram';
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
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
  { code: 'AMD', name: 'Armenian Dram', symbol: '֏' },
];

export default function Settings() {
  const { t } = useTranslation();
  const { preferences, setPreferences, security, setSecurity, isPrivacyMode, togglePrivacyMode, resetAllData, setCustomSound } = useApp();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [legalKey, setLegalKey] = useState<'tos' | 'privacy' | 'ccpa' | 'gdpr' | null>(null);

  const set = <K extends keyof typeof preferences>(key: K, val: typeof preferences[K]) =>
    setPreferences({ ...preferences, [key]: val });

  const onReset = () => {
    const tg = getTelegram();
    const msg = t('resetConfirm');
    if (tg?.showConfirm) {
      tg.showConfirm(msg, ok => { if (ok) resetAllData(); });
    } else if (window.confirm(msg)) {
      resetAllData();
    }
  };

  const onUpgrade = () => {
    const tg = getTelegram();
    const msg = t('premiumComingSoon');
    if (tg?.showAlert) tg.showAlert(msg);
    else alert(msg);
  };

  return (
    <div className="max-w-md mx-auto pb-12 space-y-5">
      <header className="space-y-1 px-1">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">{t('settings')}</h2>
        <p className="text-sm text-zinc-500">{t('tweakPrefs')}</p>
      </header>

      {/* Language */}
      <Section icon={Languages} title={t('language')}>
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
      <Section icon={Coins} title={t('currency')}>
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
      <Section icon={ShieldCheck} title={t('displayPrivacy')}>
        <Toggle
          label={t('darkMode')}
          icon={preferences.theme === 'dark' ? Moon : Sun}
          on={preferences.theme === 'dark'}
          onChange={v => set('theme', v ? 'dark' : 'light')}
        />
        <Toggle
          label={t('privacyModeLabel')}
          icon={isPrivacyMode ? EyeOff : Eye}
          on={isPrivacyMode}
          onChange={() => togglePrivacyMode()}
        />
      </Section>

      {/* Plan */}
      <Section icon={Crown} title={t('plan')}>
        <div className="flex items-center justify-between p-3 rounded-xl border-2 border-indigo-600 bg-indigo-600/5 mb-2">
          <div>
            <p className="text-sm font-bold text-zinc-900 dark:text-white">{t('freeTier')}</p>
            <p className="text-xs text-zinc-500">{t('freeTierDesc')}</p>
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
              <p className="text-sm font-bold text-zinc-900 dark:text-white">{t('premium')}</p>
              <p className="text-xs text-zinc-500">{t('premiumDesc')}</p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{t('comingSoon')}</span>
        </button>
      </Section>

      {/* Sound — collapsible, with per-event custom audio upload */}
      <Collapsible
        icon={Volume2}
        title={t('sound')}
        open={openSection === 'sound'}
        onToggle={() => setOpenSection(openSection === 'sound' ? null : 'sound')}
      >
        <Toggle
          label={t('allSounds')}
          icon={Volume2}
          on={preferences.soundSettings.enabled}
          onChange={v => set('soundSettings', { ...preferences.soundSettings, enabled: v })}
        />
        {(['income', 'expense', 'payment', 'system'] as const).map(kind => (
          <React.Fragment key={kind}>
            <SoundRow
              kind={kind}
              label={t({ income: 'onIncome', expense: 'onExpense', payment: 'onPayment', system: 'systemTones' }[kind])}
              uploadLabel={t('uploadAudio')}
              replaceLabel={t('replaceAudio')}
              enabled={preferences.soundSettings[kind]}
              customUrl={preferences.customSounds?.[kind] || ''}
              onToggle={v => set('soundSettings', { ...preferences.soundSettings, [kind]: v })}
              onPick={url => setCustomSound(kind, url)}
              onClear={() => setCustomSound(kind, null)}
            />
          </React.Fragment>
        ))}
      </Collapsible>

      {/* Security — hidden inside Telegram (auth handled by Telegram itself) */}
      {!isTelegramWebApp() && (
        <Collapsible
          icon={Fingerprint}
          title={t('security')}
          open={openSection === 'security'}
          onToggle={() => setOpenSection(openSection === 'security' ? null : 'security')}
        >
          <Toggle
            label={t('biometric')}
            icon={Fingerprint}
            on={security.biometric}
            onChange={v => setSecurity(s => ({ ...s, biometric: v }))}
          />
          <Toggle
            label={t('twoFactor')}
            icon={ShieldCheck}
            on={security.twoFactor}
            onChange={v => setSecurity(s => ({ ...s, twoFactor: v }))}
          />
          <Toggle
            label={t('anomalyAlerts')}
            icon={Bell}
            on={security.anomaly}
            onChange={v => setSecurity(s => ({ ...s, anomaly: v }))}
          />
        </Collapsible>
      )}

      {/* Legal — collapsible */}
      <Collapsible
        icon={FileText}
        title={t('legal')}
        open={openSection === 'legal'}
        onToggle={() => setOpenSection(openSection === 'legal' ? null : 'legal')}
      >
        {(['tos', 'privacy', 'ccpa', 'gdpr'] as const).map(key => (
          <button
            key={key}
            onClick={() => setLegalKey(legalKey === key ? null : key)}
            className="w-full text-left p-3 rounded-xl bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors"
          >
            <p className="text-sm font-bold text-zinc-900 dark:text-white">
              {t({ tos: 'legalTos', privacy: 'legalPrivacy', ccpa: 'legalCcpa', gdpr: 'legalGdpr' }[key])}
            </p>
            {legalKey === key && (
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                {t({ tos: 'legalTosBody', privacy: 'legalPrivacyBody', ccpa: 'legalCcpaBody', gdpr: 'legalGdprBody' }[key])}
              </p>
            )}
          </button>
        ))}
      </Collapsible>

      {/* Danger zone */}
      <Section icon={Trash2} title={t('dangerZone')} tone="danger">
        <button
          onClick={onReset}
          className="w-full flex items-center justify-between p-3 rounded-xl border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 transition-colors"
        >
          <div className="text-left">
            <p className="text-sm font-bold">{t('resetAll')}</p>
            <p className="text-xs opacity-80">{t('resetAllDesc')}</p>
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

function SoundRow({
  kind, label, uploadLabel, replaceLabel, enabled, customUrl, onToggle, onPick, onClear,
}: {
  kind: 'income' | 'expense' | 'payment' | 'system';
  label: string;
  uploadLabel: string;
  replaceLabel: string;
  enabled: boolean;
  customUrl: string;
  onToggle: (v: boolean) => void;
  onPick: (dataUrl: string) => void;
  onClear: () => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 500_000) {
      alert('Sound file is too big — keep it under 500 KB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onPick(String(reader.result));
    reader.readAsDataURL(file);
  };

  const preview = () => {
    try {
      const a = new Audio(customUrl);
      a.volume = 0.5;
      a.play().catch(() => {});
    } catch { /* noop */ }
  };

  return (
    <div className="rounded-xl bg-zinc-100 dark:bg-white/5 p-2.5 space-y-2">
      <Toggle
        label={label}
        icon={kind === 'system' ? Bell : Activity}
        on={enabled}
        onChange={onToggle}
      />
      {enabled && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => inputRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white dark:bg-white/10 border border-zinc-200 dark:border-white/10 text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:border-indigo-500/40 transition-colors"
          >
            <Upload size={12} />
            {customUrl ? replaceLabel : uploadLabel}
          </button>
          {customUrl && (
            <>
              <button
                onClick={preview}
                className="p-2 rounded-lg bg-white dark:bg-white/10 border border-zinc-200 dark:border-white/10 text-zinc-600 hover:text-indigo-500 transition-colors"
                aria-label="Preview"
              >
                <Play size={12} />
              </button>
              <button
                onClick={onClear}
                className="p-2 rounded-lg bg-white dark:bg-white/10 border border-zinc-200 dark:border-white/10 text-zinc-600 hover:text-rose-500 transition-colors"
                aria-label="Reset to default"
              >
                <XIcon size={12} />
              </button>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="audio/*"
            onChange={onFile}
            className="hidden"
          />
        </div>
      )}
    </div>
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
