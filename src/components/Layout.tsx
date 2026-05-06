import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Wallet, 
  MessageSquare, 
  Settings, 
  Shield, 
  Eye, 
  EyeOff,
  Bell,
  Search,
  User,
  CreditCard,
  Crown,
  X,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import Modal from './ui/Modal';
import { showRewardedAd, adsEnabled } from '../lib/adsgram';
import { getTelegram, haptic } from '../lib/telegram';
import { HAS_AI } from '../lib/flags';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const { t } = useTranslation();
  const { isPrivacyMode, togglePrivacyMode, notifications, removeNotification, clearAllNotifications, tgUser, grantBonusUses } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [adState, setAdState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const displayName = tgUser ? `${tgUser.firstName}${tgUser.lastName ? ' ' + tgUser.lastName : ''}` : 'Guest';
  const avatarSeed = tgUser?.username || tgUser?.firstName || 'guest';
  const avatarUrl = tgUser?.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(avatarSeed)}`;

  const onWatchAd = async () => {
    haptic('tap');
    setAdState('loading');
    const ok = await showRewardedAd();
    if (ok) {
      grantBonusUses('photo', 1);
      grantBonusUses('ai', 1);
      setAdState('success');
      haptic('success');
    } else {
      setAdState('error');
      haptic('error');
    }
    setTimeout(() => setAdState('idle'), 2500);
  };

  const onPremiumClick = () => {
    const tg = getTelegram();
    const msg = 'Premium plans are coming soon. Watch ads to refill your AI and photo quota in the meantime!';
    if (tg?.showAlert) tg.showAlert(msg);
    else alert(msg);
  };

  const onLogout = () => {
    const tg = getTelegram();
    if (tg) tg.close();
  };

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('dashboard') },
    { id: 'quick-log', icon: PlusCircle, label: t('quickLog') },
    ...(HAS_AI ? [{ id: 'ai', icon: MessageSquare, label: t('ai') }] : []),
    { id: 'settings', icon: Settings, label: t('settings') },
  ];

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-[#0A0A0A] text-zinc-900 dark:text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-200 dark:border-white/10 flex flex-col p-6 max-md:hidden bg-white dark:bg-transparent">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Shield className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">ZenFinance</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                activeTab === item.id 
                  ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]" 
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5"
              )}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-zinc-200 dark:border-white/10">
          <button 
            onClick={togglePrivacyMode}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
          >
            {isPrivacyMode ? <EyeOff size={20} /> : <Eye size={20} />}
            <span className="text-sm font-medium">{t('privacyMode')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Topbar */}
        <header className="h-20 border-b border-zinc-200 dark:border-white/10 flex items-center justify-between px-8 bg-white/50 dark:bg-black/20 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full max-sm:hidden">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input 
                type="text" 
                placeholder="Search transactions..."
                className="w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:text-white transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setShowNotifications(true)}
              className="relative text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-white transition-colors"
            >
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>
            <button 
              onClick={() => setShowProfile(true)}
              className="flex items-center gap-3 pl-6 border-l border-zinc-200 dark:border-white/10 group text-left"
            >
              <div className="text-right">
                <p className="text-sm font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{displayName}</p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-mono">Free tier</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full p-[2px]">
                <div className="w-full h-full rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center p-1">
                  <img
                    src={avatarUrl}
                    alt="User"
                    className="w-full h-full rounded-full"
                  />
                </div>
              </div>
            </button>
          </div>
        </header>


        <Modal 
          isOpen={showNotifications} 
          onClose={() => setShowNotifications(false)} 
          title="Notifications"
        >
          <div className="space-y-4">
            {notifications.length > 0 ? (
              <>
                <div className="flex justify-end mb-2">
                  <button 
                    onClick={clearAllNotifications}
                    className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-rose-500 transition-colors flex items-center gap-2"
                  >
                    <Trash2 size={12} />
                    Clear All
                  </button>
                </div>
                {notifications.map((notification) => (
                  <div key={notification.id} className="group relative p-4 bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/5 rounded-2xl flex gap-4 hover:border-indigo-600/30 transition-all">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      notification.type === 'security' ? "bg-rose-500/10 text-rose-500" :
                      notification.type === 'budget' ? "bg-amber-500/10 text-amber-500" :
                      "bg-indigo-600/10 text-indigo-400"
                    )}>
                      {notification.type === 'security' ? <Shield size={18} /> : 
                       notification.type === 'budget' ? <AlertCircle size={18} /> : 
                       <Bell size={18} />}
                    </div>
                    <div className="flex-1 min-w-0 pr-6">
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">{notification.title}</p>
                      <p className="text-xs text-zinc-500 line-clamp-2 mt-0.5">{notification.message}</p>
                    </div>
                    <button 
                      onClick={() => removeNotification(notification.id)}
                      className="absolute top-2 right-2 p-1.5 text-zinc-400 hover:text-rose-500 scale-0 group-hover:scale-100 transition-all"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-zinc-100 dark:bg-white/5 rounded-full flex items-center justify-center text-zinc-400 mb-4">
                  <Bell size={32} />
                </div>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">All caught up!</p>
                <p className="text-xs text-zinc-500 mt-1">No new notifications to show.</p>
              </div>
            )}
          </div>
        </Modal>

        {/* Profile Modal */}
        <Modal 
          isOpen={showProfile} 
          onClose={() => setShowProfile(false)} 
          title="Profile & Identity"
        >
          <div className="space-y-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full p-1 mb-4 shadow-xl">
                <img
                  src={avatarUrl}
                  alt="User"
                  className="w-full h-full rounded-full bg-zinc-900"
                />
              </div>
              <h4 className="text-2xl font-bold">{displayName}</h4>
              {tgUser?.username && (
                <p className="text-zinc-500 text-sm">@{tgUser.username}</p>
              )}
              <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-zinc-200 dark:bg-white/5 border border-zinc-300 dark:border-white/10 rounded-full text-zinc-500 text-xs font-bold uppercase">
                Free tier
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between p-4 bg-zinc-100 dark:bg-white/5 rounded-2xl">
                <div className="flex items-center gap-3">
                  <User size={18} className="text-zinc-500" />
                  <span className="text-sm">Telegram identity</span>
                </div>
                <span className="text-xs text-emerald-500">Verified</span>
              </div>
              <button
                onClick={onPremiumClick}
                className="w-full flex items-center justify-between p-4 bg-zinc-100 dark:bg-white/5 rounded-2xl hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Crown size={18} className="text-zinc-500" />
                  <span className="text-sm">Premium</span>
                </div>
                <span className="text-xs text-indigo-500">Coming soon</span>
              </button>
            </div>

            <button
              onClick={onLogout}
              className="w-full py-4 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl font-bold text-sm hover:bg-rose-500 hover:text-white transition-all"
            >
              Close mini app
            </button>
          </div>
        </Modal>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-zinc-50 dark:bg-[#0a0a0a]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sponsored — non-dismissible. Tapping triggers an Adsgram rewarded ad
            that grants +1 AI message and +1 photo scan. */}
        <div className="px-4 md:px-8 pb-3 md:pb-6 pt-2">
          <button
            onClick={onWatchAd}
            disabled={adState === 'loading'}
            className={cn(
              "w-full bg-gradient-to-r from-indigo-600/15 via-purple-600/10 to-indigo-600/15 border border-indigo-500/30 rounded-3xl p-4 flex items-center justify-between transition-all backdrop-blur-md hover:border-indigo-500/50 disabled:opacity-70",
              adState === 'success' && "border-emerald-500/40 bg-emerald-500/10",
              adState === 'error' && "border-rose-500/40 bg-rose-500/10"
            )}
          >
            <div className="flex items-center gap-4 text-left min-w-0">
              <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center text-[10px] font-black text-indigo-400 uppercase tracking-tighter">
                Ad
              </div>
              <div className="min-w-0">
                {adState === 'success' ? (
                  <>
                    <p className="text-sm font-black text-emerald-500 truncate">Reward unlocked</p>
                    <p className="text-xs text-zinc-500 font-medium truncate">+1 AI message and +1 photo scan added.</p>
                  </>
                ) : adState === 'error' ? (
                  <>
                    <p className="text-sm font-black text-rose-500 truncate">No ad available</p>
                    <p className="text-xs text-zinc-500 font-medium truncate">Try again in a few minutes.</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-black text-zinc-900 dark:text-white truncate">
                      {adsEnabled() ? 'Watch a short ad → +1 AI msg, +1 photo scan' : 'Sponsored slot'}
                    </p>
                    <p className="text-xs text-zinc-500 font-medium truncate">
                      {adsEnabled() ? 'Adsgram rewarded video, ~15 seconds.' : 'Configure VITE_ADSGRAM_BLOCK_ID to enable real ads.'}
                    </p>
                  </>
                )}
              </div>
            </div>
            <span className="bg-indigo-600 text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 whitespace-nowrap shrink-0 ml-3">
              {adState === 'loading' ? '...' : adState === 'success' ? '✓' : 'Watch'}
            </span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden border-t border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-black/60 backdrop-blur-xl flex justify-around p-4 shrink-0">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "p-2 rounded-xl transition-all",
                activeTab === item.id ? "text-indigo-600 dark:text-indigo-500" : "text-zinc-400 dark:text-zinc-500"
              )}
            >
              <item.icon size={24} />
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
}
