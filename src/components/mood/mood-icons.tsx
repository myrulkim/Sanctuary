import React from "react";

interface MoodIconProps extends React.SVGProps<SVGSVGElement> {}

export const RadiantIcon = (props: MoodIconProps) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="50" cy="50" r="50" fill="#FFD700" />
    <path d="M25 35 Q 35 25 45 35" stroke="#8B6508" strokeWidth="6" strokeLinecap="round" fill="none" />
    <path d="M55 35 Q 65 25 75 35" stroke="#8B6508" strokeWidth="6" strokeLinecap="round" fill="none" />
    <path d="M25 55 Q 50 85 75 55 Z" fill="#8B6508" />
    <path d="M35 55 Q 50 70 65 55 Z" fill="#FF4040" />
    <circle cx="80" cy="30" r="6" fill="#FFC125" />
    <circle cx="20" cy="30" r="4" fill="#FFC125" />
  </svg>
);

export const HappyIcon = (props: MoodIconProps) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="50" cy="50" r="50" fill="#FFD700" />
    <circle cx="35" cy="40" r="6" fill="#8B6508" />
    <circle cx="65" cy="40" r="6" fill="#8B6508" />
    <path d="M30 60 Q 50 80 70 60" stroke="#8B6508" strokeWidth="6" strokeLinecap="round" fill="none" />
    <circle cx="20" cy="60" r="8" fill="#FF8C00" opacity="0.3" />
    <circle cx="80" cy="60" r="8" fill="#FF8C00" opacity="0.3" />
  </svg>
);

export const NeutralIcon = (props: MoodIconProps) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="50" cy="50" r="50" fill="#FFE4B5" />
    <circle cx="35" cy="40" r="6" fill="#8B6508" />
    <circle cx="65" cy="40" r="6" fill="#8B6508" />
    <line x1="35" y1="65" x2="65" y2="65" stroke="#8B6508" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

export const SadIcon = (props: MoodIconProps) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="50" cy="50" r="50" fill="#87CEEB" />
    <circle cx="35" cy="45" r="6" fill="#004A7F" />
    <circle cx="65" cy="45" r="6" fill="#004A7F" />
    <path d="M30 35 Q 40 30 50 35" stroke="#004A7F" strokeWidth="5" strokeLinecap="round" fill="none" />
    <path d="M50 35 Q 60 30 70 35" stroke="#004A7F" strokeWidth="5" strokeLinecap="round" fill="none" />
    <path d="M35 70 Q 50 55 65 70" stroke="#004A7F" strokeWidth="6" strokeLinecap="round" fill="none" />
    <path d="M25 55 Q 25 65 25 65 Q 25 75 25 75 C 25 78 22 80 20 80 C 18 80 15 78 15 75 Q 15 65 20 55 C 22 58 25 55 25 55 Z" fill="#00BFFF" />
  </svg>
);

export const StressedIcon = (props: MoodIconProps) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="50" cy="50" r="50" fill="#FF7F50" />
    <path d="M25 35 L 45 45" stroke="#8B0000" strokeWidth="6" strokeLinecap="round" />
    <path d="M75 35 L 55 45" stroke="#8B0000" strokeWidth="6" strokeLinecap="round" />
    <circle cx="35" cy="50" r="6" fill="#8B0000" />
    <circle cx="65" cy="50" r="6" fill="#8B0000" />
    <path d="M30 70 L 40 65 L 50 70 L 60 65 L 70 70" stroke="#8B0000" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <circle cx="80" cy="30" r="8" fill="#B0E0E6" opacity="0.8" />
    <circle cx="78" cy="28" r="3" fill="#FFFFFF" />
  </svg>
);
