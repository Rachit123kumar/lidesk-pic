import Link from 'next/link';
import Sidebar from '../../components/SIdeBar';
import {
  Bell,
  Heart,
  Gift,
  Flame,
  Briefcase,
  Camera,
  Plane,
  Film,
  Sparkles,
  Music
} from 'lucide-react';
import { prisma } from '../../../lib/prisma';

// Custom SVG to replace the missing Lucide Instagram export
const InstagramIcon = ({ size = 24, strokeWidth = 2, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default async function DashboardPage() {
  const styles = await prisma.style.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="h-screen max-h-screen bg-[#FAFAF8] text-[#0E0E10] flex flex-col lg:flex-row overflow-hidden">
      <Sidebar />

      {/* Main content area */}
      <main className="flex-1 flex flex-col h-full pt-14 lg:pt-0 w-full relative font-['Inter',_sans-serif]">
        
        {/* Slim header */}
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 border-b-2 border-[#0E0E10] bg-[#FAFAF8] z-10">
          <h1 className="text-sm font-bold font-['Space_Grotesk',_sans-serif]">
            Choose a style
          </h1>

          <button
            className="w-7 h-7 flex items-center justify-center bg-white border-2 border-[#0E0E10] rounded-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[2px_2px_0_#0E0E10] active:translate-y-0.5 active:shadow-none relative shrink-0"
            aria-label="Notifications"
          >
            <Bell strokeWidth={2} size={14} className="text-[#0E0E10]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#FF4D6D] border border-[#0E0E10]" />
          </button>
        </div>

        {/* Scrollable grid */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-5 pb-24">
          <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {styles.map((style, index) => (
              <Link
                href={`/styles/${style.slug}`} // Navigates to the slug page
                key={style.id || index} 
                className="group cursor-pointer border-2 border-[#0E0E10] rounded-sm overflow-hidden flex flex-col text-left transition-all duration-200 shadow-[3px_3px_0_#0E0E10] hover:-translate-y-1 hover:shadow-[5px_5px_0_#0E0E10] active:translate-y-0.5 active:shadow-none"
              >
                {/* Image Container with Netflix Hover Effect */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  <img 
                    src={style.images?.[0] || '/placeholder.jpg'} 
                    alt={style.styleName} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  
                  {/* Hover Overlay (Dark Gradient & Description) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4">
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                      <p className="text-white/90 text-[11px] sm:text-xs leading-relaxed line-clamp-3 sm:line-clamp-4">
                        {style.description || "No description available for this style."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-2.5 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 border-t-2 border-[#0E0E10] bg-white group-hover:bg-[#FAFAF8] transition-colors duration-200 flex flex-col gap-1.5">
                  <span className="font-bold text-xs sm:text-sm md:text-base leading-tight line-clamp-1">
                    {style.styleName}
                  </span>
                  
                  {/* Tags Rendering */}
                  {style.tags && style.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {style.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span 
                          key={tagIndex} 
                          className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 border border-[#0E0E10] bg-[#FAFAF8] text-[#0E0E10] rounded-sm uppercase tracking-wider"
                        >
                          {tag}
                        </span>
                      ))}
                      {/* Optional: Show "+X" if there are more than 3 tags */}
                      {style.tags.length > 3 && (
                        <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 border border-[#0E0E10] bg-gray-200 text-[#0E0E10] rounded-sm">
                          +{style.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}