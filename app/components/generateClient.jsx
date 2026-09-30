"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, UploadCloud, Image as ImageIcon, Loader2, X, ShieldCheck, CheckSquare, Square } from "lucide-react";

const ASPECT_RATIOS = [
  { id: "match_input_image", label: "Original", ratio: "Auto", description: "Matches input size", boxClass: "aspect-square w-5 border-dashed" },
  { id: "1:1", label: "Square", ratio: "1:1", description: "Profile photos & Insta", boxClass: "aspect-square w-5" },
  { id: "3:4", label: "Portrait", ratio: "3:4", description: "Classic photography", boxClass: "aspect-[3/4] h-6" },
  { id: "4:3", label: "Landscape", ratio: "4:3", description: "Standard digital photos", boxClass: "aspect-[4/3] w-6" },
  { id: "9:16", label: "Vertical", ratio: "9:16", description: "Stories, TikTok & Reels", boxClass: "aspect-[9/16] h-6" },
  { id: "16:9", label: "Widescreen", ratio: "16:9", description: "YouTube & Cinematic", boxClass: "aspect-[16/9] w-7" },
];

const FORMATS = [
  { id: "webp", label: "WebP", desc: "Best for Web" },
  { id: "jpg", label: "JPG", desc: "Standard" },
  { id: "png", label: "PNG", desc: "Lossless" },
];

