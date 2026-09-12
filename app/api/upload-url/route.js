import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { authOptions } from "../../api/auth/[...nextauth]/route";
import { r2 } from "../../../lib/r2";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    // Admin authentication
    if (!session ) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized access",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { fileName, fileType } = body;

    if (!fileName || !fileType) {
      return NextResponse.json(
        {
          success: false,
          error: "fileName and fileType are required",
        },
        { status: 400 }
      );
    }

    // Only allow images
    if (!fileType.startsWith("image/")) {
      return NextResponse.json(
        {
          success: false,
          error: "Only image files are allowed",
        },
        { status: 400 }
      );
    }

    // Allowed image types
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ];

    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json(
        {
          success: false,
          error: "Unsupported image type",
        },
        { status: 400 }
      );
    }

    // Generate unique filename
    const extension = fileName.split(".").pop()?.toLowerCase() || "webp";

    const objectKey = `styles/${crypto.randomUUID()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: objectKey,
      ContentType: fileType,
    });

    // URL valid for 5 minutes
    const uploadUrl = await getSignedUrl(r2, command, {
      expiresIn: 300,
    });

    const publicUrl = `${process.env.R2_PUBLIC_URL}/${objectKey}`;

    return NextResponse.json({
      success: true,
      uploadUrl,
      objectKey,
      publicUrl,
    });
  } catch (error) {
    console.error("R2 upload URL error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate upload URL",
      },
      { status: 500 }
    );
  }
}