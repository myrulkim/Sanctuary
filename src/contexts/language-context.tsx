"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "bm" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    greeting_morning: "Good morning",
    greeting_afternoon: "Good afternoon",
    greeting_evening: "Good evening",
    greeting_night: "Good night",
    home: "Home",
    checkin: "Check-in",
    chat: "Chat",
    profile: "Profile",
    how_feeling: "How are you feeling?",
    tell_more: "Tell me more",
    saved: "Saved!",
    back_dashboard: "Back to Dashboard",
    logout: "Log Out",
    settings: "Settings",
    language: "Language",
    privacy: "Privacy",
    notifications: "Notifications",
    top_mood: "Top Mood",
    last_note: "Last Note",
    daily_streak: "Daily Streak",
    checkin_now: "Check-in Now",
    edit_profile: "Edit Profile",
    save_changes: "Save Changes",
    sanctuary_listening: "Sanctuary is listening",
    deep_breath: "Take a deep breath...",
    soul_lightened: "Soul lightened.",
    thank_you_time: "Thank you for taking a moment for yourself today",
    talk_more: "Talk More",
    flow_state: "The Flow State",
    write_here: "Write here... let it flow",
    something_to_express: "Something to express?",
    welcome: "Welcome,",
    days: "Days",
    momentum_text: "Keep up the momentum for better mental health.",
    manage_profile_desc: "Manage your personal info and language",
    notif_desc: "Daily reminder controls",
    privacy_desc: "Your data stays safe with us",
    calming_soul: "Calming the soul...",
    no_data: "No data yet",
    start_today: "No note for today. Let's start?",
    premium_title: "Sanctuary Premium",
    premium_desc: "Coming soon: Deepen your peace with premium features.",
    weekly_trend: "Weekly Trend",
    emotional_stable: "Your emotional health is stable",
    save_checkin: "Save Check-in",
    continue: "Continue",
    placeholder_safe_space: "Let your thoughts flow freely. I'm listening...",
    my_diary: "My Diary",
    diary_desc: "Your journey of growth",
    mindfulness: "Mindfulness",
    breathing: "Breathing",
    motivation: "Motivation",
    visualize: "Visualize",
    relaxing_sounds: "Relaxing Sounds",
  },
  bm: {
    greeting_morning: "Selamat pagi",
    greeting_afternoon: "Selamat tengah hari",
    greeting_evening: "Selamat petang",
    greeting_night: "Selamat malam",
    home: "Utama",
    checkin: "Check-in",
    chat: "Bual",
    profile: "Profil",
    how_feeling: "Apa khabar jiwa anda?",
    tell_more: "Ceritakan sedikit lagi",
    saved: "Disimpan!",
    back_dashboard: "Kembali ke Dashboard",
    logout: "Log Keluar",
    settings: "Tetapan",
    language: "Bahasa",
    privacy: "Privasi",
    notifications: "Notifikasi",
    top_mood: "Mood Utama",
    last_note: "Nota Terakhir",
    daily_streak: "Streak Harian",
    checkin_now: "Check-in Sekarang",
    edit_profile: "Edit Profil",
    save_changes: "Simpan Tetapan",
    sanctuary_listening: "Sanctuary sedang mendengar",
    deep_breath: "Hela nafas dalam-dalam...",
    soul_lightened: "Jiwa diringankan.",
    thank_you_time: "Terima kasih kerana meluangkan masa untuk diri anda hari ini.",
    talk_more: "Bual Lagi",
    flow_state: "The Flow State",
    write_here: "Tuliskan di sini... biarkan ia mengalir",
    something_to_express: "Sesuatu untuk diluahkan?",
    welcome: "Selamat datang,",
    days: "Hari",
    momentum_text: "Teruskan momentum anda untuk kesihatan mental yang lebih baik.",
    manage_profile_desc: "Uruskan maklumat peribadi dan bahasa anda",
    notif_desc: "Kawalan peringatan harian",
    privacy_desc: "Data anda kekal selamat bersama kami",
    calming_soul: "Meneduhkan jiwa...",
    no_data: "Belum ada data",
    start_today: "Belum ada nota untuk hari ini. Mari kita mulakan?",
    premium_title: "Sanctuary Premium",
    premium_desc: "Akan datang: Tingkatkan ketenangan anda dengan fungsi premium.",
    weekly_trend: "Trend Mingguan",
    emotional_stable: "Kesihatan emosi anda stabil",
    save_checkin: "Simpan Check-in",
    continue: "Teruskan",
    placeholder_safe_space: "Ruang selamat anda. Luahkan apa yang terbuku di hati...",
    my_diary: "Diari Saya",
    diary_desc: "Perjalanan pertumbuhan anda",
    mindfulness: "Minda Sedar",
    breathing: "Pernafasan",
    motivation: "Motivasi",
    visualize: "Visualisasi",
    relaxing_sounds: "Bunyi Tenang",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("bm");

  // Load language preference from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("sanctuary-lang") as Language;
    if (savedLang && (savedLang === "en" || savedLang === "bm")) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("sanctuary-lang", lang);
  };

  const t = (key: string) => {
    return (translations[language] as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
