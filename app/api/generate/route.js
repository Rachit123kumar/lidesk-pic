import Replicate from "replicate";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../lib/prisma"; // Adjust path to your prisma file
import { authOptions } from "../../api/auth/[...nextauth]/route";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract the new parameters (with fallbacks just in case)
    const { 
      styleId, 
      inputImageUrl, 
      aspectRatio = "match_input_image", 
      outputFormat = "webp" 
    } = await req.json();

    if (!styleId || !inputImageUrl) {
      return NextResponse.json(
        { error: "styleId and inputImageUrl are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const style = await prisma.style.findUnique({
      where: { id: styleId },
    });

    if (!style || !style.isActive) {
      return NextResponse.json({ error: "Style Unavailable" }, { status: 404 });
    }

    const webhookUrl = `${process.env.REPLICATE_WEBHOOK_URL}/api/replicate/webhook`;
    const modelToUse = "black-forest-labs/flux-2-pro";

    // Trigger Replicate with the dynamic user choices
    const prediction = await replicate.predictions.create({
      model: modelToUse,
      input: {
        prompt: style.prompt,
        input_images: [inputImageUrl],
        aspect_ratio: aspectRatio,
        output_format: outputFormat,
      },
      webhook: webhookUrl,
      webhook_events_filter: ["completed"],
    });

    const generation = await prisma.generation.create({
      data: {
        predictionId: prediction.id,
        userId: user.id,
        status: prediction.status,
        model: modelToUse,
        prompt: style.prompt,
        inputImageUrl: inputImageUrl,
      },
    });

    return NextResponse.json({
      success: true,
      generationId: generation.id,
      predictionId: prediction.id,
      status: prediction.status,
    });
  } catch (error) {
    console.error("Replicate error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}