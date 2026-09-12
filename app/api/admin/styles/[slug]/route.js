import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route"; // Adjust this path as needed
import { prisma } from "../../../../../lib/prisma"; // Adjust this path to your prisma client

// 1. GET: Fetch a single style by its slug for the client component
export async function GET(request, { params }) {
  try {
    // Await params in Next.js (required in newer versions)
    const { slug } = await params;

    const style = await prisma.style.findUnique({
      where: { slug: slug },
    });

    if (!style) {
      return NextResponse.json(
        { success: false, error: "Style not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, style },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching style:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 2. PATCH: Edit existing details of a style securely
export async function PATCH(request, { params }) {
  try {
    // 1. Authenticate and verify Admin email
    const session = await getServerSession(authOptions);

    if (!session || session.user?.email !== "hellobittukumar12@gmail.com") {
      return NextResponse.json(
        { success: false, error: "Unauthorized access. Admin only." },
        { status: 401 }
      );
    }

    const { slug: currentSlug } = await params;
    const body = await request.json();
    
    const {
      styleName,
      slug: newSlug,
      prompt,
      tags,
      advice,
      isActive,
      generationCost
    } = body;

    // 2. Check if the slug is being changed to something else, and if it conflicts
    if (newSlug && newSlug !== currentSlug) {
      const existingStyle = await prisma.style.findUnique({
        where: { slug: newSlug }
      });

      if (existingStyle) {
        return NextResponse.json(
          { success: false, error: "A style with this new slug already exists." },
          { status: 409 }
        );
      }
    }

    // 3. Build the update payload dynamically (only update fields that were sent)
    const updateData = {};
    if (styleName !== undefined) updateData.styleName = styleName;
    if (newSlug !== undefined) updateData.slug = newSlug;
    if (prompt !== undefined) updateData.prompt = prompt;
    if (advice !== undefined) updateData.advice = advice;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (generationCost !== undefined) updateData.generationCost = parseInt(generationCost, 10);
    
    // Process comma-separated tags if they are sent as a string, otherwise accept the array
    if (tags !== undefined) {
      updateData.tags = Array.isArray(tags) 
        ? tags 
        : tags.split(',').map(tag => tag.trim()).filter(Boolean);
    }

    // 4. Perform the update
    const updatedStyle = await prisma.style.update({
      where: { slug: currentSlug },
      data: updateData,
    });

    return NextResponse.json(
      { success: true, style: updatedStyle },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating style:", error);
    
    // Check if the record to update didn't exist
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: "Record to update not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}