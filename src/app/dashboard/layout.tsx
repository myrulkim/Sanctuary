"use client";

import { usePathname } from "next/navigation";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Navbar } from "@/components/layout/navbar";
import { BottomNav } from "@/components/layout/bottom-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDistractionFreePage = 
    pathname.startsWith("/dashboard/diary") || 
    pathname.startsWith("/dashboard/mindfulness");

  return (
    <AuthGuard>
      <div className="min-h-screen ambient-bg">
        {!isDistractionFreePage && <Navbar />}
        <main className={isDistractionFreePage ? "" : "pb-20 lg:pb-8"}>{children}</main>
        {!isDistractionFreePage && <BottomNav />}
      </div>
    </AuthGuard>
  );
}
