"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronLeft, Quote, RefreshCw, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

const QUOTES = [
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "You have power over your mind — not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
  { text: "Do not judge each day by the harvest you reap but by the seeds that you plant.", author: "Robert Louis Stevenson" },
  { text: "The only thing we have to fear is fear itself.", author: "Franklin D. Roosevelt" },
  { text: "Injustice anywhere is a threat to justice everywhere.", author: "Martin Luther King Jr." },
  { text: "The best way to find yourself is to lose yourself in the service of others.", author: "Mahatma Gandhi" },
  { text: "Kindness is a mark of faith, and whoever is not kind has no faith.", author: "Prophet Muhammad (Peace be upon him)" }
];

export default function MotivationPage() {
  const router = useRouter();
  const [quote, setQuote] = useState(QUOTES[0]);
  const [loading, setLoading] = useState(false);

  const refreshQuote = () => {
    setLoading(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * QUOTES.length);
      setQuote(QUOTES[randomIndex]);
      setLoading(false);
    }, 600);
  };

  useEffect(() => {
    refreshQuote();
  }, []);

  return (
    <div className="min-h-screen bg-emerald-50/50 flex flex-col p-6 items-center">
      <div className="w-full max-w-lg flex items-center justify-between mt-4">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
          <ChevronLeft className="w-5 h-5 text-emerald-900" />
        </button>
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Daily Wisdom</span>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full gap-12 text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-[2.5rem] flex items-center justify-center shadow-inner">
          <Quote className="w-10 h-10 text-emerald-600" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={quote.text}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <h2 className={cn(
               "text-2xl md:text-4xl font-black text-slate-900 leading-tight",
               loading && "blur-sm opacity-50 transition-all duration-300"
            )}>
              &quot;{quote.text}&quot;
            </h2>
            <p className="text-emerald-600 font-bold uppercase tracking-widest text-xs">— {quote.author}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="w-full max-w-sm flex gap-4 mb-20">
        <button
          onClick={refreshQuote}
          disabled={loading}
          className="flex-1 py-5 bg-white border border-emerald-200 rounded-3xl flex items-center justify-center gap-3 shadow-lg hover:shadow-xl active:scale-95 transition-all outline-none"
        >
          <RefreshCw className={cn("w-5 h-5 text-emerald-600", loading && "animate-spin")} />
          <span className="font-black uppercase tracking-widest text-[10px] text-slate-900">Get New Insight</span>
        </button>
      </div>
    </div>
  );
}
