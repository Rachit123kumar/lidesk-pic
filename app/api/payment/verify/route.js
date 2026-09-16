import crypto from "crypto";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "../../../../lib/prisma";
import { creditPaymentCoins } from "../../../../lib/payment/creditPayment";

export async function POST(req) {
  try {
    // 1. Check logged-in user
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

    // 2. Get payment details from frontend
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

    // 3. Find the logged-in user
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

    // 4. Find our payment record
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

    // 5. Make sure this payment belongs to this user
    if (payment.userId !== user.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment does not belong to this user",
        },
        { status: 403 }
      );
    }

    // 6. Verify Razorpay signature
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

    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      console.error("Invalid Razorpay payment signature");

      return NextResponse.json(
        {
          success: false,
          error: "Invalid payment signature",
        },
        { status: 400 }
      );
    }

    // 7. Save Razorpay payment ID and mark payment as authorized
    await prisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        providerPaymentId: razorpay_payment_id,
        status: "authorized",
      },
    });

    // 8. Credit coins exactly once
    // const creditResult = await creditPaymentCoins(payment.id);

    // 9. Return success
    return NextResponse.json({
      success: true,
      message:"payment verified sucessfully",

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