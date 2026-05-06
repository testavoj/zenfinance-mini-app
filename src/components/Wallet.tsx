import React, { useState } from 'react';
import { 
  Wifi, 
  Smartphone, 
  ShieldCheck, 
  CreditCard, 
  History, 
  ArrowUpRight, 
  MapPin,
  CheckCircle2,
  Nfc
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../AppContext';
import { formatCurrency, cn } from '../lib/utils';
import { useSound } from '../lib/useSound';

export default function Wallet() {
  const { transactions, addTransaction } = useApp();
  const { playSound } = useSound();
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedCard, setSelectedCard] = useState(0);
  const [nfcEnabled, setNfcEnabled] = useState(false); // Default to false to show the menu

  const cards = [
    { id: 1, type: 'Visa', last4: '4821', color: 'bg-gradient-to-br from-indigo-600 to-purple-700', bank: 'Zen Global' },
    { id: 2, type: 'Mastercard', last4: '9902', color: 'bg-gradient-to-br from-zinc-800 to-zinc-900', bank: 'BOA Premium' },
    { id: 3, type: 'Amex', last4: '1004', color: 'bg-gradient-to-br from-emerald-600 to-teal-700', bank: 'Business Gold' },
  ];

  const handleTapToPay = () => {
    playSound('notify', 'system');
    setIsPaying(true);
    
    // Simulate NFC connection and processing
    setTimeout(() => {
      const amount = (Math.random() * 50 + 5).toFixed(2);
      const vendors = ['Starbucks', 'Uber', 'Apple Store', 'Netflix', 'Whole Foods'];
      const vendor = vendors[Math.floor(Math.random() * vendors.length)];
      
      addTransaction({
        amount: parseFloat(amount),
        category: 'Shopping',
        type: 'expense',
        description: `ZenPay at ${vendor}`
      });

      setIsPaying(false);
      setPaymentSuccess(true);
      playSound('success', 'payment');
      
      setTimeout(() => setPaymentSuccess(false), 3000);
    }, 2500);
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-2 text-zinc-900 dark:text-white">ZenPay Wallet</h2>
        <p className="text-zinc-500">Secure contactless payments & digital cards.</p>
      </div>

      {/* NFC Status Indicator */}
      <div className="flex items-center justify-center gap-3">
        <div className={cn(
          "flex items-center justify-center gap-3 py-2 px-4 rounded-full w-fit transition-all",
          nfcEnabled 
            ? "bg-emerald-500/10 border border-emerald-500/20" 
            : "bg-rose-500/10 border border-rose-500/20"
        )}>
          <div className={cn(
            "w-2 h-2 rounded-full",
            nfcEnabled ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
          )} />
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-widest flex items-center gap-2",
            nfcEnabled ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
          )}>
            <Nfc size={14} />
            {nfcEnabled ? "NFC Ready for Tap" : "NFC Disabled"}
          </span>
        </div>
      </div>

      {/* Card Carousel */}
      <div className="relative h-64 flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          {cards.map((card, i) => {
            const isSelected = selectedCard === i;
            if (!isSelected && Math.abs(selectedCard - i) > 1) return null;

            return (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, scale: 0.8, x: (i - selectedCard) * 100 }}
                animate={{ 
                  opacity: isSelected ? 1 : 0.4, 
                  scale: isSelected ? 1 : 0.9,
                  x: (i - selectedCard) * 280,
                  zIndex: isSelected ? 10 : 0
                }}
                className={cn(
                  "absolute w-[340px] h-[210px] rounded-[2rem] p-8 text-white shadow-2xl flex flex-col justify-between cursor-pointer transition-shadow",
                  card.color,
                  isSelected ? "shadow-indigo-500/20" : "grayscale-[0.5]"
                )}
                onClick={() => setSelectedCard(i)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">{card.bank}</p>
                    <h3 className="text-lg font-bold">{card.type} Platinum</h3>
                  </div>
                  <div className="w-12 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-md">
                    <Smartphone size={20} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-base sm:text-xl font-mono tracking-[0.25em] text-white/90 drop-shadow-sm">•••• •••• •••• {card.last4}</p>
                    <Wifi className="rotate-90 opacity-40 shrink-0" size={18} />
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-white/10">
                    <p className="text-[9px] sm:text-[10px] font-bold tracking-widest text-white/60">VALID THRU: 09/28</p>
                    <p className="text-[9px] sm:text-[10px] font-bold tracking-widest text-white/60">ALEX NOMAD</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Pay Action Area */}
      <div className="flex flex-col items-center gap-8 pt-8">
        {!nfcEnabled ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm bg-rose-500/10 border border-rose-500/20 rounded-3xl p-8 text-center space-y-4"
          >
            <div className="w-16 h-16 bg-rose-500/20 rounded-2xl flex items-center justify-center text-rose-500 mx-auto">
              <Smartphone size={32} />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-white">NFC Communication Offline</h3>
              <p className="text-xs text-zinc-500 mt-1">Please enable NFC in your system settings to use Tap to Pay functionality.</p>
            </div>
            <button 
              onClick={() => setNfcEnabled(true)}
              className="w-full py-3 bg-rose-500 text-white rounded-2xl font-bold text-sm hover:bg-rose-600 transition-colors"
            >
              Enable Protocol
            </button>
          </motion.div>
        ) : (
          <motion.button
            disabled={isPaying || paymentSuccess}
            onClick={handleTapToPay}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "w-48 h-48 rounded-full border-[8px] flex flex-col items-center justify-center gap-4 transition-all relative overflow-hidden",
              isPaying ? "border-indigo-600 bg-indigo-600/5" : "border-zinc-200 dark:border-white/10 hover:border-indigo-600/50",
              paymentSuccess && "border-emerald-500 bg-emerald-500/5"
            )}
          >
            {isPaying ? (
              <>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-indigo-600"
                >
                  <Nfc size={48} />
                </motion.div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Hold Near Terminal</span>
              </>
            ) : paymentSuccess ? (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-emerald-500"
                >
                  <CheckCircle2 size={48} />
                </motion.div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Payment Sent!</span>
              </>
            ) : (
              <>
                <div className="p-6 rounded-full bg-zinc-100 dark:bg-white/5 text-zinc-400 group-hover:text-indigo-600 transition-colors">
                  <Nfc size={48} />
                </div>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest text-center px-4">Tap to Pay</span>
              </>
            )}

            {isPaying && (
              <motion.div 
                className="absolute inset-0 border-t-4 border-indigo-600"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
            )}
          </motion.button>
        )}

        <div className="w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-[2.5rem] p-8 space-y-6 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Recent ZenPay Purchases</h3>
            <History size={18} className="text-zinc-400" />
          </div>

          <div className="space-y-4">
            {transactions.filter(t => t.description.includes('ZenPay')).slice(0, 3).map((t) => (
              <div key={t.id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-white/[0.02] rounded-2xl border border-zinc-100 dark:border-transparent group hover:border-indigo-500/20 transition-all">
                <div className="flex items-center gap-3 truncate">
                  <div className="w-10 h-10 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                    <ArrowUpRight size={20} className="rotate-90" />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-bold text-zinc-900 dark:text-white truncate max-w-[120px] sm:max-w-none">{t.description.replace('ZenPay at ', '')}</p>
                    <p className="text-[10px] text-zinc-500 font-medium">{new Date(t.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
                <p className="text-sm font-black tabular-nums tracking-tight text-zinc-900 dark:text-white shrink-0">-{formatCurrency(t.amount)}</p>
              </div>
            ))}
            {transactions.filter(t => t.description.includes('ZenPay')).length === 0 && (
              <p className="text-center text-zinc-500 text-sm py-8">No specific ZenPay history yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
