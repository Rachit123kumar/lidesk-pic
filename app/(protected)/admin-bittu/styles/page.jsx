'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function StylesPage() {
  const [styles, setStyles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/styles');
        const data = await response.json();
        if (data.success) {
          setStyles(data.styles);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#0E0E10] p-6 lg:p-10 font-['Space_Grotesk',_sans-serif] w-full">
      {/* Header section based on wireframe */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight">Styles Page</h1>
        
        <Link 
          href="/admin-bittu/styles/create" 
          className="flex items-center gap-2 px-6 py-3 bg-[#4B3AFF] text-white border-2 border-[#0E0E10] rounded-sm font-bold transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_#0E0E10] active:translate-y-0 active:shadow-none shadow-[4px_4px_0_#0E0E10]"
        >
          <Plus size={20} strokeWidth={3} />
          <span>Create Style</span>
        </Link>
      </div>

      {/* Grid Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Loader2 className="animate-spin text-[#4B3AFF]" size={40} strokeWidth={3} />
          <p className="font-bold animate-pulse">Loading styles...</p>
        </div>
      ) : styles.length === 0 ? (
        <div className="w-full p-10 border-2 border-dashed border-[#0E0E10] rounded-sm text-center bg-white">
           <p className="font-bold text-lg text-gray-500">No styles found. Create one to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-8 pb-10">
          {styles.map((style) => (
            <div key={style.id} className="flex flex-col gap-3 group">
              {/* Card Image Wrapper (Tall layout from wireframe) */}
              <div className="aspect-[2/3] w-full bg-white border-2 border-[#0E0E10] rounded-sm overflow-hidden shadow-[4px_4px_0_#0E0E10] transition-all duration-200 group-hover:-translate-y-2 group-hover:shadow-[8px_8px_0_#0E0E10] cursor-pointer">
                {style.images && style.images.length > 0 ? (
                  <img 
                    src={style.images[0]} 
                    alt={style.styleName} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400 gap-2">
                    <ImageIcon size={32} strokeWidth={1.5} />
                    <span className="text-xs font-semibold">No Image</span>
                  </div>
                )}
              </div>
              
              {/* Style Name Badge (Wireframe accurate) */}
              <div className="text-center px-3 py-2 bg-white border-2 border-[#0E0E10] rounded-sm font-bold text-sm shadow-[2px_2px_0_#0E0E10] truncate">
                {style.styleName}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}