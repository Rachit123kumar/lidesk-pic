import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "../../../api/auth/[...nextauth]/route";
import { prisma } from "../../../../lib/prisma";

export async function GET(request, { params }) {
  try {
    // 1. Validate session
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Generation ID is required" },
        { status: 400 }
      );
    }

    // 2. Fetch the user to verify ownership
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // 3. Query the database strictly for this user's generation
    const generation = await prisma.generation.findFirst({
      where: {
        id: id,
        userId: user.id,
      },
      select: {
        id: true,
        status: true,
        outputImageUrl: true,
        inputImageUrl: true,
        error: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!generation) {
      return NextResponse.json(
        { success: false, error: "Generation not found" },
        { status: 404 }
      );
    }

    // 4. Return database record
    return NextResponse.json({
      success: true,
      data: generation,
    });
  } catch (error) {
    console.error("Fetch generation status error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch generation status",
      },
      { status: 500 }
    );
  }
}