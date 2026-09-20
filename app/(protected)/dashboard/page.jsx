import Link from 'next/link';
import Sidebar from '../../components/SIdeBar';
import { Coins } from 'lucide-react';
import { prisma } from '../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

// Force Next.js to re-render this page on every request (fixes caching issues)
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

  // Build a clean Prisma where clause
  const whereClause = { 
    isActive: true 
  };

  if (currentGender === 'male') {
    whereClause.type = { in: ['male', 'both'] };
  } else if (currentGender === 'female') {
    whereClause.type = { in: ['female', 'both'] };
  }

  // Fetch styles using the dynamic where clause
  const styles = await prisma.style.findMany({
    where: whereClause,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="h-screen max-h-screen bg-[#FAFAF8] text-[#0E0E10] flex flex-col lg:flex-row overflow-hidden font-['Inter',_sans-serif]">
      <Sidebar />

      <main className="flex-1 flex flex-col h-full pt-14 lg:pt-0 w-full relative">
        
        {/* Neo-brutalist Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 border-b-2 border-[#0E0E10] bg-[#FAFAF8] z-10">
          <h1 className="text-xl md:text-2xl font-bold font-['Space_Grotesk',_sans-serif]">
            Styles
          </h1>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FFD93D] border-2 border-[#0E0E10] rounded-md shadow-[2px_2px_0_#0E0E10] transition-transform hover:-translate-y-0.5">
              <Coins size={16} strokeWidth={2.5} className="text-[#0E0E10]" />
              <span className="font-bold text-sm md:text-base">
                {userData?.coins || 0} coins
              </span>
            </div>

            {userData?.image && (
              <img 
                src={userData.image} 
                alt={userData.name || "User profile"} 
                className="w-9 h-9 border-2 border-[#0E0E10] rounded-md object-cover shadow-[2px_2px_0_#0E0E10] shrink-0"
              />
            )}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="px-4 sm:px-6 md:px-8 py-4 flex gap-3 border-b-2 border-[#0E0E10] bg-white">
          <Link 
            href="?gender=all"
            replace={true}
            className={`px-4 py-1.5 border-2 border-[#0E0E10] rounded-md font-bold text-sm transition-all shadow-[2px_2px_0_#0E0E10] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none ${
              currentGender === 'all' ? 'bg-[#0E0E10] text-white' : 'bg-[#FAFAF8] text-[#0E0E10]'
            }`}
          >
            All
          </Link>
          <Link 
            href="?gender=male"
            replace={true}
            className={`px-4 py-1.5 border-2 border-[#0E0E10] rounded-md font-bold text-sm transition-all shadow-[2px_2px_0_#0E0E10] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none ${
              currentGender === 'male' ? 'bg-[#0E0E10] text-white' : 'bg-[#FAFAF8] text-[#0E0E10]'
            }`}
          >
            Male
          </Link>
          <Link 
            href="?gender=female"
            replace={true}
            className={`px-4 py-1.5 border-2 border-[#0E0E10] rounded-md font-bold text-sm transition-all shadow-[2px_2px_0_#0E0E10] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none ${
              currentGender === 'female' ? 'bg-[#0E0E10] text-white' : 'bg-[#FAFAF8] text-[#0E0E10]'
            }`}
          >
            Female
          </Link>
        </div>

        {/* Scrollable grid */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-6 pb-24">
          <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
            {styles.length > 0 ? (
              styles.map((style) => (
                <Link
                  href={`/styles/${style.slug}`}
                  key={style.id} 
                  className="group cursor-pointer border-2 border-[#0E0E10] rounded-lg overflow-hidden flex flex-col text-center bg-white transition-all duration-200 shadow-[4px_4px_0_#0E0E10] hover:-translate-y-1 hover:shadow-[6px_6px_0_#0E0E10] active:translate-y-0.5 active:shadow-none"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100 border-b-2 border-[#0E0E10]">
                    <img 
                      src={style.images?.[0] || '/placeholder.jpg'} 
                      alt={style.styleName} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                      <h3 className="text-white font-bold text-sm mb-2 font-['Space_Grotesk',_sans-serif]">Description</h3>
                      <p className="text-gray-200 text-[11px] sm:text-xs leading-relaxed line-clamp-6 text-center">
                        {style.description || "No description available."}
                      </p>
                    </div>
                  </div>

                  <div className="px-3 py-3 md:px-4 md:py-4 flex flex-col gap-2.5 flex-1 justify-center bg-[#FAFAF8]">
                    <h2 className="font-bold text-sm md:text-base leading-tight truncate font-['Space_Grotesk',_sans-serif]">
                      {style.styleName}
                    </h2>
                    
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
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <p className="font-bold text-lg text-gray-500">No styles found for this category.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}