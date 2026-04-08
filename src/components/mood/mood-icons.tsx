import React from "react";

const EMOJI_URLS = {
  radiant: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Star-Struck.png",
  happy: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Smiling%20Face%20with%20Smiling%20Eyes.png",
  neutral: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Neutral%20Face.png",
  sad: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Pensive%20Face.png",
  stressed: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Hot%20Face.png"
};

export const RadiantIcon = () => (
  <img src={EMOJI_URLS.radiant} alt="Radiant" className="w-full h-full object-contain" />
);

export const HappyIcon = () => (
  <img src={EMOJI_URLS.happy} alt="Happy" className="w-full h-full object-contain" />
);

export const NeutralIcon = () => (
  <img src={EMOJI_URLS.neutral} alt="Neutral" className="w-full h-full object-contain" />
);

export const SadIcon = () => (
  <img src={EMOJI_URLS.sad} alt="Sad" className="w-full h-full object-contain" />
);

export const StressedIcon = () => (
  <img src={EMOJI_URLS.stressed} alt="Stressed" className="w-full h-full object-contain" />
);
