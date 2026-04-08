"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "navigation"; // User might have next/navigation
import { useRouter as useNextRouter } from "next/navigation";
import { ChevronLeft, Music2, Play, Pause, Volume2, CloudRain, Coffee, Trees, Wind } from "lucide-react";
import { cn } from "@/lib/utils";

const SOUNDS = [
  { 
    id: "rain", 
    name: "Soft Rain", 
    icon: <CloudRain className="w-5 h-5" />, 
    color: "bg-blue-500", 
    image: "/calm_cabin.png",
    url: "l5V-mF673tU"
  },
  { 
    id: "cafe", 
    name: "Cozy Cafe", 
    icon: <Coffee className="w-5 h-5" />, 
    color: "bg-amber-600", 
    image: "/calm_cafe.png",
    url: "gaGrHmU_y80"
  },
  { 
    id: "forest", 
    name: "Forest Birds", 
    icon: <Trees className="w-5 h-5" />, 
    color: "bg-emerald-600", 
    image: "/calm_forest.png",
    url: "6wn8TJR0GP8"
  },
  { 
    id: "zen", 
    name: "Zen Bowls", 
    icon: <Music2 className="w-5 h-5" />, 
    color: "bg-purple-600", 
    image: "/calm_zen.png",
    url: "5CQu9TjU_yM"
  }
];

export default function RelaxingSoundsPage() {
  const router = useNextRouter();
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleSound = (id: string) => {
    if (activeSound === id) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveSound(id);
      setIsPlaying(true);
    }
  };

  const currentSound = SOUNDS.find(s => s.id === activeSound);

  return (
    <div className="min-h-screen bg-emerald-50/30 flex flex-col items-center">
      {/* Invisible Audio Source (Active only on valid focus/interaction) */}
      <div className="absolute opacity-0 pointer-events-none w-1 h-1 overflow-hidden">
        {activeSound && isPlaying && (
          <iframe
            key={activeSound}
            src={`https://www.youtube.com/embed/${currentSound?.url}?autoplay=${isPlaying ? 1 : 0}&mute=0&controls=0&modestbranding=1&rel=0&loop=1&playlist=${currentSound?.url}&enablejsapi=1`}
            allow="autoplay; encrypted-media"
            title="Audio Player"
          ></iframe>
        )}
      </div>

      <div className="w-full max-w-lg mt-8 px-6 flex items-center justify-between z-10">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors">
          <ChevronLeft className="w-5 h-5 text-emerald-900" />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-black text-emerald-900 tracking-tight">Soundscape</h1>
          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Ambient Calm</p>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl w-full gap-8 py-10 px-6">
        {/* Main Immersive Display */}
        <div className="w-full relative aspect-[16/10] md:aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white backdrop-blur-xl group">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSound || "none"}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <img 
                src={currentSound?.image || "/crystal_bg.png"} 
                className="w-full h-full object-cover brightness-[0.7]" 
                alt="bg" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20">
            {activeSound ? (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex flex-col items-center gap-6"
              >
                <div className={cn(
                  "w-20 h-20 rounded-full flex items-center justify-center shadow-lg border-2 border-white/30 backdrop-blur-xl relative",
                  isPlaying && "animate-pulse"
                )}>
                  {isPlaying ? <Volume2 className="w-8 h-8 animate-bounce-slow" /> : <Play className="w-8 h-8 translate-x-0.5" />}
                </div>
                <div className="text-center">
                  <h2 className="text-3xl font-black tracking-tight">{currentSound?.name}</h2>
                  <p className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-60">
                    {isPlaying ? "Now Playing" : "Paused"}
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="text-center opacity-60 flex flex-col items-center gap-4">
                <Music2 className="w-12 h-12" />
                <p className="text-sm font-black uppercase tracking-widest">Select your vibe</p>
              </div>
            )}
          </div>
        </div>

        {/* 4 Cards Selection */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {SOUNDS.map((sound) => (
            <button
              key={sound.id}
              onClick={() => toggleSound(sound.id)}
              className={cn(
                "relative h-32 md:h-40 rounded-[2rem] overflow-hidden group transition-all duration-500 hover:scale-[1.03] active:scale-95 border-2",
                activeSound === sound.id ? "border-rose-300 shadow-xl" : "border-white"
              )}
            >
              <img 
                src={sound.image} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                alt={sound.name}
              />
              <div className={cn(
                "absolute inset-0 transition-colors duration-500",
                activeSound === sound.id ? "bg-black/20" : "bg-black/50 group-hover:bg-black/30"
              )} />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                <div className={cn(
                  "p-2.5 rounded-xl mb-2 transition-all",
                  activeSound === sound.id ? sound.color : "bg-white/10 backdrop-blur-md"
                )}>
                  {sound.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{sound.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Action Pill */}
      <div className="w-full max-w-sm mb-20 px-6">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          disabled={!activeSound}
          className={cn(
            "w-full py-5 rounded-full font-black uppercase tracking-[0.3em] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all outline-none border",
            isPlaying 
              ? "bg-emerald-500 text-white shadow-emerald-200 border-emerald-400" 
              : "bg-white text-emerald-500 border-emerald-100"
          )}
        >
          {isPlaying ? "PAUSE AMBIENCE" : "START AMBIENCE"}
        </button>
      </div>
    </div>
  );
}
