import React, { createContext, useContext, useState, useEffect, useLayoutEffect } from 'react';
import { UserPreferences, FinancialTransaction, AppNotification } from './lib/utils';
import i18n from './i18n';
import { MOCK_TRANSACTIONS } from './lib/mockData';

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
  isLoading: boolean;
}

export const PHOTO_QUOTA_LIMIT = 10;

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('zen_prefs');
    const defaults: UserPreferences = {
      language: 'en',
      theme: 'dark',
      baseCurrency: 'RUB',
      privacyMode: false,
      aiUsageCount: 0,
      photoUsageCount: 0,
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

  const [transactions, setTransactions] = useState<FinancialTransaction[]>(MOCK_TRANSACTIONS as FinancialTransaction[]);

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: '1',
      title: 'New Login Detected',
      message: 'A new device signed into your account from Yerevan, Armenia.',
      type: 'security',
      timestamp: new Date().toISOString(),
      read: false
    },
    {
      id: '2',
      title: 'Budget Alert',
      message: "You've reached 80% of your Food budget for April.",
      type: 'budget',
      timestamp: new Date().toISOString(),
      read: false
    }
  ]);

  const [security, setSecurity] = useState({
    biometric: true,
    twoFactor: false,
    anomaly: true
  });
  const [showAd, setShowAd] = useState(true);

  const [isLoading, setIsLoading] = useState(true);

  // useLayoutEffect ensures the theme change is applied BEFORE the browser paints
  useLayoutEffect(() => {
    localStorage.setItem('zen_prefs', JSON.stringify(preferences));
    document.documentElement.classList.toggle('dark', preferences.theme === 'dark');
    document.documentElement.style.colorScheme = preferences.theme;
  }, [preferences]);

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
