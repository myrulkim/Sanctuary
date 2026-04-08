import type { Metadata } from "next";
import "./globals.css";
import { Outfit } from "next/font/google";
import { AuthProvider } from "@/contexts/auth-context";
import { LanguageProvider } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fonts = cn(outfit.variable);

export const metadata: Metadata = {
  title: "Sanctuary — Your Safe Space for Emotional Wellness",
  description:
    "A serene mood journaling app that helps you understand your emotions, receive empathetic AI support, and track your mental wellness journey.",
  keywords: ["mental health", "mood tracker", "wellness", "journal", "AI companion"],
  authors: [{ name: "Sanctuary" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(fonts, "font-sans antialiased overflow-x-hidden")}>
        {/* Global Background Layering System */}
        <div className="fixed inset-0 -z-50 bg-[#f8fafc]" />
        
        {/* Colorful Mesh Blobs (Vibrant & Clear) */}
        <div className="fixed inset-0 -z-40 overflow-hidden pointer-events-none">
          <div className="mesh-blob w-[1000px] h-[1000px] bg-blue-400/30 -top-60 -left-60" />
          <div className="mesh-blob w-[1100px] h-[1100px] bg-emerald-400/25 top-1/4 -right-60" />
          <div className="mesh-blob w-[900px] h-[900px] bg-indigo-400/20 -bottom-80 left-1/4" />
          <div className="mesh-blob w-[800px] h-[800px] bg-purple-400/15 top-0 left-1/2 opacity-50" />
          
          {/* Global Crystal Texture Overlaid on Mesh */}
          <div className="absolute inset-0 z-0 opacity-[0.08]">
            <img src="/crystal_bg.png" alt="" className="w-full h-full object-cover grayscale opacity-40" />
          </div>

          <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.05),transparent_50%)]" />
        </div>

        <div className="relative z-10">
          <LanguageProvider>
            <AuthProvider>
              <main className="relative z-10">
                {children}
              </main>
            </AuthProvider>
          </LanguageProvider>
        </div>
      </body>
    </html>
  );
}
