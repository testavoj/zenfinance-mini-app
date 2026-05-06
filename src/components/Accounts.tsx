import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Plus, 
  CreditCard, 
  Coins, 
  Building2, 
  LineChart, 
  ArrowRight,
  ExternalLink,
  Shield,
  RefreshCw,
  Power,
  Info
} from 'lucide-react';
import { MOCK_ACCOUNTS } from '../lib/mockData';
import { formatCurrency, cn } from '../lib/utils';
import { useApp } from '../AppContext';
import { motion } from 'motion/react';
import Modal from './ui/Modal';

export default function Accounts() {
  const { t } = useTranslation();
  const { isPrivacyMode, preferences } = useApp();
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const institutions = [
    { name: 'Chase Bank', icon: '🏦' },
    { name: 'Bank of America', icon: '🏛️' },
    { name: 'Wells Fargo', icon: '🏢' },
    { name: 'Ameriabank', icon: '🇦🇲' },
    { name: 'HSBC', icon: '🌐' },
    { name: 'Revolut', icon: '💳' },
  ];

  const handleConnect = (instName: string) => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setShowAddAccount(false);
    }, 2000);
  };

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
    <div className="space-y-10 pb-12">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">{t('accounts')}</h2>
          <p className="text-zinc-500">Manage your linked banks, wallets, and assets.</p>
        </div>
        <button 
          onClick={() => setShowAddAccount(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-indigo-500/20"
        >
          <Plus size={20} />
          {t('linkAccount')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Connected Institutions</h3>
          <div className="space-y-4">
            {MOCK_ACCOUNTS.map((acc, i) => {
              const Icon = getIcon(acc.type);
              return (
                <motion.div 
                  key={acc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 flex items-center justify-between group hover:bg-zinc-100 dark:hover:bg-white/[0.08] transition-all cursor-pointer shadow-sm dark:shadow-none"
                  onClick={() => setSelectedAccount(acc)}
                >
                  <div className="flex items-center gap-5 min-w-0">
                    <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
                      <Icon size={28} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-lg truncate text-zinc-900 dark:text-white">{acc.name}</p>
                      <p className="text-sm text-zinc-500 truncate">{acc.institution}</p>
                    </div>
                  </div>
        <div className="text-right flex items-center gap-4 sm:gap-6 shrink-0 ml-4">
          <div className="min-w-0">
            <p className="text-lg sm:text-xl font-mono font-extrabold tabular-nums tracking-tighter truncate max-w-[120px] sm:max-w-none">
              {isPrivacyMode ? '••••••' : formatCurrency(acc.balance, acc.currency)}
            </p>
            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest opacity-80">Sync OK</p>
          </div>
          <ArrowRight className="text-zinc-400 group-hover:text-indigo-600 transition-colors shrink-0" size={20} />
        </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-indigo-100 opacity-70 mb-2">Net Worth Overview</p>
              <h3 className="text-4xl sm:text-5xl font-black tracking-[ -0.05em] mb-4 tabular-nums drop-shadow-sm">
                {isPrivacyMode ? '•••••••••' : formatCurrency(66191.25, preferences.baseCurrency)}
              </h3>
              <div className="flex items-center gap-3">
                <div className="px-2.5 py-1 bg-white/20 rounded-full text-[10px] font-black tracking-tight text-white">+12.4% ARR</div>
                <p className="text-[10px] font-bold text-indigo-100/60 uppercase">Real-time Valuation</p>
              </div>
            </div>
            {/* Design accents */}
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute right-8 top-8 opacity-20 group-hover:opacity-40 transition-opacity">
              <LineChart size={80} />
            </div>
          </div>

          <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-[2.5rem] p-8 shadow-sm dark:shadow-none">
            <h3 className="font-bold mb-6 flex items-center justify-between text-zinc-900 dark:text-white">
              Asset Allocation
              <ExternalLink size={16} className="text-zinc-500" />
            </h3>
            <div className="space-y-6">
              <AllocationItem label="Liquid Cash" value={72} color="bg-indigo-500" />
              <AllocationItem label="Equities" value={18} color="bg-purple-500" />
              <AllocationItem label="Crypto" value={10} color="bg-orange-500" />
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showAddAccount}
        onClose={() => setShowAddAccount(false)}
        title="Link New Institution"
      >
        <div className="space-y-6">
          <div className="relative">
            <RefreshCw className={cn("absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500", isConnecting && "animate-spin")} size={16} />
            <input 
              type="text" 
              placeholder="Search for your bank..."
              className="w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl py-4 pl-6 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {institutions.map(inst => (
              <button 
                key={inst.name}
                onClick={() => handleConnect(inst.name)}
                disabled={isConnecting}
                className="flex items-center gap-3 p-4 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl hover:border-indigo-500/50 hover:bg-zinc-200 dark:hover:bg-white/10 transition-all text-left group disabled:opacity-50"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">{inst.icon}</span>
                <span className="text-xs font-bold leading-tight">{inst.name}</span>
              </button>
            ))}
          </div>

          <p className="text-[10px] text-zinc-500 text-center leading-relaxed px-8">
            ZenFinance uses AES-256 bank-level encryption. We never store your login credentials. By continuing, you agree to our <span className="text-indigo-400 cursor-pointer">Security Protocol</span>.
          </p>
        </div>
      </Modal>

      <Modal
        isOpen={!!selectedAccount}
        onClose={() => setSelectedAccount(null)}
        title="Account Details"
      >
        {selectedAccount && (
          <div className="space-y-8">
            <div className="flex items-center gap-6 p-6 bg-zinc-100 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/5 rounded-3xl">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                {React.createElement(getIcon(selectedAccount.type), { size: 32 })}
              </div>
              <div>
                <h4 className="text-xl font-bold text-zinc-900 dark:text-white">{selectedAccount.name}</h4>
                <p className="text-zinc-500">{selectedAccount.institution}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-zinc-100 dark:bg-white/5 rounded-2xl border border-zinc-200 dark:border-transparent">
                <div className="flex items-center gap-3">
                  <Shield size={18} className="text-zinc-500" />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">Account Status</span>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Connected</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-zinc-100 dark:bg-white/5 rounded-2xl border border-zinc-200 dark:border-transparent">
                <div className="flex items-center gap-3">
                  <RefreshCw size={18} className="text-zinc-500" />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">Last Synced</span>
                </div>
                <span className="text-xs text-zinc-500">2 minutes ago</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-zinc-100 dark:bg-white/5 rounded-2xl border border-zinc-200 dark:border-transparent">
                <div className="flex items-center gap-3">
                  <Info size={18} className="text-zinc-500" />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">Account Number</span>
                </div>
                <span className="text-xs font-mono text-zinc-500">**** 4821</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-4 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 border border-zinc-200 dark:border-white/10 rounded-2xl text-sm font-bold text-zinc-700 dark:text-white transition-all">
                <RefreshCw size={16} />
                Force Sync
              </button>
              <button className="flex items-center justify-center gap-2 py-4 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 rounded-2xl text-sm font-bold transition-all">
                <Power size={16} />
                Disconnect
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function AllocationItem({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
        <span className="text-zinc-400">{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={cn("h-full rounded-full", color)}
        />
      </div>
    </div>
  );
}
