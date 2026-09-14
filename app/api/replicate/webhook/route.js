import crypto from "crypto";
import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";

import { prisma } from "../../../../lib/prisma";
import { r2 } from "../../../../lib/r2";

function verifyReplicateWebhook(request, rawBody) {
  const webhookId = request.headers.get("webhook-id");
  const webhookTimestamp = request.headers.get("webhook-timestamp");
  const webhookSignature = request.headers.get("webhook-signature");

  if (!webhookId || !webhookTimestamp || !webhookSignature) {
    return false;
  }

  const secret = process.env.REPLICATE_WEBHOOK_SECRET;

  if (!secret) {
    throw new Error("REPLICATE_WEBHOOK_SECRET is not configured");
  }

  // Replicate secret is usually:
  // whsec_xxxxxxxxxxxxxxxxx
  const secretBytes = Buffer.from(
    secret.replace(/^whsec_/, ""),
    "base64"
  );

  const signedContent =
    `${webhookId}.${webhookTimestamp}.${rawBody}`;

  const expectedSignature = crypto
    .createHmac("sha256", secretBytes)
    .update(signedContent)
    .digest("base64");

  // webhook-signature can contain multiple signatures:
  // v1,signature1 v1,signature2 ...
  const signatures = webhookSignature
    .split(" ")
    .map((signature) => {
      const [version, value] = signature.split(",");

      return {
        version,
        value,
      };
    });

  return signatures.some(({ version, value }) => {
    if (version !== "v1" || !value) {
      return false;
    }

    const expected = Buffer.from(expectedSignature);
    const received = Buffer.from(value);

    if (expected.length !== received.length) {
      return false;
    }

    return crypto.timingSafeEqual(expected, received);
  });
}

function isRecentWebhook(timestamp) {
  const timestampSeconds = Number(timestamp);

  if (!Number.isFinite(timestampSeconds)) {
    return false;
  }

  // Reject webhooks older than 5 minutes.
  const now = Math.floor(Date.now() / 1000);

  return Math.abs(now - timestampSeconds) <= 300;
}

