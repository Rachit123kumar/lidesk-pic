import Link from 'next/link';
import Sidebar from '../../components/SIdeBar';
import { Coins, Image as ImageIcon } from 'lucide-react';
import { prisma } from '../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

// Force Next.js to re-render this page on every request
export const dynamic = 'force-dynamic';

export default async function DashboardPage(props) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/login');
  }

  // Await searchParams to support Next.js 15+ changes
  const searchParams = await props.searchParams;
  const currentGender = typeof searchParams?.gender === 'string' ? searchParams.gender : 'all';

  const userData = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { coins: true, name: true, image: true }
  });

  return (
    <div className="flex h-[calc(100vh-60px)] lg:h-screen w-full overflow-hidden bg-[#09090b] text-slate-200 font-sans selection:bg-blue-500/30">
      
      <Sidebar />

      <main className="flex-1 flex flex-col h-full w-full relative bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900/40 via-[#09090b] to-[#09090b]">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[120px] pointer-events-none rounded-full" />

        {/* Premium Header */}
        <div className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-white/[0.08] bg-[#09090b]/60 backdrop-blur-xl z-20 shrink-0">
          <h1 className="text-xl md:text-2xl font-semibold text-white tracking-tight">
            Styles
          </h1>

          <div className="flex items-center gap-4">
            {/* Premium Coins Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.05)]">
              <Coins size={16} strokeWidth={2.5} className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]" />
              <span className="font-semibold text-sm text-amber-400">
                {userData?.coins || 0} Credits
              </span>
            </div>

            {/* Profile Avatar */}
            {userData?.image && (
              <img 
                src={userData.image} 
                alt={userData.name || "User profile"} 
                className="w-9 h-9 rounded-full border border-white/10 object-cover shadow-inner bg-white/5 shrink-0"
              />
            )}
          </div>
        </div>

        {/* Premium Filter Controls */}
        <div className="px-6 md:px-8 py-4 flex gap-2 border-b border-white/[0.05] bg-[#09090b]/40 backdrop-blur-md z-10 shrink-0">
          <Link 
            href="?gender=all"
            replace={true}
            className={`px-4 py-1.5 rounded-full font-medium text-[13px] transition-all duration-300 ${
              currentGender === 'all' 
                ? 'bg-white text-[#09090b] shadow-[0_0_15px_rgba(255,255,255,0.15)]' 
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/10'
            }`}
          >
            All
          </Link>
          <Link 
            href="?gender=male"
            replace={true}
            className={`px-4 py-1.5 rounded-full font-medium text-[13px] transition-all duration-300 ${
              currentGender === 'male' 
                ? 'bg-white text-[#09090b] shadow-[0_0_15px_rgba(255,255,255,0.15)]' 
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/10'
            }`}
          >
            Male
          </Link>
          <Link 
            href="?gender=female"
            replace={true}
            className={`px-4 py-1.5 rounded-full font-medium text-[13px] transition-all duration-300 ${
              currentGender === 'female' 
                ? 'bg-white text-[#09090b] shadow-[0_0_15px_rgba(255,255,255,0.15)]' 
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/10'
            }`}
          >
            Female
          </Link>
        </div>

        {/* Scrollable Container with Suspense Boundary */}
        <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 pb-24 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full z-0">
          {/* 
            By setting the key to currentGender, Next.js knows to show the fallback 
            skeleton whenever the category changes and new data is fetching.
          */}
          <Suspense key={currentGender} fallback={<GridSkeleton />}>
            <StyleGrid currentGender={currentGender} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

// ============================================================================
// 1. DATA FETCHING COMPONENT
// ============================================================================
async function StyleGrid({ currentGender }) {
  const whereClause = { isActive: true };

  if (currentGender === 'male') {
    whereClause.type = { in: ['male', 'both'] };
  } else if (currentGender === 'female') {
    whereClause.type = { in: ['female', 'both'] };
  }

  const styles = await prisma.style.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
  });

  if (styles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center w-full h-full">
        <div className="h-16 w-16 mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
          <span className="text-2xl opacity-50">✨</span>
        </div>
        <h3 className="text-lg font-medium text-white tracking-tight">No styles found</h3>
        <p className="text-sm text-slate-400 mt-1">Try selecting a different category filter.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
      {styles.map((style) => (
        <Link
          href={`/styles/${style.slug}`}
          key={style.id} 
          className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden flex flex-col backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-white/[0.2] hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)] relative"
        >
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-white/[0.02]">
            <img 
              src={style.images?.[0] || '/placeholder.jpg'} 
              alt={style.styleName} 
              className="w-full h-full object-cover object-[center_top] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" 
            />
            
            {/* 
              Fix: Description overlay only renders if a description exists. 
              If there is no description, the dark overlay simply won't appear.
            */}
            {style.description && style.description.trim() !== "" && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-5 text-center">
                <h3 className="text-white font-semibold text-sm mb-2 tracking-wide">Description</h3>
                <p className="text-slate-300 text-[11px] sm:text-xs leading-relaxed line-clamp-6">
                  {style.description}
                </p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/[0.05] flex flex-col gap-3 flex-1 justify-center bg-gradient-to-b from-transparent to-white/[0.02]">
            <h2 className="font-semibold text-sm md:text-base text-white leading-tight truncate">
              {style.styleName}
            </h2>
            
            {style.tags && style.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                {style.tags.slice(0, 2).map((tag, tagIndex) => (
                  <span 
                    key={tagIndex} 
                    className="text-[9px] sm:text-[10px] font-medium px-2 py-0.5 border border-white/10 bg-white/5 text-slate-300 rounded-full uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
                {style.tags.length > 2 && (
                  <span className="text-[9px] sm:text-[10px] font-medium px-2 py-0.5 border border-white/5 bg-transparent text-slate-400 rounded-full">
                    +{style.tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

// ============================================================================
// 2. LOADING SKELETON COMPONENT (Shows during filter change)
// ============================================================================
function GridSkeleton() {
  const skeletonCards = Array.from({ length: 10 });
  
  return (
    <div className="max-w-[1600px] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6 w-full">
      {skeletonCards.map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden flex flex-col backdrop-blur-sm shadow-2xl relative"
        >
          <div className="relative aspect-[3/4] w-full bg-white/[0.03] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent animate-pulse duration-1000" />
            <ImageIcon className="w-8 h-8 text-slate-600/30 animate-pulse" />
          </div>
          <div className="p-4 border-t border-white/[0.05] flex flex-col gap-3">
            <div className="h-4 bg-white/10 rounded-md w-2/3 animate-pulse" />
            <div className="flex flex-wrap gap-2 mt-1">
              <div className="h-5 w-16 bg-white/5 border border-white/5 rounded-full animate-pulse" />
              <div className="h-5 w-20 bg-white/5 border border-white/5 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}