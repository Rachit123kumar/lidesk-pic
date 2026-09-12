import { notFound } from 'next/navigation';
import Image from 'next/image';
import Sidebar from '../../../components/SIdeBar';
import { prisma } from '../../../../lib/prisma';
import GenerateClient from '../../../components/generateClient';

export default async function StyleDetailsPage({ params }) {
  const { slug } = await params;

  const style = await prisma.style.findUnique({
    where: {
      slug: slug,
    },
  });

  if (!style) {
    notFound();
  }

  return (
    <div className="h-screen max-h-screen bg-[#FAFAF8] text-[#0E0E10] flex flex-col lg:flex-row overflow-hidden selection:bg-[#FFC93C] selection:text-[#0E0E10]">
      <Sidebar />

      <main className="flex-1 flex flex-col h-full pt-14 lg:pt-0 w-full relative font-['Inter',_sans-serif] overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
        
        {/* Header */}
        <div className="flex items-center px-4 sm:px-6 md:px-10 py-5 border-b-2 border-[#0E0E10] bg-white sticky top-0 z-10 shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-black font-['Space_Grotesk',_sans-serif] uppercase tracking-tight">
            {style.styleName}
          </h1>
        </div>

        {/* Content Grid */}
        <div className="p-4 sm:p-6 md:p-10 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left Column: Image */}
          <div className="group border-2 border-[#0E0E10] rounded-sm shadow-[8px_8px_0_#0E0E10] hover:shadow-[12px_12px_0_#0E0E10] transition-shadow duration-300 overflow-hidden aspect-[4/5] bg-white relative">
            {style.images?.[0] ? (
              <Image 
                src={style.images[0]} 
                alt={style.styleName} 
                fill
                sizes="(max-w-768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                priority
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center font-bold text-[#0E0E10] opacity-50 border-4 border-dashed border-[#0E0E10] m-4 w-[calc(100%-32px)] h-[calc(100%-32px)] bg-gray-100">
                <span className="text-4xl mb-2">?</span>
                <span className="uppercase tracking-widest text-sm">No Preview</span>
              </div>
            )}
          </div>

          {/* Right Column: Info & Actions */}
          <div className="flex flex-col gap-8">
            
            {/* Description Card */}
            <div className="border-2 border-[#0E0E10] rounded-sm bg-white p-6 sm:p-8 shadow-[4px_4px_0_#0E0E10]">
              <h2 className="text-sm font-black border-b-2 border-[#0E0E10] pb-3 mb-4 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-[#4B3AFF] inline-block"></span>
                Description
              </h2>
              <p className="text-base sm:text-lg leading-relaxed font-medium text-gray-800">
                {style.description || "No description available for this style."}
              </p>
            </div>

            {/* Tags */}
            {style.tags && style.tags.length > 0 && (
              <div className="border-2 border-[#0E0E10] rounded-sm bg-[#FFC93C] p-6 sm:p-8 shadow-[4px_4px_0_#0E0E10]">
                <h2 className="text-sm font-black border-b-2 border-[#0E0E10] pb-3 mb-4 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#0E0E10] inline-block"></span>
                  Tags
                </h2>
                <div className="flex flex-wrap gap-3">
                  {style.tags.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="text-xs sm:text-sm font-bold px-3 py-1.5 border-2 border-[#0E0E10] bg-white text-[#0E0E10] rounded-sm uppercase tracking-wider hover:-translate-y-1 hover:shadow-[2px_2px_0_#0E0E10] transition-all cursor-default"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Client Component for Generation */}
            <GenerateClient styleId={style.id} styleName={style.styleName} />
            
          </div>
        </div>
      </main>
    </div>
  );
}