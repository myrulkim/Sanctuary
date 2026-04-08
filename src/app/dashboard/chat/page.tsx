"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mountain, Menu as MenuIcon } from "lucide-react";
import { ChatWindow } from "@/components/chat/chat-window";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { Button } from "@/components/ui/button";

export default function ChatPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatKey, setChatKey] = useState(0);
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>(undefined);

  const handleNewChat = () => {
    setCurrentSessionId(undefined);
    setChatKey(prev => prev + 1);
  };

  const handleSelectSession = (id: string) => {
    setCurrentSessionId(id);
    setChatKey(prev => prev + 1); // Remount to ensure clean state
  };

  return (
    <div className="fixed inset-0 top-0 pb-24 md:pb-2 flex flex-col bg-transparent overflow-hidden z-[40]">
      <ChatSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        currentSessionId={currentSessionId}
      />
      
      <div className="max-w-2xl mx-auto w-full h-full flex flex-col bg-transparent relative z-10">
        {/* ... (Header stays the same) */}
        <div className="w-full shrink-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full bg-transparent p-4 flex items-center gap-3 border-b border-black/[0.03] backdrop-blur-sm"
          >
            {/* Sidebar Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
              className="rounded-xl bg-white/40 shadow-sm border border-white/60 -ml-1 mr-1"
            >
              <MenuIcon className="w-5 h-5 text-slate-700" />
            </Button>

            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center border border-white/20">
              <Mountain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-heading text-sm font-black text-slate-900 tracking-tight leading-none mb-1">
                Sanctuary
              </h2>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest opacity-70">
                  Always here for you
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Chat window area (Scrollable) */}
        <div className="flex-1 overflow-hidden relative">
          <ChatWindow key={chatKey} sessionId={currentSessionId} />
        </div>
      </div>
    </div>
  );
}
