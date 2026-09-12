'use client';

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, CheckCircle, XCircle, Tag, Coins, Save, X, Loader2 } from "lucide-react";

export default function StyleDetailsClientPage() {
  const { slug } = useParams();
  const router = useRouter();

  // Core Data States
  const [style, setStyle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Editing States
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({});

  // Fetch the data on mount
  useEffect(() => {
    const fetchStyle = async () => {
      try {
        const response = await fetch(`/api/admin/styles/${slug}`);
        const data = await response.json();
        
        if (data.success) {
          setStyle(data.style);
          // Initialize form data (convert tags array to comma-separated string for editing)
          setFormData({
            ...data.style,
            tags: data.style.tags ? data.style.tags.join(', ') : ''
          });
        } else {
          alert(data.error || "Style not found");
          router.push('/admin-bittu/styles');
        }
      } catch (error) {
        console.error("Error fetching style:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchStyle();
  }, [slug, router]);

  // Handle Save
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        generationCost: parseInt(formData.generationCost, 10),
      };

      const response = await fetch(`/api/admin/styles/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStyle(data.style);
        setIsEditing(false);
        
        // If the slug changed, update the URL so a page refresh doesn't break
        if (data.style.slug !== slug) {
          router.replace(`/admin-bittu/styles/${data.style.slug}`);
        }
      } else {
        alert(`Error: ${data.error || 'Failed to update style'}`);
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('A critical error occurred while updating.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data back to original style data
    setFormData({
      ...style,
      tags: style.tags ? style.tags.join(', ') : ''
    });
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-full bg-[#FAFAF8] flex items-center justify-center p-10">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[#4B3AFF]" size={40} strokeWidth={3} />
          <p className="font-bold font-['Space_Grotesk',_sans-serif]">Loading Style Data...</p>
        </div>
      </div>
    );
  }

  if (!style) return null;

  return (
    <div className="min-h-full bg-[#FAFAF8] text-[#0E0E10] p-6 lg:p-10 font-['Space_Grotesk',_sans-serif]">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Link 
            href="/admin-bittu/styles"
            className="p-2 bg-white border-2 border-[#0E0E10] rounded-sm transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#0E0E10] active:translate-y-0 active:shadow-none shrink-0"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </Link>
          
          {isEditing ? (
            <input
              type="text"
              value={formData.styleName}
              onChange={(e) => setFormData({...formData, styleName: e.target.value})}
              className="text-2xl sm:text-3xl font-extrabold px-4 py-2 bg-white border-2 border-[#0E0E10] rounded-sm shadow-[4px_4px_0_#4B3AFF] focus:outline-none w-full max-w-md"
            />
          ) : (
            <h1 className="text-2xl sm:text-3xl font-extrabold px-6 py-3 bg-white border-2 border-[#0E0E10] rounded-sm shadow-[4px_4px_0_#0E0E10] truncate max-w-md">
              {style.styleName}
            </h1>
          )}
        </div>

        {/* Toggle Edit/Save Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
          {isEditing ? (
            <>
              <button 
                onClick={handleCancel}
                disabled={isSaving}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#0E0E10] border-2 border-[#0E0E10] rounded-sm font-bold transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0_#0E0E10] active:translate-y-0 active:shadow-none shadow-[2px_2px_0_#0E0E10]"
              >
                <X size={18} strokeWidth={2.5} />
                <span>Cancel</span>
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#4B3AFF] text-white border-2 border-[#0E0E10] rounded-sm font-bold transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0_#0E0E10] active:translate-y-0 active:shadow-none shadow-[2px_2px_0_#0E0E10] disabled:opacity-70 disabled:transform-none disabled:shadow-none"
              >
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} strokeWidth={2.5} />}
                <span>Save</span>
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#FFC93C] text-[#0E0E10] border-2 border-[#0E0E10] rounded-sm font-bold transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_#0E0E10] active:translate-y-0 active:shadow-none shadow-[4px_4px_0_#0E0E10]"
            >
              <Edit size={18} strokeWidth={2.5} />
              <span>Edit Style</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details & Metadata */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Stats Banner */}
          <div className="flex flex-wrap gap-4">
            {/* Status Toggle */}
            <div className={`flex items-center gap-2 px-4 py-2 border-2 border-[#0E0E10] rounded-sm font-bold text-sm shadow-[2px_2px_0_#0E0E10] ${isEditing ? 'bg-gray-100' : 'bg-white'}`}>
              {isEditing ? (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="w-4 h-4 accent-[#4B3AFF] cursor-pointer"
                  />
                  Status Active
                </label>
              ) : style.isActive ? (
                <><CheckCircle size={16} className="text-[#00D084]" /> Active</>
              ) : (
                <><XCircle size={16} className="text-[#FF4D6D]" /> Inactive</>
              )}
            </div>

            {/* Cost Input */}
            <div className={`flex items-center gap-2 px-4 py-2 border-2 border-[#0E0E10] rounded-sm font-bold text-sm shadow-[2px_2px_0_#0E0E10] ${isEditing ? 'bg-gray-100' : 'bg-white'}`}>
              <Coins size={16} className="text-[#4B3AFF]" />
              {isEditing ? (
                <input 
                  type="number"
                  min="1"
                  value={formData.generationCost}
                  onChange={(e) => setFormData({...formData, generationCost: e.target.value})}
                  className="w-16 bg-transparent outline-none border-b border-[#0E0E10]"
                />
              ) : (
                <span>Cost: {style.generationCost}</span>
              )}
            </div>

            {/* Slug Input */}
            <div className={`flex items-center gap-2 px-4 py-2 border-2 border-[#0E0E10] rounded-sm font-bold text-sm shadow-[2px_2px_0_#0E0E10] ${isEditing ? 'bg-gray-100' : 'bg-white text-gray-500'}`}>
              {isEditing ? (
                <>
                  <span className="text-gray-500">/</span>
                  <input 
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    className="w-32 sm:w-48 bg-transparent outline-none border-b border-[#0E0E10] text-[#0E0E10]"
                  />
                </>
              ) : (
                <span>Slug: /{style.slug}</span>
              )}
            </div>
          </div>

          {/* Primary Text Data */}
          <div className="bg-white border-2 border-[#0E0E10] rounded-sm shadow-[6px_6px_0_#0E0E10] p-6 space-y-6 transition-all">
            
            {/* System Prompt */}
            <div>
              <h2 className="font-extrabold text-lg mb-2 border-b-2 border-[#0E0E10] pb-1 inline-block">System Prompt</h2>
              {isEditing ? (
                <textarea
                  rows={4}
                  value={formData.prompt}
                  onChange={(e) => setFormData({...formData, prompt: e.target.value})}
                  className="w-full mt-2 p-3 bg-[#FAFAF8] border-2 border-[#0E0E10] rounded-sm focus:outline-none focus:shadow-[4px_4px_0_#4B3AFF] font-mono text-sm font-semibold resize-none"
                />
              ) : (
                <div className="bg-[#FAFAF8] border-2 border-[#0E0E10] rounded-sm p-4 mt-2">
                  <p className="font-mono text-sm text-[#4B3AFF] whitespace-pre-wrap break-words font-semibold">
                    {style.prompt}
                  </p>
                </div>
              )}
            </div>

            {/* Usage Advice */}
            <div>
              <h2 className="font-extrabold text-lg mb-2 border-b-2 border-[#0E0E10] pb-1 inline-block">Usage Advice</h2>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.advice || ''}
                  onChange={(e) => setFormData({...formData, advice: e.target.value})}
                  className="w-full p-2.5 mt-2 bg-[#FFF5D1] border-2 border-[#FFC93C] text-gray-800 rounded-sm focus:outline-none focus:border-[#0E0E10] font-semibold"
                  placeholder="Leave blank if none..."
                />
              ) : style.advice && (
                <p className="font-medium text-gray-700 bg-[#FFF5D1] border-2 border-[#FFC93C] p-3 rounded-sm mt-2">
                  {style.advice}
                </p>
              )}
            </div>

            {/* Tags */}
            <div>
              <h2 className="font-extrabold text-lg mb-3 flex items-center gap-2">
                <Tag size={18} /> Tags
              </h2>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="w-full p-2.5 bg-[#FAFAF8] border-2 border-[#0E0E10] rounded-sm focus:outline-none focus:shadow-[4px_4px_0_#4B3AFF] font-semibold"
                  placeholder="sci-fi, neon, cyberpunk (comma separated)"
                />
              ) : style.tags && style.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {style.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-[#0E0E10] text-white text-xs font-bold rounded-sm uppercase tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm font-semibold">No tags assigned.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Image Gallery (Display Only in this phase) */}
        <div className="lg:col-span-1">
          <div className={`bg-white border-2 border-[#0E0E10] rounded-sm p-6 sticky top-6 transition-all ${isEditing ? 'opacity-50 grayscale shadow-none' : 'shadow-[6px_6px_0_#0E0E10]'}`}>
            <div className="flex justify-between items-center mb-4 border-b-2 border-[#0E0E10] pb-2">
              <h2 className="font-extrabold text-xl">Images ({style.images.length})</h2>
              {isEditing && <span className="text-xs font-bold bg-[#0E0E10] text-white px-2 py-1 rounded-sm">Locked</span>}
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              {style.images.map((image, index) => (
                <div 
                  key={index} 
                  className="relative aspect-square border-2 border-[#0E0E10] rounded-sm overflow-hidden bg-gray-100 shadow-[3px_3px_0_#0E0E10]"
                >
                  <img
                    src={image}
                    alt={`${style.styleName} reference ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-white border-2 border-[#0E0E10] text-[#0E0E10] text-xs font-bold w-6 h-6 flex items-center justify-center rounded-sm">
                    {index + 1}
                  </div>
                </div>
              ))}
              
              {style.images.length === 0 && (
                <div className="aspect-square border-2 border-dashed border-gray-300 rounded-sm flex items-center justify-center bg-gray-50 text-gray-400 font-semibold text-sm">
                  No images attached
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}