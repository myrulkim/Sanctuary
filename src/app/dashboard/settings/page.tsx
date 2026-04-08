"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  User as UserIcon, 
  Globe, 
  Save, 
  Check,
  ChevronRight,
  Shield,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { useTranslation } from "@/contexts/language-context";
import { cn } from "@/lib/utils";
import { updateProfile } from "firebase/auth";

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { language, setLanguage, t } = useTranslation();
  
  // Local state for settings
  const [tempName, setTempName] = useState(user?.displayName || "");
  const [tempLang, setTempLang] = useState(language);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (user?.displayName) setTempName(user.displayName);
  }, [user]);

  async function handleSave() {
    setIsSaving(true);
    try {
      // 1. Update Language in Context
      setLanguage(tempLang);
      
      // 2. Update Firebase Display Name if changed
      if (user && tempName !== user.displayName) {
        await updateProfile(user, { displayName: tempName });
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Save error:", error);
    }
    setIsSaving(false);
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-12 pb-32 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-12">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className="rounded-full bg-white/40 border border-white/40"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-3xl font-light tracking-tight text-foreground">
          {t("settings")}
        </h1>
      </div>

      <div className="space-y-6">
        {/* Section: Profile */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2 px-2">
            <UserIcon className="w-3.5 h-3.5 text-primary/40" />
            <h2 className="text-[9px] uppercase tracking-[0.25em] font-bold text-muted-foreground/30">
              {t("edit_profile")}
            </h2>
          </div>
          <div className="bento-card !p-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest px-1">
                Display Name
              </label>
              <Input 
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="bg-white/10 border-white/5 focus:border-primary/30 rounded-xl h-10 text-sm"
                placeholder="Masukkan nama anda..."
              />
            </div>
          </div>
        </motion.div>

        {/* Section: Language */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2 px-2">
            <Globe className="w-3.5 h-3.5 text-primary/40" />
            <h2 className="text-[9px] uppercase tracking-[0.25em] font-bold text-muted-foreground/30">
              {t("language")}
            </h2>
          </div>
          <div className="bento-card !p-1.5 flex gap-1">
            <button
              onClick={() => setTempLang("bm")}
              className={cn(
                "flex-1 py-3 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] transition-all",
                tempLang === "bm" 
                  ? "bg-primary text-white shadow-lg shadow-primary/10" 
                  : "bg-transparent text-muted-foreground/30 hover:bg-white/5"
              )}
            >
              Bahasa Melayu
            </button>
            <button
              onClick={() => setTempLang("en")}
              className={cn(
                "flex-1 py-3 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] transition-all",
                tempLang === "en" 
                  ? "bg-primary text-white shadow-lg shadow-primary/10" 
                  : "bg-transparent text-muted-foreground/30 hover:bg-white/5"
              )}
            >
              English
            </button>
          </div>
        </motion.div>

        {/* Other menu previews */}
        <div className="space-y-2 opacity-30">
          <div className="bento-card !p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{t("notifications")}</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Save Button Overlay - Pushed up to clear BottomNav */}
      <div className="fixed bottom-28 left-0 right-0 p-6 z-40 lg:relative lg:p-0 lg:mt-10 lg:bottom-0">
        <div className="max-w-xl mx-auto">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full h-14 rounded-2xl primary-btn-glow text-sm font-bold gap-3 shadow-[0_15px_45px_rgba(99,102,241,0.2)]"
          >
            {isSaving ? (
              "Saving..."
            ) : showSuccess ? (
              <>
                {t("saved")}
                <Check className="w-4 h-4" />
              </>
            ) : (
              <>
                {t("save_changes")}
                <Save className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
