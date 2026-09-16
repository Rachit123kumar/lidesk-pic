import crypto from "crypto";
import { NextResponse } from "next/server";

import { prisma } from "../../../../lib/prisma";
import { creditPaymentCoins } from "../../../../lib/payment/creditPayment";
import { sendPaymentSuccessEmail } from "../../../../lib/email/sendPaymentSuccessEmail";

export async function POST(req) {
  try {
    // Razorpay webhook signature must be generated
    // from the RAW request body.
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

    // Verify Razorpay webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

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

    // Parse only after signature verification
    const payload = JSON.parse(rawBody);

    const event = payload.event;

    console.log("Razorpay webhook received:", {
      event,
      eventId,
    });

    /*
     * ==================================================
     * PAYMENT FAILED
     * ==================================================
     */

    if (event === "payment.failed") {
      const paymentEntity = payload?.payload?.payment?.entity;

      if (!paymentEntity) {
        console.error(
          "payment.failed payload is missing payment entity"
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
        console.error(
          "Payment ID or Order ID missing from failed payment"
        );

        return NextResponse.json(
          {
            success: false,
            error: "Payment information missing",
          },
          { status: 400 }
        );
      }

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

      // Verify amount
      if (razorpayAmount !== payment.amount) {
        console.error("Failed payment amount mismatch:", {
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
        console.error("Failed payment currency mismatch:", {
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

      // Failed payment = NO coins
      await prisma.payment.update({
        where: {
          id: payment.id,
        },
        data: {
          providerPaymentId: razorpayPaymentId,
          status: "failed",
        },
      });

      console.log("Payment marked as failed:", {
        paymentId: payment.id,
        razorpayPaymentId,
        razorpayOrderId,
      });

      return NextResponse.json({
        success: true,
        message: "Payment marked as failed",
        paymentId: payment.id,
        status: "failed",
      });
    }

    /*
     * ==================================================
     * PAYMENT CAPTURED
     * ==================================================
     */

    if (event === "payment.captured") {
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
        console.error(
          "Payment ID or Order ID missing from captured payment"
        );

        return NextResponse.json(
          {
            success: false,
            error: "Payment information missing",
          },
          { status: 400 }
        );
      }

      // Fetch payment + user + plan
      const payment = await prisma.payment.findUnique({
        where: {
          providerOrderId: razorpayOrderId,
        },
        include: {
          user: true,
          plan: true,
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

      // Make sure payment ID matches if already present
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

      /*
       * ==================================================
       * CREDIT COINS
       * ==================================================
       */

      const creditResult = await creditPaymentCoins(payment.id);

      /*
       * ==================================================
       * MARK PAYMENT AS CAPTURED
       * ==================================================
       */

      await prisma.payment.update({
        where: {
          id: payment.id,
        },
        data: {
          providerPaymentId: razorpayPaymentId,
          status: "captured",
        },
      });

      /*
       * ==================================================
       * SEND SUCCESS EMAIL
       * ==================================================
       */

      let emailResult = null;

      if (!payment.emailSent) {
        emailResult = await sendPaymentSuccessEmail({
          email: payment.user.email,
          name: payment.user.name,
          planName: payment.plan.name,
          coins: payment.coins,
          amount: payment.amount,
          currency: payment.currency,
          paymentId: razorpayPaymentId,
        });

        if (emailResult.success) {
          await prisma.payment.update({
            where: {
              id: payment.id,
            },
            data: {
              emailSent: true,
            },
          });

          console.log("Payment success email sent:", {
            paymentId: payment.id,
            email: payment.user.email,
            emailId: emailResult.emailId,
          });
        } else {
          console.error("Payment succeeded but email failed:", {
            paymentId: payment.id,
            email: payment.user.email,
            error: emailResult.error,
          });
        }
      } else {
        console.log("Payment email already sent:", {
          paymentId: payment.id,
        });
      }

      /*
       * ==================================================
       * RESPONSE
       * ==================================================
       */

      console.log("Payment captured and coins processed:", {
        paymentId: payment.id,
        razorpayPaymentId,
        coins: creditResult.coins,
        alreadyCredited: creditResult.alreadyCredited,
        emailSent: payment.emailSent || emailResult?.success === true,
      });

      return NextResponse.json({
        success: true,
        message: "Payment captured successfully",
        paymentId: payment.id,
        status: "captured",
        coins: creditResult.coins,
        alreadyCredited: creditResult.alreadyCredited,
        emailSent:
          payment.emailSent || emailResult?.success === true,
      });
    }

    /*
     * ==================================================
     * OTHER RAZORPAY EVENTS
     * ==================================================
     */

    return NextResponse.json({
      success: true,
      message: "Webhook received",
      event,
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