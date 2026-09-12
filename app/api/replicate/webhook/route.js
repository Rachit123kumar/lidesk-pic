import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";

import { prisma } from "../../../../lib/prisma";
import { r2 } from "../../../../lib/r2";

export async function POST(request) {
  try {
    console.log("");
    console.log("=================================");
    console.log("🔥 WEBHOOK RECEIVED");
    console.log("=================================");

    const body = await request.json();

    const { id, status, output, error } = body;

    console.log("ID:", id);
    console.log("STATUS:", status);
    console.log("OUTPUT:", output);

    // Find our generation using Replicate prediction ID
    const generation = await prisma.generation.findUnique({
      where: {
        predictionId: id,
      },
    });

    if (!generation) {
      console.log("❌ Generation not found:", id);

      return NextResponse.json(
        { error: "Generation not found" },
        { status: 404 }
      );
    }

    // -----------------------------
    // FAILED
    // -----------------------------

    if (status === "failed") {
      await prisma.generation.update({
        where: {
          id: generation.id,
        },
        data: {
          status: "failed",
          error: error || "Generation failed",
        },
      });

      console.log("❌ Generation failed");

      return NextResponse.json({
        received: true,
      });
    }

    // -----------------------------
    // CANCELED
    // -----------------------------

    if (status === "canceled") {
      await prisma.generation.update({
        where: {
          id: generation.id,
        },
        data: {
          status: "canceled",
        },
      });

      console.log("❌ Generation canceled");

      return NextResponse.json({
        received: true,
      });
    }

    // -----------------------------
    // PROCESSING / STARTING
    // -----------------------------

    if (status === "starting" || status === "processing") {
      await prisma.generation.update({
        where: {
          id: generation.id,
        },
        data: {
          status: "processing",
        },
      });

      console.log("⏳ Generation still processing");

      return NextResponse.json({
        received: true,
      });
    }

    // -----------------------------
    // SUCCESS
    // -----------------------------

    if (status === "succeeded") {
      // Replicate can return output as an array
      const replicateImageUrl = Array.isArray(output)
        ? output[0]
        : output;

      if (!replicateImageUrl) {
        console.log("❌ No output image URL");

        await prisma.generation.update({
          where: {
            id: generation.id,
          },
          data: {
            status: "failed",
            error: "Replicate returned no output image",
          },
        });

        return NextResponse.json({
          received: true,
        });
      }

      console.log("⬇️ Downloading image from Replicate...");

      // Download image from Replicate
      const imageResponse = await fetch(replicateImageUrl);

      if (!imageResponse.ok) {
        throw new Error(
          `Failed to download image: ${imageResponse.status}`
        );
      }

      const imageBuffer = Buffer.from(
        await imageResponse.arrayBuffer()
      );

      // Get actual image type
      const contentType =
        imageResponse.headers.get("content-type") ||
        "application/octet-stream";

      console.log("📦 Content type:", contentType);
      console.log("📦 Image size:", imageBuffer.length);

      // Determine extension
      const extension =
        contentType === "image/png"
          ? "png"
          : contentType === "image/jpeg"
          ? "jpg"
          : contentType === "image/webp"
          ? "webp"
          : "bin";

      // R2 object path
      const key = `generations/${generation.userId}/${generation.id}.${extension}`;

      console.log("⬆️ Uploading to R2...");
      console.log("R2 KEY:", key);

      // Upload to Cloudflare R2
      await r2.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: key,
          Body: imageBuffer,
          ContentType: contentType,
        })
      );

      console.log("✅ Image uploaded to R2");

      // Public R2 URL
      const r2Url = `${process.env.R2_PUBLIC_URL}/${key}`;

      console.log("R2 URL:", r2Url);

      // Update database
      await prisma.generation.update({
        where: {
          id: generation.id,
        },
        data: {
          status: "succeeded",
          outputImageUrl: r2Url,
        },
      });

      console.log("✅ Generation updated in database");

      return NextResponse.json({
        received: true,
      });
    }

    // Unknown status
    console.log("⚠️ Unknown Replicate status:", status);

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error("🔥 WEBHOOK ERROR:", error);

    return NextResponse.json(
      {
        error: error.message || String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return new Response("Webhook route is working!");
}