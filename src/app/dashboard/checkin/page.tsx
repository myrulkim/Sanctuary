"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReflectionInput } from "@/components/reflection/reflection-input";
import { useAuth } from "@/contexts/auth-context";
import { saveMoodEntry } from "@/lib/firebase/firestore";
import { MoodType } from "@/lib/types";
import { getMoodConfig } from "@/lib/constants/moods";
import { useTranslation } from "@/contexts/language-context";

const STEPS = [
  { title: "tell_more", step: 1 },
  { title: "Your Support", step: 2 },
  { title: "saved", step: 3 },
];

export default function CheckInPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [reflection, setReflection] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [aiResponse, setAiResponse] = useState("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const moodParam = searchParams.get("mood") as MoodType;
    if (moodParam) {
      setSelectedMood(moodParam);
    } else {
      // Default fallback if accessed without param
      setSelectedMood("neutral");
    }
  }, [searchParams]);

  const moodConfig = selectedMood ? getMoodConfig(selectedMood) : null;

  function handleTagToggle(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  async function handleGetAIResponse() {
    if (!selectedMood) return;
    setIsLoadingAI(true);
    setCurrentStep(1);

    const tagText =
      selectedTags.length > 0
        ? ` It's related to: ${selectedTags.join(", ")}.`
        : "";
    const userMessage = reflection
      ? `I'm feeling ${selectedMood} today. ${reflection}${tagText}`
      : `I'm feeling ${selectedMood} today.${tagText}`;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: userMessage }],
          mood: selectedMood,
        }),
      });

      if (!response.ok) throw new Error("Failed");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          fullResponse += chunk;
          setAiResponse(fullResponse);
        }
      }

      setIsLoadingAI(false);
    } catch {
      setAiResponse(
        "I'm here for you 💛 Even though I couldn't formulate the perfect words right now, please know that your feelings are valid and you matter."
      );
      setIsLoadingAI(false);
    }
  }

  async function handleSave() {
    if (!user || !selectedMood) return;
    setIsSaving(true);

    try {
      await saveMoodEntry(
        user.uid,
        selectedMood,
        moodConfig?.score || 3,
        reflection,
        aiResponse
      );
      setCurrentStep(2);
    } catch (error) {
      console.error("Save error:", error);
    }
    setIsSaving(false);
  }

  function canProceed(): boolean {
    switch (currentStep) {
      case 0:
        return true; // Reflection is optional
      case 1:
        return !isLoadingAI;
      default:
        return false;
    }
  }

  function handleNext() {
    if (currentStep === 0) {
      handleGetAIResponse();
    } else if (currentStep === 1) {
      handleSave();
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  }

  const getDynamicPrompt = (mood: string) => {
    switch (mood) {
      case "radiant": return "What's making you shine so bright today?";
      case "happy": return "What brought a smile to your face today?";
      case "neutral": return "What's on your mind right now?";
      case "sad": return "I'm sorry you're feeling down. What's been heavy on your heart?";
      case "stressed": return "Take a deep breath. What's causing you to feel overwhelmed?";
      default: return "Tell me more about how you're feeling.";
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 min-h-[calc(100vh-5rem)]">
      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (currentStep === 0) router.back();
            else setCurrentStep((prev) => prev - 1);
          }}
          className="shrink-0"
          id="checkin-back"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>

        <div className="flex-1 flex gap-1.5">
          {STEPS.map((_, i) => (
            <motion.div
              key={i}
              className="flex-1 h-1 rounded-full overflow-hidden bg-muted/30"
            >
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: "0%" }}
                animate={{
                  width: i <= currentStep ? "100%" : "0%",
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait" custom={1}>
          {currentStep === 0 && (
            <motion.div
              key="step-reflection"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              custom={1}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-8"
            >
              <div className="text-center space-y-5 mb-2 mt-4">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-24 h-24 mx-auto rounded-full flex items-center justify-center shadow-lg relative"
                >
                  <div className={cn("absolute -inset-4 opacity-20 blur-2xl", moodConfig?.bgClass)} />
                  <span className="relative z-10 w-full h-full flex items-center justify-center filter drop-shadow-md">
                    {moodConfig?.emoji}
                  </span>
                </motion.div>
                
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-tight mb-2">
                    {selectedMood ? getDynamicPrompt(selectedMood) : "Tell me more about your day"}
                  </h2>
                  <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/60">
                    YOUR SAFE SPACE
                  </p>
                </div>
              </div>

              <ReflectionInput
                value={reflection}
                onChange={setReflection}
                selectedTags={selectedTags}
                onTagToggle={handleTagToggle}
              />
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="step-ai"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              custom={1}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center min-h-[400px] space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-premium p-10 rounded-[3rem] w-full relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-emerald-400 opacity-30" />
                
                <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-primary/40 mb-8 text-center">
                  {t("sanctuary_listening")}
                </h2>

                <div className="space-y-6">
                  {isLoadingAI && !aiResponse ? (
                    <div className="flex justify-center py-10">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-4 h-4 rounded-full bg-primary"
                      />
                    </div>
                  ) : (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 2 }}
                      className="text-xl font-light leading-relaxed text-center text-foreground/80 italic"
                    >
                      {aiResponse || t("calming_soul")}
                    </motion.p>
                  )}
                </div>
              </motion.div>

              <motion.p 
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/30"
              >
                {t("deep_breath")}
              </motion.p>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step-done"
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.8, ease: "circOut" }}
              className="flex flex-col items-center justify-center min-h-[400px] text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  delay: 0.3,
                }}
                className="w-32 h-32 rounded-[3rem] glass-premium flex items-center justify-center mb-10 shadow-[0_20px_50px_rgba(99,102,241,0.1)]"
              >
                <Check className="w-12 h-12 text-primary" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-4xl font-light tracking-tight text-foreground mb-4"
              >
                {t("soul_lightened")}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-muted-foreground/60 text-sm max-w-xs mb-12 font-medium"
              >
                {t("thank_you_time")}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="flex flex-col w-full gap-4"
              >
                <Button
                  className="w-full h-14 rounded-2xl primary-btn-glow text-base font-bold"
                  onClick={() => router.push("/dashboard")}
                >
                  {t("back_dashboard")}
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-xs font-bold uppercase tracking-widest text-muted-foreground/40"
                  onClick={() => router.push("/dashboard/chat")}
                >
                  {t("talk_more")}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      {currentStep < 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 flex justify-end"
        >
          <Button
            onClick={handleNext}
            disabled={!canProceed() || isSaving}
            className="gap-2 min-w-[140px]"
            id="checkin-next"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : currentStep === 1 ? (
              <>
                {t("save_checkin")}
                <Check className="w-4 h-4" />
              </>
            ) : (
              <>
                {t("continue")}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </motion.div>
      )}
    </div>
  );
}
