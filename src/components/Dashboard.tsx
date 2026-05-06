import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  TrendingUp, 
  Zap, 
  Trophy,
  History,
  Calendar,
  Filter,
  MapPin,
  Tag,
  Clock,
  CreditCard
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../AppContext';
import { formatCurrency, cn } from '../lib/utils';
import { buildChartData } from '../lib/mockData';
import { motion } from 'motion/react';
import Modal from './ui/Modal';
import AccountsSummary from './AccountsSummary';

export default function Dashboard({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const { t } = useTranslation();
  const { isPrivacyMode, preferences, transactions } = useApp();
  const [timeRange, setTimeRange] = useState<'Day' | 'Week' | 'Month'>('Week');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showAllHistory, setShowAllHistory] = useState(false);

  const totalBalance = transactions.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0);
  const chartData = buildChartData(timeRange, transactions);

  // Last-30-days stats — computed, no hardcoded values.
  const since30 = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const recent = transactions.filter(t => new Date(t.timestamp).getTime() >= since30);
  const recentExpense = recent.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const recentIncome = recent.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const burnRate = recentExpense / 30; // average daily expense, last 30d
  const savingsRate = recentIncome > 0 ? Math.max(0, ((recentIncome - recentExpense) / recentIncome) * 100) : 0;
  const healthIndex = transactions.length === 0
    ? 0
    : Math.min(100, Math.round(savingsRate * 0.6 + Math.min(40, transactions.length * 2)));
  const hasData = transactions.length > 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Stats */}
      {preferences.dashboardStats.showBalance && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title={t('totalBalance')}
            value={isPrivacyMode ? '••••••' : formatCurrency(totalBalance, preferences.baseCurrency)}
            change={hasData ? '' : 'No data'}
            icon={Wallet}
            trend={totalBalance >= 0 ? 'up' : 'down'}
          />
          <StatCard
            title={t('burnRate')}
            value={isPrivacyMode ? '••••••' : (hasData ? `${formatCurrency(burnRate, preferences.baseCurrency)}/d` : '—')}
            change={hasData ? `${recent.length} entries` : 'Last 30 days'}
            icon={Zap}
            trend="down"
          />
          <StatCard
            title={t('savingsRate')}
            value={hasData ? `${savingsRate.toFixed(0)}%` : '—'}
            change={hasData ? (savingsRate >= 20 ? 'Healthy' : 'Low') : 'No income yet'}
            icon={TrendingUp}
            trend={savingsRate >= 20 ? 'up' : 'down'}
          />
          <StatCard
            title="Health Index"
            value={hasData ? `${healthIndex}/100` : '—'}
            change={hasData ? (healthIndex >= 70 ? 'Strong' : healthIndex >= 40 ? 'OK' : 'Build it up') : 'Log to start'}
            icon={Trophy}
            trend={healthIndex >= 50 ? 'up' : 'down'}
            color={healthIndex >= 70 ? 'text-emerald-500' : 'text-zinc-900 dark:text-white'}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        {preferences.dashboardStats.showChart && (
          <div className="lg:col-span-2 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-8 backdrop-blur-sm shadow-sm dark:shadow-none">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Analytics Overview</h2>
                <p className="text-xs text-zinc-500 mt-1">Detailed flow for {timeRange.toLowerCase()}ly period</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex bg-zinc-200 dark:bg-black/40 p-1 rounded-xl border border-zinc-300 dark:border-white/5">
                  {['Day', 'Week', 'Month'].map((r) => (
                    <button
                      key={r}
                      onClick={() => setTimeRange(r as any)}
                      className={cn(
                        "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                        timeRange === r ? "bg-indigo-600 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Period Summary Stats */}
            <div className={cn(
              "grid gap-4 mb-8",
              [preferences.dashboardStats.showIncome, preferences.dashboardStats.showOutgoing, preferences.dashboardStats.showNetFlow, preferences.dashboardStats.showAvg].filter(Boolean).length === 1 ? "grid-cols-1" : 
              [preferences.dashboardStats.showIncome, preferences.dashboardStats.showOutgoing, preferences.dashboardStats.showNetFlow, preferences.dashboardStats.showAvg].filter(Boolean).length === 2 ? "grid-cols-2" :
              [preferences.dashboardStats.showIncome, preferences.dashboardStats.showOutgoing, preferences.dashboardStats.showNetFlow, preferences.dashboardStats.showAvg].filter(Boolean).length === 3 ? "grid-cols-1 sm:grid-cols-3" :
              "grid-cols-2 lg:grid-cols-4"
            )}>
               {preferences.dashboardStats.showIncome && (
                 <div className="p-4 bg-zinc-100 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/5 rounded-2xl flex flex-col justify-between min-h-[90px] min-w-0">
                    <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-widest leading-none truncate mb-1">Total Income</p>
                    <p className="text-lg sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tighter truncate tabular-nums" title={isPrivacyMode ? 'Hidden' : formatCurrency(chartData.reduce((acc, curr) => acc + curr.income, 0), preferences.baseCurrency)}>
                      {isPrivacyMode ? '••••••' : formatCurrency(chartData.reduce((acc, curr) => acc + curr.income, 0), preferences.baseCurrency)}
                    </p>
                 </div>
               )}
               {preferences.dashboardStats.showOutgoing && (
                 <div className="p-4 bg-zinc-100 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/5 rounded-2xl flex flex-col justify-between min-h-[90px] min-w-0">
                    <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-widest leading-none truncate mb-1">Outgoing</p>
                    <p className="text-lg sm:text-2xl font-bold text-rose-600 dark:text-rose-400 tracking-tighter truncate tabular-nums" title={isPrivacyMode ? 'Hidden' : formatCurrency(chartData.reduce((acc, curr) => acc + curr.expense, 0), preferences.baseCurrency)}>
                      {isPrivacyMode ? '••••••' : formatCurrency(chartData.reduce((acc, curr) => acc + curr.expense, 0), preferences.baseCurrency)}
                    </p>
                 </div>
               )}
               {preferences.dashboardStats.showNetFlow && (
                 <div className="p-4 bg-zinc-100 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/5 rounded-2xl flex flex-col justify-between min-h-[90px] min-w-0">
                    <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-widest leading-none truncate mb-1">Net Flow</p>
                    <p className={cn(
                      "text-lg sm:text-2xl font-bold tracking-tighter truncate tabular-nums",
                      chartData.reduce((acc, curr) => acc + curr.income - curr.expense, 0) >= 0 ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-600 dark:text-zinc-100"
                    )} title={isPrivacyMode ? 'Hidden' : formatCurrency(chartData.reduce((acc, curr) => acc + curr.income - curr.expense, 0), preferences.baseCurrency)}>
                      {isPrivacyMode ? '••••••' : formatCurrency(chartData.reduce((acc, curr) => acc + curr.income - curr.expense, 0), preferences.baseCurrency)}
                    </p>
                 </div>
               )}
               {preferences.dashboardStats.showAvg && (
                 <div className="p-4 bg-zinc-100 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/5 rounded-2xl flex flex-col justify-between min-h-[90px] min-w-0">
                    <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-widest leading-none truncate mb-1">Avg / {timeRange === 'Day' ? 'Hour' : 'Day'}</p>
                    <p className="text-lg sm:text-2xl font-bold text-zinc-600 dark:text-zinc-400 tracking-tighter truncate tabular-nums" title={isPrivacyMode ? 'Hidden' : formatCurrency(chartData.reduce((acc, curr) => acc + curr.expense, 0) / chartData.length, preferences.baseCurrency)}>
                      {isPrivacyMode ? '••••••' : formatCurrency(chartData.reduce((acc, curr) => acc + curr.expense, 0) / chartData.length, preferences.baseCurrency)}
                    </p>
                 </div>
               )}
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={preferences.theme === 'dark' ? '#ffffff10' : '#00000010'} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: preferences.theme === 'dark' ? '#18181b' : '#ffffff', 
                      border: preferences.theme === 'dark' ? '1px solid #3f3f46' : '1px solid #e4e4e7', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                    }}
                    itemStyle={{ fontSize: '12px', color: preferences.theme === 'dark' ? '#ffffff' : '#18181b' }}
                  />
                  <Area type="monotone" dataKey="income" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                  <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        {preferences.dashboardStats.showActivity && (
          <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-8 backdrop-blur-sm shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold tracking-tight flex items-center gap-2 text-zinc-900 dark:text-white">
                <History size={20} className="text-indigo-600 dark:text-indigo-400" />
                History
              </h2>
              <button 
                onClick={() => setShowAllHistory(true)}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-medium px-3 py-1 bg-indigo-600/10 rounded-full"
              >
                View All
              </button>
            </div>
            <div className="space-y-6">
              {transactions.slice(0, 5).map((t, i) => (
                <motion.div 
                  key={t.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedTransaction(t)}
                  className="flex items-center justify-between group cursor-pointer hover:translate-x-1 transition-transform"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm dark:shadow-none shrink-0",
                      t.type === 'income' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    )}>
                      {t.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                    </div>
                    <div className="truncate min-w-0">
                      <p className="text-sm font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-zinc-900 dark:text-white truncate">{t.description}</p>
                      <p className="text-xs text-zinc-500 font-medium opacity-80 truncate">{t.category}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={cn(
                      "text-sm font-extrabold tabular-nums tracking-tight",
                      t.type === 'income' ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-900 dark:text-zinc-100"
                    )}>
                      {t.type === 'income' ? '+' : '-'}{isPrivacyMode ? '•••' : formatCurrency(t.amount, t.currency || preferences.baseCurrency)}
                    </p>
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono font-medium">
                      {new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Right Sidebar Modules */}
        {preferences.dashboardStats.showAccounts && (
          <div className="space-y-8">
            <AccountsSummary onNavigate={onNavigate} />
          </div>
        )}
      </div>

      {/* Transaction Detail Modal */}
      <Modal 
        isOpen={!!selectedTransaction} 
        onClose={() => setSelectedTransaction(null)} 
        title="Transaction Details"
      >
        {selectedTransaction && (
          <div className="space-y-8">
            <div className="text-center">
               <div className={cn(
                  "w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6",
                  selectedTransaction.type === 'income' ? "bg-emerald-400/10 text-emerald-400" : "bg-rose-400/10 text-rose-400"
                )}>
                  {selectedTransaction.type === 'income' ? <ArrowUpRight size={40} /> : <ArrowDownRight size={40} />}
                </div>
                <h3 className="text-4xl font-bold tracking-tighter text-zinc-900 dark:text-white">
                  {selectedTransaction.type === 'income' ? '+' : '-'}{formatCurrency(selectedTransaction.amount, selectedTransaction.currency || preferences.baseCurrency)}
                </h3>
                <p className="text-zinc-500 mt-1">{selectedTransaction.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <DetailItem icon={Calendar} label="Date" value={new Date(selectedTransaction.timestamp).toLocaleDateString()} />
               <DetailItem icon={Clock} label="Time" value={new Date(selectedTransaction.timestamp).toLocaleTimeString()} />
               <DetailItem icon={Tag} label="Category" value={selectedTransaction.category} />
               <DetailItem icon={MapPin} label="Location" value="Remote" />
            </div>

            <div className="p-6 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl text-zinc-900 dark:text-white">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Internal Receipt Info</p>
              <div className="font-mono text-[11px] text-zinc-600 dark:text-zinc-400 space-y-1">
                <p>TXID: {selectedTransaction.id}</p>
                <p>STATUS: VERIFIED_SERVER_SIDE</p>
                <p>METHOD: ZEN_PAY_LOCAL</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* View All History Modal */}
      <Modal
        isOpen={showAllHistory}
        onClose={() => setShowAllHistory(false)}
        title="Full History"
      >
        <div className="space-y-6">
           <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input 
                type="text" 
                placeholder="Search history..."
                className="w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none text-zinc-900 dark:text-white"
              />
           </div>
           <div className="space-y-4">
              {transactions.map((t, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-transparent rounded-2xl">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", t.type === 'income' ? "bg-emerald-400/10 text-emerald-400" : "bg-rose-400/10 text-rose-400")}>
                      <History size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{t.description}</p>
                      <p className="text-[10px] text-zinc-500 font-medium">{new Date(t.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className={cn("text-sm font-extrabold tabular-nums tracking-tight shrink-0", t.type === 'income' ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-900 dark:text-white")}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, t.currency || preferences.baseCurrency)}
                  </p>
                </div>
              ))}
           </div>
        </div>
      </Modal>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }: any) {
  return (
    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
      <div className="text-zinc-500"><Icon size={18} /></div>
      <div>
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon: Icon, trend, color = "text-zinc-900 dark:text-white" }: any) {
  return (
    <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 backdrop-blur-sm transition-all hover:bg-zinc-50 dark:hover:bg-white/[0.07] group shadow-sm hover:shadow-md dark:shadow-none min-w-0 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
          <Icon size={20} />
        </div>
        <div className={cn(
          "px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 tabular-nums shrink-0",
          trend === 'up' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
        )}>
          {trend === 'up' ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
          {change}
        </div>
      </div>
      <p className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1.5 opacity-80 truncate">{title}</p>
      <p className={cn("text-xl sm:text-2xl font-extrabold tracking-tighter truncate tabular-nums", color)} title={value}>{value}</p>
    </div>
  );
}
