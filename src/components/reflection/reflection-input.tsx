"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { QUICK_TAGS } from "@/lib/constants/moods";
import { useTranslation } from "@/contexts/language-context";

interface ReflectionInputProps {
  value: string;
  onChange: (value: string) => void;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

export function ReflectionInput({
  value,
  onChange,
  selectedTags,
  onTagToggle,
}: ReflectionInputProps) {
  const { t } = useTranslation();
  const maxLength = 500;
  const charCount = value.length;

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.1 }
        }
      }}
      className="space-y-6"
    >
      {/* Quick tags staggered */}
      <div className="flex flex-wrap justify-center gap-3">
        {QUICK_TAGS.map((tag) => (
          <motion.button
            key={tag}
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              show: { opacity: 1, scale: 1 }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onTagToggle(tag)}
            className={cn(
              "px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-300 shadow-sm",
              selectedTags.includes(tag)
                ? "bg-primary text-white shadow-[0_8px_20px_-6px_rgba(99,102,241,0.6)] translate-y-[-2px] border border-primary/20 hover:scale-105"
                : "bg-white/50 backdrop-blur-md text-slate-600 border-2 border-black/[0.04] shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:bg-white/80 hover:shadow-[0_4px_15px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 hover:border-primary/20"
            )}
          >
            {tag}
          </motion.button>
        ))}
      </div>

      {/* Elevated Textarea Container */}
      <div className="relative pt-4 w-full max-w-2xl mx-auto">
        <Textarea
          value={value}
          onChange={(e) => {
            if (e.target.value.length <= maxLength) {
              onChange(e.target.value);
            }
          }}
          placeholder={t("placeholder_safe_space") || "Let your thoughts flow freely. I'm listening..."}
          className="min-h-[220px] bg-white/40 backdrop-blur-xl border border-black/[0.04] rounded-3xl p-8 outline-none focus-visible:ring-4 focus-visible:ring-primary/15 focus-visible:border-primary/30 text-xl md:text-2xl font-medium text-center leading-relaxed text-slate-800 placeholder:text-slate-400/80 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] transition-all resize-none"
          id="reflection-textarea"
        />

        {/* Floating character count */}
        <div className="flex justify-center mt-6">
          <span
            className={cn(
              "text-[10px] font-bold tracking-[0.3em] uppercase transition-colors",
              charCount > maxLength * 0.9
                ? "text-destructive"
                : "text-muted-foreground/20"
            )}
          >
            {charCount} / {maxLength}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
