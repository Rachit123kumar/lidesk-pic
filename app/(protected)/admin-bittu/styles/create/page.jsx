'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import ImageUploader from '../../../../components/ImageUploader'; // Adjust path if needed

export default function CreateStylePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State aligns with your Prisma model
  const [formData, setFormData] = useState({
    styleName: '',
    slug: '',
    prompt: '',
    advice: '',
    tags: '', // Managed as a comma-separated string in the UI
    generationCost: 1,
    images: [], // Populated by ImageUploader
  });

  // Automatically generate a slug when the style name changes
  const handleNameChange = (e) => {
    const name = e.target.value;
    const generatedSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
      
    setFormData({ ...formData, styleName: name, slug: generatedSlug });
  };

  const handleUploadSuccess = (uploadedUrls) => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...uploadedUrls]
    }));
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Format data for Prisma
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        generationCost: parseInt(formData.generationCost, 10)
      };

      const response = await fetch('/api/admin/styles/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        router.push('/admin-bittu/styles');
        router.refresh();
      } else {
        // FIX: Safely attempt to parse JSON, fallback to status text if it fails
        let errorMessage = 'Failed to create style';
        try {
          const data = await response.json();
          errorMessage = data.error || errorMessage;
        } catch (parseError) {
          errorMessage = `Server Error: ${response.status} ${response.statusText}. Check server logs.`;
        }
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('A critical error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-full bg-[#FAFAF8] text-[#0E0E10] p-6 lg:p-10 font-['Space_Grotesk',_sans-serif]">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/admin-bittu/styles"
          className="p-2 bg-white border-2 border-[#0E0E10] rounded-sm transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#0E0E10] active:translate-y-0 active:shadow-none"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </Link>
        <h1 className="text-3xl font-extrabold px-6 py-3 bg-white border-2 border-[#0E0E10] rounded-sm shadow-[4px_4px_0_#0E0E10]">
          Style Creating
        </h1>
      </div>

      {/* Main Form Container */}
      <div className="max-w-4xl bg-white border-2 border-[#0E0E10] rounded-sm shadow-[8px_8px_0_#0E0E10] p-6 md:p-8">
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Text Inputs */}
            <div className="space-y-5">
              
              <div>
                <label className="block font-bold text-sm mb-1.5">Style Name</label>
                <input
                  type="text"
                  required
                  value={formData.styleName}
                  onChange={handleNameChange}
                  className="w-full p-2.5 bg-[#FAFAF8] border-2 border-[#0E0E10] rounded-sm focus:outline-none focus:shadow-[4px_4px_0_#4B3AFF] transition-shadow font-semibold"
                  placeholder="e.g. Cyberpunk Neon"
                />
              </div>

              <div>
                <label className="block font-bold text-sm mb-1.5">Prompt</label>
                <textarea
                  required
                  rows={3}
                  value={formData.prompt}
                  onChange={(e) => setFormData({...formData, prompt: e.target.value})}
                  className="w-full p-2.5 bg-[#FAFAF8] border-2 border-[#0E0E10] rounded-sm focus:outline-none focus:shadow-[4px_4px_0_#4B3AFF] transition-shadow font-semibold resize-none"
                  placeholder="Masterpiece, highly detailed, neon lighting..."
                />
              </div>

              <div>
                <label className="block font-bold text-sm mb-1.5">Advice (Optional)</label>
                <input
                  type="text"
                  value={formData.advice}
                  onChange={(e) => setFormData({...formData, advice: e.target.value})}
                  className="w-full p-2.5 bg-[#FAFAF8] border-2 border-[#0E0E10] rounded-sm focus:outline-none focus:shadow-[4px_4px_0_#4B3AFF] transition-shadow font-semibold"
                  placeholder="Works best with portraits..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm mb-1.5">Slug</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    className="w-full p-2.5 bg-gray-100 border-2 border-[#0E0E10] text-gray-500 rounded-sm focus:outline-none font-semibold text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm mb-1.5">Generation Cost</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.generationCost}
                    onChange={(e) => setFormData({...formData, generationCost: e.target.value})}
                    className="w-full p-2.5 bg-[#FAFAF8] border-2 border-[#0E0E10] rounded-sm focus:outline-none focus:shadow-[4px_4px_0_#4B3AFF] transition-shadow font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-sm mb-1.5">Tags</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="w-full p-2.5 bg-[#FAFAF8] border-2 border-[#0E0E10] rounded-sm focus:outline-none focus:shadow-[4px_4px_0_#4B3AFF] transition-shadow font-semibold"
                  placeholder="sci-fi, neon, futuristic (comma separated)"
                />
              </div>

            </div>

            {/* Right Column: Image Upload & Preview */}
            <div className="space-y-5">
              <div>
                <label className="block font-bold text-sm mb-1.5">Upload Images</label>
                <div className="p-4 bg-[#FAFAF8] border-2 border-[#0E0E10] rounded-sm">
                  <ImageUploader onUploadSuccess={handleUploadSuccess} />
                </div>
              </div>

              {/* Show successfully uploaded links below */}
              {formData.images.length > 0 && (
                <div className="p-4 bg-[#E0FFED] border-2 border-[#00D084] rounded-sm">
                  <p className="font-bold text-sm text-[#00D084] mb-2">Attached Images ({formData.images.length})</p>
                  <ul className="text-xs font-semibold space-y-1 truncate">
                    {formData.images.map((url, i) => (
                      <li key={i} className="truncate text-gray-600">- {url.split('/').pop()}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 border-t-2 border-[#0E0E10]">
            <button
              type="submit"
              disabled={isSubmitting || formData.images.length === 0}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-[#4B3AFF] text-white border-2 border-[#0E0E10] rounded-sm font-bold text-lg transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_#0E0E10] active:translate-y-0 active:shadow-none shadow-[4px_4px_0_#0E0E10] disabled:opacity-70 disabled:pointer-events-none disabled:transform-none disabled:shadow-[4px_4px_0_#0E0E10]"
            >
              {isSubmitting ? (
                <><Loader2 size={20} className="animate-spin" /> Saving Style...</>
              ) : (
                <><Save size={20} /> Create New Style</>
              )}
            </button>
            {formData.images.length === 0 && (
              <p className="text-[#FF4D6D] text-sm font-bold mt-3 text-center md:text-left">
                * You must upload at least one image before saving.
              </p>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}