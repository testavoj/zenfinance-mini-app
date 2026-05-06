import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  X,
  Mic,
  Camera,
  Plus,
  Minus,
  Check,
  Coffee,
  Car,
  Home,
  Gamepad2,
  HeartPulse,
  ShoppingBag,
  Plane,
  MoreHorizontal,
  Loader2,
  Scan,
  Sparkles,
  Eraser,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';
import { cn, FinancialCategory, getCurrencySymbol } from '../lib/utils';
import { useSound } from '../lib/useSound';
import Modal from './ui/Modal';
import { useApp, PHOTO_QUOTA_LIMIT } from '../AppContext';
import { haptic } from '../lib/telegram';
import { HAS_AI } from '../lib/flags';

export default function QuickLog() {
  const { t } = useTranslation();
  const { addTransaction, preferences, incrementPhotoUsage } = useApp();
  const { playSound } = useSound();
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [category, setCategory] = useState<FinancialCategory>('Food');
  const [note, setNote] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photosRemaining = Math.max(0, PHOTO_QUOTA_LIMIT - (preferences.photoUsageCount || 0));

  const categories: { label: FinancialCategory, icon: any }[] = [
    { label: 'Food', icon: Coffee },
    { label: 'Transport', icon: Car },
    { label: 'Housing', icon: Home },
    { label: 'Entertainment', icon: Gamepad2 },
    { label: 'Health', icon: HeartPulse },
    { label: 'Shopping', icon: ShoppingBag },
    { label: 'Travel', icon: Plane },
    { label: 'Other', icon: MoreHorizontal },
  ];

  const toggleVoice = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setAmount('15.00');
      setCategory('Food');
    }, 3000);
  };

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    if (!amount) {
      playSound('error', 'system');
      return;
    }
    setIsSaving(true);
    
    const newTx = {
      amount: parseFloat(amount),
      category: category,
      type: type,
      description: note || (type === 'income' ? 'Logged Income' : `Expense: ${category}`)
    };

    addTransaction(newTx);
    
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setAmount('');
      setNote('');
      playSound('success', type === 'income' ? 'income' : 'expense');
      
      setTimeout(() => setShowSuccess(false), 2000);
    }, 800);
  };

  const handleNumpad = (val: string) => {
    playSound('notify', 'system');
    if (val === 'BS') {
      setAmount(prev => prev.slice(0, -1));
    } else if (val === '.') {
      if (!amount.includes('.')) setAmount(prev => prev + '.');
    } else {
      if (amount.length < 10) setAmount(prev => prev + val);
    }
  };

  const fileToBase64 = (file: File): Promise<{ data: string; mimeType: string }> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const [meta, data] = result.split(',');
        const mimeMatch = meta.match(/data:(.*?);base64/);
        resolve({ data, mimeType: mimeMatch?.[1] || file.type || 'image/jpeg' });
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

  const inferCategory = (raw: string): FinancialCategory => {
    const c = raw.toLowerCase();
    if (/(restaurant|cafe|coffee|food|grocery|market|bistro|bakery)/.test(c)) return 'Food';
    if (/(taxi|uber|fuel|gas|transport|metro|bus)/.test(c)) return 'Transport';
    if (/(rent|utility|housing|electric|water)/.test(c)) return 'Housing';
    if (/(cinema|movie|game|netflix|spotify|entertainment)/.test(c)) return 'Entertainment';
    if (/(pharmacy|clinic|hospital|health|doctor)/.test(c)) return 'Health';
    if (/(amazon|store|shop|clothing|mall)/.test(c)) return 'Shopping';
    if (/(hotel|flight|travel|airline|airbnb)/.test(c)) return 'Travel';
    if (/(salary|payroll|wage|income)/.test(c)) return 'Salary';
    return 'Other';
  };

  const onCameraClick = () => {
    if (photosRemaining <= 0) {
      playSound('error', 'system');
      setScanError(`Free photo quota reached (${PHOTO_QUOTA_LIMIT}/${PHOTO_QUOTA_LIMIT}). Upgrade for unlimited scans.`);
      setShowScanner(true);
      return;
    }
    setScanError(null);
    setShowScanner(true);
    fileInputRef.current?.click();
  };

  const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (e.target) e.target.value = '';
    if (!file) {
      setShowScanner(false);
      return;
    }
    if (photosRemaining <= 0) {
      setScanError('Quota depleted.');
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      setScanError('Photo recognition unavailable: API key not configured.');
      playSound('error', 'system');
      return;
    }

    setIsScanning(true);
    setScanError(null);
    haptic('tap');
    try {
      const { data, mimeType } = await fileToBase64(file);
      const genAI = new GoogleGenAI({ apiKey });
      const response = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text:
                  'Extract the receipt total and merchant from this image. ' +
                  'Reply ONLY as compact JSON like {"amount": number, "merchant": string, "category": string}. ' +
                  'Category must be one of: Food, Transport, Housing, Entertainment, Health, Shopping, Travel, Salary, Other. ' +
                  'If unreadable, reply {"error":"unreadable"}.'
              },
              { inlineData: { mimeType, data } }
            ]
          }
        ]
      });

      const text = (response.text || '').trim();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON in response');
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.error || typeof parsed.amount !== 'number') {
        throw new Error('Could not read receipt');
      }

      setAmount(String(parsed.amount.toFixed(2)));
      const inferred = (parsed.category && inferCategory(parsed.category)) || inferCategory(parsed.merchant || '');
      setCategory(inferred);
      if (parsed.merchant) setNote(parsed.merchant);
      incrementPhotoUsage();
      playSound('success', 'system');
      haptic('success');
      setShowScanner(false);
    } catch (err) {
      // Quota is intentionally NOT decremented here — failed attempts must
      // not count against the user's free 10. incrementPhotoUsage() is only
      // called above on success.
      const msg = err instanceof Error ? err.message : 'Failed to read image';
      setScanError(`${msg}. This attempt did not count toward your quota.`);
      playSound('error', 'system');
      haptic('error');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto h-full flex flex-col p-4 md:p-0 gap-6">
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black shadow-2xl flex items-center gap-3 backdrop-blur-md"
          >
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <Check size={14} className="stroke-[4]" />
            </div>
            <span className="uppercase tracking-widest text-[10px]">Transaction Secured</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Entry Surface */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Header Logic */}
        <div className="flex items-center justify-between px-4">
          <div className="flex bg-zinc-100 dark:bg-white/5 p-1 rounded-2xl w-48">
            <button 
              onClick={() => { setType('expense'); playSound('notify', 'system'); }}
              className={cn(
                "flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                type === 'expense' ? "bg-rose-500 text-white shadow-lg" : "text-zinc-500"
              )}
            >
              Expense
            </button>
            <button 
              onClick={() => { setType('income'); playSound('notify', 'system'); }}
              className={cn(
                "flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                type === 'income' ? "bg-emerald-500 text-white shadow-lg" : "text-zinc-500"
              )}
            >
              Income
            </button>
          </div>
          
          <div className="flex gap-2">
            <button onClick={toggleVoice} className="p-3 bg-zinc-100 dark:bg-white/5 rounded-2xl text-zinc-500 hover:text-indigo-600 transition-colors">
              <Mic size={18} />
            </button>
            {HAS_AI && (
              <>
                <button onClick={onCameraClick} className="p-3 bg-zinc-100 dark:bg-white/5 rounded-2xl text-zinc-500 hover:text-indigo-600 transition-colors relative">
                  <Camera size={18} />
                  {photosRemaining > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center">
                      {photosRemaining}
                    </span>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={onFileSelected}
                  className="hidden"
                />
              </>
            )}
          </div>
        </div>

        {/* Amount Card — responsive, scales down with input length */}
        <div className="flex flex-col items-center justify-center py-4 sm:py-6">
           <div className="flex items-start justify-center gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-zinc-300 dark:text-zinc-700 mt-1">{getCurrencySymbol(preferences.baseCurrency)}</span>
              <motion.span
                key={amount}
                initial={{ scale: 0.95, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                className={cn(
                  "font-black tracking-tighter tabular-nums text-zinc-900 dark:text-white transition-all",
                  amount.length > 8 ? "text-3xl sm:text-4xl" : amount.length > 5 ? "text-4xl sm:text-5xl" : "text-5xl sm:text-6xl"
                )}
              >
                {amount || '0'}
              </motion.span>
           </div>
           <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-400 mt-1">Tap numpad to enter amount</p>
        </div>

        {/* Note Input */}
        <div className="px-4">
          <div className="relative">
            <input 
              type="text"
              placeholder="What's this for? (Optional note)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-zinc-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/30 dark:focus:border-white/20 rounded-[2rem] px-6 py-4 text-sm font-medium focus:outline-none transition-all pr-12"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400">
              <Sparkles size={16} />
            </div>
          </div>
        </div>

        {/* Category Carousel — compact */}
        <div className="px-2 overflow-hidden">
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.label}
                onClick={() => { setCategory(cat.label); playSound('notify', 'system'); }}
                className={cn(
                  "min-w-[68px] flex flex-col items-center justify-center gap-1.5 p-2 rounded-2xl border transition-all shrink-0 font-bold",
                  category === cat.label
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "bg-white dark:bg-white/5 border-zinc-100 dark:border-white/5 text-zinc-500 hover:border-indigo-600/30"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
                  category === cat.label ? "bg-white/20" : "bg-zinc-100 dark:bg-white/10"
                )}>
                  <cat.icon size={16} className={category === cat.label ? "text-white" : "text-zinc-500 dark:text-zinc-400"} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-wider">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Interface: Numpad + Save */}
      <div className="mt-auto bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-white/10 -mx-4 px-8 pt-8 pb-32 md:pb-12 rounded-t-[3rem] shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.1)]">
        <div className="grid grid-cols-3 gap-y-4 gap-x-8 mb-8">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'BS'].map((val) => (
            <button
              key={val}
              onClick={() => handleNumpad(val)}
              className="h-12 flex items-center justify-center rounded-2xl text-2xl font-black text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/5 active:scale-95 transition-all"
            >
              {val === 'BS' ? (
                 <div className="w-10 h-10 bg-zinc-100 dark:bg-white/10 rounded-xl flex items-center justify-center">
                    <Eraser size={20} />
                 </div>
              ) : val}
            </button>
          ))}
        </div>

        <button 
          onClick={handleSave}
          disabled={!amount || isSaving}
          className={cn(
            "w-full py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all disabled:opacity-50",
            type === 'expense' ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-2xl" : "bg-emerald-600 text-white shadow-2xl shadow-emerald-500/20"
          )}
        >
          {isSaving ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
               <Plus size={14} className="stroke-[3]" />
            </div>
          )}
          {isSaving ? 'Synchronizing...' : `Record ${type}`}
        </button>
      </div>

      {/* Modals */}
      <Modal 
        isOpen={isListening} 
        onClose={() => setIsListening(false)} 
        title="Tactile Voice Sync"
      >
        <div className="space-y-10 text-center py-10">
          <div className="flex justify-center items-end gap-1.5 h-20">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  height: [10, Math.random() * 60 + 20, 10],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{ 
                  duration: 0.4, 
                  repeat: Infinity,
                  delay: i * 0.05
                }}
                className="w-3 bg-indigo-600 rounded-full"
              />
            ))}
          </div>
          <div className="space-y-2">
            <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest italic">Capturing Audio Pulse</p>
            <p className="text-xl font-bold italic">"Dinner at Bistro for $45.00"</p>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showScanner}
        onClose={() => { if (!isScanning) setShowScanner(false); }}
        title="Receipt Photo Scan"
      >
        <div className="space-y-6">
          <div className="aspect-square bg-zinc-900 rounded-[3rem] border-2 border-indigo-500/30 relative overflow-hidden">
            {isScanning ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-indigo-600/5">
                <div className="relative">
                  <Loader2 className="animate-spin text-indigo-400" size={64} />
                  <Sparkles className="absolute -top-2 -right-2 text-white animate-pulse" size={24} />
                </div>
                <div className="text-center">
                  <p className="text-indigo-400 font-black uppercase tracking-[0.2em] text-[10px] animate-pulse">Reading receipt</p>
                  <p className="text-white font-bold text-sm mt-2">Extracting amount & merchant…</p>
                </div>
                <motion.div
                  initial={{ top: '0%' }}
                  animate={{ top: '100%' }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  className="absolute left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_20px_rgba(129,140,248,1)]"
                />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-4 text-zinc-500 px-8 text-center">
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <Scan size={48} className="opacity-40" />
                </div>
                <div>
                  <p className="text-white font-bold mb-1">Snap a receipt</p>
                  <p className="text-xs text-zinc-500">
                    {photosRemaining > 0
                      ? `${photosRemaining} of ${PHOTO_QUOTA_LIMIT} free scans remaining.`
                      : 'Free quota depleted.'}
                  </p>
                </div>
                {scanError && (
                  <div className="flex items-center gap-2 text-rose-400 text-xs font-bold mt-2">
                    <AlertCircle size={14} /> {scanError}
                  </div>
                )}
              </div>
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isScanning || photosRemaining <= 0}
            className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-indigo-500 transition-all disabled:opacity-50 shadow-xl shadow-indigo-500/20"
          >
            {isScanning ? 'Processing…' : photosRemaining > 0 ? 'Take or pick photo' : 'Quota depleted'}
          </button>
        </div>
      </Modal>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
}
