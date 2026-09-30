// // app/api/generate/[id]/route.js
// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "../../../api/auth/[...nextauth]/route";
// import {prisma} from "../../../../lib/prisma";
// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// export async function GET(request, { params }) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const generationId = params.id;

//     // Get the generation from DB
//     const generation = await prisma.generation.findUnique({
//       where: { id: generationId },
//     });

//     if (!generation) {
//       return NextResponse.json({ error: "Not found" }, { status: 404 });
//     }

//     // If it's already finished in our DB, return it immediately
//     if (generation.status === "succeeded" || generation.status === "failed") {
//       return NextResponse.json({ generation });
//     }

//     // Check status with Google API
//     const operation = await ai.operations.get({ name: generation.predictionId });

//     if (operation.done) {
//       if (operation.error) {
//         // Handle failure
//         const failedGen = await prisma.generation.update({
//           where: { id: generationId },
//           data: { status: "failed", error: operation.error.message },
//         });
//         return NextResponse.json({ generation: failedGen });
//       }

//       // Handle success
//       // Extract the generated video URI (differs slightly based on REST vs SDK mapping)
//       const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri || operation.response?.videoUri;

//       const succeededGen = await prisma.generation.update({
//         where: { id: generationId },
//         data: { 
//           status: "succeeded",
//           outputImageUrl: videoUri // Storing video URL in your existing outputImageUrl field
//         },
//       });

//       return NextResponse.json({ generation: succeededGen });
//     }

//     // Still processing
//     return NextResponse.json({ generation });
//   } catch (error) {
//     console.error("Polling Error:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }