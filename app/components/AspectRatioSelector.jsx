"use client";

import { Check } from "lucide-react";

const ASPECT_RATIOS = [
  { 
    id: "1:1", 
    label: "Square", 
    ratio: "1:1", 
    description: "Perfect for Profile Photos & Instagram Posts",
    boxClass: "aspect-square w-6" 
  },
  { 
    id: "4:5", 
    label: "Portrait", 
    ratio: "4:5", 
    description: "Perfect for Instagram Feed & Facebook",
    boxClass: "aspect-[4/5] w-5" 
  },
  { 
    id: "9:16", 
    label: "Vertical", 
    ratio: "9:16", 
    description: "Perfect for Stories, TikTok & Reels",
    boxClass: "aspect-[9/16] h-7" 
  },
  { 
    id: "16:9", 
    label: "Landscape", 
    ratio: "16:9", 
    description: "Perfect for YouTube & Cinematic Shots",
    boxClass: "aspect-[16/9] w-8" 
  },
];

export default function AspectRatioSelector({ selectedRatio, onSelect }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <label className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#7C5CFF]"></span>
          Aspect Ratio
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ASPECT_RATIOS.map((option) => {
          const isActive = selectedRatio === option.id;

          return (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              type="button"
              className={`relative flex items-start gap-4 p-4 rounded-2xl border text-left transition-all duration-300 overflow-hidden group ${
                isActive
                  ? "bg-[#7C5CFF]/10 border-[#7C5CFF]/50 shadow-[0_0_20px_rgba(124,92,255,0.15)]"
                  : "bg-white/[0.02] border-white/10 hover:bg-white/[0.04] hover:border-white/20"
              }`}
            >
              {/* Visual Box Indicator */}
              <div className="shrink-0 h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner mt-0.5">
                <div 
                  className={`border-2 rounded-sm transition-colors duration-300 ${option.boxClass} ${
                    isActive ? "border-[#7C5CFF] bg-[#7C5CFF]/20" : "border-slate-500 bg-slate-500/10 group-hover:border-slate-400"
                  }`} 
                />
              </div>

              {/* Text Content */}
              <div className="flex flex-col flex-1 min-w-0 pr-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-semibold text-sm tracking-wide ${isActive ? "text-white" : "text-slate-300"}`}>
                    {option.ratio}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-medium text-slate-500 bg-white/5 px-1.5 py-0.5 rounded">
                    {option.label}
                  </span>
                </div>
                <span className={`text-[12px] leading-snug ${isActive ? "text-[#B7A8FF]" : "text-slate-500"}`}>
                  {option.description}
                </span>
              </div>

              {/* Active Checkmark Overlay */}
              <div className={`absolute top-4 right-4 transition-all duration-300 ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
                <div className="h-5 w-5 rounded-full bg-[#7C5CFF] flex items-center justify-center shadow-lg">
                  <Check strokeWidth={3} className="w-3 h-3 text-white" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}