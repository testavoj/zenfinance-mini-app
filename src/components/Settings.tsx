import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ShieldCheck, 
  Languages, 
  Globe, 
  Fingerprint, 
  BellRing, 
  Lock, 
  FileText, 
  LogOut,
  Moon,
  Sun,
  LayoutDashboard,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Clock,
  Volume2,
  Database,
  History,
  Wallet,
  CreditCard
} from 'lucide-react';
import { useApp } from '../AppContext';
import { cn } from '../lib/utils';
import { useSound } from '../lib/useSound';
import { motion, AnimatePresence } from 'motion/react';
import Modal from './ui/Modal';

export default function Settings() {
  const { t } = useTranslation();
  const { preferences, setPreferences, security, setSecurity } = useApp();
  const { playSound } = useSound();
  const [activeLegal, setActiveLegal] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'language' | 'dashboard' | 'visual' | 'sound' | 'security' | 'compliance'>('language');

  const toggleSecurity = (key: keyof typeof security) => {
    setSecurity(prev => ({ ...prev, [key]: !prev[key] }));
    playSound('notify', 'system');
  };

  const handleTabChange = (id: typeof activeTab) => {
    setActiveTab(id);
    playSound('notify', 'system');
  };

  const navItems = [
    { id: 'language', icon: Languages, label: 'Language' },
    { id: 'visual', icon: Globe, label: 'Other' },
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard Display' },
    { id: 'sound', icon: Volume2, label: 'Sound Architecture' },
    { id: 'security', icon: ShieldCheck, label: 'Security & Defense' },
    { id: 'compliance', icon: FileText, label: 'Compliance & Transparency' },
  ] as const;

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'am', name: 'Հայերեն', flag: '🇦🇲' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'ar', name: 'العربية', flag: '🇦🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  ];

  const legalContent: Record<string, { title: string, content: string }> = {
    'tos': {
       title: 'Terms of Service',
       content: 'By using ZenFinance, you agree to bound by these terms. We provide a platform for financial tracking and AI analysis. You are responsible for the security of your device and passcodes.'
    },
    'privacy': {
       title: 'Privacy Policy',
       content: 'ZenFinance prioritizes your privacy. We use end-to-end encryption for all financial data. We do not sell your personal information to third parties. Your data is your property.'
    },
    'ccpa': {
       title: 'CCPA Request',
       content: 'California residents have the right to request access to their data, delete their data, and opt-out of data sharing. Use this section to initiate a formal data portability request.'
    },
    'gdpr': {
       title: 'GDPR Data Processing',
       content: 'European users data is processed in accordance with the General Data Protection Regulation. You have the right to be forgotten and the right to data portability.'
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 text-zinc-900 dark:text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tight mb-2">{t('settings')}</h2>
          <p className="text-zinc-500 font-medium">Fine-tune your financial ecosystem.</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-100 dark:bg-white/5 px-4 py-2 rounded-full border border-zinc-200 dark:border-white/10">
          <div className="w-2 h-2 bg-emerald-500 rounded-full" />
          System Optimal
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-72 shrink-0 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-4 px-6 py-4 rounded-3xl transition-all border font-bold text-sm",
                activeTab === item.id 
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20 translate-x-2" 
                  : "bg-white/50 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/10"
              )}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}

          <div className="pt-8 mt-8 border-t border-zinc-200 dark:border-white/10">
            <button className="w-full flex items-center gap-4 px-6 py-4 rounded-3xl text-zinc-500 hover:text-rose-500 transition-colors font-bold text-sm group">
              <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
              Sign Out Securely
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-[3rem] p-6 sm:p-10 shadow-sm dark:shadow-none min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeTab === 'language' && (
                <div className="space-y-8">
                  <SectionTitle title="Regional Settings" subtitle="Choose your primary language for the interface." />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setPreferences({ ...preferences, language: lang.code });
                          playSound('notify', 'system');
                        }}
                        className={cn(
                          "flex items-center justify-between px-6 py-4 rounded-2xl border-2 transition-all",
                          preferences.language === lang.code 
                            ? "bg-indigo-600/5 border-indigo-500 text-indigo-600 dark:text-white" 
                            : "bg-zinc-50 dark:bg-white/5 border-zinc-100 dark:border-transparent hover:border-zinc-300 dark:hover:border-white/10"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl drop-shadow-sm">{lang.flag}</span>
                          <span className="font-bold">{lang.name}</span>
                        </div>
                        {preferences.language === lang.code && (
                          <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'visual' && (
                <div className="space-y-10">
                  <SectionTitle title="Financial & Visual Architecture" subtitle="Configure currency modes and global visual protocols." />
                  
                  <div className="p-8 bg-zinc-100 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/5 rounded-[2.5rem] mt-6">
                    <SectionTitle title="Currency Formatting" subtitle="Select the primary currency for all financial calculations." />
                    <div className="flex flex-wrap gap-3 mt-6">
                      {['USD', 'EUR', 'AMD', 'RUB', 'GBP', 'JPY'].map(curr => (
                        <button 
                          key={curr}
                          onClick={() => {
                            setPreferences({ ...preferences, baseCurrency: curr });
                            playSound('success', 'system');
                          }}
                          className={cn(
                            "px-6 py-4 rounded-2xl border-2 font-bold text-sm transition-all min-w-[100px] flex flex-col items-center gap-2",
                            preferences.baseCurrency === curr 
                              ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                              : "bg-white dark:bg-white/5 border-zinc-100 dark:border-white/10 text-zinc-500 hover:border-indigo-600/50"
                          )}
                        >
                          <span className="text-lg">{curr === 'AMD' ? '֏' : curr === 'USD' ? '$' : curr === 'EUR' ? '€' : curr === 'RUB' ? '₽' : curr === 'GBP' ? '£' : '¥'}</span>
                          <span>{curr}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-10 border-t border-zinc-100 dark:border-white/10">
                    <SectionTitle title="Theme Engine" subtitle="Global visual mode configuration." />
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <ThemeButton 
                        active={preferences.theme === 'dark'} 
                        icon={Moon} 
                        label="Onyx Dark" 
                        onClick={() => {
                          setPreferences({ ...preferences, theme: 'dark' });
                          playSound('notify', 'system');
                        }} 
                      />
                      <ThemeButton 
                        active={preferences.theme === 'light'} 
                        icon={Sun} 
                        label="Pure Light" 
                        onClick={() => {
                          setPreferences({ ...preferences, theme: 'light' });
                          playSound('notify', 'system');
                        }} 
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'dashboard' && (
                <div className="space-y-10">
                  <SectionTitle title="Dashboard Architect" subtitle="Select which major modules are visible on your primary workspace." />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ToggleCard 
                      icon={Wallet} 
                      title="Balance Overview" 
                      subtitle="Show total wealth and credit card summaries." 
                      enabled={preferences.dashboardStats.showBalance} 
                      onToggle={() => {
                        setPreferences({
                          ...preferences, 
                          dashboardStats: { ...preferences.dashboardStats, showBalance: !preferences.dashboardStats.showBalance }
                        });
                        playSound('notify', 'system');
                      }}
                    />
                    <ToggleCard 
                      icon={Activity} 
                      title="Interactive Chart" 
                      subtitle="Financial flow visualization graph." 
                      enabled={preferences.dashboardStats.showChart} 
                      onToggle={() => setPreferences({
                        ...preferences, 
                        dashboardStats: { ...preferences.dashboardStats, showChart: !preferences.dashboardStats.showChart }
                      })}
                    />
                    <ToggleCard 
                      icon={History} 
                      title="Activity Feed" 
                      subtitle="List of most recent transactions." 
                      enabled={preferences.dashboardStats.showActivity} 
                      onToggle={() => setPreferences({
                        ...preferences, 
                        dashboardStats: { ...preferences.dashboardStats, showActivity: !preferences.dashboardStats.showActivity }
                      })}
                    />
                    <ToggleCard 
                      icon={CreditCard} 
                      title="Accounts List" 
                      subtitle="Dashboard summary of linked institutions." 
                      enabled={preferences.dashboardStats.showAccounts} 
                      onToggle={() => setPreferences({
                        ...preferences, 
                        dashboardStats: { ...preferences.dashboardStats, showAccounts: !preferences.dashboardStats.showAccounts }
                      })}
                    />
                  </div>

                  <div className="pt-10 border-t border-zinc-100 dark:border-white/10">
                    <SectionTitle title="Analytics Overview" subtitle="Configure granular sub-metrics for the summary widgets." />
                    <div className="space-y-3 mt-6">
                      <ToggleItem 
                         icon={ArrowUpRight} 
                         title="Total Income" 
                         subtitle="Cumulative period earnings." 
                         enabled={preferences.dashboardStats.showIncome} 
                         onToggle={() => setPreferences({
                           ...preferences, 
                           dashboardStats: { ...preferences.dashboardStats, showIncome: !preferences.dashboardStats.showIncome }
                         })}
                      />
                      <ToggleItem 
                         icon={ArrowDownRight} 
                         title="Outgoing Flow" 
                         subtitle="Cumulative period expenses." 
                         enabled={preferences.dashboardStats.showOutgoing} 
                         onToggle={() => setPreferences({
                           ...preferences, 
                           dashboardStats: { ...preferences.dashboardStats, showOutgoing: !preferences.dashboardStats.showOutgoing }
                         })}
                      />
                      <ToggleItem 
                         icon={Activity} 
                         title="Net Performance" 
                         subtitle="Calculated income vs expense delta." 
                         enabled={preferences.dashboardStats.showNetFlow} 
                         onToggle={() => setPreferences({
                           ...preferences, 
                           dashboardStats: { ...preferences.dashboardStats, showNetFlow: !preferences.dashboardStats.showNetFlow }
                         })}
                      />
                      <ToggleItem 
                         icon={Clock} 
                         title="Temporal Averages" 
                         subtitle="Daily and hourly calculated averages." 
                         enabled={preferences.dashboardStats.showAvg} 
                         onToggle={() => setPreferences({
                           ...preferences, 
                           dashboardStats: { ...preferences.dashboardStats, showAvg: !preferences.dashboardStats.showAvg }
                         })}
                      />
                    </div>
                  </div>

                  <div className="pt-10 border-t border-zinc-100 dark:border-white/10">
                    {/* Theme section removed from dashboard display and moved to Visual Mode */}
                  </div>
                </div>
              )}

              {activeTab === 'sound' && (
                <div className="space-y-10">
                  <SectionTitle title="Auditory Resonance" subtitle="Configure haptic and audio feedback for system events." />
                  
                  <div className="p-8 bg-indigo-600 border border-indigo-500 rounded-[2.5rem] text-white shadow-xl shadow-indigo-500/20">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                           <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center">
                              <Volume2 size={32} />
                           </div>
                           <div>
                              <p className="text-xl font-black">Master Audio</p>
                              <p className="text-sm text-indigo-100 font-medium italic">Enable all auditory feedback protocols.</p>
                           </div>
                        </div>
                        <button 
                          onClick={() => {
                            const newEnabled = !preferences.soundSettings.enabled;
                            setPreferences({
                              ...preferences,
                              soundSettings: { ...preferences.soundSettings, enabled: newEnabled }
                            });
                            if (newEnabled) playSound('success', 'system');
                          }}
                          className={cn(
                            "w-16 h-8 rounded-full p-1 flex items-center transition-all",
                            preferences.soundSettings.enabled ? "bg-white" : "bg-white/30"
                          )}
                        >
                          <motion.div 
                            animate={{ x: preferences.soundSettings.enabled ? 32 : 0 }}
                            className={cn(
                              "w-6 h-6 rounded-full shadow-lg",
                              preferences.soundSettings.enabled ? "bg-indigo-600" : "bg-white/50"
                            )}
                          />
                        </button>
                     </div>
                  </div>

                  <div className="space-y-4 opacity-100 transition-opacity" style={{ opacity: preferences.soundSettings.enabled ? 1 : 0.4 }}>
                    <SoundToggleItem 
                      icon={ArrowUpRight} 
                      title="Income Chime" 
                      subtitle="Play a melodic confirmation on successful earnings log." 
                      enabled={preferences.soundSettings.income} 
                      onToggle={() => {
                        setPreferences({
                          ...preferences,
                          soundSettings: { ...preferences.soundSettings, income: !preferences.soundSettings.income }
                        });
                        playSound('notify', 'system');
                      }}
                      customUrl={preferences.customSounds.income || ''}
                      onUrlChange={(url) => setPreferences({
                        ...preferences,
                        customSounds: { ...preferences.customSounds, income: url }
                      })}
                    />
                    <SoundToggleItem 
                      icon={ArrowDownRight} 
                      title="Expenditure Alert" 
                      subtitle="Soft auditory feedback when recording spending." 
                      enabled={preferences.soundSettings.expense} 
                      onToggle={() => {
                        setPreferences({
                          ...preferences,
                          soundSettings: { ...preferences.soundSettings, expense: !preferences.soundSettings.expense }
                        });
                        playSound('notify', 'system');
                      }}
                      customUrl={preferences.customSounds.expense || ''}
                      onUrlChange={(url) => setPreferences({
                        ...preferences,
                        customSounds: { ...preferences.customSounds, expense: url }
                      })}
                    />
                    <SoundToggleItem 
                      icon={Wallet} 
                      title="Payment Feedback" 
                      subtitle="NFC transaction success and failure tones." 
                      enabled={preferences.soundSettings.payment} 
                      onToggle={() => {
                        setPreferences({
                          ...preferences,
                          soundSettings: { ...preferences.soundSettings, payment: !preferences.soundSettings.payment }
                        });
                        playSound('notify', 'system');
                      }}
                      customUrl={preferences.customSounds.payment || ''}
                      onUrlChange={(url) => setPreferences({
                        ...preferences,
                        customSounds: { ...preferences.customSounds, payment: url }
                      })}
                    />
                    <SoundToggleItem 
                      icon={BellRing} 
                      title="System Notifications" 
                      subtitle="UI interactions and navigation sounds." 
                      enabled={preferences.soundSettings.system} 
                      onToggle={() => {
                        setPreferences({
                          ...preferences,
                          soundSettings: { ...preferences.soundSettings, system: !preferences.soundSettings.system }
                        });
                        playSound('notify', 'system');
                      }}
                      customUrl={preferences.customSounds.system || ''}
                      onUrlChange={(url) => setPreferences({
                        ...preferences,
                        customSounds: { ...preferences.customSounds, system: url }
                      })}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-10">
                  <SectionTitle title="Access & Verification" subtitle="Protect your financial data with multi-layer defense." />

                  <div className="space-y-6">
                    <ToggleItem 
                      icon={Fingerprint} 
                      title="Biometric Login" 
                      subtitle="Use FaceID or TouchID for instant gateway access." 
                      enabled={security.biometric} 
                      onToggle={() => toggleSecurity('biometric')}
                    />
                    <ToggleItem 
                      icon={Lock} 
                      title="2FA Protocol" 
                      subtitle="Require SMS or Authenticator tokens for high-value syncs." 
                      enabled={security.twoFactor} 
                      onToggle={() => toggleSecurity('twoFactor')}
                    />
                    <ToggleItem 
                      icon={ShieldCheck} 
                      title="Stealth Mode" 
                      subtitle="Hide sensitive numbers when the screen is partially visible." 
                      enabled={preferences.privacyMode} 
                      onToggle={() => setPreferences({ ...preferences, privacyMode: !preferences.privacyMode })}
                    />
                  </div>

                  <div className="pt-10 border-t border-zinc-100 dark:border-white/10">
                    <SectionTitle title="Active Defense" subtitle="Automated monitoring specialized in fraud detection." />
                    <div className="p-6 bg-zinc-100 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/5 rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-6">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500">
                             <BellRing size={24} />
                          </div>
                          <div>
                             <p className="font-bold">Anomaly Alerts</p>
                             <p className="text-xs text-zinc-500 font-medium">Real-time notification on suspicious activity.</p>
                          </div>
                       </div>
                       <button 
                         onClick={() => toggleSecurity('anomaly')}
                         className={cn(
                           "px-6 py-2 rounded-full font-bold text-xs transition-all border-2",
                           security.anomaly ? "bg-rose-500 border-rose-500 text-white" : "border-zinc-200 dark:border-white/10 text-zinc-500"
                         )}
                       >
                         {security.anomaly ? "System Active" : "Activate"}
                       </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'compliance' && (
                <div className="space-y-10">
                  <SectionTitle title="Regulatory Compliance" subtitle="Review our certifications and data handling protocols." />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ComplianceCard 
                      title="Terms of Service" 
                      icon={FileText} 
                      onClick={() => {
                        setActiveLegal('tos');
                        playSound('notify', 'system');
                      }} 
                    />
                    <ComplianceCard 
                      title="Privacy Shield" 
                      icon={ShieldCheck} 
                      onClick={() => setActiveLegal('privacy')} 
                    />
                    <ComplianceCard 
                      title="CCPA / GDPR Portal" 
                      icon={Globe} 
                      onClick={() => setActiveLegal('ccpa')} 
                    />
                    <ComplianceCard 
                      title="Standard Ledger Info" 
                      icon={Database} 
                      onClick={() => setActiveLegal('gdpr')} 
                    />
                  </div>

                  <div className="pt-10 border-t border-zinc-100 dark:border-white/10">
                    <SectionTitle title="Data Portability" subtitle="ZenFinance allows for complete data sovereignty." />
                    <div className="flex flex-col sm:flex-row gap-4">
                       <button className="flex-1 py-4 bg-zinc-900 text-white rounded-3xl font-bold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 font-black">
                          <ArrowUpRight size={18} />
                          Export Ledger (.JSON)
                       </button>
                       <button className="flex-1 py-4 bg-zinc-100 dark:bg-white/10 text-zinc-900 dark:text-white rounded-3xl font-bold hover:bg-zinc-200 dark:hover:bg-white/20 transition-colors flex items-center justify-center gap-2 font-black">
                          <History size={18} />
                          Download Audit Log
                       </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="text-center opacity-40 hover:opacity-100 transition-opacity pt-12">
        <p className="text-[10px] text-zinc-500 font-mono font-bold tracking-[0.4em] uppercase mb-2">ZEN_PROTOCOL_V1.AR_BUILD</p>
        <p className="text-[10px] text-zinc-400 font-mono">Distributed Ledger • Hyper-Secure Architecture</p>
      </div>

      <Modal 
        isOpen={!!activeLegal} 
        onClose={() => setActiveLegal(null)} 
        title={activeLegal ? legalContent[activeLegal].title : ''}
      >
        <div className="text-zinc-600 dark:text-zinc-400 leading-relaxed space-y-6">
          <p className="font-medium text-sm">{activeLegal && legalContent[activeLegal].content}</p>
          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-zinc-50 dark:bg-white/5 rounded-2xl border border-zinc-100 dark:border-white/10">
                <p className="text-[10px] font-bold uppercase text-zinc-500 mb-1">Last Updated</p>
                <p className="text-xs font-bold text-zinc-900 dark:text-white">April 28, 2026</p>
             </div>
             <div className="p-4 bg-zinc-50 dark:bg-white/5 rounded-2xl border border-zinc-100 dark:border-white/10">
                <p className="text-[10px] font-bold uppercase text-zinc-500 mb-1">Status</p>
                <p className="text-xs font-bold text-emerald-500">LEGALLY_ACTIVE</p>
             </div>
          </div>
          <div className="p-5 bg-indigo-600/5 border border-indigo-600/20 rounded-3xl text-indigo-600 dark:text-indigo-400 text-[10px] font-mono leading-tight">
            HASH_ID: ZEN_LEG_0x{Math.random().toString(16).substring(2, 10).toUpperCase()}<br/>
            DIGITAL_SIGNATURE: VERIFIED_ON_NODE_77
          </div>
        </div>
      </Modal>
    </div>
  );
}

function SectionTitle({ title, subtitle }: { title: string, subtitle: string }) {
  return (
    <div className="space-y-1">
      <h3 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">{title}</h3>
      <p className="text-xs text-zinc-500 font-medium">{subtitle}</p>
    </div>
  );
}

function ThemeButton({ active, icon: Icon, label, onClick }: { active: boolean, icon: any, label: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-4 p-8 rounded-[2.5rem] border-2 transition-all",
        active 
          ? "bg-indigo-600/10 border-indigo-600 text-indigo-600" 
          : "bg-zinc-50 dark:bg-white/5 border-transparent text-zinc-400 grayscale hover:grayscale-0 hover:border-zinc-200 dark:hover:border-white/20"
      )}
    >
      <div className={cn(
        "p-4 rounded-3xl transition-colors",
        active ? "bg-indigo-600 text-white" : "bg-zinc-200 dark:bg-white/10"
      )}>
        <Icon size={32} />
      </div>
      <span className="font-black text-[10px] uppercase tracking-widest">{label}</span>
    </button>
  );
}

function ComplianceCard({ title, icon: Icon, onClick }: { title: string, icon: any, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="p-6 bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 rounded-[2rem] text-left hover:border-indigo-600/30 transition-all group"
    >
      <div className="w-10 h-10 bg-white dark:bg-white/5 rounded-xl flex items-center justify-center text-zinc-400 group-hover:text-indigo-600 transition-all mb-4 shadow-sm border border-zinc-100 dark:border-transparent">
        <Icon size={20} />
      </div>
      <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-[0.2em] mb-1">Regulatory Portal</p>
      <p className="font-bold text-sm text-zinc-900 dark:text-white">{title}</p>
    </button>
  );
}

function ToggleCard({ icon: Icon, title, subtitle, enabled, onToggle }: { icon: any, title: string, subtitle: string, enabled: boolean, onToggle: () => void }) {
  return (
    <button 
      onClick={onToggle}
      className={cn(
        "p-6 rounded-[2.5rem] border-2 text-left transition-all group flex flex-col justify-between min-h-[160px]",
        enabled 
          ? "bg-indigo-600/5 border-indigo-600/50" 
          : "bg-zinc-50 dark:bg-white/5 border-transparent opacity-60 grayscale hover:grayscale-0 hover:opacity-100"
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
          enabled ? "bg-indigo-600 text-white" : "bg-zinc-200 dark:bg-white/10 text-zinc-500"
        )}>
          <Icon size={24} />
        </div>
        <div className={cn(
          "w-10 h-5 rounded-full p-0.5 flex items-center transition-all",
          enabled ? "bg-indigo-600" : "bg-zinc-300 dark:bg-zinc-800"
        )}>
          <motion.div 
            animate={{ x: enabled ? 20 : 0 }}
            className="w-4 h-4 bg-white rounded-full shadow-md"
          />
        </div>
      </div>
      <div>
        <p className="font-bold text-sm text-zinc-900 dark:text-white">{title}</p>
        <p className="text-[10px] text-zinc-500 font-medium leading-tight mt-1">{subtitle}</p>
      </div>
    </button>
  );
}

function SectionHeader({ icon: Icon, title }: { icon: any, title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-indigo-600/10 flex items-center justify-center text-indigo-400">
        <Icon size={16} />
      </div>
      <h3 className="font-bold">{title}</h3>
    </div>
  );
}

function ToggleItem({ icon: Icon, title, subtitle, enabled, onToggle }: { icon: any, title: string, subtitle: string, enabled: boolean, onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between p-2">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-zinc-500 dark:text-zinc-400 shrink-0">
          <Icon size={22} />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-sm text-zinc-900 dark:text-white truncate">{title}</p>
          <p className="text-[10px] text-zinc-500 font-medium truncate max-w-[180px] sm:max-w-none">{subtitle}</p>
        </div>
      </div>
      <button 
        onClick={onToggle}
        className={cn(
          "w-12 h-6 rounded-full p-1 flex items-center transition-all shrink-0 ml-4",
          enabled ? "bg-indigo-600" : "bg-zinc-300 dark:bg-zinc-800"
        )}
      >
        <motion.div 
          animate={{ x: enabled ? 24 : 0 }}
          className="w-4 h-4 bg-white rounded-full shadow-md"
        />
      </button>
    </div>
  );
}

function SoundToggleItem({ 
  icon: Icon, 
  title, 
  subtitle, 
  enabled, 
  onToggle, 
  customUrl, 
  onUrlChange 
}: { 
  icon: any, 
  title: string, 
  subtitle: string, 
  enabled: boolean, 
  onToggle: () => void,
  customUrl: string,
  onUrlChange: (url: string) => void
}) {
  return (
    <div className="space-y-3 p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-zinc-500 dark:text-zinc-400 shrink-0">
            <Icon size={22} />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm text-zinc-900 dark:text-white truncate">{title}</p>
            <p className="text-[10px] text-zinc-500 font-medium">{subtitle}</p>
          </div>
        </div>
        <button 
          onClick={onToggle}
          className={cn(
            "w-12 h-6 rounded-full p-1 flex items-center transition-all shrink-0 ml-4",
            enabled ? "bg-indigo-600" : "bg-zinc-300 dark:bg-zinc-800"
          )}
        >
          <motion.div 
            animate={{ x: enabled ? 24 : 0 }}
            className="w-4 h-4 bg-white rounded-full shadow-md"
          />
        </button>
      </div>
      {enabled && (
        <div className="ml-16">
          <label className="text-[9px] font-black uppercase text-zinc-400 tracking-widest mb-1 block">Custom Waveform URL (Optional)</label>
          <input 
            type="text"
            value={customUrl}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="https://assets.mixkit.co/..."
            className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 rounded-xl px-4 py-2 text-[10px] focus:outline-none focus:ring-1 focus:ring-indigo-600/30 transition-all font-mono"
          />
        </div>
      )}
    </div>
  );
}

