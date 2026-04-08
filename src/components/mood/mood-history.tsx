"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getDayName, getLast7Days, getDateString } from "@/lib/utils";
import { getMoodConfig } from "@/lib/constants/moods";
import { MoodEntry } from "@/lib/types";

interface MoodHistoryProps {
  entries: MoodEntry[];
}

export function MoodHistory({ entries }: MoodHistoryProps) {
  const days = getLast7Days();

  // Map entries by date
  const entryMap = new Map<string, MoodEntry>();
  entries.forEach((entry) => {
    entryMap.set(entry.date, entry);
  });

  const maxScore = 5;

  return (
    <div className="space-y-4">
      <h3 className="font-heading text-lg font-semibold text-foreground">
        This Week
      </h3>

      <div className="flex items-end gap-2 h-40">
        {days.map((day, index) => {
          const dateStr = getDateString(day);
          const entry = entryMap.get(dateStr);
          const config = entry ? getMoodConfig(entry.mood) : null;
          const heightPercent = entry
            ? (entry.moodScore / maxScore) * 100
            : 0;
          const isToday = dateStr === getDateString(new Date());

          return (
            <div
              key={dateStr}
              className="flex-1 flex flex-col items-center gap-2"
            >
              {/* Bar */}
              <div className="w-full h-28 flex items-end justify-center">
                {entry ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: `${heightPercent}%`,
                      opacity: 1,
                    }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100,
                    }}
                    className={cn(
                      "w-full max-w-[36px] rounded-t-lg relative group cursor-pointer",
                      config?.bgClass
                    )}
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      <span className="text-xs bg-card px-2 py-1 rounded-lg shadow-lg border border-border">
                        {config?.emoji} {config?.label}
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="w-full max-w-[36px] h-2 rounded-full bg-muted/30"
                  />
                )}
              </div>

              {/* Day label */}
              <span
                className={cn(
                  "text-[10px] font-medium",
                  isToday
                    ? "text-primary font-bold"
                    : "text-muted-foreground"
                )}
              >
                {getDayName(day)}
              </span>

              {/* Today indicator */}
              {isToday && (
                <motion.div
                  layoutId="today-dot"
                  className="w-1.5 h-1.5 rounded-full bg-primary"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Trend message */}
      {entries.length >= 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="glass-card p-3 text-center"
        >
          <p className="text-xs text-muted-foreground">
            {getTrendMessage(entries)}
          </p>
        </motion.div>
      )}
    </div>
  );
}

function getTrendMessage(entries: MoodEntry[]): string {
  if (entries.length < 2) return "Keep checking in to see your trends ✨";

  const recent = entries.slice(-3);
  const avgScore =
    recent.reduce((sum, e) => sum + e.moodScore, 0) / recent.length;

  if (avgScore >= 4) return "You've been feeling great lately! Keep it up 🌟";
  if (avgScore >= 3) return "Things are steady. Every day is a new beginning 🌱";
  if (avgScore >= 2)
    return "It's been tough, but you're showing up for yourself 💜";
  return "Remember, it's okay to not be okay. You're not alone 🫂";
}
