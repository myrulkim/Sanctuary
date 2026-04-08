"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, BookOpen, Wind, Quote, Eye, Music2, Activity } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { getWeeklyMoods, getRecentMoods } from "@/lib/firebase/firestore";
import { MOODS } from "@/lib/constants/moods";
import { useTranslation } from "@/contexts/language-context";
import { getGreeting, cn } from "@/lib/utils";
import { MoodEntry } from "@/lib/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const { language, t } = useTranslation();
  const [weeklyMoods, setWeeklyMoods] = useState<MoodEntry[]>([]);
  const [latestMood, setLatestMood] = useState<MoodEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [focusSeconds, setFocusSeconds] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [centeredMood, setCenteredMood] = useState<string>("neutral");

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    
    const viewportCenter = container.scrollLeft + container.clientWidth / 2;
    let minDistance = Infinity;
    let closestIndex = 2;

    const children = Array.from(container.children);
    children.forEach((child, index) => {
       const childElement = child as HTMLElement;
       const childCenter = childElement.offsetLeft + childElement.clientWidth / 2;
       const distance = Math.abs(viewportCenter - childCenter);
       if (distance < minDistance) {
         minDistance = distance;
         closestIndex = index;
       }
    });
    
    if (MOODS[closestIndex]) {
      setCenteredMood(MOODS[closestIndex].type);
    }
  };

  useEffect(() => {
    setTimeout(handleScroll, 100);
    if (user) {
      Promise.all([
        getTodayMood(user.uid),
        getWeeklyMoods(user.uid),
        getRecentMoods(user.uid, 1)
      ]).then(([today, weekly, recent]) => {
        setWeeklyMoods(weekly);
        if (recent.length > 0) setLatestMood(recent[0]);
        setLoading(false);
      }).catch(() => setLoading(false));
    }

    const updateFocus = () => {
      const stored = localStorage.getItem("totalFocusSeconds") || "0";
      setFocusSeconds(parseInt(stored));
    };
    updateFocus();
    window.addEventListener("focusUpdate", updateFocus);
    
    return () => window.removeEventListener("focusUpdate", updateFocus);
  }, [user]);

  const greeting = getGreeting(language);
  const firstName = user?.displayName?.split(" ")[0] || "User";

  // Calculate Chart Data
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const targetDay = dayNames[i];
    const entry = weeklyMoods.find(m => {
      const date = m.createdAt instanceof Date ? m.createdAt : (m.createdAt as any).toDate?.() || new Date(m.createdAt as any);
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      return dayName === targetDay;
    });

    return {
      day: targetDay[0], 
      height: entry ? (entry.moodScore / 5) * 100 : 10,
      active: !!entry
    };
  });

  const stabilityPercentage = Math.round(
    weeklyMoods.reduce((acc, curr) => acc + (curr.moodScore / 5) * 100, 0) / (weeklyMoods.length || 1)
  );

  const streak = weeklyMoods.length;

  const lastNoteDate = latestMood 
    ? (latestMood.date === new Date().toISOString().split("T")[0] ? "Today" : 
       latestMood.date === new Date(Date.now() - 86400000).toISOString().split("T")[0] ? "Yesterday" : 
       latestMood.date)
    : "";

  return (
    <div className="max-w-4xl mx-auto px-6 pt-0 pb-32">
      {/* Unified Sticky Header */}
      <div className="sticky top-0 z-50 -mx-6 px-6 py-6 bg-white/[0.02] backdrop-blur-xl border-b border-white/10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <span className="text-[10px] font-black tracking-[0.6em] text-primary uppercase mb-2">
            Sanctuary
          </span>
          <h1 className="font-heading text-xl md:text-2xl font-black text-slate-900 leading-tight">
            {greeting}, <span className="gradient-text">{firstName}</span>
          </h1>
          <p className="text-[9px] text-primary font-black mt-1 tracking-[0.4em] uppercase opacity-40">
            {t("momentum_text")}
          </p>
        </motion.div>
      </div>

      <div className="pt-2 space-y-6">
        {/* Mood Selection Carousel - NEW SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative pt-6 pb-12 flex flex-col items-center text-center overflow-hidden"
        >
          <div className="flex flex-col items-center w-full">
            <span className="text-[10px] font-black tracking-[0.4em] text-primary/60 uppercase mb-5">
              Reflect with Sanctuary
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-10">
              How are you today?
            </h2>
            
            <div className="w-full relative overflow-visible">
              <div 
                ref={carouselRef}
                onScroll={handleScroll}
                className="flex overflow-x-auto gap-8 px-[30%] md:px-[35vw] pb-10 pt-4 no-scrollbar snap-x snap-mandatory scroll-smooth min-h-[160px] items-center"
              >
                {MOODS.map((mood) => {
                  const isCentered = centeredMood === mood.type;
                  
                  return (
                  <Link
                    key={mood.type}
                    href={`/dashboard/checkin?mood=${mood.type}`}
                    className="snap-center shrink-0 py-8 outline-none"
                  >
                    <motion.div
                      animate={{
                        scale: isCentered ? 1.3 : 0.8,
                        opacity: isCentered ? 1 : 0.4,
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      whileHover={{ scale: isCentered ? 1.35 : 0.9 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "flex flex-col items-center gap-4 transition-all group",
                        isCentered ? "z-10" : "z-0"
                      )}
                    >
                      <div className="w-20 h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center shadow-[0_15px_30px_rgba(0,0,0,0.1)] relative group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-shadow">
                        <div className={cn("absolute -inset-4 rounded-full opacity-0 group-hover:opacity-30 transition-opacity blur-2xl z-0", mood.bgClass, isCentered && "opacity-20")} />
                        <span className="w-full h-full filter drop-shadow-md relative z-10 select-none flex items-center justify-center">
                          {mood.emoji}
                        </span>
                      </div>
                      <span className={cn(
                        "text-[10px] font-black group-hover:text-primary transition-colors tracking-widest uppercase",
                        isCentered ? "text-primary" : "text-slate-400"
                      )}>
                        {t(mood.type)}
                      </span>
                    </motion.div>
                  </Link>
                  );
                })}
              </div>
              <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-transparent to-transparent pointer-events-none z-10" />
            </div>
          </div>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Weekly Trends */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-3 relative bento-card flex flex-col justify-between min-h-[220px] !p-6 overflow-hidden group/chart"
          >
            <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none">
              <img src="/crystal_bg.png" className="w-full h-full object-cover grayscale" alt="" />
            </div>

            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900/40">{t("weekly_trend")}</h3>
                <div className="flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/20" />
                  ))}
                </div>
              </div>

              <div className="h-32 flex items-end gap-2 px-1 relative">
                {chartData.map((data, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3 group/bar">
                    <div className="relative w-full flex flex-col items-center">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${data.height}%` }}
                        transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 + (i * 0.05) }}
                        className={cn(
                          "w-full max-w-[12px] rounded-full transition-all duration-500 relative",
                          data.active ? "bg-gradient-to-t from-primary/80 to-primary/40 border border-white/20" : "bg-slate-200 border border-transparent",
                          "group-hover/bar:from-primary group-hover/bar:to-indigo-500 group-hover/bar:shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                        )}
                      />
                    </div>
                    <span className={cn("text-[9px] font-black transition-colors", data.active ? "text-slate-900" : "text-slate-900/20")}>
                      {data.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* My Diary Action */}
          <Link href="/dashboard/diary" className="group md:col-span-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bento-card h-full flex flex-col items-center justify-center bg-white/40 backdrop-blur-xl text-center hover:scale-[1.02] active:scale-[0.98] transition-all border-white/60 !p-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]"
            >
              <div className="w-16 h-16 rounded-[2rem] bg-primary/10 flex items-center justify-center mb-6 group-hover:rotate-6 transition-all duration-500 shadow-sm border border-primary/5">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-black text-2xl text-slate-900 tracking-tight">{t("my_diary")}</h3>
              <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-[0.3em]">{t("diary_desc")}</p>
            </motion.div>
          </Link>

          {/* Mindfulness Section */}
          <div className="md:col-span-3 pt-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-primary rounded-full" />
              <h3 className="text-xl font-black text-slate-900 tracking-tight">{t("mindfulness")}</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {/* Breathing */}
              <Link href="/dashboard/mindfulness/breathing" className="group">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bento-card relative overflow-hidden group hover:scale-[1.03] transition-all duration-500 !p-6 aspect-square md:aspect-auto md:min-h-[160px] flex flex-col justify-between"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-sky-500/10 blur-[30px] rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />
                  <Wind className="w-8 h-8 text-sky-500 mb-4 group-hover:rotate-12 transition-transform" />
                  <div>
                    <h4 className="font-black text-slate-900 text-sm md:text-base leading-tight mb-1">{t("breathing")}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Find your pace</p>
                  </div>
                </motion.div>
              </Link>

              {/* Motivation */}
              <Link href="/dashboard/mindfulness/motivation" className="group">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bento-card relative overflow-hidden group hover:scale-[1.03] transition-all duration-500 !p-6 aspect-square md:aspect-auto md:min-h-[160px] flex flex-col justify-between"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 blur-[30px] rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />
                  <Quote className="w-8 h-8 text-amber-500 mb-4 group-hover:-rotate-12 transition-transform" />
                  <div>
                    <h4 className="font-black text-slate-900 text-sm md:text-base leading-tight mb-1">{t("motivation")}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Daily Wisdom</p>
                  </div>
                </motion.div>
              </Link>

              {/* Visualize */}
              <Link href="/dashboard/mindfulness/visualize" className="group">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bento-card relative overflow-hidden group hover:scale-[1.03] transition-all duration-500 !p-6 aspect-square md:aspect-auto md:min-h-[160px] flex flex-col justify-between"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/10 blur-[30px] rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />
                  <Eye className="w-8 h-8 text-indigo-500 mb-4 group-hover:scale-110 transition-transform" />
                  <div>
                    <h4 className="font-black text-slate-900 text-sm md:text-base leading-tight mb-1">{t("visualize")}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inner Peace</p>
                  </div>
                </motion.div>
              </Link>

              {/* Relaxing Sound */}
              <Link href="/dashboard/mindfulness/sounds" className="group">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bento-card relative overflow-hidden group hover:scale-[1.03] transition-all duration-500 !p-6 aspect-square md:aspect-auto md:min-h-[160px] flex flex-col justify-between"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/10 blur-[30px] rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />
                  <Music2 className="w-8 h-8 text-rose-500 mb-4 group-hover:bounce transition-transform" />
                  <div>
                    <h4 className="font-black text-slate-900 text-sm md:text-base leading-tight mb-1">{t("relaxing_sounds")}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ambient calm</p>
                  </div>
                </motion.div>
              </Link>
            </div>
          </div>

          {/* Bottom Stats Row */}
          <div className="md:col-span-3 grid grid-cols-2 gap-4 mt-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="bento-card !p-5 flex items-center justify-between group bg-emerald-50/20 border-emerald-500/5"
            >
              <div className="flex flex-col">
                <h3 className="text-[9px] font-black text-emerald-900/40 uppercase tracking-widest mb-1">Focus Flow</h3>
                <span className="text-2xl font-black text-emerald-600">
                  {focusSeconds >= 60 ? Math.floor(focusSeconds / 60) : focusSeconds}
                  <span className="text-[10px] ml-1 opacity-60 uppercase">{focusSeconds >= 60 ? "Mins" : "Secs"}</span>
                </span>
              </div>
              <Activity className="w-8 h-8 text-emerald-500/20 group-hover:text-emerald-500/40 transition-colors" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
              className="bento-card !p-5 flex items-center justify-between group bg-indigo-50/20 border-indigo-500/5"
            >
              <div className="flex flex-col">
                <h3 className="text-[9px] font-black text-indigo-900/40 uppercase tracking-widest mb-1">{t("daily_streak")}</h3>
                <span className="text-2xl font-black text-indigo-600">
                  {streak}
                  <span className="text-[10px] ml-1 opacity-60 uppercase">{t("days")}</span>
                </span>
              </div>
              <Sparkles className="w-8 h-8 text-indigo-500/20 group-hover:text-indigo-500/40 transition-colors" />
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
