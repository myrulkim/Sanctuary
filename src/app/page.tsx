"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import {
  Mountain,
  Sparkles,
  Heart,
  TrendingUp,
  Shield,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Daily Mood Check-in",
    description:
      "Start each day with a gentle check-in. Select how you feel with beautiful animated emojis and write your reflections.",
    gradient: "from-amber-400 to-orange-500",
  },
  {
    icon: MessageCircle,
    title: "AI Companion",
    description:
      "Talk to Sanctuary — an empathetic AI friend who listens without judgment, validates your feelings, and offers gentle support.",
    gradient: "from-purple-400 to-pink-500",
  },
  {
    icon: TrendingUp,
    title: "Weekly Mood Tracker",
    description:
      "Visualize your emotional patterns over time. Understand your triggers and celebrate your growth.",
    gradient: "from-cyan-400 to-blue-500",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description:
      "Your emotional journey is sacred. All data is encrypted and stored securely — only you can see your entries.",
    gradient: "from-green-400 to-emerald-500",
  },
];

export default function LandingPage() {
  const { user } = useAuth();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <div className="min-h-screen ambient-bg overflow-x-hidden">
      {/* Floating orbs background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 50, 0],
            y: [0, -50, 100, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-500/5 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 30, 0],
            y: [0, 80, -60, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 right-1/4 w-96 h-96 rounded-full bg-pink-500/5 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 60, -40, 0],
            y: [0, -40, 80, 0],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full bg-blue-500/5 blur-3xl"
        />
      </div>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden"
      >
        {/* Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5"
        >
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mountain className="w-6 h-6 text-primary" />
              <span className="font-heading text-lg font-bold gradient-text">
                Sanctuary
              </span>
            </div>
            <Link href={user ? "/dashboard" : "/login"}>
              <Button variant="glass" size="sm">
                {user ? "Dashboard" : "Get Started"}
              </Button>
            </Link>
          </div>
        </motion.nav>

        {/* Hero content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-2xl w-full px-4 relative z-10"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs text-muted-foreground mb-8"
          >
            <Heart className="w-3 h-3 text-pink-400" />
            Your mental wellness matters
          </motion.div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Your safe space for{" "}
            <span className="gradient-text">emotional wellness</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground mb-10 max-w-lg mx-auto leading-relaxed">
            Check in with yourself daily, talk to an empathetic AI companion,
            and understand your emotional patterns — all in one serene space.
          </p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href={user ? "/dashboard" : "/login"} className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-3 text-base px-10 h-14 rounded-2xl glass-premium hover:scale-105 transition-all duration-300" id="hero-cta">
                {user ? "Go to Dashboard" : "Begin Your Journey"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border border-white/10 flex items-start justify-center p-1.5"
          >
            <motion.div className="w-1.5 h-1.5 rounded-full bg-white/20" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-24"
          >
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Everything you need to{" "}
              <span className="gradient-text">feel supported</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-lg leading-relaxed">
              Sanctuary combines gentle self-reflection with AI-powered
              empathy to create your personal wellness companion.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="premium-card h-full group">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform shadow-lg`}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-heading text-2xl font-semibold text-foreground mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="premium-card p-16 gradient-border">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-6xl mb-8"
            >
              🏔️
            </motion.div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Ready to find your sanctuary?
            </h2>
            <p className="text-muted-foreground mb-10 text-lg max-w-sm mx-auto">
              Start your wellness journey today. It only takes a moment to
              check in with yourself.
            </p>
            <Link href={user ? "/dashboard" : "/login"}>
              <Button size="lg" className="h-14 px-10 text-lg rounded-2xl glass-premium hover:scale-105 transition-all">
                {user ? "Go to Dashboard" : "Start Your Journey"}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Mountain className="w-4 h-4" />
            <span>Sanctuary</span>
          </div>
          <p>Your emotions are valid. Always. 💜</p>
        </div>
      </footer>
    </div>
  );
}
