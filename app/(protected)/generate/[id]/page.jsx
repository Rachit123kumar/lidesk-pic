"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Download, Loader2, ArrowRightLeft, Image as ImageIcon, AlertCircle, Sparkles, ArrowLeft } from "lucide-react"; 
import Sidebar from "../../../components/SIdeBar"; 
import FeedbackLine from "../../../components/FeedbackLine"; 

export default function ActiveGenerationPage() {
  const params = useParams();
  const router = useRouter(); 
  const generationId = params.id;
  
  const [generation, setGeneration] = useState(null);
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
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

  const handleDownload = async (imageUrl) => {
    try {
      setIsDownloading(true);
      
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
      window.open(imageUrl, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  const mainImage = showInputAsMain ? generation?.inputImageUrl : generation?.outputImageUrl;
  const thumbnailImage = showInputAsMain ? generation?.outputImageUrl : generation?.inputImageUrl;
  const mainLabel = showInputAsMain ? "Original Input" : "Generated Artwork";
  const thumbnailLabel = showInputAsMain ? "View Result" : "View Input";

  return (
    <div className="h-screen max-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex flex-col lg:flex-row overflow-hidden antialiased selection:bg-indigo-100 dark:selection:bg-indigo-900/50 selection:text-indigo-900 dark:selection:text-indigo-200">
      <Sidebar />

      {/* Grid Background adapted for Light & Dark */}
      <main className="flex-1 flex flex-col h-full pt-14 lg:pt-0 w-full relative font-sans overflow-y-auto bg-slate-50 dark:bg-slate-950 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]">
        
        {/* Glassmorphic Header */}
        <div className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl sticky top-0 z-20">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors active:scale-95"
              aria-label="Go back"
              title="Go back"
            >
              <ArrowLeft size={20} strokeWidth={2.5} />
            </button>
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              Workspace
            </h1>
          </div>
          
          {generation && (
            <span className={`text-xs font-medium px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-colors ${
              generation.status === 'succeeded' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20' :
              generation.status === 'failed' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20' :
              'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 animate-pulse'
            }`}>
              {generation.status === 'starting' || generation.status === 'processing' ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <div className={`w-1.5 h-1.5 rounded-full ${generation.status === 'succeeded' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              )}
              <span className="capitalize tracking-wide">{generation.status}</span>
            </span>
          )}
        </div>

        {/* Page Content area */}
        <div className="p-6 md:p-10 max-w-5xl mx-auto w-full flex flex-col items-center min-h-[70vh]">
          
          {error && (
            <div className="bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 p-8 rounded-2xl w-full max-w-md text-center my-auto flex flex-col items-center gap-3">
              <AlertCircle className="w-10 h-10 text-rose-500 dark:text-rose-400 mb-2" />
              <h2 className="text-lg font-semibold text-rose-800 dark:text-rose-300">Something went wrong</h2>
              <p className="text-sm text-rose-600/80 dark:text-rose-400/80">{error}</p>
            </div>
          )}

          {!generation && !error && (
            <div className="flex flex-col items-center justify-center gap-5 my-auto text-slate-400 dark:text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-400 dark:text-indigo-500" />
              <p className="font-medium text-sm tracking-wide">Retrieving assets...</p>
            </div>
          )}

          {generation && ["starting", "processing"].includes(generation.status) && (
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-100 dark:border-slate-800 rounded-3xl p-10 w-full max-w-md aspect-square flex flex-col items-center justify-center gap-6 shadow-xl shadow-slate-200/40 dark:shadow-black/40 my-auto">
              <div className="relative flex items-center justify-center w-20 h-20">
                <div className="absolute inset-0 border-4 border-indigo-100 dark:border-indigo-900/50 rounded-full animate-ping opacity-75"></div>
                <div className="absolute inset-0 border-4 border-t-indigo-500 border-indigo-50 dark:border-indigo-900 rounded-full animate-spin"></div>
                <Sparkles className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white tracking-tight">Crafting your vision</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">This magic usually takes 10-20 seconds.</p>
              </div>
            </div>
          )}

          {generation && generation.status === "succeeded" && generation.outputImageUrl && (
            <div className="flex flex-col items-center gap-8 w-full my-auto animate-in fade-in zoom-in duration-500 ease-out">
              
              <div className="relative flex justify-center max-w-[500px] w-full group">
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-800 dark:text-slate-200 text-xs font-semibold py-1.5 px-3.5 rounded-full shadow-sm border border-white/50 dark:border-slate-700/50 flex items-center gap-1.5">
                    <ImageIcon size={12} className="text-slate-500 dark:text-slate-400" />
                    {mainLabel}
                  </span>
                </div>
                
                <img 
                  src={mainImage} 
                  alt="Main display" 
                  className="max-w-full h-auto max-h-[65vh] object-contain rounded-[24px] shadow-2xl shadow-slate-300/60 dark:shadow-black/60 transition-transform duration-700 group-hover:scale-[1.01] bg-slate-100 dark:bg-slate-800"
                />

                {generation.inputImageUrl && thumbnailImage && (
                  <button 
                    onClick={() => setShowInputAsMain(!showInputAsMain)}
                    className="absolute -bottom-5 -right-5 w-32 h-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-1.5 rounded-2xl shadow-xl shadow-slate-300/60 dark:shadow-black/60 border border-white/60 dark:border-slate-700/60 hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all duration-300 flex flex-col z-20 group/thumb overflow-hidden"
                    title={`Swap to ${thumbnailLabel}`}
                  >
                    <div className="w-full h-full rounded-xl overflow-hidden relative">
                      <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/50 opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                        <ArrowRightLeft className="text-white drop-shadow-md" size={20} />
                      </div>
                      <img 
                        src={thumbnailImage} 
                        alt="Thumbnail view" 
                        className="w-full h-full object-cover bg-slate-200 dark:bg-slate-800"
                      />
                    </div>
                    <div className="absolute -bottom-2 inset-x-0 flex justify-center opacity-0 group-hover/thumb:opacity-100 group-hover/thumb:bottom-2 transition-all duration-300 z-20">
                      <span className="bg-slate-900/80 dark:bg-black/80 backdrop-blur-sm text-white text-[9px] font-medium py-1 px-2.5 rounded-full border border-slate-700/50">
                        {thumbnailLabel}
                      </span>
                    </div>
                  </button>
                )}
              </div>
              
              <div className="flex flex-col w-full max-w-[300px] mt-2">
                <button 
                  onClick={() => handleDownload(mainImage)}
                  disabled={isDownloading}
                  className="flex items-center justify-center gap-2.5 w-full bg-slate-900 dark:bg-indigo-600 text-white font-medium py-3.5 px-6 rounded-xl shadow-lg shadow-slate-900/20 dark:shadow-indigo-900/20 hover:bg-slate-800 dark:hover:bg-indigo-500 hover:shadow-xl hover:shadow-slate-900/30 dark:hover:shadow-indigo-900/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 size={18} className="animate-spin text-slate-300 dark:text-indigo-200" />
                      <span className="text-sm">Downloading...</span>
                    </>
                  ) : (
                    <>
                      <Download size={18} className="text-slate-300 dark:text-indigo-200" />
                      <span className="text-sm">Download {showInputAsMain ? 'Input' : 'Result'}</span>
                    </>
                  )}
                </button>
                {generation.model && (
                  <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4 font-medium tracking-wide">
                    Generated with <span className="text-slate-600 dark:text-slate-300">{generation.model}</span>
                  </p>
                )}

                <FeedbackLine 
                  generationId={generationId} 
                  initialSubmitted={generation.isFeedbacked} 
                />
              </div>
            </div>
          )}

          {generation && generation.status === "failed" && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-10 shadow-xl shadow-slate-200/50 dark:shadow-black/50 w-full max-w-md text-center my-auto">
              <div className="w-16 h-16 bg-rose-50 dark:bg-rose-500/10 rounded-full mx-auto mb-5 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-rose-500 dark:text-rose-400" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 tracking-tight">Generation Failed</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                {generation.error || "An unexpected error occurred while processing your image. Please try again."}
              </p>
              <button 
                onClick={() => router.back()}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium py-3 px-6 rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 active:scale-[0.98] transition-all text-sm"
              >
                Go Back & Try Again
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}