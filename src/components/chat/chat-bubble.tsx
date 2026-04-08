"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  content: string;
  role: "user" | "assistant";
  isStreaming?: boolean;
}

export function ChatBubble({ content, role, isStreaming = false }: ChatBubbleProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={cn("flex", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[88%] px-5 py-3.5 rounded-3xl text-[14px] leading-[1.6] transition-all duration-300",
          isUser
            ? "bg-primary text-white font-medium shadow-[0_8px_20px_-5px_rgba(99,102,241,0.4)] rounded-br-lg"
            : "glass-premium !bg-white/60 !backdrop-blur-3xl text-slate-900/90 font-medium border-white/80 shadow-[0_4px_15px_rgba(0,0,0,0.03)] rounded-bl-lg"
        )}
      >
        <div className="whitespace-pre-wrap break-words">
          {content}
        </div>
        {isStreaming && (
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block ml-1.5 w-1.5 h-4 bg-primary/40 rounded-full align-middle"
          />
        )}
      </div>
    </motion.div>
  );
}
