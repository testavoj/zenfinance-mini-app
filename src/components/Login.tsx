import React from 'react';
import { Shield, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] text-zinc-900 dark:text-white flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-500">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 dark:bg-indigo-600/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/5 dark:bg-purple-600/10 rounded-full blur-[120px] -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white dark:bg-zinc-900/50 backdrop-blur-3xl border border-zinc-200 dark:border-white/10 rounded-[3rem] p-10 shadow-2xl text-center space-y-6"
      >
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.4)] text-white">
            <Shield size={32} />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">ZenFinance</h2>
          <p className="text-zinc-500">AI-powered finance, exclusively as a Telegram Mini App.</p>
        </div>

        <div className="text-left p-4 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Open inside Telegram</p>
          <p className="text-sm">
            This app authenticates with your Telegram identity. Browser access is disabled.
          </p>
        </div>

        <a
          href="https://t.me"
          className="w-full py-4 bg-indigo-600 rounded-2xl font-bold text-white flex items-center justify-center gap-2 hover:bg-indigo-500 shadow-xl transition-all"
        >
          Open Telegram
          <ExternalLink size={16} />
        </a>

        <p className="text-[10px] uppercase tracking-widest text-zinc-400">
          Find this bot via the menu button or short link your admin shared.
        </p>
      </motion.div>
    </div>
  );
}
