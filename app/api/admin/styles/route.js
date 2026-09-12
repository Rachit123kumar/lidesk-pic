import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route"; // Adjust this path if needed
import { prisma } from "../../../../lib/prisma"; // Adjust this path to your prisma client

// ... your existing GET function ...

export async function POST(request) {
  try {
    // 1. Authenticate and verify Admin email
    const session = await getServerSession(authOptions);

    if (!session || session.user?.email !== "hellobittukumar12@gmail.com") {
      return NextResponse.json(
        { success: false, error: "Unauthorized access. Admin only." },
        { status: 401 }
      );
    }

    // 2. Parse incoming data
    const body = await request.json();
    const {
      styleName,
      slug,
      images,
      prompt,
      tags,
      description,
      advice,
      generationCost,
      isActive
    } = body;

    // 3. Validate required fields based on Prisma model
    if (!styleName || !slug || !prompt || !images || images.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (styleName, slug, prompt, images)." },
        { status: 400 }
      );
    }

    // 4. Check for unique slug collision before inserting
    const existingStyle = await prisma.style.findUnique({
      where: { slug }
    });

    if (existingStyle) {
      return NextResponse.json(
        { success: false, error: "A style with this slug already exists." },
        { status: 409 }
      );
    }

    // 5. Create the record in the database
    const newStyle = await prisma.style.create({
      data: {
        styleName,
        slug,
        images,
        prompt,
        tags: tags || [], // Ensure it falls back to an empty array
        description: description || null,
        advice: advice || null,
        generationCost: generationCost ? parseInt(generationCost, 10) : 1,
        isActive: isActive !== undefined ? isActive : true,
        createdBy: "Admin" 
      }
    });

    // 6. Return success response
    return NextResponse.json(
      { success: true, style: newStyle },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating style:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}