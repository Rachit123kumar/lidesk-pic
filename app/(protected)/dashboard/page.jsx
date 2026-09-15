import Link from 'next/link';
import Sidebar from '../../components/SIdeBar';
import {
  Bell,
  Coins
} from 'lucide-react';
import { prisma } from '../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/login');
  }

  // OPTIMIZATION: Only fetch the coins to save bandwidth
  const userData = await prisma.user.findUnique({
    where: {
      id: session.user.id
    },
    select: {
      coins: true
    }
  });

  const styles = await prisma.style.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="h-screen max-h-screen bg-[#FAFAF8] text-[#0E0E10] flex flex-col lg:flex-row overflow-hidden font-['Inter',_sans-serif]">
      <Sidebar />

      {/* Main content area */}
      <main className="flex-1 flex flex-col h-full pt-14 lg:pt-0 w-full relative">
        
        {/* Neo-brutalist Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 border-b-2 border-[#0E0E10] bg-[#FAFAF8] z-10">
          <h1 className="text-xl md:text-2xl font-bold font-['Space_Grotesk',_sans-serif]">
            Styles
          </h1>

          <div className="flex items-center gap-4">
            {/* Coin Display matching the neo-brutalism theme */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FFD93D] border-2 border-[#0E0E10] rounded-md shadow-[2px_2px_0_#0E0E10] transition-transform hover:-translate-y-0.5">
              <Coins size={16} strokeWidth={2.5} className="text-[#0E0E10]" />
              <span className="font-bold text-sm md:text-base">
                {userData?.coins || 0} coins
              </span>
            </div>

            {/* Notification Bell */}
            <button
              className="w-9 h-9 flex items-center justify-center bg-white border-2 border-[#0E0E10] rounded-md transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[2px_2px_0_#0E0E10] active:translate-y-0.5 active:shadow-none relative shrink-0"
              aria-label="Notifications"
            >
              <Bell strokeWidth={2.5} size={16} className="text-[#0E0E10]" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#FF4D6D] border-2 border-[#0E0E10]" />
            </button>
          </div>
        </div>

        {/* Scrollable grid */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-8 pb-24">
          <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
            {styles.map((style) => (
              <Link
                href={`/styles/${style.slug}`}
                key={style.id} 
                className="group cursor-pointer border-2 border-[#0E0E10] rounded-lg overflow-hidden flex flex-col text-center bg-white transition-all duration-200 shadow-[4px_4px_0_#0E0E10] hover:-translate-y-1 hover:shadow-[6px_6px_0_#0E0E10] active:translate-y-0.5 active:shadow-none"
              >
                {/* Image Container (Top) */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100 border-b-2 border-[#0E0E10]">
                  <img 
                    src={style.images?.[0] || '/placeholder.jpg'} 
                    alt={style.styleName} 
                    className="w-full h-full object-cover" 
                  />
                  
                  {/* Hover Overlay - Only shows description on hover */}
                  <div className="absolute inset-0 bg-black/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                    <h3 className="text-white font-bold text-sm mb-2 font-['Space_Grotesk',_sans-serif]">Description</h3>
                    <p className="text-gray-200 text-[11px] sm:text-xs leading-relaxed line-clamp-6 text-center">
                      {style.description || "No description available."}
                    </p>
                  </div>
                </div>

                {/* Card Footer (Bottom) - Text is now strictly below the image */}
                <div className="px-3 py-3 md:px-4 md:py-4 flex flex-col gap-2.5 flex-1 justify-center bg-[#FAFAF8]">
                  <h2 className="font-bold text-sm md:text-base leading-tight truncate font-['Space_Grotesk',_sans-serif]">
                    {style.styleName}
                  </h2>
                  
                  {/* Tags */}
                  {style.tags && style.tags.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {style.tags.slice(0, 2).map((tag, tagIndex) => (
                        <span 
                          key={tagIndex} 
                          className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 border border-[#0E0E10] bg-white text-[#0E0E10] rounded-full uppercase tracking-wide"
                        >
                          {tag}
                        </span>
                      ))}
                      {style.tags.length > 2 && (
                        <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 border border-[#0E0E10] bg-gray-100 text-[#0E0E10] rounded-full">
                          +{style.tags.length - 2}
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