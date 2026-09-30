// // app/generate/page.jsx
// "use client";

// import { useState, useRef } from "react";

// export default function GenerateVideoPage() {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [status, setStatus] = useState("");
//   const [videoUrl, setVideoUrl] = useState(null);
  
//   const fileInputRef = useRef(null);

//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files.length > 0) {
//       setFile(e.target.files[0]);
//     }
//   };

//   const handleGenerate = async () => {
//     if (!file) return alert("Please select an image first.");
    
//     setLoading(true);
//     setVideoUrl(null);
//     setStatus("Uploading image to Cloudflare R2...");

//     try {
//       // 1. Get presigned URL from your existing upload endpoint
//       const uploadRes = await fetch("/api/upload-url", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           fileName: file.name,
//           fileType: file.type,
//         }),
//       });
      
//       const { uploadUrl, publicUrl } = await uploadRes.json();

//       // 2. Upload file directly to R2
//       await fetch(uploadUrl, {
//         method: "PUT",
//         headers: { "Content-Type": file.type },
//         body: file,
//       });

//       setStatus("Starting video generation with Veo 3.1...");

//       // 3. Trigger generation job
//       const generateRes = await fetch("/api/generateVideo", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           imageUrls: [publicUrl],
//           prompt: "Cinematic transition reel showing dynamic movement.",
//         }),
//       });

//       const generateData = await generateRes.json();
      
//       if (!generateData.success) {
//         throw new Error(generateData.error || "Failed to start generation");
//       }

//       // 4. Poll for results
//       setStatus("Rendering video (this usually takes 1-2 minutes)...");
//       pollStatus(generateData.generationId);

//     } catch (error) {
//       console.error(error);
//       setStatus(`Error: ${error.message}`);
//       setLoading(false);
//     }
//   };

//   const pollStatus = async (generationId) => {
//     const interval = setInterval(async () => {
//       try {
//         const res = await fetch(`/api/generateVideo/${generationId}`);
//         const { generation } = await res.json();

//         if (generation.status === "succeeded") {
//           clearInterval(interval);
//           setVideoUrl(generation.outputImageUrl);
//           setStatus("Video complete!");
//           setLoading(false);
//         } else if (generation.status === "failed") {
//           clearInterval(interval);
//           setStatus("Video generation failed.");
//           setLoading(false);
//         }
//       } catch (err) {
//         console.error("Polling error", err);
//       }
//     }, 10000); // Poll every 10 seconds
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-8 flex flex-col gap-6">
//       <h1 className="text-2xl font-bold">Create Transformation Reel</h1>
      
//       <div className="border-2 border-dashed p-8 text-center rounded-lg">
//         <input 
//           type="file" 
//           accept="image/*" 
//           onChange={handleFileChange} 
//           ref={fileInputRef}
//           className="hidden"
//         />
//         <button 
//           onClick={() => fileInputRef.current?.click()}
//           className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
//         >
//           {file ? file.name : "Select Reference Image"}
//         </button>
//       </div>

//       <button 
//         onClick={handleGenerate} 
//         disabled={loading || !file}
//         className="bg-blue-600 text-white font-semibold py-3 rounded-lg disabled:opacity-50"
//       >
//         {loading ? "Processing..." : "Generate Reel (1 Coin)"}
//       </button>

//       {status && (
//         <p className="text-sm text-gray-600 text-center animate-pulse">{status}</p>
//       )}

//       {videoUrl && (
//         <div className="mt-8 rounded-lg overflow-hidden bg-black">
//           <video 
//             src={videoUrl} 
//             controls 
//             autoPlay 
//             loop 
//             className="w-full h-auto aspect-video"
//           />
//         </div>
//       )}
//     </div>
//   );
// }

import React from 'react'

export default function Page() {
  return (
    <div>Page</div>
  )
}
