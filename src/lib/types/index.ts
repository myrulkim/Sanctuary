import { Timestamp } from "firebase/firestore";

export type MoodType = "radiant" | "happy" | "neutral" | "sad" | "stressed";

export interface MoodConfig {
  type: MoodType;
  emoji: string | any;
  label: string;
  score: number;
  color: string;
  gradient: string;
  glowClass: string;
  bgClass: string;
  description: string;
}

export interface MoodEntry {
  id: string;
  mood: MoodType;
  moodScore: number;
  reflection: string;
  aiResponse: string;
  createdAt: Timestamp;
  date: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  createdAt: Timestamp;
  lastActive: Timestamp;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Timestamp;
  moodContext?: MoodType;
}

export interface CheckInStep {
  step: number;
  title: string;
  description: string;
}
