'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, X, Loader2, Image as ImageIcon, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ImageUploader({ onUploadSuccess }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  // 'idle' | 'verifying' | 'uploading' | 'success'
  const [status, setStatus] = useState('idle'); 
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const MAX_FILES = 3;
  const MAX_SIZE_MB = 5;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

  const handleFileChange = (e) => {
    setError(null);
    setStatus('idle');
    const files = Array.from(e.target.files);

    if (files.length + selectedFiles.length > MAX_FILES) {
      setError(`Maximum ${MAX_FILES} images allowed.`);
      return;
    }

    const validFiles = [];
    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(`${file.name} is not supported. Use JPG, PNG, WEBP, or AVIF.`);
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        setError(`${file.name} exceeds ${MAX_SIZE_MB}MB.`);
        return;
      }
      file.preview = URL.createObjectURL(file);
      validFiles.push(file);
    }

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const processUploads = async () => {
    if (selectedFiles.length === 0) return;
    setError(null);
    const finalImageUrls = [];

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        
        // Phase 1: Verification & URL Generation
        setStatus('verifying');
        const tokenRes = await fetch('/api/upload-url', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: file.name, fileType: file.type })
        });
        
        const tokenData = await tokenRes.json();
        if (!tokenData.success) throw new Error(`Verification failed: ${tokenData.error}`);

        // Phase 2: Active Upload to R2
        setStatus('uploading');
        const uploadRes = await fetch(tokenData.uploadUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type },
        });

        if (!uploadRes.ok) throw new Error(`Failed to upload ${file.name} to storage.`);

        finalImageUrls.push(tokenData.publicUrl);
      }

      setStatus('success');
      if (onUploadSuccess) onUploadSuccess(finalImageUrls);
      
      // Delay clearing so user sees the success state briefly
      setTimeout(() => {
        setSelectedFiles([]);
        setStatus('idle');
      }, 2000);

    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred during upload.');
      setStatus('idle');
    }
  };

  const isProcessing = status === 'verifying' || status === 'uploading';

  return (
    <div className="w-full font-['Space_Grotesk',_sans-serif]">
      {/* Dropzone */}
      <div 
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`w-full p-6 flex flex-col items-center justify-center text-center bg-white border-2 border-dashed border-[#0E0E10] rounded-sm cursor-pointer transition-all duration-200 
          ${isProcessing ? 'opacity-50 pointer-events-none' : 'hover:bg-[#FAFAF8] hover:shadow-[4px_4px_0_#0E0E10]'}`}
      >
        <UploadCloud size={32} strokeWidth={1.5} className="mb-3 text-[#0E0E10]" />
        <h3 className="text-base font-bold text-[#0E0E10] mb-1">Click to select images</h3>
        <p className="text-xs font-semibold text-gray-500">
          Max {MAX_FILES} files ({MAX_SIZE_MB}MB each)
        </p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept="image/jpeg, image/png, image/webp, image/avif"
          className="hidden"
          disabled={isProcessing || selectedFiles.length >= MAX_FILES}
        />
      </div>

      {/* Error State */}
      {error && (
        <div className="mt-3 p-3 bg-[#FF4D6D]/10 border-2 border-[#FF4D6D] rounded-sm flex items-center gap-2 text-[#FF4D6D] font-bold text-sm shadow-[2px_2px_0_#FF4D6D]">
          <AlertCircle size={16} strokeWidth={2.5} />
          <span>{error}</span>
        </div>
      )}

      {/* Previews & Actions */}
      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <div className="flex gap-4 mb-4 overflow-x-auto pb-2">
            {selectedFiles.map((file, idx) => (
              <div key={idx} className="relative w-24 h-24 shrink-0 border-2 border-[#0E0E10] rounded-sm overflow-hidden bg-gray-100 shadow-[2px_2px_0_#0E0E10]">
                <img src={file.preview} alt={`preview ${idx}`} className="w-full h-full object-cover" />
                {!isProcessing && status !== 'success' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(idx);
                    }}
                    className="absolute top-1 right-1 w-5 h-5 bg-white border-2 border-[#0E0E10] flex items-center justify-center rounded-sm hover:bg-[#FF4D6D] hover:text-white"
                  >
                    <X size={12} strokeWidth={3} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={processUploads}
            disabled={isProcessing || status === 'success'}
            className={`w-full flex items-center justify-center gap-2 py-2.5 text-white border-2 border-[#0E0E10] rounded-sm font-bold text-sm transition-all shadow-[3px_3px_0_#0E0E10]
              ${status === 'success' ? 'bg-[#00D084]' : 'bg-[#0E0E10] hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#0E0E10] active:translate-y-0.5 active:shadow-none'}
              disabled:opacity-80 disabled:pointer-events-none disabled:transform-none`}
          >
            {status === 'verifying' && <><Loader2 size={16} className="animate-spin" /> Checking for Verification...</>}
            {status === 'uploading' && <><Loader2 size={16} className="animate-spin" /> Uploading to R2...</>}
            {status === 'success' && <><CheckCircle2 size={16} /> Upload Complete!</>}
            {status === 'idle' && <span>Upload {selectedFiles.length} Image(s)</span>}
          </button>
        </div>
      )}
    </div>
  );
}