"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChatBubble } from "./chat-bubble";
import { TypingIndicator } from "./typing-indicator";
import { useAuth } from "@/contexts/auth-context";
import { saveChatMessage, getChatHistory } from "@/lib/firebase/firestore";
import { MoodType } from "@/lib/types";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatWindowProps {
  currentMood?: MoodType | null;
  initialMessage?: string;
  onAiResponse?: (response: string) => void;
  compact?: boolean;
  sessionId?: string;
}

const QUICK_PROMPTS = [
  "I need to vent 💭",
  "Give me encouragement 🌟",
  "Help me reflect 🪞",
];

export function ChatWindow({
  currentMood,
  initialMessage,
  onAiResponse,
  compact = false,
  sessionId: propSessionId,
}: ChatWindowProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [sessionId, setSessionId] = useState(propSessionId || Date.now().toString());
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync with prop
  useEffect(() => {
    if (propSessionId && propSessionId !== sessionId) {
      setSessionId(propSessionId);
      setInitialized(false);
      setMessages([]);
    }
  }, [propSessionId]);

  // Load chat history for this specific session
  useEffect(() => {
    if (user && !compact && !initialized) {
      getChatHistory(user.uid, sessionId).then((history) => {
        setMessages(history);
        setInitialized(true);
      });
    } else {
      setInitialized(true);
    }
  }, [user, compact, initialized, sessionId]);

  // Handle initial message
  useEffect(() => {
    if (initialMessage && initialized && messages.length === 0) {
      handleSend(initialMessage);
    }
  }, [initialMessage, initialized]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  async function handleSend(text?: string) {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    if (user && !compact) {
      saveChatMessage(user.uid, "user", messageText, sessionId, currentMood || undefined);
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          mood: currentMood,
        }),
      });

      if (!response.ok) throw new Error("Failed to get AI response");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsLoading(false);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          fullResponse += chunk;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsg.id ? { ...m, content: fullResponse } : m
            )
          );
        }
      }

      if (user && !compact) {
        saveChatMessage(user.uid, "assistant", fullResponse, sessionId);
      }
      if (onAiResponse) onAiResponse(fullResponse);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again in a moment 💛",
      };
      setMessages((prev) => [...prev, errorMsg]);
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col w-full h-full bg-transparent overflow-hidden")}>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 pb-24"
      >
        {messages.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-4"
          >
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}>
              <Sparkles className="w-10 h-10 text-primary/60" />
            </motion.div>
            <div>
              <p className="text-slate-900 font-black mb-1 text-lg">I&apos;m here for you</p>
              <p className="text-slate-500 font-medium text-sm">Share what&apos;s on your mind, or try one of these:</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {QUICK_PROMPTS.map((prompt) => (
                <motion.button
                  key={prompt}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSend(prompt)}
                  className="bg-white/40 backdrop-blur-md border border-black/[0.05] px-4 py-2 rounded-2xl text-xs font-black text-slate-800 uppercase tracking-widest shadow-sm"
                >
                  {prompt}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              content={msg.content}
              role={msg.role}
              isStreaming={
                msg.role === "assistant" &&
                msg.id === messages[messages.length - 1]?.id &&
                msg.content.length > 0 &&
                isLoading
              }
            />
          ))}
        </AnimatePresence>

        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <TypingIndicator />
        )}
      </div>

      <div className="shrink-0 p-4 pt-1 bg-gradient-to-t from-white/90 to-transparent">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2 glass-premium p-1.5 !rounded-full border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.08)] items-center"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your thoughts..."
            className="flex-1 h-9 bg-transparent px-5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="shrink-0 w-9 h-9 rounded-full primary-btn-glow shadow-md flex items-center justify-center"
            size="icon"
          >
            <ArrowUp className="w-5 h-5 stroke-[2.5]" />
          </Button>
        </form>
      </div>
    </div>
  );
}
