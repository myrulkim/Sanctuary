"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wind, Play, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function BreathingCard() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"Inhale" | "Hold" | "Exhale" | "Ready">("Ready");
  const [timer, setTimer] = useState(0);
  const [totalTimeLeft, setTotalTimeLeft] = useState(30);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && totalTimeLeft > 0) {
      interval = setInterval(() => {
        setTotalTimeLeft((prev) => prev - 1);
        setTimer((prev) => {
          const next = prev + 1;
          if (next <= 4) setPhase("Inhale");
          else if (next <= 6) setPhase("Hold");
          else if (next <= 10) setPhase("Exhale");
          else return 0;
          return next;
        });
      }, 1000);
    } else if (totalTimeLeft === 0) {
      setIsActive(false);
      setIsComplete(true);
      setPhase("Ready");
      
      // Persist the focus progress
      const currentFocus = parseInt(localStorage.getItem("totalFocusSeconds") || "0");
      localStorage.setItem("totalFocusSeconds", (currentFocus + 30).toString());
      window.dispatchEvent(new Event("focusUpdate"));

      setTimeout(() => setIsComplete(false), 5000);
    }

    return () => clearInterval(interval);
  }, [isActive, totalTimeLeft]);

  const handleToggle = () => {
    if (isActive) {
      setIsActive(false);
      setTotalTimeLeft(30);
    } else {
      setIsComplete(false);
      setTotalTimeLeft(30);
      setIsActive(true);
    }
  };

  return (
    <div className="bento-card flex flex-col items-center justify-between min-h-[300px] relative overflow-hidden group">
      {/* Focus Glow */}
      <div className={cn(
        "absolute inset-0 transition-all duration-1000 opacity-20 blur-[60px]",
        phase === "Inhale" ? "bg-emerald-400 scale-150" : 
        phase === "Exhale" ? "bg-blue-400 scale-125" : "bg-primary/20"
      )} />

      <div className="flex justify-between items-center w-full relative z-10">
        <div className="flex flex-col">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900/40">Mindfulness Breathing</h3>
          {isActive && (
            <span className="text-[9px] font-black text-primary mt-1">{totalTimeLeft}s remaining</span>
          )}
        </div>
        <Wind className={cn(
          "w-4 h-4 text-primary transition-all duration-500",
          isActive && "animate-pulse"
        )} />
      </div>

      {/* The Crystal Lung - Animation */}
      <div className="relative flex items-center justify-center flex-1 w-full py-6">
        <AnimatePresence mode="wait">
          {isComplete ? (
            <motion.div
              key="complete"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Great Job!</span>
              <p className="text-[8px] text-slate-400 mt-2">BREATH OF LIFE RESTORED</p>
            </motion.div>
          ) : (
            <motion.div
              key="lung"
              animate={{
                scale: phase === "Inhale" ? 1.4 : phase === "Hold" ? 1.4 : 1,
                opacity: isActive ? 1 : 0.4,
              }}
              transition={{ duration: phase === "Hold" ? 2 : 4, ease: "easeInOut" }}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full glass-premium flex items-center justify-center border-white/60 relative"
            >
              <motion.span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                {isActive ? phase : "Focus"}
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Bar (Bottom) */}
      {isActive && (
        <div className="absolute bottom-0 left-0 h-1 bg-primary/20 w-full">
          <motion.div 
            initial={{ width: "100%" }}
            animate={{ width: `${(totalTimeLeft / 30) * 100}%` }}
            transition={{ duration: 1, ease: "linear" }}
            className="h-full bg-primary"
          />
        </div>
      )}

      {/* Control Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        className="relative z-10 w-full rounded-2xl border border-white/40 bg-white/30 backdrop-blur-md text-[10px] font-black uppercase tracking-widest hover:bg-white/50 active:scale-95 transition-all mt-4"
      >
        {isActive ? (
          <><Square className="w-3 h-3 mr-2 fill-current" /> Reset Session</>
        ) : (
          <><Play className="w-3 h-3 mr-2 fill-current" /> Start 30s Zen</>
        )}
      </Button>
    </div>
  );
}
