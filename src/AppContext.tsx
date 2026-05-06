import React, { createContext, useContext, useState, useEffect, useLayoutEffect } from 'react';
import { UserPreferences, FinancialTransaction, AppNotification } from './lib/utils';
import i18n from './i18n';
import { getTelegramUser } from './lib/telegram';

interface AppContextType {
  preferences: UserPreferences;
  setPreferences: (prefs: UserPreferences) => void;
  security: {
    biometric: boolean;
    twoFactor: boolean;
    anomaly: boolean;
  };
  setSecurity: React.Dispatch<React.SetStateAction<{
    biometric: boolean;
    twoFactor: boolean;
    anomaly: boolean;
  }>>;
  isPrivacyMode: boolean;
  togglePrivacyMode: () => void;
  showAd: boolean;
  setShowAd: (show: boolean) => void;
  transactions: FinancialTransaction[];
  addTransaction: (transaction: Omit<FinancialTransaction, 'id' | 'timestamp'>) => void;
  notifications: AppNotification[];
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  incrementAIUsage: () => void;
  incrementPhotoUsage: () => void;
  grantBonusUses: (kind: 'ai' | 'photo', n: number) => void;
  resetAllData: () => void;
  tgUser: { firstName: string; lastName?: string; username?: string; photoUrl?: string; languageCode?: string; id?: number } | null;
  isLoading: boolean;
}

export const PHOTO_QUOTA_LIMIT = 10;

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    // v2 prefix forces a clean reset for users who used the demo build.
    localStorage.removeItem('zen_prefs');
    const saved = localStorage.getItem('zen_prefs_v2');
    const defaults: UserPreferences = {
      language: 'en',
      theme: 'dark',
      baseCurrency: 'RUB',
      privacyMode: false,
      aiUsageCount: 0,
      photoUsageCount: 0,
      onboardingComplete: false,
      tier: 'free',
      soundSettings: {
        enabled: true,
        income: true,
        expense: true,
        payment: true,
        system: true
      },
      customSounds: {
        income: '',
        expense: '',
        payment: '',
        system: ''
      },
      dashboardStats: {
        showIncome: true,
        showOutgoing: true,
        showNetFlow: true,
        showAvg: true,
        showChart: true,
        showActivity: true,
        showAccounts: true,
        showBalance: true,
      }
    };
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure dashboardStats exists for backward compatibility
        return {
          ...defaults,
          ...parsed,
          dashboardStats: {
            ...defaults.dashboardStats,
            ...(parsed.dashboardStats || {})
          }
        };
      } catch (e) {
        return defaults;
      }
    }
    return defaults;
  });

  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => {
    const saved = localStorage.getItem('zen_tx_v2');
    if (!saved) return [];
    try { return JSON.parse(saved); } catch { return []; }
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const [security, setSecurity] = useState({
    biometric: true,
    twoFactor: false,
    anomaly: true
  });
  const [showAd, setShowAd] = useState(true);

  const [isLoading, setIsLoading] = useState(true);

  // useLayoutEffect ensures the theme change is applied BEFORE the browser paints
  useLayoutEffect(() => {
    localStorage.setItem('zen_prefs_v2', JSON.stringify(preferences));
    const dark = preferences.theme === 'dark';
    const bg = dark ? '#050505' : '#fafafa';
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.style.colorScheme = preferences.theme;
    document.documentElement.style.backgroundColor = bg;
    document.body.style.backgroundColor = bg;
    // Telegram WebApp owns the surrounding chrome — sync it too so users
    // see the change immediately, not just inside our React tree.
    const tg = (typeof window !== 'undefined' ? window.Telegram?.WebApp : null);
    try {
      tg?.setBackgroundColor?.(bg);
      tg?.setHeaderColor?.(bg);
    } catch { /* old Telegram clients */ }
  }, [preferences.theme, preferences]);

  useEffect(() => {
    localStorage.setItem('zen_tx_v2', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    i18n.changeLanguage(preferences.language);
  }, [preferences.language]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const togglePrivacyMode = () => {
    setPreferences(prev => ({ ...prev, privacyMode: !prev.privacyMode }));
  };

  const addTransaction = (transaction: Omit<FinancialTransaction, 'id' | 'timestamp'>) => {
    const newTransaction: FinancialTransaction = {
      ...transaction,
      currency: transaction.currency || preferences.baseCurrency,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString()
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const incrementAIUsage = () => {
    setPreferences(prev => ({ ...prev, aiUsageCount: (prev.aiUsageCount || 0) + 1 }));
  };

  const incrementPhotoUsage = () => {
    setPreferences(prev => ({ ...prev, photoUsageCount: (prev.photoUsageCount || 0) + 1 }));
  };

  const grantBonusUses = (kind: 'ai' | 'photo', n: number) => {
    setPreferences(prev => {
      const key = kind === 'ai' ? 'aiUsageCount' : 'photoUsageCount';
      return { ...prev, [key]: Math.max(0, (prev[key] || 0) - n) };
    });
  };

  const resetAllData = () => {
    localStorage.removeItem('zen_prefs');
    localStorage.removeItem('zen_prefs_v2');
    localStorage.removeItem('zen_tx_v2');
    localStorage.removeItem('zen_anon_id');
    location.reload();
  };

  const tgUserRaw = getTelegramUser();
  const tgUser = tgUserRaw ? {
    firstName: tgUserRaw.first_name || 'Friend',
    lastName: tgUserRaw.last_name,
    username: tgUserRaw.username,
    photoUrl: tgUserRaw.photo_url,
    languageCode: tgUserRaw.language_code,
    id: tgUserRaw.id,
  } : null;

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <AppContext.Provider value={{
      preferences,
      setPreferences,
      security,
      setSecurity,
      isPrivacyMode: preferences.privacyMode,
      togglePrivacyMode,
      showAd,
      setShowAd,
      transactions,
      addTransaction,
      notifications,
      removeNotification,
      clearAllNotifications,
      incrementAIUsage,
      incrementPhotoUsage,
      grantBonusUses,
      resetAllData,
      tgUser,
      isLoading
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
