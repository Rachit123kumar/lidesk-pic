// import { NextResponse } from "next/server";
// import { prisma } from "../../../../lib/prisma";

// export async function POST() {
//   try {
//     const plans = await prisma.plan.createMany({
//       data: [
//         {
//           id: "starter",
//           name: "Starter",
//           coins: 10,
//           price: 29900,
//           currency: "INR",
//           description: "10 AI headshot generations",
//           availableForCommerce: true,
//           customRatio: false,
//           canDownload: true,
//         },
//         {
//           id: "pro",
//           name: "Pro",
//           coins: 25,
//           price: 59900,
//           currency: "INR",
//           description: "25 AI headshot generations",
//           availableForCommerce: true,
//           customRatio: true,
//           canDownload: true,
//         },
//         {
//           id: "premium",
//           name: "Premium",
//           coins: 50,
//           price: 99900,
//           currency: "INR",
//           description: "50 AI headshot generations",
//           availableForCommerce: true,
//           customRatio: true,
//           canDownload: true,
//         },
//       ],
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Plans created successfully",
//       data: plans,
//     });
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
//       {
//         success: false,
//         error: "Failed to create plans",
//       },
//       { status: 500 }
//     );
//   }
// }