import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../api/auth/[...nextauth]/route";
import { prisma } from "../../../../lib/prisma";

const ADMIN_EMAIL = "hellobittukumar12@gmail.com";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Not logged in
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Logged in but not admin
    if (session.user.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const conversations =
      await prisma.supportConversation.findMany({
        orderBy: {
          lastMessageAt: "desc",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          messages: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },
        },
      });

    return NextResponse.json({
      conversations,
    });
  } catch (error) {
    console.error("Admin support fetch error:", error);

    return NextResponse.json(
      { error: "Failed to load support conversations" },
      { status: 500 }
    );
  }
}