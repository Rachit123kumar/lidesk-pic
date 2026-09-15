import Sidebar from "../../components/SIdeBar";

export default function Loading() {
  // Array to map out 8 placeholder skeleton cards (fills standard desktop screens perfectly)
  const skeletonCards = Array.from({ length: 8 });

  return (
    <div className="flex h-screen w-full bg-[#0B0D14] overflow-hidden font-['Inter',_sans-serif]">
      {/* Sidebar remains fully rendered to prevent layout shifting */}
      <Sidebar />

      <main className="flex-1 h-full overflow-y-auto pt-16 lg:pt-0 relative">
        
        {/* Retain the background ambient glow so the transition is seamless */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 right-0 w-[560px] h-[560px] rounded-full bg-gradient-to-br from-violet-600/20 via-fuchsia-500/10 to-transparent blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 sm:px-8 lg:px-12 py-10 max-w-7xl">
          
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div className="flex flex-col gap-3">
              {/* Title Skeleton */}
              <div className="h-9 sm:h-10 w-48 sm:w-72 bg-white/10 rounded-lg animate-pulse" />
              {/* Subtitle Skeleton */}
              <div className="h-4 w-56 bg-white/5 rounded-md animate-pulse" />
            </div>

            {/* Stat Pills Skeleton */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="h-[38px] w-24 rounded-xl bg-white/[0.03] border border-white/10 animate-pulse backdrop-blur" />
              <div className="h-[38px] w-20 rounded-xl bg-white/[0.03] border border-white/10 animate-pulse backdrop-blur" />
              <div className="h-[38px] w-28 rounded-xl bg-white/[0.03] border border-white/10 animate-pulse backdrop-blur" />
              <div className="h-[38px] w-[72px] rounded-xl bg-white/[0.03] border border-white/10 animate-pulse backdrop-blur" />
            </div>
          </div>

          {/* Grid Skeleton (Defaults to Grid view for loading state as it feels more structural) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {skeletonCards.map((_, index) => (
              <div
                key={index}
                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02]"
              >
                {/* Image Area Skeleton */}
                <div className="w-full aspect-[4/5] relative overflow-hidden bg-[#12141F] flex items-center justify-center">
                  <div className="w-full h-full bg-white/[0.03] animate-pulse" />
                  {/* Subtle pulsing icon/dot in the center */}
                  <div className="absolute w-3 h-3 rounded-full bg-white/10 animate-ping" />
                </div>

                {/* Card Footer Skeleton */}
                <div className="flex items-center justify-between gap-2 px-3.5 py-3">
                  {/* Date Skeleton */}
                  <div className="h-3 w-12 bg-white/10 rounded-sm animate-pulse" />

                  {/* Badges Skeleton */}
                  <div className="flex items-center gap-2">
                    <div className="h-[22px] w-14 bg-white/5 rounded-md animate-pulse" />
                    <div className="h-[22px] w-16 bg-white/5 rounded-md animate-pulse" />
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