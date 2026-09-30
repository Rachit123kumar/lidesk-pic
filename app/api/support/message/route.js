import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../api/auth/[...nextauth]/route";
import { prisma } from "../../../../lib/prisma";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

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

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    let conversation = await prisma.supportConversation.findFirst({
      where: {
        userId: user.id,
        status: "open",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!conversation) {
      conversation = await prisma.supportConversation.create({
        data: {
          userId: user.id,
          status: "open",
        },
      });
    }

    const supportMessage = await prisma.supportMessage.create({
      data: {
        conversationId: conversation.id,
        sender: "user",
        message,
      },
    });

    await prisma.supportConversation.update({
      where: {
        id: conversation.id,
      },
      data: {
        lastMessageAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: supportMessage,
    });
  } catch (error) {
    console.error("Support message error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}