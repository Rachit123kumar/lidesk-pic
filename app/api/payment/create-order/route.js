import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../api/auth/[...nextauth]/route";
import { prisma } from "../../../../lib/prisma";
import { razorpay } from "../../../../lib/rajorpay";

export async function POST(req) {
  try {
    // 1. Check login
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Get planId
    const body = await req.json();
    const { planId } = body;

    if (!planId || typeof planId !== "string") {
      return NextResponse.json(
        { error: "planId is required" },
        { status: 400 }
      );
    }

    // 3. Find user
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 4. Find plan
    const plan = await prisma.plan.findUnique({
      where: {
        id: planId,
      },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    // 5. Check whether plan can be purchased
    if (!plan.availableForCommerce) {
      return NextResponse.json(
        { error: "This plan is not available for purchase" },
        { status: 400 }
      );
    }

    if (plan.price <= 0 || plan.coins <= 0) {
      return NextResponse.json(
        { error: "Invalid plan configuration" },
        { status: 400 }
      );
    }

    console.log("Razorpay config:", {
  keyId: process.env.RAZORPAY_KEY_ID,
  secretLoaded: !!process.env.RAZORPAY_KEY_SECRET,
  keyMode: process.env.RAZORPAY_KEY_ID?.startsWith("rzp_test_")
    ? "TEST"
    : process.env.RAZORPAY_KEY_ID?.startsWith("rzp_live_")
    ? "LIVE"
    : "UNKNOWN",
});
    // 6. Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: plan.price,
      currency: plan.currency,
      receipt: `plan_${plan.id}_${Date.now()}`,
      notes: {
        userId: user.id,
        planId: plan.id,
      },
    });

    // 7. Save payment in our DB
    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        planId: plan.id,
        coins: plan.coins,

        provider: "razorpay",
        providerOrderId: razorpayOrder.id,

        amount: plan.price,
        currency: plan.currency,

        status: "created",
      },
    });

    // 8. Send required information to frontend
    return NextResponse.json({
      success: true,

      paymentId: payment.id,
      orderId: razorpayOrder.id,

      amount: plan.price,
      currency: plan.currency,

      keyId: process.env.RAZORPAY_KEY_ID,

      plan: {
        id: plan.id,
        name: plan.name,
        coins: plan.coins,
      },
    });
  } catch (error) {
    console.error("Create Razorpay order error:", error);

    return NextResponse.json(
      {
        error: "Unable to create payment order",
      },
      { status: 500 }
    );
  }
}