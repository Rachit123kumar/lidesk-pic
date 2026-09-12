import React from 'react';
import Sidebar from '../../components/sideBarAdmin'; // Adjust the import path if your Sidebar is elsewhere

export default function AdminLayout({ children }) {
  return (
    // 1. Main Wrapper: Forces full screen height, flex layout, and unified background
    <div className="flex h-screen w-full bg-[#FAFAF8] overflow-hidden text-[#0E0E10]">
      
      {/* 2. The Sidebar Component */}
      <Sidebar />

      {/* 3. Main Content Area */}
      {/* flex-1 ensures it fills all remaining space, eliminating gaps. */}
      {/* overflow-y-auto ensures the page scrolls independently of a fixed sidebar. */}
      {/* pt-16 lg:pt-0 ensures content isn't hidden behind the mobile top-bar. */}
      <main className="flex-1 h-full overflow-y-auto bg-[#FAFAF8] relative pt-[60px] lg:pt-0">
        
        {/* Optional: Adds a very subtle grid pattern to the background for that premium developer tool feel */}
        <div 
          className="min-h-full w-full"
          style={{
            backgroundImage: 'radial-gradient(#E5E5E5 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        >
          {children}
        </div>
        
      </main>
    </div>
  );
}