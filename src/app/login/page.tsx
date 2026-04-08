"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Mountain, Mail, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
} from "@/lib/firebase/auth";
import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  async function handleGoogleSignIn() {
    setError("");
    setIsLoading(true);
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to sign in with Google");
    }
    setIsLoading(false);
  }

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (!displayName.trim()) {
          setError("Please enter your name");
          setIsLoading(false);
          return;
        }
        await signUpWithEmail(email, password, displayName);
      } else {
        await signInWithEmail(email, password);
      }
      router.push("/dashboard");
    } catch (err: unknown) {
      const errorObj = err as { code?: string; message?: string };
      const code = errorObj?.code;
      if (code === "auth/user-not-found") setError("No account found with this email");
      else if (code === "auth/wrong-password") setError("Incorrect password");
      else if (code === "auth/email-already-in-use") setError("Email already registered");
      else if (code === "auth/weak-password") setError("Password should be at least 6 characters");
      else if (code === "auth/invalid-email") setError("Invalid email address");
      else setError(errorObj.message || "Authentication failed");
    }
    setIsLoading(false);
  }

  if (loading) return null;

  return (
    <div className="min-h-screen ambient-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Floating orbs background */}
      <motion.div
        animate={{ 
          x: [0, 30, 0], 
          y: [0, -50, 0],
          scale: [1, 1.1, 1] 
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-blue-400/10 blur-[100px]"
      />
      <motion.div
        animate={{ 
          x: [0, -30, 0], 
          y: [0, 50, 0],
          scale: [1, 1.2, 1] 
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-emerald-400/10 blur-[100px]"
      />

      {/* Main Content */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.3
            }
          }
        }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Logo Section */}
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 }
          }}
          className="flex flex-col items-center mb-12"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 rounded-[2rem] glass-premium flex items-center justify-center mb-6 shadow-xl"
          >
            <Mountain className="w-10 h-10 text-primary" />
          </motion.div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
            Sanctuary
          </h1>
          <p className="text-sm text-muted-foreground/60 mt-2 font-medium">
            by AntiGravity
          </p>
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 40 },
            show: { opacity: 1, y: 0 }
          }}
          className="glass-premium p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-3xl border-white/40"
        >
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-foreground">
              {isSignUp ? "Selamat datang" : "Selamat pulang"}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {isSignUp ? "Mari ringankan beban fikiran anda" : "Ruang tenang anda menanti"}
            </p>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-5">
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-1.5"
              >
                <Label htmlFor="displayName" className="text-[10px] uppercase tracking-widest font-bold ml-1 text-muted-foreground/60">Name</Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Nama anda"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="soft-input"
                />
              </motion.div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[10px] uppercase tracking-widest font-bold ml-1 text-muted-foreground/60">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="hello@sanctuary.app"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="soft-input"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[10px] uppercase tracking-widest font-bold ml-1 text-muted-foreground/60">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="soft-input pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-[11px] text-destructive font-medium bg-destructive/5 px-3 py-2 rounded-xl text-center"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              className="w-full h-14 rounded-2xl primary-btn-glow text-base font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? "Memuatkan..." : isSignUp ? "Sign Up" : "Sign In"}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/[0.03]"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
              <span className="bg-transparent px-2 text-muted-foreground/30">Atau teruskan dengan</span>
            </div>
          </div>

          <Button
            variant="ghost"
            className="w-full h-12 rounded-xl border border-black/[0.03] bg-white/40 hover:bg-white/60 text-xs font-bold gap-3"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </Button>

          <p className="text-center text-[11px] text-muted-foreground mt-8">
            {isSignUp ? "Sudah ada akaun?" : "Belum ada akaun?"}{" "}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              className="text-primary hover:underline font-bold"
            >
              {isSignUp ? "Log Masuk" : "Daftar Sekarang"}
            </button>
          </p>
        </motion.div>

        <motion.p 
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1 }
          }}
          className="text-center text-[10px] text-muted-foreground/30 mt-8 tracking-widest uppercase font-bold"
        >
          Data anda kekal peribadi & selamat 🔒
        </motion.p>
      </motion.div>
    </div>
  );
}
