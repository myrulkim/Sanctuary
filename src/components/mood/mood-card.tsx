"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getMoodConfig } from "@/lib/constants/moods";
import { MoodType } from "@/lib/types";
import { formatDate, formatTime } from "@/lib/utils";

interface MoodCardProps {
  mood: MoodType;
  reflection?: string;
  date?: Date;
  compact?: boolean;
}

export function MoodCard({ mood, reflection, date, compact = false }: MoodCardProps) {
  const config = getMoodConfig(mood);

  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "premium-card p-4 flex items-center gap-4 cursor-default border-white/5 bg-white/[0.02]"
        )}
      >
        <div
          className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg transition-transform",
            config.bgClass
          )}
        >
          {config.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground tracking-tight">{config.label}</p>
          {reflection && (
            <p className="text-xs text-muted-foreground truncate opacity-70">{reflection}</p>
          )}
        </div>
        {date && (
          <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/40">
            {formatTime(date)}
          </span>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("premium-card p-8 space-y-5 gradient-border transition-all duration-500")}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-xl",
            config.bgClass
          )}
        >
          {config.emoji}
        </div>
        <div>
          <h3 className="font-heading text-xl font-bold text-foreground tracking-tight">
            {config.label}
          </h3>
          {date && (
            <p className="text-xs font-medium text-muted-foreground/60 mt-1 uppercase tracking-widest">
              {formatDate(date)} • {formatTime(date)}
            </p>
          )}
        </div>
      </div>

      {reflection && (
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 rounded-full" />
          <p className="text-base text-muted-foreground leading-relaxed pl-5 italic opacity-80">
            &quot;{reflection}&quot;
          </p>
        </div>
      )}
    </motion.div>
  );
}
