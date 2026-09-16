
import crypto from "crypto";
import { NextResponse } from "next/server";

import { prisma } from "../../../../../lib/prisma";
import { creditPaymentCoins } from "../../../../../lib/payment/creditPayment";

export async function POST(req) {
  try {
    // IMPORTANT:
    // Razorpay webhook signature must be generated from
    // the RAW request body.
    const rawBody = await req.text();

    const signature = req.headers.get("x-razorpay-signature");
    const eventId = req.headers.get("x-razorpay-event-id");

    if (!signature) {
      console.error("Razorpay webhook signature missing");

      return NextResponse.json(
        {
          success: false,
          error: "Webhook signature missing",
        },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("RAZORPAY_WEBHOOK_SECRET is missing");

      return NextResponse.json(
        {
          success: false,
          error: "Webhook configuration error",
        },
        { status: 500 }
      );
    }

    // Generate expected webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    // Timing-safe signature comparison
    const receivedBuffer = Buffer.from(signature, "utf8");
    const expectedBuffer = Buffer.from(expectedSignature, "utf8");

    if (
      receivedBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(receivedBuffer, expectedBuffer)
    ) {
      console.error("Invalid Razorpay webhook signature");

      return NextResponse.json(
        {
          success: false,
          error: "Invalid webhook signature",
        },
        { status: 400 }
      );
    }

    // Parse only AFTER signature verification
    const payload = JSON.parse(rawBody);

    const event = payload.event;

    console.log("Razorpay webhook received:", {
      event,
      eventId,
    });

    // We only process captured payments.
    // Authorized payments do NOT receive coins.
    if (event !== "payment.captured") {
      return NextResponse.json({
        success: true,
        message: "Webhook received",
        event,
      });
    }

    const paymentEntity = payload?.payload?.payment?.entity;

    if (!paymentEntity) {
      console.error(
        "payment.captured payload is missing payment entity"
      );

      return NextResponse.json(
        {
          success: false,
          error: "Invalid payment payload",
        },
        { status: 400 }
      );
    }

    const razorpayPaymentId = paymentEntity.id;
    const razorpayOrderId = paymentEntity.order_id;
    const razorpayAmount = paymentEntity.amount;
    const razorpayCurrency = paymentEntity.currency;

    if (!razorpayPaymentId || !razorpayOrderId) {
      console.error("Payment ID or Order ID missing from webhook");

      return NextResponse.json(
        {
          success: false,
          error: "Payment information missing",
        },
        { status: 400 }
      );
    }

    // Find our internal payment using Razorpay Order ID
    const payment = await prisma.payment.findUnique({
      where: {
        providerOrderId: razorpayOrderId,
      },
    });

    if (!payment) {
      console.error("Payment record not found:", {
        razorpayOrderId,
        razorpayPaymentId,
      });

      return NextResponse.json(
        {
          success: false,
          error: "Payment record not found",
        },
        { status: 404 }
      );
    }

    // Make sure the Razorpay payment ID matches
    // what we already verified, if one exists.
    if (
      payment.providerPaymentId &&
      payment.providerPaymentId !== razorpayPaymentId
    ) {
      console.error("Razorpay payment ID mismatch:", {
        databasePaymentId: payment.providerPaymentId,
        webhookPaymentId: razorpayPaymentId,
      });

      return NextResponse.json(
        {
          success: false,
          error: "Payment ID mismatch",
        },
        { status: 400 }
      );
    }

    // Verify amount
    // Razorpay amount is also in the smallest currency unit (paise for INR).
    if (razorpayAmount !== payment.amount) {
      console.error("Payment amount mismatch:", {
        databaseAmount: payment.amount,
        razorpayAmount,
      });

      return NextResponse.json(
        {
          success: false,
          error: "Payment amount mismatch",
        },
        { status: 400 }
      );
    }

    // Verify currency
    if (razorpayCurrency !== payment.currency) {
      console.error("Payment currency mismatch:", {
        databaseCurrency: payment.currency,
        razorpayCurrency,
      });

      return NextResponse.json(
        {
          success: false,
          error: "Payment currency mismatch",
        },
        { status: 400 }
      );
    }

    // Credit coins.
    //
    // creditPaymentCoins() guarantees that the same payment
    // cannot credit coins more than once because paymentId
    // is unique in CoinTransaction.
    const creditResult = await creditPaymentCoins(payment.id);

    // Mark the payment as captured only after coin processing succeeds.
    await prisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        providerPaymentId: razorpayPaymentId,
        status: "captured",
      },
    });

    console.log("Payment captured and coins processed:", {
      paymentId: payment.id,
      razorpayPaymentId,
      coins: creditResult.coins,
      alreadyCredited: creditResult.alreadyCredited,
    });

    return NextResponse.json({
      success: true,
      message: "Payment captured successfully",
      paymentId: payment.id,
      status: "captured",
      coins: creditResult.coins,
      alreadyCredited: creditResult.alreadyCredited,
    });
  } catch (error) {
    console.error("Razorpay webhook error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Webhook processing failed",
      },
      { status: 500 }
    );
  }
}

