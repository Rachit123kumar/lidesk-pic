import crypto from "crypto";
import { NextResponse } from "next/server";


import {prisma} from "../../../../lib/prisma"
import { sendPaymentSuccessEmail } from "../../../../lib/email/sendPaymentSuccessEmail";

export async function POST(req) {
  try {
    /*
     * ==================================================
     * 1. READ RAW BODY
     * ==================================================
     */

    const rawBody = await req.text();

    const signature = req.headers.get(
      "x-razorpay-signature"
    );

    const eventId = req.headers.get(
      "x-razorpay-event-id"
    );

    if (!signature) {
      console.error(
        "Razorpay webhook signature missing"
      );

      return NextResponse.json(
        {
          success: false,
          error: "Webhook signature missing",
        },
        { status: 400 }
      );
    }

    const webhookSecret =
      process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error(
        "RAZORPAY_WEBHOOK_SECRET is missing"
      );

      return NextResponse.json(
        {
          success: false,
          error: "Webhook configuration error",
        },
        { status: 500 }
      );
    }

    /*
     * ==================================================
     * 2. VERIFY WEBHOOK SIGNATURE
     * ==================================================
     */

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    const receivedBuffer = Buffer.from(
      signature,
      "utf8"
    );

    const expectedBuffer = Buffer.from(
      expectedSignature,
      "utf8"
    );

    if (
      receivedBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(
        receivedBuffer,
        expectedBuffer
      )
    ) {
      console.error(
        "Invalid Razorpay webhook signature"
      );

      return NextResponse.json(
        {
          success: false,
          error: "Invalid webhook signature",
        },
        { status: 400 }
      );
    }

    /*
     * Parse only AFTER signature verification.
     */
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
      const paymentEntity =
        payload?.payload?.payment?.entity;

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

      const razorpayPaymentId =
        paymentEntity.id;

      const razorpayOrderId =
        paymentEntity.order_id;

      const razorpayAmount =
        paymentEntity.amount;

      const razorpayCurrency =
        paymentEntity.currency;

      if (
        !razorpayPaymentId ||
        !razorpayOrderId
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Payment information missing",
          },
          { status: 400 }
        );
      }

      const payment =
        await prisma.payment.findUnique({
          where: {
            providerOrderId:
              razorpayOrderId,
          },
        });

      if (!payment) {
        console.error(
          "Payment record not found:",
          {
            razorpayOrderId,
            razorpayPaymentId,
          }
        );

        /*
         * Return 200 so Razorpay does not keep
         * retrying an event that cannot be mapped.
         *
         * You can change this to 404 if you prefer
         * Razorpay retries for investigation.
         */
        return NextResponse.json({
          success: true,
          message:
            "Payment record not found",
        });
      }

      /*
       * Never change an already-captured payment
       * to failed because of an out-of-order webhook.
       */
      if (payment.status === "captured") {
        return NextResponse.json({
          success: true,
          message:
            "Payment already captured; ignoring failed event",
          paymentId: payment.id,
          status: "captured",
        });
      }

      /*
       * Verify amount.
       */
      if (
        razorpayAmount !== payment.amount
      ) {
        console.error(
          "Failed payment amount mismatch:",
          {
            databaseAmount:
              payment.amount,
            razorpayAmount,
          }
        );

        return NextResponse.json(
          {
            success: false,
            error: "Payment amount mismatch",
          },
          { status: 400 }
        );
      }

      /*
       * Verify currency.
       */
      if (
        razorpayCurrency !==
        payment.currency
      ) {
        console.error(
          "Failed payment currency mismatch:",
          {
            databaseCurrency:
              payment.currency,
            razorpayCurrency,
          }
        );

        return NextResponse.json(
          {
            success: false,
            error: "Payment currency mismatch",
          },
          { status: 400 }
        );
      }

      /*
       * Mark failed.
       *
       * No coins are credited.
       */
      await prisma.payment.updateMany({
        where: {
          id: payment.id,
          status: {
            not: "captured",
          },
        },
        data: {
          providerPaymentId:
            razorpayPaymentId,
          status: "failed",
        },
      });

      console.log(
        "Payment marked as failed:",
        {
          paymentId: payment.id,
          razorpayPaymentId,
          razorpayOrderId,
        }
      );

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
      const paymentEntity =
        payload?.payload?.payment?.entity;

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

      const razorpayPaymentId =
        paymentEntity.id;

      const razorpayOrderId =
        paymentEntity.order_id;

      const razorpayAmount =
        paymentEntity.amount;

      const razorpayCurrency =
        paymentEntity.currency;

      if (
        !razorpayPaymentId ||
        !razorpayOrderId
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Payment information missing",
          },
          { status: 400 }
        );
      }

      /*
       * Fetch payment with user + plan.
       */
      const payment =
        await prisma.payment.findUnique({
          where: {
            providerOrderId:
              razorpayOrderId,
          },
          include: {
            user: true,
            plan: true,
          },
        });

      if (!payment) {
        console.error(
          "Payment record not found:",
          {
            razorpayOrderId,
            razorpayPaymentId,
          }
        );

        return NextResponse.json({
          success: true,
          message:
            "Payment record not found",
        });
      }

      /*
       * ==================================================
       * SECURITY CHECKS
       * ==================================================
       */

      /*
       * If we already have a payment ID,
       * it MUST match.
       */
      if (
        payment.providerPaymentId &&
        payment.providerPaymentId !==
          razorpayPaymentId
      ) {
        console.error(
          "Razorpay payment ID mismatch:",
          {
            databasePaymentId:
              payment.providerPaymentId,
            webhookPaymentId:
              razorpayPaymentId,
          }
        );

        return NextResponse.json(
          {
            success: false,
            error: "Payment ID mismatch",
          },
          { status: 400 }
        );
      }

      /*
       * Verify amount.
       */
      if (
        razorpayAmount !== payment.amount
      ) {
        console.error(
          "Payment amount mismatch:",
          {
            databaseAmount:
              payment.amount,
            razorpayAmount,
          }
        );

        return NextResponse.json(
          {
            success: false,
            error: "Payment amount mismatch",
          },
          { status: 400 }
        );
      }

      /*
       * Verify currency.
       */
      if (
        razorpayCurrency !==
        payment.currency
      ) {
        console.error(
          "Payment currency mismatch:",
          {
            databaseCurrency:
              payment.currency,
            razorpayCurrency,
          }
        );

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
       * ATOMIC PAYMENT + COIN PROCESSING
       * ==================================================
       *
       * This is the critical protection.
       *
       * Multiple webhook requests can arrive at
       * exactly the same time.
       *
       * Only the request that successfully changes
       * the payment into "captured" gets to credit
       * the coins.
       */

      const result =
        await prisma.$transaction(
          async (tx) => {
            /*
             * Re-read the payment INSIDE the transaction.
             *
             * This is important because the payment may
             * have changed after our first query.
             */
            const currentPayment =
              await tx.payment.findUnique({
                where: {
                  id: payment.id,
                },
              });

            if (!currentPayment) {
              throw new Error(
                "Payment disappeared during transaction"
              );
            }

            /*
             * Already captured means this webhook
             * is a duplicate.
             */
            if (
              currentPayment.status ===
              "captured"
            ) {
              return {
                alreadyProcessed: true,
                coins: currentPayment.coins,
              };
            }

            /*
             * Do not process refunded/failed payments
             * as captured without investigation.
             */
            if (
              currentPayment.status ===
                "refunded" ||
              currentPayment.status ===
                "partially_refunded"
            ) {
              throw new Error(
                `Payment has invalid status for capture: ${currentPayment.status}`
              );
            }

            /*
             * Make sure the provider payment ID
             * is still compatible.
             */
            if (
              currentPayment.providerPaymentId &&
              currentPayment.providerPaymentId !==
                razorpayPaymentId
            ) {
              throw new Error(
                "Provider payment ID mismatch"
              );
            }

            /*
             * ------------------------------------------------
             * Mark captured FIRST inside transaction
             * ------------------------------------------------
             */
            await tx.payment.update({
              where: {
                id: currentPayment.id,
              },
              data: {
                providerPaymentId:
                  razorpayPaymentId,
                status: "captured",
              },
            });

            /*
             * ------------------------------------------------
             * Check whether coins already exist
             * ------------------------------------------------
             */
            const existingTransaction =
              await tx.coinTransaction.findUnique({
                where: {
                  paymentId:
                    currentPayment.id,
                },
              });

            if (existingTransaction) {
              return {
                alreadyProcessed: true,
                coins: currentPayment.coins,
              };
            }

            /*
             * ------------------------------------------------
             * Credit coins
             * ------------------------------------------------
             */
            await tx.user.update({
              where: {
                id: currentPayment.userId,
              },
              data: {
                coins: {
                  increment:
                    currentPayment.coins,
                },
              },
            });

            /*
             * ------------------------------------------------
             * Create credit transaction
             * ------------------------------------------------
             *
             * paymentId is UNIQUE in your schema.
             */
            await tx.coinTransaction.create({
              data: {
                userId:
                  currentPayment.userId,

                amount:
                  currentPayment.coins,

                type: "credit",

                description:
                  `${currentPayment.coins} coins purchased - ${currentPayment.planId}`,

                paymentId:
                  currentPayment.id,
              },
            });

            return {
              alreadyProcessed: false,
              coins: currentPayment.coins,
            };
          }
        );

      /*
       * If duplicate webhook:
       *
       * No coin credit.
       * No new CoinTransaction.
       */
      if (result.alreadyProcessed) {
        console.log(
          "Duplicate captured webhook ignored:",
          {
            paymentId: payment.id,
            razorpayPaymentId,
          }
        );

        return NextResponse.json({
          success: true,
          message:
            "Payment already processed",
          paymentId: payment.id,
          status: "captured",
          coins: result.coins,
          alreadyProcessed: true,
        });
      }

      /*
       * ==================================================
       * EMAIL
       * ==================================================
       *
       * We use an atomic claim so only ONE webhook
       * request can send the email.
       */

      let emailSent = false;

      const emailClaim =
        await prisma.payment.updateMany({
          where: {
            id: payment.id,
            emailSent: false,
            emailSending: false,
            status: "captured",
          },
          data: {
            emailSending: true,
          },
        });

      if (emailClaim.count === 1) {
        /*
         * This webhook successfully claimed
         * responsibility for sending the email.
         */

        const emailResult =
          await sendPaymentSuccessEmail({
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
              emailSending: false,
            },
          });

          emailSent = true;

          console.log(
            "Payment success email sent:",
            {
              paymentId: payment.id,
              email: payment.user.email,
              emailId:
                emailResult.emailId,
            }
          );
        } else {
          /*
           * Email failed.
           *
           * Release the lock so a later webhook/retry
           * can try again.
           */
          await prisma.payment.update({
            where: {
              id: payment.id,
            },
            data: {
              emailSending: false,
            },
          });

          console.error(
            "Payment succeeded but email failed:",
            {
              paymentId: payment.id,
              email: payment.user.email,
              error: emailResult.error,
            }
          );
        }
      } else {
        /*
         * Another webhook already sent the email
         * or is currently sending it.
         */
        const latestPayment =
          await prisma.payment.findUnique({
            where: {
              id: payment.id,
            },
            select: {
              emailSent: true,
            },
          });

        emailSent =
          latestPayment?.emailSent ?? false;

        console.log(
          "Payment email already claimed/sent:",
          {
            paymentId: payment.id,
            emailSent,
          }
        );
      }

      /*
       * ==================================================
       * FINAL RESPONSE
       * ==================================================
       */

      console.log(
        "Payment captured successfully:",
        {
          paymentId: payment.id,
          razorpayPaymentId,
          coins: result.coins,
          emailSent,
        }
      );

      return NextResponse.json({
        success: true,
        message:
          "Payment captured successfully",
        paymentId: payment.id,
        status: "captured",
        coins: result.coins,
        alreadyProcessed: false,
        emailSent,
      });
    }

    /*
     * ==================================================
     * OTHER EVENTS
     * ==================================================
     */

    return NextResponse.json({
      success: true,
      message: "Webhook received",
      event,
    });
  } catch (error) {
    console.error(
      "Razorpay webhook error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Webhook processing failed",
      },
      { status: 500 }
    );
  }
}