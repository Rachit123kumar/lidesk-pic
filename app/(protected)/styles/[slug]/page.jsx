import { notFound } from "next/navigation";
import Image from "next/image";
import { Inter, JetBrains_Mono } from "next/font/google";
import { getServerSession } from "next-auth/next";

import Sidebar from "../../../components/SIdeBar";
import GenerateClient from "../../../components/generateClient";
import { prisma } from "../../../../lib/prisma";
import { authOptions } from "../../../api/auth/[...nextauth]/route"; // Adjust path to your authOptions if necessary

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
        bg-[#0A0A0F]
        text-[#F2F2F5]
        flex
        flex-col
        lg:flex-row
        overflow-hidden
        font-[family-name:var(--font-body)]
        selection:bg-[#7C5CFF]
        selection:text-white
      `}
    >
      <Sidebar />

      <main className="relative flex-1 h-full pt-14 lg:pt-0 w-full overflow-y-auto overflow-x-hidden">
        {/* Ambient background glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-[#7C5CFF]/20 blur-[140px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none fixed bottom-[-10%] right-[5%] w-[500px] h-[500px] rounded-full bg-[#FF5CA8]/15 blur-[140px]"
        />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 py-8 lg:py-12">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8">
            <span className="font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-wider text-[#7C5CFF]">
              Style
            </span>
            <span className="font-[family-name:var(--font-mono)] text-[12px] text-[#5C5C6E]">
              #{style.id.slice(0, 8)}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05] mb-10 max-w-3xl">
            {style.styleName}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-6 lg:gap-8">
            {/* Preview image */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] lg:aspect-auto lg:h-[420px] max-w-[380px] lg:max-w-none mx-auto lg:mx-0 w-full bg-[#111117] ring-1 ring-white/10">
              {style.images?.[0] ? (
                <>
                  <div
                    aria-hidden="true"
                    className="absolute -inset-px rounded-2xl bg-gradient-to-br from-[#7C5CFF] via-transparent to-[#FF5CA8] opacity-40 blur-sm"
                  />
                  <Image
                    src={style.images[0]}
                    alt={`${style.styleName} professional headshot style`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover rounded-2xl opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]"
                    priority
                  />
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                  <span className="text-[#8B8B9A] text-sm">No preview generated yet</span>
                </div>
              )}
            </div>

            {/* Information column */}
            <div className="flex flex-col gap-5">
              {/* Description */}
              <div className="rounded-2xl bg-white/[0.04] ring-1 ring-white/10 p-6 backdrop-blur-sm">
                <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-[#8B8B9A] mb-3">
                  Description
                </p>
                <p className="text-[15px] leading-relaxed text-[#D4D4DC]">
                  {style.description || "No description has been added for this style yet."}
                </p>
              </div>

              {/* Tags */}
              {style.tags?.length > 0 && (
                <div className="rounded-2xl bg-white/[0.04] ring-1 ring-white/10 p-6 backdrop-blur-sm">
                  <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-[#8B8B9A] mb-3">
                    Tags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {style.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-[family-name:var(--font-mono)] text-[12px] px-2.5 py-1 rounded-md bg-[#7C5CFF]/10 text-[#B7A8FF] ring-1 ring-[#7C5CFF]/25"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Generate section */}
              <div className="rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] ring-1 ring-white/10 p-6 flex-1">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-[#8B8B9A]">
                      Generate
                    </p>
                    <p className="mt-1 text-sm text-white/40">Create your professional headshot</p>
                  </div>

                  <div className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7C5CFF]/10 ring-1 ring-[#7C5CFF]/20 text-[#B7A8FF]">
                    <span className="text-sm">◆</span>
                    <span className="text-xs font-medium">
                      {generationCost} {generationCost === 1 ? "coin" : "coins"}
                    </span>
                  </div>
                </div>

                {/* Pass pastImages to the client component */}
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
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[fadeIn_0\\.5s_ease-out_forwards\\] {
            animation: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}