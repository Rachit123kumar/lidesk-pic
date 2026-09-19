import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../app/api/auth/[...nextauth]/route";
import { prisma } from "../../../lib/prisma";
import Sidebar from "../../components/SIdeBar";
import ImageGallery from "../../components/UploadedImagesGallery";

export default async function MyImagesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    return null;
  }

  const generations = await prisma.generation.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      inputImageUrl: true,
      outputImageUrl: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // -----------------------------
  // Uploaded images
  // -----------------------------

  // Same uploaded image can be used for multiple generations.
  // Map removes duplicates.
  const uploadedMap = new Map();

  for (const generation of generations) {
    if (!generation.inputImageUrl) continue;

    if (!uploadedMap.has(generation.inputImageUrl)) {
      uploadedMap.set(generation.inputImageUrl, {
        id: generation.id,
        url: generation.inputImageUrl,
        createdAt: generation.createdAt,
      });
    }
  }

  const uploadedImages = Array.from(uploadedMap.values());

  // -----------------------------
  // Generated images
  // -----------------------------

  const generatedImages = generations
    .filter((generation) => generation.outputImageUrl)
    .map((generation) => ({
      id: generation.id,
      url: generation.outputImageUrl,
      createdAt: generation.createdAt,
    }));

  return (
    <div className="flex h-[100dvh] w-full bg-[#0E0E10] text-gray-100 overflow-hidden font-['Inter',_sans-serif]">

      <Sidebar />

      <main className="flex-1 overflow-y-auto overflow-x-hidden pt-16 lg:pt-0 relative scroll-smooth">

        {/* Ambient background */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#4B3AFF]/15 blur-[120px] pointer-events-none" />

        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-[#FF4D6D]/10 blur-[120px] pointer-events-none" />

        <div className="p-6 md:p-8 lg:p-10 min-h-full relative z-10">

          <header className="mb-8">

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3 font-['Space_Grotesk',_sans-serif]">
              Your Gallery
            </h1>

            <p className="text-gray-400 text-sm md:text-base max-w-2xl">
              Browse your uploaded and generated images.
            </p>

          </header>

          <ImageGallery
            uploadedImages={uploadedImages}
            generatedImages={generatedImages}
          />

        </div>

      </main>

    </div>
  );
}