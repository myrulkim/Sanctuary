"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronLeft, Plus, Save, History, Book, Trash2, CheckCircle2, Edit3, X } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { saveDiaryEntry, getDiaryEntries, updateDiaryEntry } from "@/lib/firebase/firestore";
import { useTranslation } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

export default function DiaryPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    if (!user) return;
    try {
      const data = await getDiaryEntries(user.uid);
      setEntries(data);
    } catch (error) {
      console.error("Error loading diary:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !content.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        await updateDiaryEntry(user.uid, editingId, content);
      } else {
        await saveDiaryEntry(user.uid, content);
      }
      
      setContent("");
      setEditingId(null);
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 3000);
      loadHistory();
      setShowHistory(false); // Go back to history if they want after editing, or stay in editor. User choice. Let's stay in editor for now but clear content.
    } catch (error) {
      console.error("Error saving entry:", error);
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (entry: any) => {
    setContent(entry.content);
    setEditingId(entry.id);
    setShowHistory(false);
  };

  const cancelEditing = () => {
    setContent("");
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] pb-32">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/40 backdrop-blur-xl border-b border-black/[0.02] px-6 py-6 transition-all">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full glass-premium flex items-center justify-center hover:scale-110 active:scale-95 transition-all outline-none"
          >
            <ChevronLeft className="w-5 h-5 text-slate-900" />
          </button>
          
          <div className="absolute left-1/2 -translate-x-1/2 text-center">
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Book className="w-5 h-5 text-primary" />
              {t("my_diary")}
            </h1>
          </div>

          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={cn(
              "p-2.5 rounded-2xl flex items-center gap-2 transition-all group outline-none shadow-sm",
              showHistory ? "bg-primary text-white" : "bg-white border border-black/[0.05] text-slate-500 hover:bg-slate-50"
            )}
          >
            <History className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">
              {showHistory ? "Back to Write" : "History"}
            </span>
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-12">
        <AnimatePresence mode="wait">
          {!showHistory ? (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex flex-col items-center text-center space-y-2 relative">
                <span className="text-[11px] font-black text-primary uppercase tracking-[0.4em]">
                  {editingId ? "Editing Past Thought" : new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" })}
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
                  {editingId ? "Update your entry" : "What's on your mind?"}
                </h2>
                {editingId && (
                  <button 
                    onClick={cancelEditing}
                    className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-destructive transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Minimalist Editor Area */}
              <div className="relative group">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start writing your thoughts here..."
                  className="w-full min-h-[400px] bg-transparent text-xl md:text-2xl font-medium text-slate-800 placeholder:text-slate-300 leading-relaxed focus:outline-none resize-none px-4"
                />
              </div>

              {/* Elongated Save Button */}
              <div className="fixed bottom-10 left-0 right-0 px-6 flex justify-center z-40">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={saving || !content.trim()}
                  className={cn(
                    "w-full max-w-sm py-4 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] transition-all flex items-center justify-center gap-3 backdrop-blur-md border",
                    content.trim() 
                      ? "bg-primary text-white border-primary/20 shadow-primary/20" 
                      : "bg-white/80 text-slate-400 border-black/[0.03] cursor-not-allowed"
                  )}
                >
                  <Save className={cn("w-5 h-5 opacity-80", saving && "animate-pulse")} />
                  <span className="text-xs font-black uppercase tracking-[0.4em] ml-2">
                    {saving ? "Saving..." : editingId ? "Update Diary" : "Save Diary"}
                  </span>
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your Journal History</h2>
                <div className="bg-slate-100 px-4 py-2 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  {entries.length} Entries
                </div>
              </div>

              {entries.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {entries.map((entry) => (
                    <motion.div 
                      key={entry.id}
                      whileHover={{ scale: 1.01 }}
                      className="group bg-white border border-black/[0.03] rounded-3xl p-8 shadow-sm hover:shadow-md transition-all border-l-4 border-l-primary/30 relative"
                    >
                      <button 
                        onClick={() => startEditing(entry)}
                        className="absolute top-6 right-6 p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-primary/10 hover:text-primary transition-all opacity-0 group-hover:opacity-100"
                        title="Edit Entry"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest">
                          {entry.date}
                        </span>
                      </div>
                      <p className="text-lg font-medium text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {entry.content}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-32 text-center opacity-40">
                  <Book className="w-16 h-16 mx-auto mb-4" />
                  <p className="font-bold text-slate-900 uppercase tracking-widest">The pages are empty</p>
                  <p className="text-sm">Go back to write your first entry.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showSavedToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[60] bg-emerald-500 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-black uppercase tracking-widest text-[11px]">
              {editingId ? "Diary Updated!" : "Saved to your diary!"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
