"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Clock, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getChatSessions } from "@/lib/firebase/firestore";
import { useAuth } from "@/contexts/auth-context";

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  currentSessionId?: string;
}

export function ChatSidebar({ isOpen, onClose, onNewChat, onSelectSession, currentSessionId }: ChatSidebarProps) {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    if (user && isOpen) {
      getChatSessions(user.uid).then((data) => {
        setSessions(data);
      });
    }
  }, [user, isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
          />

          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[280px] bg-white/80 backdrop-blur-3xl z-[101] shadow-2xl border-r border-white/40 flex flex-col"
          >
            <div className="p-6 flex items-center justify-between border-b border-black/[0.03]">
              <h3 className="font-heading font-black text-slate-900 tracking-tight">Reflections</h3>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="w-5 h-5 text-slate-400" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <Button
                onClick={() => {
                  onNewChat();
                  onClose();
                }}
                className="w-full justify-start gap-3 !rounded-2xl primary-btn-glow py-6 shadow-lg shadow-primary/20"
              >
                <Plus className="w-5 h-5" />
                <span className="font-bold">New Reflection</span>
              </Button>

              <div className="space-y-3">
                <div className="flex items-center gap-2 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <Clock className="w-3 h-3" />
                  History
                </div>
                
                <div className="space-y-1">
                  {sessions.length > 0 ? (
                    sessions.map((session) => (
                      <button
                        key={session.id}
                        onClick={() => {
                          onSelectSession(session.id);
                          onClose();
                        }}
                        className={`w-full text-left p-3 rounded-xl transition-all group flex items-start gap-3 ${
                          currentSessionId === session.id 
                            ? "bg-primary text-white shadow-md shadow-primary/20" 
                            : "hover:bg-black/[0.03] text-slate-600"
                        }`}
                      >
                        <MessageSquare className={`w-4 h-4 mt-1 shrink-0 ${
                          currentSessionId === session.id ? "text-white" : "text-slate-400 group-hover:text-primary"
                        }`} />
                        <span className={`text-xs font-medium line-clamp-1 ${
                          currentSessionId === session.id ? "text-white" : "group-hover:text-slate-900"
                        }`}>
                          {session.content}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="p-8 text-center space-y-2 opacity-30">
                      <MessageSquare className="w-8 h-8 mx-auto" />
                      <p className="text-[10px] font-bold">No history yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-black/[0.03] bg-black/[0.01]">
              <p className="text-[9px] font-medium text-center text-slate-400 uppercase tracking-widest">
                Sanctuary AI • Session Sync Active
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
