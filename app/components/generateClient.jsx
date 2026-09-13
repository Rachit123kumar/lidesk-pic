"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GenerateClient({ styleId, styleName }) {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");

  // New state variables for user choices
  const [aspectRatio, setAspectRatio] = useState("match_input_image");
  const [outputFormat, setOutputFormat] = useState("webp");

  const handleGenerate = async () => {
    if (!file) {
      alert("Please upload your recent photo first.");
      return;
    }

    setIsProcessing(true);
    setStatusText("Uploading image...");

    try {
      // 1. Get pre-signed URL from your API
      const presignedRes = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
        }),
      });

      if (!presignedRes.ok) throw new Error("Failed to get upload URL");
      const { uploadUrl, publicUrl } = await presignedRes.json();

      // 2. Upload file directly to Cloudflare R2
      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      setStatusText("Starting generation...");

      // 3. Trigger generation with the newly added parameters
      const generateRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          styleId: styleId,
          inputImageUrl: publicUrl,
          aspectRatio: aspectRatio,
          outputFormat: outputFormat,
        }),
      });

      const generateData = await generateRes.json();

      if (generateData.success) {
        setStatusText("Redirecting...");
        router.push(`/generate/${generateData.generationId}`);
      } else {
        throw new Error(generateData.error || "Generation failed");
      }
    } catch (error) {
      console.error("Generation flow error:", error);
      alert("Something went wrong. Please try again.");
      setIsProcessing(false);
      setStatusText("");
    }
  };

  return (
    <div className="flex flex-col gap-5">

      {/* File Upload Input */}
      <div className="flex flex-col gap-2">
        <label className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-[#8B8B9A]">
          Upload your photo
        </label>
        <input
          type="file"
          accept="image/jpeg, image/png, image/webp"
          onChange={(e) => setFile(e.target.files[0])}
          disabled={isProcessing}
          className="w-full text-sm text-[#D4D4DC]
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-medium file:bg-[#7C5CFF] file:text-white
            hover:file:bg-[#6A4AE8]
            cursor-pointer file:cursor-pointer disabled:opacity-50"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Aspect Ratio Selector */}
        <div className="flex flex-col gap-2">
          <label className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-[#8B8B9A]">
            Aspect ratio
          </label>
          <select
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
            disabled={isProcessing}
            className="w-full p-2.5 rounded-lg bg-[#17171F] text-[#F2F2F5] ring-1 ring-white/10 focus:outline-none focus:ring-1 focus:ring-[#7C5CFF] text-sm disabled:opacity-50"
          >
            <option className="bg-[#17171F] text-[#F2F2F5]" value="match_input_image">Original Image Size</option>
            <option className="bg-[#17171F] text-[#F2F2F5]" value="1:1">1:1 - Square (Instagram Post)</option>
            <option className="bg-[#17171F] text-[#F2F2F5]" value="9:16">9:16 - Vertical (Reels / Shorts / TikTok)</option>
            <option className="bg-[#17171F] text-[#F2F2F5]" value="16:9">16:9 - Widescreen (YouTube / Desktop)</option>
            <option className="bg-[#17171F] text-[#F2F2F5]" value="3:4">3:4 - Standard Portrait</option>
            <option className="bg-[#17171F] text-[#F2F2F5]" value="4:3">4:3 - Standard Landscape</option>
          </select>
        </div>

        {/* Output Format Selector */}
        <div className="flex flex-col gap-2">
          <label className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-[#8B8B9A]">
            Format
          </label>
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            disabled={isProcessing}
            className="w-full p-2.5 rounded-lg bg-[#17171F] text-[#F2F2F5] ring-1 ring-white/10 focus:outline-none focus:ring-1 focus:ring-[#7C5CFF] text-sm disabled:opacity-50"
          >
            <option className="bg-[#17171F] text-[#F2F2F5]" value="webp">WebP (Best for Web)</option>
            <option className="bg-[#17171F] text-[#F2F2F5]" value="jpg">JPG (Standard)</option>
            <option className="bg-[#17171F] text-[#F2F2F5]" value="png">PNG (High Quality / Lossless)</option>
          </select>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleGenerate}
        disabled={isProcessing || !file}
        className="bg-gradient-to-r from-[#7C5CFF] to-[#FF5CA8] text-white font-semibold py-3 px-6 rounded-lg shadow-[0_0_0_1px_rgba(255,255,255,0.1)] hover:shadow-[0_0_24px_-4px_rgba(124,92,255,0.6)] active:scale-[0.99] transition-all disabled:opacity-40 disabled:hover:shadow-[0_0_0_1px_rgba(255,255,255,0.1)] disabled:cursor-not-allowed flex justify-center"
      >
        {isProcessing ? statusText : `Generate using ${styleName}`}
      </button>
    </div>
  );
}