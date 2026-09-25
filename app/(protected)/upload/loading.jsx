import Sidebar from "../../components/SIdeBar";

export default function Loading() {
  // Array to map over for the skeleton image grid (generating 10 placeholder cards)
  const skeletonCards = Array(10).fill(null);

  return (
    <div className="flex h-[100dvh] w-full bg-[#0E0E10] text-gray-100 overflow-hidden font-['Inter',_sans-serif]">
      
      {/* =========================
          RENDER ACTUAL SIDEBAR 
          So it doesn't unmount during page fetch
      ========================== */}
      <Sidebar />

      {/* =========================
          MAIN CONTENT SKELETON
      ========================== */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden pt-16 lg:pt-0 relative scroll-smooth">
        
        {/* Ambient background (matching the page) */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#4B3AFF]/15 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-[#FF4D6D]/10 blur-[120px] pointer-events-none" />

        <div className="p-6 md:p-8 lg:p-10 min-h-full relative z-10 w-full">
          
          {/* Header Skeleton (Matches "Your Gallery" Title) */}
          <header className="mb-8 animate-pulse">
            <div className="h-10 md:h-12 lg:h-14 w-48 bg-gray-800/80 rounded-md mb-4" />
            <div className="h-4 md:h-5 w-64 bg-gray-800/50 rounded-md" />
          </header>

          {/* Tabs Skeleton */}
          <div className="flex items-center gap-6 mb-8 border-b border-gray-800 animate-pulse pb-[2px]">
            <div className="h-6 w-32 bg-gray-800/80 rounded-md mb-2 ml-2" />
            <div className="h-6 w-32 bg-gray-800/50 rounded-md mb-2" />
          </div>

          {/* Image Count Skeleton */}
          <div className="flex items-center justify-between mb-5 animate-pulse">
            <div className="h-4 w-20 bg-gray-800/60 rounded" />
          </div>

          {/* Image Grid Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {skeletonCards.map((_, index) => (
              <div
                key={index}
                className="
                  relative
                  aspect-[4/5]
                  rounded-xl
                  bg-[#18181b]/80
                  border
                  border-gray-800/50
                  overflow-hidden
                "
              >
                {/* Shimmer Effect */}
                <div 
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite]"
                  style={{
                    animationName: 'shimmer',
                    animationDuration: '2s',
                    animationIterationCount: 'infinite',
                    animationTimingFunction: 'linear'
                  }}
                />
              </div>
            ))}
          </div>

        </div>
      </main>

      {/* Inline style for the custom shimmer animation to make it extra premium */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}} />
    </div>
  );
}