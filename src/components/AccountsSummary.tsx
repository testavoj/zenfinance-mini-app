import React from 'react';
import { CreditCard, PlusCircle } from 'lucide-react';
import { useApp } from '../AppContext';
import { formatCurrency } from '../lib/utils';

export default function AccountsSummary({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const { isPrivacyMode, transactions, preferences } = useApp();

  const balance = transactions.reduce(
    (acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount),
    0
  );

  return (
    <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-[3rem] p-8 space-y-6 shadow-sm dark:shadow-none">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <CreditCard size={20} className="text-indigo-600" />
          Wallet
        </h3>
      </div>

      {transactions.length === 0 ? (
        <div className="py-6 text-center space-y-3">
          <p className="text-sm font-bold text-zinc-900 dark:text-white">No transactions yet</p>
          <p className="text-xs text-zinc-500">
            Tap Quick Log below to add income, expenses, or scan a receipt photo.
          </p>
        </div>
      ) : (
        <div className="text-center py-2">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Net balance</p>
          <p className="text-3xl font-bold tabular-nums tracking-tighter mt-1 text-zinc-900 dark:text-white">
            {isPrivacyMode ? '••••' : formatCurrency(balance, preferences.baseCurrency)}
          </p>
          <p className="text-[10px] text-zinc-500 mt-1">{transactions.length} entries logged</p>
        </div>
      )}

      <button
        onClick={() => onNavigate?.('quick-log')}
        className="w-full py-4 border-2 border-dashed border-zinc-200 dark:border-white/10 rounded-2xl text-zinc-400 font-bold text-xs hover:border-indigo-600/30 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 group"
      >
        <PlusCircle size={14} />
        Add transaction
      </button>
    </div>
  );
}
