"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronLeft, Wind, CheckCircle2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BreathingPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [phaseTime, setPhaseTime] = useState(4);
  const [totalTimeLeft, setTotalTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive && totalTimeLeft > 0) {
      timer = setInterval(() => {
        // Decrease total session time
        setTotalTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            setIsCompleted(true);
            return 0;
          }
          return prev - 1;
        });

        // Handle phases
        setPhaseTime((prev) => {
          if (prev <= 1) {
            if (phase === "inhale") {
              setPhase("hold");
              return 4;
            } else if (phase === "hold") {
              setPhase("exhale");
              return 4;
            } else {
              setPhase("inhale");
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, phase, totalTimeLeft]);

  const getStatusText = () => {
    switch (phase) {
      case "inhale": return "Breathe In";
      case "hold": return "Hold";
      case "exhale": return "Breathe Out";
    }
  };

  const restartSession = () => {
    setTotalTimeLeft(30);
    setPhaseTime(4);
    setPhase("inhale");
    setIsActive(true);
    setIsCompleted(false);
  };

  return (
    <div className="min-h-screen bg-emerald-50/50 flex flex-col items-center justify-between pb-20 pt-10 px-6 overflow-hidden">
      <div className="w-full max-w-md flex items-center justify-between z-20">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-white/80 shadow-sm flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5 text-emerald-900" />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-black text-emerald-900 tracking-tight">Breathing</h1>
          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest leading-none">
            {isCompleted ? "Session Complete" : `${totalTimeLeft}s remaining`}
          </p>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full gap-12 relative">
        <AnimatePresence mode="wait">
          {!isCompleted ? (
            <motion.div
              key="active"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex flex-col items-center gap-12"
            >
              {/* Animated Circle */}
              <div className="relative flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: phase === "inhale" ? 1.5 : phase === "exhale" ? 1 : 1.5,
                    opacity: phase === "hold" ? 0.3 : 0.6,
                  }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                  className="absolute w-40 h-40 md:w-60 md:h-60 rounded-full bg-sky-400 blur-3xl pointer-events-none"
                />
                
                <motion.div
                  animate={{
                    scale: phase === "inhale" ? 1.4 : phase === "hold" ? 1.4 : 1,
                  }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                  className="w-48 h-48 md:w-72 md:h-72 rounded-full border-4 border-white/50 bg-white/20 backdrop-blur-xl flex flex-col items-center justify-center relative z-10 shadow-inner"
                >
                  <Wind className={cn("w-10 h-10 text-sky-500 mb-4 transition-transform duration-[4000ms]", phase === "inhale" ? "scale-125" : "scale-100")} />
                  <span className="text-2xl font-black text-sky-900 tracking-tight mb-2 uppercase">
                    {getStatusText()}
                  </span>
                  <span className="text-4xl font-black text-sky-500">{phaseTime}</span>
                </motion.div>
              </div>

              <div className="text-center max-w-xs">
                <p className="text-sm font-medium text-sky-800/60 leading-relaxed">
                  Focus on your breath. Let out all the tension as you exhale.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="completed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center text-center gap-8 px-8"
            >
              <div className="w-24 h-24 rounded-[2.5rem] bg-emerald-100 flex items-center justify-center shadow-lg border-4 border-white">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              </div>
              
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">Well done.</h2>
                <p className="text-[10px] font-bold text-sky-500 uppercase tracking-[0.4em] pt-4">Session Finished • 30s</p>
              </div>

              <div className="flex flex-col w-full gap-4 pt-4">
                <button
                  onClick={restartSession}
                  className="w-full py-4 bg-sky-500 text-white rounded-3xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 hover:bg-sky-600 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Breathe Again
                </button>
                <button
                  onClick={() => router.back()}
                  className="w-full py-4 bg-white text-slate-500 rounded-3xl font-black uppercase tracking-widest text-[11px] border border-slate-100"
                >
                  Back to Dashboard
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!isCompleted && (
        <div className="w-full max-w-xs z-20">
          <button
            onClick={() => setIsActive(!isActive)}
            className={cn(
              "w-full py-5 rounded-3xl font-black uppercase tracking-[0.2em] shadow-xl transition-all",
              isActive 
                ? "bg-white text-sky-500 shadow-sky-200" 
                : "bg-sky-500 text-white shadow-sky-500/30"
            )}
          >
            {isActive ? "Pause" : totalTimeLeft < 30 ? "Resume" : "Start 30s Session"}
          </button>
        </div>
      )}
    </div>
  );
}
