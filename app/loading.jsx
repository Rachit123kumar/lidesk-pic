export default function Loading() {
  return (
    <div className="h-screen w-full bg-[#0A0A0F] flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Ambient background glows matching the premium aesthetic */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/4 left-1/3 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7C5CFF]/15 blur-[120px] pointer-events-none animate-pulse duration-1000" 
      />
      <div 
        aria-hidden="true" 
        className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] translate-x-1/2 translate-y-1/2 rounded-full bg-[#FF5CA8]/10 blur-[120px] pointer-events-none animate-pulse duration-1000 delay-500" 
      />

      {/* Loading Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        
        {/* Premium multi-ring spinner */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-t-2 border-l-2 border-[#7C5CFF] opacity-80 animate-spin" />
          {/* Middle ring (spins in reverse) */}
          <div className="absolute inset-2 rounded-full border-r-2 border-b-2 border-[#FF5CA8] opacity-60 animate-[spin_1.5s_reverse_infinite]" />
          {/* Inner ring */}
          <div className="absolute inset-4 rounded-full border-t-2 border-white/30 animate-[spin_2s_linear_infinite]" />
          
          {/* Center dot */}
          <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse" />
        </div>

        {/* Loading Text */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-[#F2F2F5] text-[13px] font-medium tracking-[0.2em] uppercase">
            Loading Workspace
          </p>
          
          {/* Bouncing dots */}
          <div className="flex gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C5CFF] animate-bounce shadow-[0_0_8px_rgba(124,92,255,0.6)]" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#B7A8FF] animate-bounce shadow-[0_0_8px_rgba(183,168,255,0.6)]" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5CA8] animate-bounce shadow-[0_0_8px_rgba(255,92,168,0.6)]" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
}