import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Languages, Coins, Sparkles, ArrowRight, Crown, Check } from 'lucide-react';
import { useApp } from '../AppContext';
import { cn } from '../lib/utils';

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

export default function Onboarding() {
  const { t, i18n } = useTranslation();
  const { preferences, setPreferences, tgUser } = useApp();
  const [language, setLanguage] = useState(preferences.language || 'en');
  const [currency, setCurrency] = useState(preferences.baseCurrency || 'USD');

  // Switch the i18next language LIVE as the user picks a flag in onboarding,
  // so the rest of the screen (labels, button) re-renders in that language
  // before they tap "Get started".
  React.useEffect(() => { i18n.changeLanguage(language); }, [language, i18n]);

  const finish = () => {
    setPreferences({
      ...preferences,
      language,
      baseCurrency: currency,
      onboardingComplete: true,
      tier: 'free',
    });
  };

  const greeting = tgUser?.firstName ? t('welcome', { name: tgUser.firstName }) : t('welcomeAnon', 'Welcome!');

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] text-zinc-900 dark:text-white p-4 sm:p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex w-14 h-14 bg-indigo-600 rounded-2xl items-center justify-center text-white shadow-[0_0_30px_rgba(79,70,229,0.4)]">
            <Sparkles size={28} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{greeting}</h1>
          <p className="text-sm text-zinc-500">{t('setupTagline')}</p>
        </div>

        {/* Language */}
        <section className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
            <Languages size={12} /> {t('language')}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-xl border transition-all text-[10px] font-bold",
                  language === l.code
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "bg-white dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:border-indigo-500/40"
                )}
              >
                <span className="text-lg leading-none">{l.flag}</span>
                <span className="truncate w-full text-center">{l.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Currency */}
        <section className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
            <Coins size={12} /> {t('baseCurrency')}
          </label>
          <div className="grid grid-cols-1 gap-1.5">
            {CURRENCIES.map(c => (
              <button
                key={c.code}
                onClick={() => setCurrency(c.code)}
                className={cn(
                  "flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all",
                  currency === c.code
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "bg-white dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:border-indigo-500/40"
                )}
              >
                <span className="flex items-center gap-3">
                  <span className="font-mono text-base w-5">{c.symbol}</span>
                  <span className="text-sm font-semibold">{c.code}</span>
                  <span className="text-xs opacity-70">{c.name}</span>
                </span>
                {currency === c.code && <Check size={14} />}
              </button>
            ))}
          </div>
        </section>

        {/* Tier */}
        <section className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{t('plan')}</label>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-4 rounded-xl border-2 border-indigo-600 bg-indigo-600/5">
              <div>
                <p className="text-sm font-bold">{t('free')}</p>
                <p className="text-xs text-zinc-500">{t('freeTierDesc')}</p>
              </div>
              <Check className="text-indigo-600" size={18} />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 opacity-70">
              <div className="flex items-center gap-2">
                <Crown size={16} className="text-amber-500" />
                <div>
                  <p className="text-sm font-bold">{t('premium')}</p>
                  <p className="text-xs text-zinc-500">{t('premiumDesc')}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{t('comingSoon')}</span>
            </div>
          </div>
        </section>

        <button
          onClick={finish}
          className="w-full py-4 bg-indigo-600 rounded-2xl font-bold text-white flex items-center justify-center gap-2 hover:bg-indigo-500 shadow-xl transition-all"
        >
          {t('getStarted')} <ArrowRight size={18} />
        </button>
      </motion.div>
    </div>
  );
}
