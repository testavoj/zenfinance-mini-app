import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  CreditCard, 
  Building2, 
  Coins, 
  LineChart, 
  ArrowRight,
} from 'lucide-react';
import { MOCK_ACCOUNTS } from '../lib/mockData';
import { formatCurrency, cn } from '../lib/utils';
import { useApp } from '../AppContext';

export default function AccountsSummary({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const { t } = useTranslation();
  const { isPrivacyMode } = useApp();

  const getIcon = (type: string) => {
    switch (type) {
      case 'bank': return Building2;
      case 'credit': return CreditCard;
      case 'crypto': return Coins;
      case 'investment': return LineChart;
      default: return Building2;
    }
  };

  return (
    <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-[3rem] p-8 space-y-6 shadow-sm dark:shadow-none">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <CreditCard size={20} className="text-indigo-600" />
          Nodes
        </h3>
        <button className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-600/10 px-3 py-1 rounded-full uppercase tracking-widest">
          {MOCK_ACCOUNTS.length} Active
        </button>
      </div>

      <div className="space-y-4">
        {MOCK_ACCOUNTS.slice(0, 3).map((acc) => {
          const Icon = getIcon(acc.type);
          return (
            <div 
              key={acc.id}
              className="flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 bg-zinc-100 dark:bg-white/5 rounded-xl flex items-center justify-center text-zinc-500 dark:text-zinc-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
                  <Icon size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{acc.name}</p>
                  <p className="text-[10px] text-zinc-500 font-medium truncate">{acc.institution}</p>
                </div>
              </div>
              <div className="text-right ml-4 shrink-0">
                <p className="text-sm font-bold tabular-nums tracking-tighter">
                  {isPrivacyMode ? '••••' : formatCurrency(acc.balance, acc.currency)}
                </p>
                <div className="flex items-center justify-end gap-1">
                   <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                   <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Live</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button 
        onClick={() => onNavigate?.('accounts')}
        className="w-full py-4 border-2 border-dashed border-zinc-200 dark:border-white/10 rounded-2xl text-zinc-400 font-bold text-xs hover:border-indigo-600/30 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 group"
      >
        All Accounts
        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
