import React from "react";
import { prisma } from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import Sidebar from "../../components/SIdeBar";
import GenerationsGallery from "../../components/GenerationsGallery";

export default async function GenerationsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return (
      <div className="flex h-screen w-full text-[#0E0E10] bg-[#FAFAF8] overflow-hidden">
        <Sidebar />

        <main className="flex-1 flex justify-center items-center h-full pt-16 lg:pt-0">
          <div className="max-w-sm text-center px-8">
            <h1 className="text-2xl font-semibold text-white">
              Please log in to view your generations
            </h1>

            <p className="mt-2 text-sm text-white/50">
              Your images are tied to your account.
            </p>
          </div>
        </main>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
      coins: true,
    },
  });

  if (!user) {
    return null;
  }

  const userGenerations = await prisma.generation.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      coinTransactions: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  // Serialize Prisma Date objects before sending to the client component.
  const serialized = userGenerations.map((generation) => ({
    ...generation,

    createdAt: generation.createdAt.toISOString(),
    updatedAt: generation.updatedAt.toISOString(),

    coinTransactions: generation.coinTransactions.map((transaction) => ({
      ...transaction,
      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString(),
    })),
  }));

  return (
    <div className="flex h-screen w-full bg-[#0B0D14] overflow-hidden font-['Inter',_sans-serif]">
      <Sidebar />

      <main className="flex-1 h-full overflow-y-auto pt-16 lg:pt-0 relative">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 right-0 w-[560px] h-[560px] rounded-full bg-gradient-to-br from-violet-600/20 via-fuchsia-500/10 to-transparent blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 sm:px-8 lg:px-12 py-10 max-w-7xl">
          <GenerationsGallery
            generations={serialized}
            currentCoins={user.coins}
          />
        </div>
      </main>
    </div>
  );
}