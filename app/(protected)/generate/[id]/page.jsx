"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Download, Loader2, ArrowRightLeft } from "lucide-react"; 
// Adjust this import path based on your actual folder structure
import Sidebar from "../../../components/SIdeBar"; 

export default function ActiveGenerationPage() {
  const params = useParams();
  const generationId = params.id;
  
  const [generation, setGeneration] = useState(null);
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // State to track which image is shown in the main view
  const [showInputAsMain, setShowInputAsMain] = useState(false);

  useEffect(() => {
    if (!generationId) return;

    let intervalId;

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/generate/${generationId}`);
        const result = await res.json();

        if (result.success) {
          setGeneration(result.data);

          // Stop polling if we hit a final state
          const finalStates = ["succeeded", "failed", "canceled"];
          if (finalStates.includes(result.data.status)) {
            clearInterval(intervalId);
          }
        } else {
          setError(result.error || "Failed to fetch generation status");
          clearInterval(intervalId);
        }
      } catch (err) {
        console.error("Polling error:", err);
        setError("Network error occurred while checking status.");
      }
    };

    checkStatus();
    intervalId = setInterval(checkStatus, 3000);
    return () => clearInterval(intervalId);
  }, [generationId]);

  // --- Force Download Function using API Proxy ---
  const handleDownload = async (imageUrl) => {
    try {
      setIsDownloading(true);
      
      // Use our new local API route to bypass CORS
      const proxyUrl = `/api/download?url=${encodeURIComponent(imageUrl)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) throw new Error("Download proxy failed");
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = blobUrl;
      const filename = imageUrl.split('/').pop() || `generation-${generationId}.webp`;
      link.download = filename;
      
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      
    } catch (error) {
      console.error("Download failed, falling back to new tab:", error);
      // Fallback if the proxy fails
      window.open(imageUrl, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  // Determine which image is main and which is the thumbnail
  const mainImage = showInputAsMain ? generation?.inputImageUrl : generation?.outputImageUrl;
  const thumbnailImage = showInputAsMain ? generation?.outputImageUrl : generation?.inputImageUrl;
  const mainLabel = showInputAsMain ? "Input Image" : "Generated Output";
  const thumbnailLabel = showInputAsMain ? "View Output" : "View Input";

  return (
    <div className="h-screen max-h-screen bg-[#FAFAF8] text-[#0E0E10] flex flex-col lg:flex-row overflow-hidden">
      <Sidebar />

      {/* Main content area */}
      <main className="flex-1 flex flex-col h-full pt-14 lg:pt-0 w-full relative font-['Inter',_sans-serif] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 border-b-2 border-[#0E0E10] bg-white sticky top-0 z-10">
          <h1 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk',_sans-serif] capitalize">
            Generation Status
          </h1>
          
          {generation && (
            <span className={`text-xs sm:text-sm font-bold px-3 py-1 border-2 border-[#0E0E10] rounded-sm uppercase tracking-wider ${
              generation.status === 'succeeded' ? 'bg-green-400 text-black' :
              generation.status === 'failed' ? 'bg-red-500 text-white' :
              'bg-[#FFC93C] text-black animate-pulse'
            }`}>
              {generation.status}
            </span>
          )}
        </div>

        {/* Page Content area */}
        <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto w-full flex flex-col items-center justify-center min-h-[70vh]">
          
          {/* Error State */}
          {error && (
            <div className="border-2 border-[#0E0E10] bg-red-100 p-6 shadow-[5px_5px_0_#0E0E10] w-full text-center mb-6">
              <h2 className="text-xl font-bold text-red-600 uppercase mb-2">Error</h2>
              <p className="font-medium text-[#0E0E10]">{error}</p>
            </div>
          )}

          {/* Loading / Initial State */}
          {!generation && !error && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-[#0E0E10] border-t-[#4B3AFF] rounded-full animate-spin"></div>
              <p className="font-bold uppercase tracking-wider text-sm">Loading details...</p>
            </div>
          )}

          {/* Processing / Starting State */}
          {generation && ["starting", "processing"].includes(generation.status) && (
            <div className="border-4 border-dashed border-[#0E0E10] rounded-sm bg-white p-8 w-full max-w-md aspect-square flex flex-col items-center justify-center gap-6 shadow-[5px_5px_0_#0E0E10] animate-pulse">
              <div className="w-16 h-16 bg-[#4B3AFF] border-2 border-[#0E0E10] shadow-[2px_2px_0_#0E0E10] animate-bounce"></div>
              <p className="text-lg font-bold font-['Space_Grotesk',_sans-serif] text-center">
                Applying Style...<br/>
                <span className="text-sm text-gray-500 font-['Inter',_sans-serif] normal-case mt-2 block">
                  This usually takes 10-20 seconds
                </span>
              </p>
            </div>
          )}

          {/* Succeeded State */}
          {generation && generation.status === "succeeded" && generation.outputImageUrl && (
            <div className="flex flex-col items-center gap-6 w-full">
              
              {/* Image Container - Using relative positioning for the floating thumbnail */}
              <div className="relative w-full max-w-[450px]">
                
                {/* Main Large Image */}
                <div className="w-full border-2 border-[#0E0E10] rounded-sm shadow-[6px_6px_0_#0E0E10] bg-gray-100 flex flex-col items-center overflow-hidden transition-all duration-300">
                  <div className="w-full bg-[#0E0E10] text-white text-xs font-bold uppercase py-1.5 px-3 tracking-wider text-center flex justify-between items-center">
                    <span>{mainLabel}</span>
                    {generation.model && <span className="text-gray-400 normal-case">{generation.model}</span>}
                  </div>
                  <img 
                    src={mainImage} 
                    alt="Main display" 
                    className="w-full h-auto object-contain"
                  />
                </div>

                {/* Floating Thumbnail (Only show if an input image exists) */}
                {generation.inputImageUrl && thumbnailImage && (
                  <button 
                    onClick={() => setShowInputAsMain(!showInputAsMain)}
                    className="absolute -bottom-4 -right-4 w-28 h-32 border-2 border-[#0E0E10] bg-white rounded-sm shadow-[4px_4px_0_#0E0E10] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_#0E0E10] active:translate-y-0 active:translate-x-0 active:shadow-[2px_2px_0_#0E0E10] transition-all flex flex-col overflow-hidden z-10 group"
                    title={`Swap to ${thumbnailLabel}`}
                  >
                    <div className="w-full bg-[#4B3AFF] text-white text-[10px] font-bold uppercase py-1 text-center flex items-center justify-center gap-1">
                      <ArrowRightLeft size={10} strokeWidth={3} />
                      {thumbnailLabel}
                    </div>
                    <img 
                      src={thumbnailImage} 
                      alt="Thumbnail view" 
                      className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                    />
                  </button>
                )}
              </div>
              
              {/* Actions Section */}
              <div className="flex flex-col w-full max-w-[450px] gap-4 mt-6">
                
                <button 
                  onClick={() => handleDownload(mainImage)}
                  disabled={isDownloading}
                  className="flex items-center justify-center gap-2 w-full text-center border-2 border-[#0E0E10] bg-[#4B3AFF] text-white font-bold py-3 px-4 rounded-sm shadow-[4px_4px_0_#0E0E10] hover:-translate-y-1 hover:shadow-[6px_6px_0_#0E0E10] active:translate-y-0.5 active:shadow-[2px_2px_0_#0E0E10] transition-all uppercase tracking-wider text-sm disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-[4px_4px_0_#0E0E10]"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Downloading {showInputAsMain ? 'Input' : 'Output'}...
                    </>
                  ) : (
                    <>
                      <Download size={16} strokeWidth={2.5} />
                      Download {showInputAsMain ? 'Input' : 'Output'} Image
                    </>
                  )}
                </button>

              </div>
            </div>
          )}

          {/* Failed State */}
          {generation && generation.status === "failed" && (
            <div className="border-2 border-[#0E0E10] bg-white p-8 shadow-[5px_5px_0_#0E0E10] w-full max-w-md text-center">
              <div className="w-16 h-16 bg-red-500 border-2 border-[#0E0E10] shadow-[2px_2px_0_#0E0E10] mx-auto mb-4 flex items-center justify-center transform rotate-45">
                <span className="text-white font-bold text-2xl -rotate-45">X</span>
              </div>
              <h2 className="text-xl font-bold uppercase mb-2">Generation Failed</h2>
              <p className="font-medium text-gray-600 mb-6">
                {generation.error || "An unexpected error occurred during generation."}
              </p>
              <button 
                onClick={() => window.history.back()}
                className="border-2 border-[#0E0E10] bg-[#FFC93C] text-[#0E0E10] font-bold py-2 px-6 rounded-sm shadow-[3px_3px_0_#0E0E10] hover:-translate-y-[2px] hover:shadow-[5px_5px_0_#0E0E10] active:translate-y-[2px] active:shadow-[1px_1px_0_#0E0E10] transition-all uppercase"
              >
                Try Again
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}