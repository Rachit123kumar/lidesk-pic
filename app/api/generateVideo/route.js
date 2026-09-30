// // app/api/generate/route.js
// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "../../api/auth/[...nextauth]/route";
// import {prisma} from "../../../lib/prisma";
// import { GoogleGenAI } from "@google/genai";

// // Initialize Google Gen AI SDK
// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// export async function POST(request) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session?.user?.email) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { imageUrls, prompt = "A cinematic transformation reel" } = await request.json();

//     if (!imageUrls || imageUrls.length === 0) {
//       return NextResponse.json({ error: "Images are required" }, { status: 400 });
//     }

//     // 1. Fetch user and check coins
//     const user = await prisma.user.findUnique({
//       where: { email: session.user.email },
//     });

//     if (!user || user.coins < 1) {
//       return NextResponse.json({ error: "Insufficient coins" }, { status: 403 });
//     }

//     // 2. Fetch the uploaded R2 image to pass to Veo as base64
//     // Note: Veo 3.1 takes a primary reference image. We'll use the first one.
//     const imageResponse = await fetch(imageUrls[0]);
//     const imageBuffer = await imageResponse.arrayBuffer();
//     const imageBase64 = Buffer.from(imageBuffer).toString("base64");
//     const mimeType = imageResponse.headers.get("content-type") || "image/jpeg";

//     // 3. Call Google Veo 3.1 Lite
//     // 3. Call Google Veo 3.1 Lite
//     // 3. Call Google Veo 3.1 Lite
//    // 3. Call Google Veo 3.1 Lite
//     let operation;
//     try {
//       operation = await ai.models.generateVideos({
//         model: "veo-3.1-lite-generate-preview", 
//         source: {                           
//           prompt: prompt,
//           image: {
//             // Use 'imageBytes' instead of 'bytesBase64Encoded' or 'inlineData'
//             imageBytes: imageBase64, 
//             mimeType: mimeType,
//           },
//         },
//         config: {
//           aspectRatio: "16:9",
//           duration: "4s", 
//         },
//       });
//     } catch (veoError) {
//       console.error("Veo API Error:", veoError);
//       return NextResponse.json({ error: "Failed to start video generation" }, { status: 500 });
//     }

//     // The SDK returns an operation object with a name/id
//     const predictionId = operation.name || operation.id || crypto.randomUUID();

//     // 4. Update Database (Transaction to deduct coin and log generation)
//     const generation = await prisma.$transaction(async (tx) => {
//       // Deduct coin
//       await tx.user.update({
//         where: { id: user.id },
//         data: { coins: { decrement: 1 } },
//       });

//       // Log transaction
//       await tx.coinTransaction.create({
//         data: {
//           userId: user.id,
//           amount: 1,
//           type: "deduction",
//           description: "Veo 3.1 Lite Video Generation",
//         },
//       });

//       // Create generation record
//       return await tx.generation.create({
//         data: {
//           userId: user.id,
//           predictionId: predictionId,
//           status: "processing",
//           prompt: prompt,
//           inputImageUrl: imageUrls[0], // Store first image
//           model: "veo-3.1-lite",
//           coinCost: 1,
//         },
//       });
//     });

//     return NextResponse.json({ success: true, generationId: generation.id, predictionId });
//   } catch (error) {
//     console.error("Generation Error:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }