"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MOODS } from "@/lib/constants/moods";
import { MoodType } from "@/lib/types";
import { useTranslation } from "@/contexts/language-context";

interface MoodSelectorProps {
  selectedMood: MoodType | null;
  onSelect: (mood: MoodType) => void;
}

export function MoodSelector({ selectedMood, onSelect }: MoodSelectorProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-3xl md:text-5xl font-bold tracking-tight text-slate-800 leading-tight"
        >
          Apa khabar jiwa anda?
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[12px] uppercase tracking-[0.4em] font-bold text-primary/60"
        >
          MARI RINGANKAN BEBAN FIKIRAN ANDA
        </motion.p>
      </div>

      {/* Mood Carousel Container */}
      <div className="relative w-full overflow-visible py-4">
        <div className="flex overflow-x-auto gap-8 px-[30%] pb-12 snap-x snap-mandatory no-scrollbar scroll-smooth">
          {MOODS.map((mood) => {
            const isSelected = selectedMood === mood.type;

            return (
              <motion.button
                key={mood.type}
                onClick={() => onSelect(mood.type)}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "snap-center shrink-0 relative flex flex-col items-center gap-6 transition-all duration-700",
                  isSelected ? "scale-125 z-10" : "scale-75 opacity-50"
                )}
              >
                {/* Pedestal Glass Circle */}
                <div className={cn(
                  "relative w-32 h-32 md:w-36 md:h-36 rounded-full flex items-center justify-center transition-all duration-700",
                  "bg-white/40 backdrop-blur-xl border border-white/60",
                  isSelected 
                    ? "shadow-[0_20px_50px_rgba(99,102,241,0.2)] border-white/90 scale-110" 
                    : "shadow-none"
                )}>
                  {/* Subtle Inner Glow */}
                  <div className={cn(
                    "absolute inset-2 rounded-full transition-opacity duration-700",
                    isSelected ? "opacity-30" : "opacity-0",
                    mood.bgClass || "bg-primary/20"
                  )} />
                  
                  <span className="text-5xl md:text-6xl relative z-10 filter drop-shadow-2xl select-none">
                    {mood.emoji}
                  </span>

                  {/* iOS 26 Specular Highlight Ring */}
                  {isSelected && (
                    <motion.div 
                      layoutId="mood-aura"
                      className="absolute -inset-2 rounded-full border-2 border-white/50 opacity-50"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </div>

                {/* Label */}
                <div className={cn(
                  "transition-all duration-700 text-center",
                  isSelected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}>
                  <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase">
                    {t(mood.type)}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Description below carousel */}
      <AnimatePresence mode="wait">
        {selectedMood && (
          <motion.div
            key={selectedMood}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center gap-2"
          >
            <p className="text-sm text-slate-500 text-center max-w-sm font-light italic leading-relaxed">
              &quot;{MOODS.find((m) => m.type === selectedMood)?.description}&quot;
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
