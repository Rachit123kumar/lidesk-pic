import crypto from "crypto";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "../../../../lib/prisma";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment verification data is incomplete",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    const payment = await prisma.payment.findUnique({
      where: {
        providerOrderId: razorpay_order_id,
      },
    });

    if (!payment) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment record not found",
        },
        { status: 404 }
      );
    }

    // Make sure this payment belongs to the logged-in user.
    if (payment.userId !== user.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment does not belong to this user",
        },
        { status: 403 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      console.error("RAZORPAY_KEY_SECRET is missing");

      return NextResponse.json(
        {
          success: false,
          error: "Payment configuration error",
        },
        { status: 500 }
      );
    }

    /*
     * Verify Razorpay checkout signature.
     */
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const receivedBuffer = Buffer.from(
      razorpay_signature,
      "utf8"
    );

    const expectedBuffer = Buffer.from(
      generatedSignature,
      "utf8"
    );

    if (
      receivedBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(
        receivedBuffer,
        expectedBuffer
      )
    ) {
      console.error("Invalid Razorpay payment signature");

      return NextResponse.json(
        {
          success: false,
          error: "Invalid payment signature",
        },
        { status: 400 }
      );
    }

    /*
     * Important:
     *
     * Never allow browser verification to overwrite
     * a payment that has already been captured by webhook.
     *
     * If webhook wins the race:
     *
     *     captured → stays captured
     *
     * If verify wins first:
     *
     *     created → authorized
     *
     * Later webhook:
     *
     *     authorized → captured
     */
    const updated = await prisma.payment.updateMany({
      where: {
        id: payment.id,
        status: {
          not: "captured",
        },
      },
      data: {
        providerPaymentId: razorpay_payment_id,
        status: "authorized",
      },
    });

    /*
     * If updated.count === 0, the payment was probably
     * already captured by the webhook.
     */
    if (updated.count === 0) {
      const latestPayment = await prisma.payment.findUnique({
        where: {
          id: payment.id,
        },
        select: {
          id: true,
          status: true,
          providerPaymentId: true,
        },
      });

      if (latestPayment?.status === "captured") {
        return NextResponse.json({
          success: true,
          message: "Payment already captured",
          paymentId: latestPayment.id,
          status: "captured",
        });
      }

      return NextResponse.json({
        success: true,
        message: "Payment already processed",
        paymentId: payment.id,
        status: latestPayment?.status ?? payment.status,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      paymentId: payment.id,
      status: "authorized",
    });
  } catch (error) {
    console.error("Payment verification error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to verify payment",
      },
      { status: 500 }
    );
  }
}