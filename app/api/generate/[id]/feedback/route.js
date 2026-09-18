
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "../../../auth/[...nextauth]/route";
import { prisma } from "./../../../../../lib/prisma";

export async function PATCH(request, { params }) {
  try {
    // 1. Validate session
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Generation ID is required" },
        { status: 400 }
      );
    }

    // 2. Get the logged-in user
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
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // 3. Get request body
    const body = await request.json();

    const { feedbackRating, feedbackText } = body;

    // 4. Validate rating
    if (
      !Number.isInteger(feedbackRating) ||
      feedbackRating < 1 ||
      feedbackRating > 5
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Feedback rating must be between 1 and 5",
        },
        { status: 400 }
      );
    }

    // 5. Validate feedback text if provided
    if (
      feedbackText !== undefined &&
      feedbackText !== null &&
      typeof feedbackText !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Feedback text must be a string",
        },
        { status: 400 }
      );
    }

    // 6. Find generation and verify ownership
    const generation = await prisma.generation.findFirst({
      where: {
        id,
        userId: user.id,
      },
      select: {
        id: true,
      },
    });

    if (!generation) {
      return NextResponse.json(
        {
          success: false,
          error: "Generation not found",
        },
        { status: 404 }
      );
    }

    // 7. Update feedback
    const updatedGeneration = await prisma.generation.update({
      where: {
        id: generation.id,
      },
      data: {
        feedbackRating,
        feedbackText: feedbackText ?? null,
        isFeedbacked: true,
      },
      select: {
        id: true,
        feedbackRating: true,
        feedbackText: true,
        isFeedbacked: true,
      },
    });

    // 8. Return updated feedback
    return NextResponse.json({
      success: true,
      message: "Feedback submitted successfully",
      data: updatedGeneration,
    });
  } catch (error) {
    console.error("Update generation feedback error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit feedback",
      },
      { status: 500 }
    );
  }
}


// ### Request

// Your frontend can call:

// ```javascript
// fetch(`/api/generation/${generationId}/feedback`, {
//   method: "PATCH",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     feedbackRating: 5,
//     feedbackText: "The face looks very natural.",
//   }),
// });
// ```

// Or if the user doesn't want to write anything:

// ```javascript
// {
//   "feedbackRating": 5,
//   "feedbackText": ""
// }
// ```

// ### One thing I'd recommend

// Since this is **user feedback**, I would prevent the user from changing it repeatedly unless you specifically want users to edit their feedback.

// You can add this check before the update:

// ```javascript
// if (generation.isFeedbacked) {
//   return NextResponse.json(
//     {
//       success: false,
//       error: "Feedback has already been submitted",
//     },
//     { status: 400 }
//   );
// }
// ```

// For that, include `isFeedbacked` in the first `select`.

// That gives you a clean **one-generation → one-feedback** system.
