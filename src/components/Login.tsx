import React, { useState } from 'react';
import { Shield, Fingerprint, Lock, Globe, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useApp } from '../AppContext';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const { preferences, setPreferences } = useApp();
  const [step, setStep] = useState(1);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else authenticate();
  };

  const authenticate = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      onLogin();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] text-zinc-900 dark:text-white flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-500">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 dark:bg-indigo-600/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/5 dark:bg-purple-600/10 rounded-full blur-[120px] -z-10"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white dark:bg-zinc-900/50 backdrop-blur-3xl border border-zinc-200 dark:border-white/10 rounded-[3rem] p-10 shadow-2xl relative"
      >
        <div className="mb-8 flex justify-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.4)] text-white">
            <Shield size={32} />
          </div>
        </div>

        <div className="flex bg-zinc-100 dark:bg-white/5 p-1 rounded-2xl mb-8 relative z-10">
          <button 
            onClick={() => setAuthMode('login')}
            className={cn(
              "flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              authMode === 'login' ? "bg-white dark:bg-zinc-800 text-indigo-600 shadow-sm" : "text-zinc-500"
            )}
          >
            Access Vault
          </button>
          <button 
            onClick={() => setAuthMode('register')}
            className={cn(
              "flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              authMode === 'register' ? "bg-white dark:bg-zinc-800 text-indigo-600 shadow-sm" : "text-zinc-500"
            )}
          >
            New Node
          </button>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key={`${authMode}-step1`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  {authMode === 'login' ? 'ZenFinance' : 'Create Identity'}
                </h2>
                <p className="text-zinc-500">
                  {authMode === 'login' ? 'Secure AI-Powered Wealth Management' : 'Initialize your secure financial node'}
                </p>
              </div>
              
              {authMode === 'register' && (
                <div className="space-y-4">
                  <input 
                    type="text"
                    placeholder="Identify Name"
                    className="w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all text-zinc-900 dark:text-white"
                  />
                  <input 
                    type="email"
                    placeholder="Pulse Email"
                    className="w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all text-zinc-900 dark:text-white"
                  />
                </div>
              )}

              <div className="space-y-4">
                <button 
                  onClick={nextStep}
                  className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black dark:hover:bg-zinc-200 transition-all shadow-lg"
                >
                  <Fingerprint size={20} />
                  {authMode === 'login' ? 'Biometric Unlock' : 'Set Biometric Anchor'}
                </button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-200 dark:border-white/5"></div></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-zinc-900 px-2 text-zinc-400 dark:text-zinc-600 font-bold tracking-widest">or use passkey</span></div>
                </div>
                <button 
                  onClick={nextStep}
                  className="w-full py-4 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl font-bold text-zinc-600 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-white/10 transition-all"
                >
                  {authMode === 'login' ? 'Enter PIN Code' : 'Create PIN Sequence'}
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Initial Setup</h2>
                <p className="text-zinc-500">Configure your base currency & region.</p>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                    <Globe size={12} />
                    Base Currency
                  </label>
                  <select 
                    value={preferences.baseCurrency}
                    onChange={(e) => setPreferences({ ...preferences, baseCurrency: e.target.value })}
                    className="w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl py-4 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all appearance-none text-zinc-900 dark:text-white"
                  >
                    <option value="RUB">RUB - Russian Ruble</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="AMD">AMD - Armenian Dram</option>
                  </select>
                </div>
                <div className="p-4 bg-indigo-600/10 border border-indigo-600/20 rounded-2xl flex gap-3">
                  <Shield className="text-indigo-600 dark:text-indigo-400 shrink-0" size={18} />
                  <p className="text-[10px] text-zinc-600 dark:text-zinc-400 leading-relaxed uppercase font-bold tracking-wider">
                    CCPA & GDPR Compliant. Your data is encrypted locally and in transit. By continuing, you agree to our Terms of Service.
                  </p>
                </div>
                <button 
                  onClick={nextStep}
                  className="w-full py-4 bg-indigo-600 rounded-2xl font-bold text-white flex items-center justify-center gap-2 hover:bg-indigo-500 shadow-xl transition-all"
                >
                  Continue Setup
                  <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8 py-4"
            >
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/10 rounded-full border border-emerald-500/20 mb-4">
                  {isAuthenticating ? <Loader2 className="animate-spin text-emerald-500" size={40} /> : <Lock className="text-emerald-500" size={32} />}
                </div>
                <h2 className="text-2xl font-bold">Verification</h2>
                <p className="text-zinc-500">Device binding & 2FA check in progress.</p>
              </div>
              {!isAuthenticating && (
                <button 
                  onClick={nextStep}
                  className="w-full py-5 bg-indigo-600 rounded-3xl font-bold text-lg hover:bg-indigo-500 shadow-2xl transition-all"
                >
                  Finalize Enrollment
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 flex justify-center gap-1">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={cn(
                "h-1 transition-all rounded-full",
                s === step ? "w-8 bg-indigo-600" : "w-1 bg-white/10"
              )} 
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
