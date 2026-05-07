import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCurrencySymbol(currency: string = 'USD', locale: string = 'en-US'): string {
  if (currency === 'AMD') return '֏';
  if (currency === 'RUB') return '₽';
  if (currency === 'BRL') return 'R$';

  try {
    const parts = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).formatToParts(0);
    const symbolPart = parts.find(part => part.type === 'currency');
    return symbolPart ? symbolPart.value : '$';
  } catch (e) {
    return '$';
  }
}

export function formatCurrency(amount: number, currency: string = 'USD', locale: string = 'en-US') {
  // Special handling for Ruble to ensure the symbol ₽ is used
  if (currency === 'RUB') {
    const formatted = new Intl.NumberFormat('ru-RU', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    return `${formatted} ₽`;
  }

  // Special handling for Armenian Dram to ensure the symbol ֏ is used
  if (currency === 'AMD') {
    const formatted = new Intl.NumberFormat('hy-AM', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    return `${formatted} ֏`;
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export type FinancialCategory = 
  | 'Food' | 'Transport' | 'Housing' | 'Entertainment' 
  | 'Health' | 'Tech' | 'Shopping' | 'Travel' | 'Salary' | 'Other';

export interface FinancialTransaction {
  id: string;
  amount: number;
  category: FinancialCategory;
  type: 'income' | 'expense';
  description: string;
  timestamp: string;
  currency?: string;
}

export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark';
  baseCurrency: string;
  privacyMode: boolean;
  dashboardStats: {
    showIncome: boolean;
    showOutgoing: boolean;
    showNetFlow: boolean;
    showAvg: boolean;
    showChart: boolean;
    showActivity: boolean;
    showAccounts: boolean;
    showBalance: boolean;
  };
  aiUsageCount: number;
  photoUsageCount: number;
  onboardingComplete: boolean;
  tier: 'free' | 'premium';
  soundSettings: {
    enabled: boolean;
    income: boolean;
    expense: boolean;
    payment: boolean;
    system: boolean;
  };
  customSounds: {
    income?: string;
    expense?: string;
    payment?: string;
    system?: string;
  };
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'security' | 'wallet' | 'system' | 'budget';
  timestamp: string;
  read: boolean;
}
