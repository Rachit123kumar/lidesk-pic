import { notFound } from "next/navigation";
import Image from "next/image";
import { Inter, JetBrains_Mono } from "next/font/google";
import { getServerSession } from "next-auth/next";

import Sidebar from "../../../components/SIdeBar";
import GenerateClient from "../../../components/generateClient";
import { prisma } from "../../../../lib/prisma";
import { authOptions } from "../../../api/auth/[...nextauth]/route"; 

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "800"],
  variable: "--font-body",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export default async function StyleDetailsPage({ params }) {
  const { slug } = await params;

  // 1. Fetch the Style
  const style = await prisma.style.findUnique({
    where: { slug },
    select: {
      id: true,
      styleName: true,
      images: true,
      description: true,
      tags: true,
      isActive: true,
      generationCost: true,
    },
  });

  if (!style || !style.isActive) {
    notFound();
  }

  // 2. Fetch the User Session and Past Uploaded Images
  const session = await getServerSession(authOptions);
  let pastImages = [];

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (user) {
      const pastGenerations = await prisma.generation.findMany({
        where: {
          userId: user.id,
          inputImageUrl: { not: null },
        },
        select: {
          inputImageUrl: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Deduplicate the image URLs
      const uniqueImages = new Set();
      pastGenerations.forEach((gen) => {
        if (gen.inputImageUrl) {
          uniqueImages.add(gen.inputImageUrl);
        }
      });
      pastImages = Array.from(uniqueImages);
    }
  }

  const generationCost = style.generationCost;

  return (
    <div
      className={`
        ${inter.variable}
        ${jetbrainsMono.variable}
        h-[100dvh]
        bg-[#050507]
        text-slate-200
        flex
        flex-col
        lg:flex-row
        overflow-hidden
        font-[family-name:var(--font-body)]
        selection:bg-blue-500/30
        selection:text-white
      `}
    >
      <Sidebar />

      <main className="relative flex-1 h-full pt-14 lg:pt-0 w-full overflow-y-auto overflow-x-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900/40 via-[#050507] to-[#050507]">
        
        {/* Premium Ambient Background Glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-[#7C5CFF]/10 blur-[120px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none fixed bottom-[-10%] right-[5%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px]"
        />

        <div className="relative max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12 py-10 lg:py-16">
          
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8">
            <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-widest text-[#7C5CFF] font-medium bg-[#7C5CFF]/10 px-3 py-1 rounded-full border border-[#7C5CFF]/20">
              Style Details
            </span>
            <span className="font-[family-name:var(--font-mono)] text-[12px] text-slate-500">
              ID: {style.id.slice(0, 8)}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-12 max-w-3xl bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent">
            {style.styleName}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-12">
            
            {/* Preview image */}
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] lg:aspect-auto lg:h-[500px] max-w-[420px] lg:max-w-none mx-auto lg:mx-0 w-full bg-white/[0.02] border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] group">
              {style.images?.[0] ? (
                <>
                  <div
                    aria-hidden="true"
                    className="absolute -inset-px rounded-3xl bg-gradient-to-br from-[#7C5CFF]/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-md z-10"
                  />
                  {/* Fixed Image: Added object-[center_top] to prevent head cutoff */}
                  <Image
                    src={style.images[0]}
                    alt={`${style.styleName} professional headshot style`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover object-[center_top] opacity-0 animate-[fadeIn_0.7s_ease-out_forwards] transition-transform duration-1000 group-hover:scale-105"
                    priority
                  />
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-white/[0.02]">
                  <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <span className="text-xl opacity-50">🖼️</span>
                  </div>
                  <span className="text-slate-500 text-sm font-medium">No preview available</span>
                </div>
              )}
            </div>

            {/* Information column */}
            <div className="flex flex-col gap-6">
              
              {/* Description - ONLY renders if a valid description exists */}
              {style.description && style.description.trim() !== "" && (
                <div className="rounded-3xl bg-white/[0.02] border border-white/[0.08] p-6 lg:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#7C5CFF]"></span>
                    About this style
                  </p>
                  <p className="text-[15px] sm:text-[16px] leading-relaxed text-slate-300">
                    {style.description}
                  </p>
                </div>
              )}

              {/* Tags */}
              {style.tags?.length > 0 && (
                <div className="rounded-3xl bg-white/[0.02] border border-white/[0.08] p-6 lg:p-8 backdrop-blur-xl shadow-2xl">
                  <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                    Attributes
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {style.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[12px] font-medium px-3 py-1.5 rounded-full bg-white/5 text-slate-300 border border-white/10 tracking-wide"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Generate section */}
              <div className="rounded-3xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.08] p-6 lg:p-8 flex-1 flex flex-col shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#7C5CFF]/50 to-transparent" />
                
                <div className="flex items-start justify-between gap-4 mb-8">
                  <div>
                    <h2 className="text-xl font-semibold text-white tracking-tight">
                      Ready to Generate?
                    </h2>
                    <p className="mt-1.5 text-sm text-slate-400">Upload your images to create your professional headshot.</p>
                  </div>

                  {/* Premium Price Tag */}
                  <div className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
                    <span className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">✨</span>
                    <span className="text-[13px] font-bold text-amber-400 tracking-wide">
                      {generationCost} {generationCost === 1 ? "Credit" : "Credits"}
                    </span>
                  </div>
                </div>

                {/* Generate Client Component */}
                <div className="flex-1 flex flex-col">
                  <GenerateClient
                    styleId={style.id}
                    styleName={style.styleName}
                    generationCost={generationCost}
                    pastImages={pastImages} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Smooth Fade In Animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[fadeIn_0\\.7s_ease-out_forwards\\] {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}