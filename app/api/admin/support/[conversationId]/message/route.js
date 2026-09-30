import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../../lib/auth";
import { prisma } from "../../../../../../lib/prisma";

const ADMIN_EMAIL = "hellobittukumar12@gmail.com";

export async function POST(
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

    const body = await req.json();
    const message = body.message?.trim();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: "Message is too long" },
        { status: 400 }
      );
    }

    const conversation =
      await prisma.supportConversation.findUnique({
        where: {
          id: conversationId,
        },
      });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    const supportMessage =
      await prisma.supportMessage.create({
        data: {
          conversationId,
          sender: "admin",
          message,
        },
      });

    await prisma.supportConversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: new Date(),
        status: "open",
      },
    });

    return NextResponse.json({
      success: true,
      message: supportMessage,
    });
  } catch (error) {
    console.error("Admin reply error:", error);

    return NextResponse.json(
      { error: "Failed to send reply" },
      { status: 500 }
    );
  }
}