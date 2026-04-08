"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, PenLine, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/contexts/language-context";

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const NAV_ITEMS = [
    { href: "/dashboard", icon: Home, label: t("home") },
    { href: "/dashboard/checkin", icon: PenLine, label: t("checkin") },
    { href: "/dashboard/chat", icon: MessageCircle, label: t("chat") },
    { href: "/dashboard/profile", icon: User, label: t("profile") },
  ];

  return (
    <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm h-16 bg-white/60 backdrop-blur-3xl border-t border-white/80 border-x border-white/60 border-b border-black/5 rounded-full shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25),0_10px_25px_-5px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.8)] flex items-center justify-around px-4">
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
              "relative flex flex-col items-center justify-center gap-1 min-w-[64px] transition-all",
              isActive 
                ? "text-primary scale-110" 
                : "text-muted-foreground/60 hover:text-foreground/80"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="bottom-nav-active"
                className="absolute inset-x-0 -top-3 h-1 bg-primary rounded-full mx-auto w-4"
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              />
            )}
            <item.icon className={cn(
              "w-5 h-5 transition-transform",
              isActive && "fill-primary/5"
            )} />
            <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
