"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronLeft, Maximize2, X, Play, Film, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const MEDIA = [
  { 
    id: 1, 
    type: "video", 
    url: "7X8mS5x4S-A", 
    thumbnail: "/calm_forest.png", 
    title: "Mountain Mist", 
    desc: "30s of pure nature immersion" 
  },
  { 
    id: 5, 
    type: "image", 
    url: "/calm_desert.png", 
    thumbnail: "/calm_desert.png", 
    title: "Desert Silence", 
    desc: "Peace in the golden dunes" 
  },
  { 
    id: 2, 
    type: "video", 
    url: "vPhgM8_O9pU", 
    thumbnail: "/calm_lake.png", 
    title: "Ocean Waves", 
    desc: "Infinite blue horizon" 
  },
  { 
    id: 6, 
    type: "image", 
    url: "/calm_snow.png", 
    thumbnail: "/calm_snow.png", 
    title: "Winter Pure", 
    desc: "Crisp air of snowy peaks" 
  },
  { 
    id: 3, 
    type: "image", 
    url: "/calm_zen.png", 
    thumbnail: "/calm_zen.png", 
    title: "Zen Peace", 
    desc: "Still garden for reflection" 
  },
  { 
    id: 7, 
    type: "image", 
    url: "/calm_lavender.png", 
    thumbnail: "/calm_lavender.png", 
    title: "Lavender Dream", 
    desc: "A horizon of purple calm" 
  },
  { 
    id: 4, 
    type: "video", 
    url: "L72M38O5p9Q", 
    thumbnail: "/calm_stars.png", 
    title: "Midnight Rain", 
    desc: "Calming sounds of the night" 
  },
  { 
    id: 8, 
    type: "image", 
    url: "/calm_cabin.png", 
    thumbnail: "/calm_cabin.png", 
    title: "Cozy Retreat", 
    desc: "Warmth within the storm" 
  }
];

export default function VisualizePage() {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  return (
    <div className="min-h-screen bg-emerald-50/30 pb-32">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/60 backdrop-blur-xl border-b border-black/[0.03] px-6 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-emerald-100/50 flex items-center justify-center hover:bg-emerald-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-emerald-900" />
          </button>
          <div className="text-center">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Visualize</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gallery & Cinema</p>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {MEDIA.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedItem(item)}
              className="group cursor-pointer relative bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-2"
            >
              <div className="aspect-[16/9] overflow-hidden relative">
                <img 
                  src={item.thumbnail} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
                />
                
                <div className="absolute top-6 left-6 px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 flex items-center gap-2 text-[9px] font-black text-white uppercase tracking-widest">
                  {item.type === "video" ? <Film className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                  {item.type}
                </div>

                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-150 group-hover:scale-100 duration-500">
                    {item.type === "video" ? <Play className="w-6 h-6 text-white fill-current" /> : <Maximize2 className="w-6 h-6 text-white" />}
                  </div>
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-lg font-black text-slate-900 tracking-tight mb-1">{item.title}</h3>
                <p className="text-sm font-medium text-slate-400">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
          >
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all z-[110]"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              className="w-full h-full relative"
            >
              {selectedItem.type === "video" ? (
                <div className="w-full h-full flex items-center justify-center bg-black">
                  <iframe
                    className="w-full h-full max-w-[100vw]"
                    src={`https://www.youtube-nocookie.com/embed/${selectedItem.url}?autoplay=1&mute=0&loop=0&controls=1&modestbranding=1&rel=0&end=30&origin=${origin}`}
                    title={selectedItem.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <img 
                  src={selectedItem.url} 
                  alt={selectedItem.title} 
                  className="w-full h-full object-cover"
                />
              )}
              
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase bg-primary text-white tracking-[0.2em]">
                    {selectedItem.type === "video" ? "30s Immersive" : "Ultra Visual"}
                  </span>
                  <h2 className="text-3xl md:text-5xl font-black text-white">{selectedItem.title}</h2>
                </div>
                <p className="text-white/60 text-lg font-medium">{selectedItem.desc}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
