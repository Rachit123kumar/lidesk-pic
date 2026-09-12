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
    <div className="mt-auto flex flex-col gap-5 border-t-2 border-[#0E0E10] pt-6">
      
      {/* File Upload Input */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold uppercase tracking-wider">
          Upload Your Photo
        </label>
        <input
          type="file"
          accept="image/jpeg, image/png, image/webp"
          onChange={(e) => setFile(e.target.files[0])}
          disabled={isProcessing}
          className="w-full text-sm text-[#0E0E10] 
            file:mr-4 file:py-2 file:px-4 
            file:rounded-sm file:border-2 file:border-[#0E0E10] 
            file:text-sm file:font-bold file:bg-[#FFC93C] file:text-[#0E0E10] 
            hover:file:bg-[#e6b535] file:shadow-[2px_2px_0_#0E0E10]
            cursor-pointer file:cursor-pointer disabled:opacity-50"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Aspect Ratio Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold uppercase tracking-wider">
            Aspect Ratio
          </label>
          <select
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
            disabled={isProcessing}
            className="w-full p-2 border-2 border-[#0E0E10] rounded-sm bg-white shadow-[2px_2px_0_#0E0E10] focus:outline-none focus:ring-0 font-medium text-sm"
          >
            <option value="match_input_image">Original Image Size</option>
            <option value="1:1">1:1 - Square (Instagram Post)</option>
            <option value="9:16">9:16 - Vertical (Reels / Shorts / TikTok)</option>
            <option value="16:9">16:9 - Widescreen (YouTube / Desktop)</option>
            <option value="3:4">3:4 - Standard Portrait</option>
            <option value="4:3">4:3 - Standard Landscape</option>
          </select>
        </div>

        {/* Output Format Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold uppercase tracking-wider">
            Format
          </label>
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            disabled={isProcessing}
            className="w-full p-2 border-2 border-[#0E0E10] rounded-sm bg-white shadow-[2px_2px_0_#0E0E10] focus:outline-none focus:ring-0 font-medium text-sm"
          >
            <option value="webp">WebP (Best for Web)</option>
            <option value="jpg">JPG (Standard)</option>
            <option value="png">PNG (High Quality / Lossless)</option>
          </select>
        </div>
      </div>

      {/* Action Button */}
      <button 
        onClick={handleGenerate}
        disabled={isProcessing || !file}
        className="border-2 border-[#0E0E10] bg-[#4B3AFF] text-white font-bold py-3 px-6 rounded-sm shadow-[4px_4px_0_#0E0E10] hover:-translate-y-1 hover:shadow-[6px_6px_0_#0E0E10] active:translate-y-1 active:shadow-[2px_2px_0_#0E0E10] transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_#0E0E10] disabled:cursor-not-allowed flex justify-center"
      >
        {isProcessing ? statusText : `Generate using ${styleName}`}
      </button>
    </div>
  );
}