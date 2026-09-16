import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const plans = await prisma.plan.findMany({
      where: {
        availableForCommerce: true,
      },
      orderBy: {
        price: "asc",
      },
      select: {
        id: true,
        name: true,
        coins: true,
        price: true,
        currency: true,
        description: true,
        customRatio: true,
        canDownload: true,
      },
    });

    return NextResponse.json({
      success: true,
      plans,
    });
  } catch (error) {
    console.error("Fetch plans error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch plans",
      },
      { status: 500 }
    );
  }
}