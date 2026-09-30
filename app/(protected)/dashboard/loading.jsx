import Sidebar from '../../components/SIdeBar';
import { Bell, Image as ImageIcon } from 'lucide-react';

export default function Loading() {
  // Array to map out 10 placeholder skeleton cards
  const skeletonCards = Array.from({ length: 10 });

  return (
    <div className="flex h-[calc(100vh-60px)] lg:h-screen w-full overflow-hidden bg-[#09090b] text-slate-200 font-sans selection:bg-blue-500/30">
      
      {/* Sidebar remains fully rendered to prevent layout shifting */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full w-full relative bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900/40 via-[#09090b] to-[#09090b]">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[120px] pointer-events-none rounded-full" />

        {/* Premium Slim Header */}
        <div className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-white/[0.08] bg-[#09090b]/60 backdrop-blur-xl z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
              <ImageIcon className="w-4 h-4 text-slate-400" />
            </div>
            <h1 className="text-base font-semibold text-white tracking-tight">
              Choose a style
            </h1>
          </div>

          <button
            disabled
            className="h-9 w-9 flex items-center justify-center bg-white/5 border border-white/10 rounded-full opacity-50 shrink-0 cursor-not-allowed transition-colors"
            aria-label="Loading Notifications"
          >
            <Bell strokeWidth={2} size={16} className="text-slate-400" />
          </button>
        </div>

        {/* Scrollable Grid Skeleton */}
        <div className="flex-1 overflow-y-auto px-6 md:px-8 py-8 pb-24 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full z-10">
          <div className="max-w-[1600px] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
            {skeletonCards.map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden flex flex-col backdrop-blur-sm shadow-2xl relative group"
              >
                {/* Premium Image Skeleton with smooth pulse */}
                <div className="relative aspect-[3/4] w-full bg-white/[0.03] flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent animate-pulse duration-1000" />
                  <ImageIcon className="w-8 h-8 text-slate-600/30 animate-pulse" />
                </div>

                {/* Card Footer Skeleton */}
                <div className="p-4 border-t border-white/[0.05] flex flex-col gap-3">
                  
                  {/* Title Skeleton */}
                  <div className="h-4 bg-white/10 rounded-md w-2/3 animate-pulse" />
                  
                  {/* Tags Skeleton */}
                  <div className="flex flex-wrap gap-2 mt-1">
                    <div className="h-5 w-16 bg-white/5 border border-white/5 rounded-full animate-pulse" />
                    <div className="h-5 w-20 bg-white/5 border border-white/5 rounded-full animate-pulse" />
                    <div className="h-5 w-12 bg-white/5 border border-white/5 rounded-full animate-pulse" />
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}