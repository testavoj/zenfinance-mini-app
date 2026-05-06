import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Sparkles, Bot, User, Loader2, AlertCircle } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useApp } from '../AppContext';
import { useSound } from '../lib/useSound';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAssistant() {
  const { t } = useTranslation();
  const { preferences, incrementAIUsage, tgUser } = useApp();
  const { playSound } = useSound();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Hi ${tgUser?.firstName || 'there'}! I'm your ZenFinance AI. Ask me anything about budgeting, savings, or investments.` }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const QUOTA_LIMIT = 10;
  const remaining = Math.max(0, QUOTA_LIMIT - (preferences.aiUsageCount || 0));

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    if (remaining <= 0) {
      playSound('error', 'system');
      setMessages(prev => [...prev, { role: 'user', content: input }, { role: 'assistant', content: "You've reached your free daily quota of 10 requests. Please upgrade to ZenPremium for unlimited insights." }]);
      setInput('');
      return;
    }

    playSound('notify', 'system');
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error('API Key missing');

      const genAI = new GoogleGenAI({ apiKey });
      const model = 'gemini-2.5-flash';

      const response = await genAI.models.generateContent({
        model,
        contents: input,
        config: {
          systemInstruction: "You are a specialized financial coach for ZenFinance. Provide concise, actionable advice. Users have a limit of 10 free requests, they are currently interacting with you using one of those requests."
        }
      });

      const assistantMessage: Message = { 
        role: 'assistant', 
        content: response.text || 'I apologize, I am unable to process that right now.' 
      };
      setMessages(prev => [...prev, assistantMessage]);
      playSound('success', 'system');
      incrementAIUsage();
    } catch (err) {
      playSound('error', 'system');
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting to my brain. Please check your API key." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-12rem)] flex flex-col gap-6">
      <div className="flex items-center justify-between px-2 shrink-0">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
            <Sparkles className="text-indigo-600 dark:text-indigo-400" size={24} />
            Zen Intelligence
          </h2>
          <p className={cn(
            "text-sm font-medium",
            remaining === 0 ? "text-rose-500" : "text-zinc-500"
          )}>
            {remaining} Free requests remaining today.
          </p>
        </div>
        <div className="bg-indigo-600/10 border border-indigo-600/20 px-4 py-1.5 rounded-full">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Premium Available</span>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 overflow-y-auto space-y-6 scrollbar-hide shadow-sm dark:shadow-none"
      >
        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-4 max-w-[85%]",
                m.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                m.role === 'assistant' ? "bg-indigo-600 text-white" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
              )}>
                {m.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed",
                m.role === 'assistant' ? "bg-zinc-100 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/5 text-zinc-800 dark:text-zinc-100" : "bg-indigo-600 text-white"
              )}>
                {m.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <div className="flex gap-4 max-w-[85%]">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 animate-pulse">
              <Bot size={20} />
            </div>
            <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/5 text-zinc-500 flex items-center gap-2">
              <Loader2 className="animate-spin" size={16} />
              Analyzing patterns...
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {remaining === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-600 dark:text-rose-400 text-xs font-bold"
          >
            <AlertCircle size={16} />
            Quota Depleted. Upgrade to ZenPremium for continued financial intelligence.
          </motion.div>
        )}
        <div className="relative shrink-0">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={remaining === 0}
            placeholder={remaining === 0 ? "Quota depleted..." : "Ask about savings, investments, or deviations..."}
            className="w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all placeholder:text-zinc-400 dark:text-white disabled:opacity-50"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping || remaining === 0}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-500 text-white transition-colors disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
