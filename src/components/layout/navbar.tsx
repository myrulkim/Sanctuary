"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, PenLine, MessageCircle, Mountain, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { signOut } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/contexts/language-context";

export function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const NAV_ITEMS = [
    { href: "/dashboard", icon: Home, label: t("home") },
    { href: "/dashboard/checkin", icon: PenLine, label: t("checkin") },
    { href: "/dashboard/chat", icon: MessageCircle, label: t("chat") },
  ];

  if (pathname === "/dashboard/chat") return null;

  return (
    <header className={cn(
      "sticky top-0 z-50 transition-all duration-500",
      scrolled 
        ? "bg-white/40 backdrop-blur-2xl border-b border-white/30 shadow-[0_10px_30px_rgba(0,0,0,0.03)] py-0" 
        : "bg-transparent border-b border-transparent py-2"
    )}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Mountain className="w-5 h-5 text-primary" />
          </div>
          <span className="font-heading text-lg font-bold gradient-text tracking-tight">
            Sanctuary
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-2 px-5 py-2 rounded-2xl text-[13px] font-bold transition-all",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground/60 hover:text-foreground hover:bg-white/10"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="desktop-nav-pill"
                    className="absolute inset-0 bg-white/70 shadow-[0_4px_15px_rgba(0,0,0,0.05)] border border-white/60 rounded-2xl z-0"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
                <item.icon className="w-4 h-4 relative z-10" />
                <span className="relative z-10 tracking-tight">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="flex items-center gap-3">
          {user && (
            <>
              <div className="hidden sm:block text-right">
                <p className="text-xs text-muted-foreground">{t("welcome")}</p>
                <p className="text-sm font-medium text-foreground">
                  {user.displayName || "User"}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut()}
                className="text-muted-foreground hover:text-foreground"
                id="logout-btn"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
