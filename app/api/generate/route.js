
import Replicate from "replicate";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { prisma } from "../../../lib/prisma";
import { authOptions } from "../../api/auth/[...nextauth]/route";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const MODEL = "black-forest-labs/flux-2-pro";

function errorResponse(message, status = 500, extra = {}) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...extra,
    },
    { status }
  );
}

export async function POST(req) {
  try {
    /*
     * ---------------------------------------------------------
     * 1. Authenticate user
     * ---------------------------------------------------------
     */
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return errorResponse("Unauthorized", 401);
    }

    /*
     * ---------------------------------------------------------
     * 2. Parse request body
     * ---------------------------------------------------------
     */
    let body;

    try {
      body = await req.json();
    } catch {
      return errorResponse("Invalid request body", 400);
    }

    const {
      styleId,
      inputImageUrl,
      aspectRatio = "match_input_image",
      outputFormat = "webp",
    } = body;

    /*
     * ---------------------------------------------------------
     * 3. Validate input
     * ---------------------------------------------------------
     */
    if (!styleId || !inputImageUrl) {
      return errorResponse(
        "styleId and inputImageUrl are required",
        400
      );
    }

    /*
     * ---------------------------------------------------------
     * 4. Find user
     * ---------------------------------------------------------
     */
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
      return errorResponse("User not found", 404);
    }

    /*
     * ---------------------------------------------------------
     * 5. Find style
     * ---------------------------------------------------------
     */
    const style = await prisma.style.findUnique({
      where: {
        id: styleId,
      },
      select: {
        id: true,
        styleName: true,
        prompt: true,
        isActive: true,
        generationCost: true,
      },
    });

    if (!style || !style.isActive) {
      return errorResponse("Style unavailable", 404);
    }

    /*
     * ---------------------------------------------------------
     * 6. Determine generation cost
     * ---------------------------------------------------------
     */
    const coinCost = style.generationCost;

    if (!Number.isInteger(coinCost) || coinCost <= 0) {
      console.error(
        `Invalid generation cost for style ${style.id}:`,
        coinCost
      );

      return errorResponse(
        "This style is temporarily unavailable",
        500
      );
    }

    /*
     * ---------------------------------------------------------
     * 7. Check balance
     *
     * This is only an early check for a better UX.
     *
     * The REAL protection happens inside the transaction below.
     * ---------------------------------------------------------
     */
    if (user.coins < coinCost) {
      return errorResponse("Insufficient coins", 402, {
        errorCode: "INSUFFICIENT_COINS",
        requiredCoins: coinCost,
        currentCoins: user.coins,
      });
    }

    /*
     * ---------------------------------------------------------
     * 8. Create a temporary generation + reserve coins
     *
     * IMPORTANT:
     * We deduct the coins BEFORE calling Replicate.
     *
     * updateMany + gte prevents two simultaneous requests
     * from spending the same coins.
     * ---------------------------------------------------------
     */
    const generation = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.updateMany({
        where: {
          id: user.id,
          coins: {
            gte: coinCost,
          },
        },
        data: {
          coins: {
            decrement: coinCost,
          },
        },
      });

      /*
       * Another request may have spent the user's coins
       * after our initial balance check.
       */
      if (updatedUser.count !== 1) {
        throw new Error("INSUFFICIENT_COINS");
      }

      /*
       * Create generation BEFORE Replicate.
       *
       * predictionId is required by your current schema, so we
       * temporarily use a unique reservation ID.
       *
       * It will be replaced with the real Replicate prediction ID
       * immediately after Replicate starts.
       */
      const reservationId = `pending_${crypto.randomUUID()}`;

      const newGeneration = await tx.generation.create({
        data: {
          predictionId: reservationId,
          userId: user.id,

          status: "starting",

          model: MODEL,
          prompt: style.prompt,

          coinCost,

          inputImageUrl,
        },
      });

      /*
       * Record the deduction.
       */
      await tx.coinTransaction.create({
        data: {
          userId: user.id,
          generationId: newGeneration.id,

          amount: -coinCost,
          type: "deduction",

          description: `Generation started — ${coinCost} coin${
            coinCost === 1 ? "" : "s"
          } deducted`,
        },
      });

      return newGeneration;
    });

    /*
     * ---------------------------------------------------------
     * 9. Start Replicate generation
     * ---------------------------------------------------------
     */
    let prediction;

    try {
      const baseWebhookUrl = process.env.REPLICATE_WEBHOOK_URL;

      if (!baseWebhookUrl) {
        throw new Error("REPLICATE_WEBHOOK_URL is not configured");
      }

      const webhookUrl =
        `${baseWebhookUrl.replace(/\/$/, "")}/api/replicate/webhook`;

      prediction = await replicate.predictions.create({
        model: MODEL,

        input: {
          prompt: style.prompt,
          input_images: [inputImageUrl],
          aspect_ratio: aspectRatio,
          output_format: outputFormat,
        },

        webhook: webhookUrl,

        /*
         * Your webhook only needs the final result.
         */
        webhook_events_filter: ["completed"],
      });
    } catch (replicateError) {
      /*
       * -------------------------------------------------------
       * Replicate failed to start.
       *
       * We MUST refund the reserved coins.
       *
       * coinsRefunded prevents accidental double refunds.
       * -------------------------------------------------------
       */
      console.error(
        "Replicate prediction creation failed:",
        replicateError
      );

      await prisma.$transaction(async (tx) => {
        const updatedGeneration = await tx.generation.updateMany({
          where: {
            id: generation.id,
            coinsRefunded: false,
          },
          data: {
            status: "failed",
            coinsRefunded: true,
            error:
              replicateError instanceof Error
                ? replicateError.message
                : "Failed to start generation",
          },
        });

        /*
         * Only refund if this request successfully marked the
         * generation as refunded.
         *
         * This makes the refund idempotent.
         */
        if (updatedGeneration.count === 1) {
          await tx.user.update({
            where: {
              id: user.id,
            },
            data: {
              coins: {
                increment: coinCost,
              },
            },
          });

          await tx.coinTransaction.create({
            data: {
              userId: user.id,
              generationId: generation.id,

              amount: coinCost,
              type: "credit",

              description: `Generation failed to start — ${coinCost} coin${
                coinCost === 1 ? "" : "s"
              } refunded`,
            },
          });
        }
      });

      return errorResponse(
        "We couldn't start the generation. Your coins have been refunded.",
        503,
        {
          errorCode: "GENERATION_START_FAILED",
        }
      );
    }

    /*
     * ---------------------------------------------------------
     * 10. Save real Replicate prediction ID
     * ---------------------------------------------------------
     */
    try {
      const updatedGeneration = await prisma.generation.update({
        where: {
          id: generation.id,
        },
        data: {
          predictionId: prediction.id,

          /*
           * Replicate normally returns "starting" or "processing".
           * We keep your enum-compatible values.
           */
          status:
            prediction.status === "processing"
              ? "processing"
              : "starting",
        },
      });

      /*
       * -------------------------------------------------------
       * 11. Success response
       * -------------------------------------------------------
       */
      return NextResponse.json({
        success: true,

        generationId: updatedGeneration.id,
        predictionId: prediction.id,

        status: updatedGeneration.status,

        coinsDeducted: coinCost,

        /*
         * We don't use the old `user.coins` value here because
         * another request could have changed the balance.
         *
         * Fetch the actual current balance.
         */
        remainingCoins: (
          await prisma.user.findUnique({
            where: {
              id: user.id,
            },
            select: {
              coins: true,
            },
          })
        )?.coins ?? 0,
      });
    } catch (databaseError) {
      /*
       * -------------------------------------------------------
       * VERY IMPORTANT
       *
       * Replicate has already started.
       *
       * We should NOT refund here automatically because the
       * Replicate prediction is running.
       *
       * The webhook can still find the prediction if the
       * generation record is repaired/retried.
       * -------------------------------------------------------
       */
      console.error(
        "Failed to save Replicate prediction:",
        databaseError
      );

      return errorResponse(
        "Generation started, but we couldn't save its status. Please contact support if it doesn't appear in your history.",
        500,
        {
          errorCode: "GENERATION_RECORD_UPDATE_FAILED",
        }
      );
    }
  } catch (error) {
    /*
     * ---------------------------------------------------------
     * Unexpected server error
     * ---------------------------------------------------------
     */
    console.error("Generation API error:", error);

    /*
     * Don't expose raw internal errors to the client.
     */
    return errorResponse(
      "Something went wrong while starting the generation.",
      500
    );
  }
}

