"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GenerateClient({ styleId, styleName, pastImages = [] }) {
  const router = useRouter();
  
  // Input method: 'upload' or 'history'
  const [inputMethod, setInputMethod] = useState("upload");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  
  // Modal & History States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPastImage, setSelectedPastImage] = useState(null);
  const [tempSelectedImage, setTempSelectedImage] = useState(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");

  const [aspectRatio, setAspectRatio] = useState("match_input_image");
  const [outputFormat, setOutputFormat] = useState("webp");

  // Create object URL for local file preview
  useEffect(() => {
    if (!file) {
      setFilePreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setFilePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleOpenModal = () => {
    setTempSelectedImage(selectedPastImage); // Reset temp to currently confirmed
    setIsModalOpen(true);
  };

  const handleConfirmSelection = () => {
    setSelectedPastImage(tempSelectedImage);
    setIsModalOpen(false);
  };

  const handleGenerate = async () => {
    if (inputMethod === "upload" && !file) {
      alert("Please upload your recent photo first.");
      return;
    }
    if (inputMethod === "history" && !selectedPastImage) {
      alert("Please select an image from your history.");
      return;
    }

    setIsProcessing(true);

    try {
      let finalImageUrl = selectedPastImage;

      // Upload to R2 if providing a new file
      if (inputMethod === "upload") {
        setStatusText("Uploading image...");
        
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

        await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });

        finalImageUrl = publicUrl;
      }

      setStatusText("Starting generation...");

      const generateRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          styleId: styleId,
          inputImageUrl: finalImageUrl,
          aspectRatio: aspectRatio,
          outputFormat: outputFormat,
        }),
      });

      const generateData = await generateRes.json();

      if (generateData.success) {
        setStatusText("Redirecting...");
        router.push(`/generate/${generateData.generationId}`);
        return;
      }

      if (generateRes.status === 402 || generateData.error === "Insufficient coins") {
        alert("You don't have enough coins to generate this image.");
        setIsProcessing(false);
        setStatusText("");
        return;
      }

      throw new Error(generateData.error || "Generation failed");
    } catch (error) {
      console.error("Generation flow error:", error);
      alert("Something went wrong. Please try again.");
      setIsProcessing(false);
      setStatusText("");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      
      {/* Input Method Toggle */}
      {pastImages.length > 0 && (
        <div className="flex p-1 bg-[#17171F] rounded-lg ring-1 ring-white/10">
          <button
            onClick={() => setInputMethod("upload")}
            disabled={isProcessing}
            className={`flex-1 text-xs font-medium py-2 rounded-md transition-all ${
              inputMethod === "upload"
                ? "bg-[#7C5CFF] text-white shadow-sm"
                : "text-[#8B8B9A] hover:text-[#D4D4DC]"
            }`}
          >
            Upload New
          </button>
          <button
            onClick={() => setInputMethod("history")}
            disabled={isProcessing}
            className={`flex-1 text-xs font-medium py-2 rounded-md transition-all ${
              inputMethod === "history"
                ? "bg-[#7C5CFF] text-white shadow-sm"
                : "text-[#8B8B9A] hover:text-[#D4D4DC]"
            }`}
          >
            Choose from History
          </button>
        </div>
      )}

      {/* File Upload OR History Selection */}
      <div className="flex flex-col gap-3 min-h-[120px]">
        {inputMethod === "upload" ? (
          <>
            <label className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-[#8B8B9A]">
              Upload your photo
            </label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  onChange={(e) => setFile(e.target.files[0])}
                  disabled={isProcessing}
                  className="w-full text-sm text-[#D4D4DC]
                    file:mr-4 file:py-2.5 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-medium file:bg-[#7C5CFF]/10 file:text-[#B7A8FF] file:ring-1 file:ring-[#7C5CFF]/30
                    hover:file:bg-[#7C5CFF]/20
                    cursor-pointer file:cursor-pointer disabled:opacity-50 transition-all"
                />
              </div>
              {filePreview && (
                <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden ring-2 ring-[#7C5CFF] shadow-[0_0_15px_rgba(124,92,255,0.3)]">
                  <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <label className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-[#8B8B9A]">
              Selected Image
            </label>
            
            {selectedPastImage ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#17171F] ring-1 ring-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden ring-2 ring-[#7C5CFF] shadow-[0_0_15px_rgba(124,92,255,0.2)]">
                    <img src={selectedPastImage} alt="Selected" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">From Gallery</span>
                    <span className="text-xs text-gray-500">Ready to generate</span>
                  </div>
                </div>
                <button
                  onClick={handleOpenModal}
                  disabled={isProcessing}
                  className="px-4 py-2 text-xs font-medium text-[#B7A8FF] bg-[#7C5CFF]/10 rounded-lg hover:bg-[#7C5CFF]/20 transition-colors"
                >
                  Change
                </button>
              </div>
            ) : (
              <button
                onClick={handleOpenModal}
                disabled={isProcessing}
                className="w-full py-8 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-[#7C5CFF]/50 hover:bg-[#7C5CFF]/5 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 group-hover:text-[#7C5CFF]">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Browse past uploads</span>
              </button>
            )}
          </>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
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
            <option className="bg-[#17171F]" value="match_input_image">Original Size</option>
            <option className="bg-[#17171F]" value="1:1">1:1 - Square</option>
            <option className="bg-[#17171F]" value="9:16">9:16 - Vertical</option>
            <option className="bg-[#17171F]" value="16:9">16:9 - Widescreen</option>
            <option className="bg-[#17171F]" value="3:4">3:4 - Portrait</option>
            <option className="bg-[#17171F]" value="4:3">4:3 - Landscape</option>
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
            <option className="bg-[#17171F]" value="webp">WebP (Best for Web)</option>
            <option className="bg-[#17171F]" value="jpg">JPG (Standard)</option>
            <option className="bg-[#17171F]" value="png">PNG (Lossless)</option>
          </select>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleGenerate}
        disabled={isProcessing || (inputMethod === "upload" && !file) || (inputMethod === "history" && !selectedPastImage)}
        className="bg-gradient-to-r from-[#7C5CFF] to-[#FF5CA8] text-white font-semibold py-3 px-6 rounded-lg shadow-[0_0_0_1px_rgba(255,255,255,0.1)] hover:shadow-[0_0_24px_-4px_rgba(124,92,255,0.6)] active:scale-[0.99] transition-all disabled:opacity-40 disabled:hover:shadow-[0_0_0_1px_rgba(255,255,255,0.1)] disabled:cursor-not-allowed flex justify-center mt-2"
      >
        {isProcessing ? statusText : `Generate using ${styleName}`}
      </button>

      {/* =========================================
          PREMIUM GALLERY MODAL
      ========================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-[#0A0A0F] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative">
            
            {/* Modal Ambient Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#7C5CFF]/15 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#FF5CA8]/10 blur-[100px] pointer-events-none" />

            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10 relative z-10 bg-[#0A0A0F]/80 backdrop-blur-xl">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Image Gallery</h3>
                <p className="text-xs text-gray-400 mt-1">Select an image from your past generations</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Modal Body - Image Grid */}
            <div className="flex-1 overflow-y-auto p-5 relative z-10 custom-scrollbar">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {pastImages.map((imgUrl, idx) => {
                  const isSelected = tempSelectedImage === imgUrl;
                  return (
                    <div
                      key={idx}
                      onClick={() => setTempSelectedImage(imgUrl)}
                      className={`
                        group relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all duration-300
                        ${isSelected ? 'ring-2 ring-[#7C5CFF] ring-offset-2 ring-offset-[#0A0A0F] scale-[0.98]' : 'ring-1 ring-white/10 hover:ring-white/30'}
                      `}
                    >
                      <img src={imgUrl} alt="Past generation" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      
                      {/* Selection Overlay & Checkmark */}
                      <div className={`absolute inset-0 bg-[#7C5CFF]/20 backdrop-blur-[2px] transition-opacity duration-300 flex items-center justify-center ${isSelected ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="w-10 h-10 rounded-full bg-[#7C5CFF] flex items-center justify-center shadow-lg shadow-black/50 scale-100">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-white/10 flex justify-end gap-3 relative z-10 bg-[#0A0A0F]/80 backdrop-blur-xl">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSelection}
                disabled={!tempSelectedImage}
                className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-[#7C5CFF] text-white hover:bg-[#6A4AE8] shadow-[0_0_15px_rgba(124,92,255,0.4)] disabled:opacity-50 disabled:shadow-none transition-all"
              >
                Use Selected Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}