export async function POST(request) {
  try {
    console.log("");
    console.log("=================================");
    console.log("🔥 REPLICATE WEBHOOK RECEIVED");
    console.log("=================================");

    // IMPORTANT:
    // Read RAW body first.
    const rawBody = await request.text();

    const webhookTimestamp =
      request.headers.get("webhook-timestamp");

    // --------------------------------
    // VERIFY SIGNATURE
    // --------------------------------

    if (!webhookTimestamp) {
      console.log("❌ Missing webhook timestamp");

      return NextResponse.json(
        { error: "Invalid webhook" },
        { status: 401 }
      );
    }

    if (!isRecentWebhook(webhookTimestamp)) {
      console.log("❌ Webhook timestamp expired");

      return NextResponse.json(
        { error: "Webhook expired" },
        { status: 401 }
      );
    }

    const validSignature = verifyReplicateWebhook(
      request,
      rawBody
    );

    if (!validSignature) {
      console.log("❌ Invalid Replicate webhook signature");

      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    console.log("✅ Replicate webhook verified");

    // --------------------------------
    // PARSE BODY
    // --------------------------------

    const body = JSON.parse(rawBody);

    const {
      id,
      status,
      output,
      error,
    } = body;

    console.log("ID:", id);
    console.log("STATUS:", status);
    console.log("OUTPUT:", output);

    // --------------------------------
    // FIND GENERATION
    // --------------------------------

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

    // --------------------------------
    // FAILED
    // --------------------------------

    if (status === "failed") {
      await prisma.$transaction(async (tx) => {
        // Update generation first
        await tx.generation.update({
          where: {
            id: generation.id,
          },
          data: {
            status: "failed",
            error: error || "Generation failed",
          },
        });

        // Refund ONLY if we haven't refunded already.
        const refundGeneration =
          await tx.generation.updateMany({
            where: {
              id: generation.id,
              coinsRefunded: false,
            },
            data: {
              coinsRefunded: true,
            },
          });

        if (refundGeneration.count === 0) {
          console.log(
            "⚠️ Coins already refunded for:",
            generation.id
          );

          return;
        }

        // Give coins back
        await tx.user.update({
          where: {
            id: generation.userId,
          },
          data: {
            coins: {
              increment: generation.coinCost,
            },
          },
        });

        // Record refund
        await tx.coinTransaction.create({
          data: {
            userId: generation.userId,
            generationId: generation.id,
            amount: generation.coinCost,
            type: "credit",
            description: `Generation failed — ${generation.coinCost} coin${
              generation.coinCost === 1 ? "" : "s"
            } refunded`,
          },
        });

        console.log(
          `💰 Refunded ${generation.coinCost} coin(s)`
        );
      });

      console.log("❌ Generation failed");

      return NextResponse.json({
        received: true,
      });
    }

    // --------------------------------
    // CANCELED
    // --------------------------------

    if (status === "canceled") {
      await prisma.$transaction(async (tx) => {
        await tx.generation.update({
          where: {
            id: generation.id,
          },
          data: {
            status: "canceled",
          },
        });

        // Refund ONLY once
        const refundGeneration =
          await tx.generation.updateMany({
            where: {
              id: generation.id,
              coinsRefunded: false,
            },
            data: {
              coinsRefunded: true,
            },
          });

        if (refundGeneration.count === 0) {
          console.log(
            "⚠️ Coins already refunded for:",
            generation.id
          );

          return;
        }

        // Give coins back
        await tx.user.update({
          where: {
            id: generation.userId,
          },
          data: {
            coins: {
              increment: generation.coinCost,
            },
          },
        });

        // Record refund
        await tx.coinTransaction.create({
          data: {
            userId: generation.userId,
            generationId: generation.id,
            amount: generation.coinCost,
            type: "credit",
            description: `Generation canceled — ${generation.coinCost} coin${
              generation.coinCost === 1 ? "" : "s"
            } refunded`,
          },
        });

        console.log(
          `💰 Refunded ${generation.coinCost} coin(s)`
        );
      });

      console.log("❌ Generation canceled");

      return NextResponse.json({
        received: true,
      });
    }

    // --------------------------------
    // PROCESSING / STARTING
    // --------------------------------

    if (
      status === "starting" ||
      status === "processing"
    ) {
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

    // --------------------------------
    // SUCCESS
    // --------------------------------

    if (status === "succeeded") {
      const replicateImageUrl = Array.isArray(output)
        ? output[0]
        : output;

      if (!replicateImageUrl) {
        console.log(
          "❌ No output image URL"
        );

        // No output means this generation effectively failed,
        // so refund the coins.
        await prisma.$transaction(async (tx) => {
          await tx.generation.update({
            where: {
              id: generation.id,
            },
            data: {
              status: "failed",
              error: "Replicate returned no output image",
            },
          });

          const refundGeneration =
            await tx.generation.updateMany({
              where: {
                id: generation.id,
                coinsRefunded: false,
              },
              data: {
                coinsRefunded: true,
              },
            });

          if (refundGeneration.count === 0) {
            return;
          }

          await tx.user.update({
            where: {
              id: generation.userId,
            },
            data: {
              coins: {
                increment: generation.coinCost,
              },
            },
          });

          await tx.coinTransaction.create({
            data: {
              userId: generation.userId,
              generationId: generation.id,
              amount: generation.coinCost,
              type: "credit",
              description: `Generation failed — ${generation.coinCost} coin${
                generation.coinCost === 1 ? "" : "s"
              } refunded`,
            },
          });
        });

        return NextResponse.json({
          received: true,
        });
      }

      console.log(
        "⬇️ Downloading image from Replicate..."
      );

      // Download image
      const imageResponse =
        await fetch(replicateImageUrl);

      if (!imageResponse.ok) {
        throw new Error(
          `Failed to download image: ${imageResponse.status}`
        );
      }

      const imageBuffer = Buffer.from(
        await imageResponse.arrayBuffer()
      );

      const contentType =
        imageResponse.headers.get("content-type") ||
        "application/octet-stream";

      console.log(
        "📦 Content type:",
        contentType
      );

      console.log(
        "📦 Image size:",
        imageBuffer.length
      );

      // Determine extension
      const extension =
        contentType === "image/png"
          ? "png"
          : contentType === "image/jpeg"
          ? "jpg"
          : contentType === "image/webp"
          ? "webp"
          : "bin";

      // R2 path
      const key =
        `generations/${generation.userId}/${generation.id}.${extension}`;

      console.log(
        "⬆️ Uploading to R2..."
      );

      console.log(
        "R2 KEY:",
        key
      );

      await r2.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: key,
          Body: imageBuffer,
          ContentType: contentType,
        })
      );

      console.log(
        "✅ Image uploaded to R2"
      );

      const r2Url =
        `${process.env.R2_PUBLIC_URL}/${key}`;

      console.log(
        "R2 URL:",
        r2Url
      );

      // Update generation
      await prisma.generation.update({
        where: {
          id: generation.id,
        },
        data: {
          status: "succeeded",
          outputImageUrl: r2Url,
        },
      });

      console.log(
        "✅ Generation succeeded"
      );

      return NextResponse.json({
        received: true,
      });
    }

    // --------------------------------
    // UNKNOWN STATUS
    // --------------------------------

    console.log(
      "⚠️ Unknown Replicate status:",
      status
    );

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error(
      "🔥 WEBHOOK ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error.message ||
          String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return new Response(
    "Webhook route is working!"
  );
}