export default function GenerateClient({ styleId, styleName, pastImages = [] }) {
  const router = useRouter();
  
  // States
  const [inputMethod, setInputMethod] = useState("upload");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  
  // Mandatory check state before upload is enabled
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);
  
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
    if (!hasAgreedToTerms) return;
    setTempSelectedImage(selectedPastImage);
    setIsModalOpen(true);
  };

  const handleConfirmSelection = () => {
    setSelectedPastImage(tempSelectedImage);
    setIsModalOpen(false);
  };

  const handleGenerate = async () => {
    if (!hasAgreedToTerms) {
      alert("Please confirm your rights and agreement to proceed.");
      return;
    }
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
    <div className="flex flex-col gap-6">
      
      {/* Input Method Toggle */}
      {pastImages.length > 0 && (
        <div className="flex p-1 bg-white/[0.02] rounded-xl ring-1 ring-white/10 backdrop-blur-sm shadow-inner">
          <button
            onClick={() => setInputMethod("upload")}
            disabled={isProcessing || !hasAgreedToTerms}
            className={`flex-1 text-[13px] font-semibold py-2.5 rounded-lg transition-all duration-300 ${
              inputMethod === "upload"
                ? "bg-white/10 text-white shadow-md ring-1 ring-white/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            } ${!hasAgreedToTerms ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Upload New
          </button>
          <button
            onClick={() => setInputMethod("history")}
            disabled={isProcessing || !hasAgreedToTerms}
            className={`flex-1 text-[13px] font-semibold py-2.5 rounded-lg transition-all duration-300 ${
              inputMethod === "history"
                ? "bg-white/10 text-white shadow-md ring-1 ring-white/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            } ${!hasAgreedToTerms ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Choose from History
          </button>
        </div>
      )}

      {/* Mandatory Agreement Checkbox Banner */}
      <div 
        onClick={() => !isProcessing && setHasAgreedToTerms(!hasAgreedToTerms)}
        className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
          hasAgreedToTerms 
            ? "bg-emerald-500/[0.08] border-emerald-500/30 text-emerald-200" 
            : "bg-white/[0.02] border-white/10 hover:border-white/20 text-slate-300"
        }`}
      >
        <div className="mt-0.5 shrink-0 text-[#7C5CFF]">
          {hasAgreedToTerms ? (
            <CheckSquare className="w-5 h-5 text-emerald-400" />
          ) : (
            <Square className="w-5 h-5 text-slate-500" />
          )}
        </div>
        <div className="text-xs leading-relaxed">
          <span className="font-semibold text-white block mb-0.5">Required Agreement & Image Rights Confirmation</span>
          I confirm that I own this photo or have explicit right to use it, and that I retain 100% intellectual property ownership. I agree to the terms outlined in our{" "}
          <a 
            href="/privacy-policy" 
            target="_blank" 
            onClick={(e) => e.stopPropagation()} 
            className="underline underline-offset-2 text-[#B7A8FF] hover:text-white transition-colors font-medium"
          >
            Privacy Policy
          </a>.
        </div>
      </div>

      {/* File Upload OR History Selection (Locked if unchecked) */}
      <div className={`flex flex-col gap-3 min-h-[140px] transition-opacity duration-300 ${!hasAgreedToTerms ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
        {inputMethod === "upload" ? (
          <>
            <label className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-widest text-[#7C5CFF] font-medium flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7C5CFF]"></span>
              Source Image
            </label>
            
            {!filePreview ? (
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer bg-white/[0.02] hover:bg-white/[0.04] hover:border-[#7C5CFF]/50 transition-all duration-300 group shadow-inner">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-[#7C5CFF]/20 transition-all duration-300">
                    <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-[#7C5CFF] transition-colors" />
                  </div>
                  <p className="text-sm text-slate-200 font-medium tracking-wide">Click to upload photo</p>
                  <p className="text-xs text-slate-500 mt-1">PNG, JPG or WebP (Max 10MB)</p>
                </div>
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  onChange={(e) => setFile(e.target.files[0])}
                  disabled={isProcessing || !hasAgreedToTerms}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/10 shadow-inner">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden ring-2 ring-[#7C5CFF] shadow-[0_0_15px_rgba(124,92,255,0.3)]">
                    <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white truncate max-w-[150px] sm:max-w-[200px]">{file.name}</span>
                    <span className="text-xs text-slate-500">Ready to generate</span>
                  </div>
                </div>
                <button
                  onClick={() => setFile(null)}
                  disabled={isProcessing}
                  className="h-9 w-9 flex items-center justify-center text-slate-400 bg-white/5 rounded-full hover:bg-red-500/20 hover:text-red-400 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <label className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-widest text-[#7C5CFF] font-medium flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7C5CFF]"></span>
              Selected Image
            </label>
            
            {selectedPastImage ? (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/10 shadow-inner">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden ring-2 ring-[#7C5CFF] shadow-[0_0_15px_rgba(124,92,255,0.2)]">
                    <img src={selectedPastImage} alt="Selected" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">From Gallery</span>
                    <span className="text-xs text-slate-500">Ready to generate</span>
                  </div>
                </div>
                <button
                  onClick={handleOpenModal}
                  disabled={isProcessing}
                  className="px-4 py-2 text-xs font-semibold tracking-wide text-[#B7A8FF] bg-[#7C5CFF]/10 rounded-xl border border-[#7C5CFF]/20 hover:bg-[#7C5CFF]/20 transition-colors"
                >
                  Change
                </button>
              </div>
            ) : (
              <button
                onClick={handleOpenModal}
                disabled={isProcessing || !hasAgreedToTerms}
                className="w-full h-36 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 bg-white/[0.02] hover:border-[#7C5CFF]/50 hover:bg-white/[0.04] transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#7C5CFF]/20 transition-all duration-300">
                  <ImageIcon className="w-6 h-6 text-slate-400 group-hover:text-[#7C5CFF] transition-colors" />
                </div>
                <span className="text-sm font-medium text-slate-200 tracking-wide">Browse past uploads</span>
              </button>
            )}
          </>
        )}
      </div>

      {/* Premium Aspect Ratio Selector */}
      <div className={`flex flex-col gap-3 mt-2 transition-opacity duration-300 ${!hasAgreedToTerms ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
        <label className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-widest text-[#7C5CFF] font-medium flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#7C5CFF]"></span>
          Aspect Ratio
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ASPECT_RATIOS.map((option) => {
            const isActive = aspectRatio === option.id;
            return (
              <button
                key={option.id}
                onClick={() => setAspectRatio(option.id)}
                disabled={isProcessing || !hasAgreedToTerms}
                type="button"
                className={`relative flex items-center gap-4 p-3.5 rounded-2xl border text-left transition-all duration-300 overflow-hidden group ${
                  isActive
                    ? "bg-[#7C5CFF]/10 border-[#7C5CFF]/40 shadow-[0_0_20px_rgba(124,92,255,0.15)]"
                    : "bg-white/[0.02] border-white/10 hover:bg-white/[0.04] hover:border-white/20"
                }`}
              >
                <div className="shrink-0 h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                  <div 
                    className={`border-2 rounded-sm transition-colors duration-300 ${option.boxClass} ${
                      isActive ? "border-[#7C5CFF] bg-[#7C5CFF]/20" : "border-slate-500 bg-slate-500/10 group-hover:border-slate-400"
                    }`} 
                  />
                </div>
                <div className="flex flex-col flex-1 pr-6">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`font-semibold text-[13px] tracking-wide ${isActive ? "text-white" : "text-slate-300"}`}>
                      {option.ratio}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-full">
                      {option.label}
                    </span>
                  </div>
                  <span className={`text-[11px] font-medium leading-snug ${isActive ? "text-[#B7A8FF]" : "text-slate-500"}`}>
                    {option.description}
                  </span>
                </div>
                <div className={`absolute right-4 transition-all duration-300 ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
                  <div className="h-5 w-5 rounded-full bg-[#7C5CFF] flex items-center justify-center shadow-[0_0_10px_rgba(124,92,255,0.5)]">
                    <Check strokeWidth={3} className="w-3 h-3 text-white" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Premium Format Selector */}
      <div className={`flex flex-col gap-3 mt-2 transition-opacity duration-300 ${!hasAgreedToTerms ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
        <label className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-widest text-[#7C5CFF] font-medium flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#7C5CFF]"></span>
          Format
        </label>
        <div className="flex gap-2 p-1 bg-white/[0.02] rounded-xl ring-1 ring-white/10 backdrop-blur-sm shadow-inner">
          {FORMATS.map((f) => (
            <button
              key={f.id}
              onClick={() => setOutputFormat(f.id)}
              disabled={isProcessing || !hasAgreedToTerms}
              className={`flex-1 flex flex-col items-center justify-center py-2 rounded-lg transition-all duration-300 ${
                outputFormat === f.id
                  ? "bg-white/10 text-white shadow-md ring-1 ring-white/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-[13px] font-bold tracking-wide">{f.label}</span>
              <span className={`text-[9px] uppercase tracking-widest ${outputFormat === f.id ? "text-blue-300" : "text-slate-500"}`}>
                {f.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleGenerate}
        disabled={isProcessing || !hasAgreedToTerms || (inputMethod === "upload" && !file) || (inputMethod === "history" && !selectedPastImage)}
        className="relative mt-4 w-full h-14 rounded-2xl bg-gradient-to-r from-[#7C5CFF] to-blue-500 text-white font-bold text-[15px] shadow-[0_0_30px_-5px_rgba(124,92,255,0.5)] hover:shadow-[0_0_40px_-5px_rgba(124,92,255,0.7)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center overflow-hidden group"
      >
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
        
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="tracking-wide">{statusText}</span>
          </div>
        ) : (
          <span className="tracking-wide flex items-center gap-2">
            ✨ Generate using {styleName}
          </span>
        )}
      </button>

      {/* =========================================
          PREMIUM GALLERY MODAL
      ========================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-[#09090b] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative">
            
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#7C5CFF]/15 blur-[100px] pointer-events-none" />
            
            <div className="flex items-center justify-between p-6 border-b border-white/10 relative z-10 bg-[#09090b]/80 backdrop-blur-xl">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Image Gallery</h3>
                <p className="text-[13px] text-slate-400 mt-1 font-medium">Select a source image from your history</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 relative z-10 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {pastImages.map((imgUrl, idx) => {
                  const isSelected = tempSelectedImage === imgUrl;
                  return (
                    <div
                      key={idx}
                      onClick={() => setTempSelectedImage(imgUrl)}
                      className={`
                        group relative aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all duration-300
                        ${isSelected ? 'ring-2 ring-[#7C5CFF] ring-offset-4 ring-offset-[#09090b] scale-[0.96] shadow-[0_0_20px_rgba(124,92,255,0.4)]' : 'ring-1 ring-white/10 hover:ring-white/30 hover:scale-[0.98]'}
                      `}
                    >
                      <img src={imgUrl} alt="Past generation" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      
                      <div className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 flex items-center justify-center ${isSelected ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="w-12 h-12 rounded-full bg-[#7C5CFF] flex items-center justify-center shadow-lg shadow-black/50 scale-100">
                          <Check strokeWidth={3} className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 border-t border-white/10 flex justify-end gap-3 relative z-10 bg-[#09090b]/80 backdrop-blur-xl">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSelection}
                disabled={!tempSelectedImage}
                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-white text-black hover:bg-slate-200 shadow-[0_0_15px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:shadow-none transition-all"
              >
                Confirm Selection
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}