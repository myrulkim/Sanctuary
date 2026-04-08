"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  User as UserIcon, 
  Settings, 
  LogOut, 
  Shield, 
  Bell, 
  Moon,
  ChevronRight,
  Heart,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { signOut } from "@/lib/firebase/auth";
import { useTranslation } from "@/contexts/language-context";

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  async function handleLogout() {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 pb-32 min-h-screen">
      {/* Header Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex justify-center mb-6">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-white shadow-xl relative"
          >
            <UserIcon className="w-12 h-12 text-primary" />
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-400 border-2 border-white rounded-full"></div>
          </motion.div>
        </div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          {user?.displayName || t("profile")}
        </h1>
        <p className="text-sm text-muted-foreground/60 mt-1 font-medium">
          {user?.email}
        </p>
      </motion.div>

      {/* Bento Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Main Settings List */}
        <div className="md:col-span-2 space-y-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: 5 }}
            onClick={() => router.push("/dashboard/settings")}
            className="bento-card cursor-pointer group !p-5 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Settings className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-foreground tracking-tight">{t("settings")}</h3>
              <p className="text-[10px] text-muted-foreground/50 tracking-wide">{t("manage_profile_desc")}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bento-card flex items-center gap-4 cursor-pointer group !p-5 disabled opacity-50"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-foreground tracking-tight">{t("notifications")}</h3>
              <p className="text-[10px] text-muted-foreground/50 tracking-wide">{t("notif_desc")}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bento-card flex items-center gap-4 cursor-pointer group !p-5 disabled opacity-50"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-foreground tracking-tight">{t("privacy")}</h3>
              <p className="text-[10px] text-muted-foreground/50 tracking-wide">{t("privacy_desc")}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
          </motion.div>
        </div>

        {/* Small Stats Bento */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bento-card flex flex-col items-center justify-center text-center !p-10"
        >
          <Heart className="w-8 h-8 text-rose-400 mb-3 fill-rose-400/10" />
          <h3 className="text-sm font-bold text-foreground tracking-tight">{t("premium_title")}</h3>
          <p className="text-[10px] text-muted-foreground/50 mt-2 max-w-[150px] mx-auto leading-relaxed">{t("premium_desc")}</p>
        </motion.div>

        {/* Logout Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          onClick={handleLogout}
          className="bento-card flex flex-col items-center justify-center text-center !p-10 cursor-pointer group hover:bg-rose-50/50 transition-colors"
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 mb-4 group-hover:scale-110 transition-transform">
            <LogOut className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-rose-600 tracking-tight">{t("logout")}</h3>
        </motion.div>
      </div>

      {/* Footer Branding */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-20 text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/40 border border-white/40 rounded-full text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30">
          Made with Love by AntiGravity
        </div>
      </motion.div>
    </div>
  );
}
