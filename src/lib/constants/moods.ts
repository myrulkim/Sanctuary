import { MoodConfig } from "@/lib/types";
import React from "react";
import { RadiantIcon, HappyIcon, NeutralIcon, SadIcon, StressedIcon } from "@/components/mood/mood-icons";

export const MOODS: MoodConfig[] = [
  {
    type: "radiant",
    emoji: React.createElement(RadiantIcon),
    label: "Radiant",
    score: 5,
    color: "#FFD700",
    gradient: "linear-gradient(135deg, #FFD700, #FFA500)",
    glowClass: "glow-radiant",
    bgClass: "mood-radiant",
    description: "Feeling amazing and full of energy",
  },
  {
    type: "happy",
    emoji: React.createElement(HappyIcon),
    label: "Happy",
    score: 4,
    color: "#4ADE80",
    gradient: "linear-gradient(135deg, #4ADE80, #22D3EE)",
    glowClass: "glow-happy",
    bgClass: "mood-happy",
    description: "Content and at peace",
  },
  {
    type: "neutral",
    emoji: React.createElement(NeutralIcon),
    label: "Neutral",
    score: 3,
    color: "#94A3B8",
    gradient: "linear-gradient(135deg, #94A3B8, #CBD5E1)",
    glowClass: "glow-neutral",
    bgClass: "mood-neutral",
    description: "Going through the day",
  },
  {
    type: "sad",
    emoji: React.createElement(SadIcon),
    label: "Sad",
    score: 2,
    color: "#818CF8",
    gradient: "linear-gradient(135deg, #818CF8, #6366F1)",
    glowClass: "glow-sad",
    bgClass: "mood-sad",
    description: "Feeling down or blue",
  },
  {
    type: "stressed",
    emoji: React.createElement(StressedIcon),
    label: "Stressed",
    score: 1,
    color: "#FB7185",
    gradient: "linear-gradient(135deg, #FB7185, #F43F5E)",
    glowClass: "glow-stressed",
    bgClass: "mood-stressed",
    description: "Overwhelmed or anxious",
  },
];

export const QUICK_TAGS = [
  "Work",
  "Relationships",
  "Health",
  "Study",
  "Self",
  "Family",
  "Finance",
  "Sleep",
] as const;

export type QuickTag = (typeof QUICK_TAGS)[number];

export function getMoodConfig(mood: string): MoodConfig {
  return MOODS.find((m) => m.type === mood) || MOODS[2]; // Default neutral
}
