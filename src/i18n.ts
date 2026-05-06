import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      dashboard: 'Dashboard',
      accounts: 'Accounts',
      budget: 'Budget',
      ai: 'AI Assistant',
      settings: 'Settings',
      quickLog: 'Quick Log',
      totalBalance: 'Total Balance',
      burnRate: 'Burn Rate',
      savingsRate: 'Savings Rate',
      addTransaction: 'Add Transaction',
      expense: 'Expense',
      income: 'Income',
      login: 'Secure Login',
      privacyMode: 'Privacy Mode',
    }
  },
  am: {
    translation: {
      dashboard: 'Գլխավոր',
      accounts: 'Հաշիվներ',
      budget: 'Բյուջե',
      ai: 'AI Օգնական',
      settings: 'Կարգավորումներ',
      quickLog: 'Արագ մուտք',
      totalBalance: 'Ընդհանուր հաշվեկշիռ',
      burnRate: 'Ծախսերի մակարդակ',
      savingsRate: 'Խնայողության մակարդակ',
    }
  },
  ru: {
    translation: {
      dashboard: 'Дашборд',
      accounts: 'Счета',
      budget: 'Бюджет',
      ai: 'AI Ассистент',
      settings: 'Настройки',
      quickLog: 'Быстрая запись',
      totalBalance: 'Общий баланс',
      burnRate: 'Скорость трат',
    }
  },
  es: {
    translation: {
      dashboard: 'Panel',
      accounts: 'Cuentas',
      budget: 'Presupuesto',
      ai: 'Asistente IA',
      settings: 'Ajustes',
    }
  },
  pt: {
    translation: {
      dashboard: 'Painel',
      accounts: 'Contas',
      budget: 'Orçamento',
      ai: 'Assistente IA',
    }
  },
  ar: {
    translation: {
      dashboard: 'لوحة القيادة',
      accounts: 'الحسابات',
      budget: 'الميزانية',
      ai: 'مساعد الذكاء الاصطناعي',
      settings: 'الإعدادات',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
