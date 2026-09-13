import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");
  // Get the clean filename from the frontend, or fallback
  const filename = searchParams.get("filename") || "LibDesk-Image.webp";

  if (!imageUrl) {
    return new NextResponse("Missing URL", { status: 400 });
  }

  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    return new NextResponse(blob, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "image/webp",
        // This tells the browser exactly what to name the file
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    return new NextResponse("Failed to fetch image", { status: 500 });
  }
}