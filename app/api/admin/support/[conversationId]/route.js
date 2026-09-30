import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../api/auth/[...nextauth]/route";
import { prisma } from "../../../../../lib/prisma";

const ADMIN_EMAIL = "hellobittukumar12@gmail.com";

export async function GET(
  req,
  { params }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check admin authorization
    if (session.user.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { conversationId } = await params;

    const conversation =
      await prisma.supportConversation.findUnique({
        where: {
          id: conversationId,
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
              createdAt: "asc",
            },
          },
        },
      });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      conversation,
    });
  } catch (error) {
    console.error("Admin conversation error:", error);

    return NextResponse.json(
      { error: "Failed to load conversation" },
      { status: 500 }
    );
  }
}