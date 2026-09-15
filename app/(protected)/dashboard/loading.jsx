import Sidebar from '../../components/SIdeBar';
import { Bell } from 'lucide-react';

export default function Loading() {
  // Array to map out 10 placeholder skeleton cards
  const skeletonCards = Array.from({ length: 10 });

  return (
    <div className="h-screen max-h-screen bg-[#FAFAF8] text-[#0E0E10] flex flex-col lg:flex-row overflow-hidden">
      {/* Sidebar remains fully rendered to prevent layout shifting */}
      <Sidebar />

      {/* Main content area skeleton */}
      <main className="flex-1 flex flex-col h-full pt-14 lg:pt-0 w-full relative font-['Inter',_sans-serif]">
        
        {/* Slim header - Rendered immediately so the UI feels responsive */}
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 border-b-2 border-[#0E0E10] bg-[#FAFAF8] z-10">
          <h1 className="text-sm font-bold font-['Space_Grotesk',_sans-serif]">
            Choose a style
          </h1>

          <button
            disabled
            className="w-7 h-7 flex items-center justify-center bg-white border-2 border-[#0E0E10] rounded-sm shadow-[2px_2px_0_#0E0E10] opacity-70 shrink-0 cursor-not-allowed"
            aria-label="Loading Notifications"
          >
            <Bell strokeWidth={2} size={14} className="text-[#0E0E10]" />
          </button>
        </div>

        {/* Scrollable grid Skeleton */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-5 pb-24">
          <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {skeletonCards.map((_, index) => (
              <div
                key={index}
                className="border-2 border-[#0E0E10] rounded-sm overflow-hidden flex flex-col text-left shadow-[3px_3px_0_#0E0E10] bg-white"
              >
                {/* Image Skeleton with pulse */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-200/60 animate-pulse flex items-center justify-center">
                  {/* Subtle pulsing icon/shape in the center for a premium feel */}
                  <div className="w-10 h-10 border-4 border-gray-300 border-t-[#0E0E10]/20 rounded-full animate-spin"></div>
                </div>

                {/* Card Footer Skeleton */}
                <div className="px-2.5 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 border-t-2 border-[#0E0E10] bg-white flex flex-col gap-2">
                  
                  {/* Title Skeleton */}
                  <div className="h-3 sm:h-4 bg-gray-200 rounded-sm w-3/4 animate-pulse"></div>
                  
                  {/* Tags Skeleton */}
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <div className="h-4 sm:h-[18px] w-12 bg-gray-200 border border-gray-300 rounded-sm animate-pulse"></div>
                    <div className="h-4 sm:h-[18px] w-16 bg-gray-200 border border-gray-300 rounded-sm animate-pulse"></div>
                    <div className="h-4 sm:h-[18px] w-10 bg-gray-200 border border-gray-300 rounded-sm animate-pulse"></div>
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