import React from 'react';
import Sidebar from '../../components/SIdeBar';
import { CreditCard, Wrench } from 'lucide-react';

export default function PaymentPage() {
  return (
    <div className="flex h-screen w-full bg-[#FAFAF8] overflow-hidden font-['Inter',_sans-serif]">
      {/* Sidebar handles its own mobile/desktop state */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto pt-16 lg:pt-0 flex items-center justify-center p-4">
        
        {/* Neo-brutalist Placeholder Card */}
        <div className="max-w-md w-full bg-white border-2 border-[#0E0E10] rounded-sm shadow-[8px_8px_0_#0E0E10] p-8 text-center flex flex-col items-center transition-transform hover:-translate-y-1 hover:shadow-[10px_10px_0_#0E0E10] duration-200">
          
          {/* Icon Container */}
          <div className="w-16 h-16 bg-[#FFC93C] border-2 border-[#0E0E10] rounded-sm shadow-[4px_4px_0_#0E0E10] flex items-center justify-center mb-6 shrink-0">
            <CreditCard size={32} strokeWidth={2} className="text-[#0E0E10]" />
          </div>
          
          {/* Text Content */}
          <h1 className="text-3xl font-bold font-['Space_Grotesk',_sans-serif] text-[#0E0E10] mb-3">
            Payments
          </h1>
          <p className="text-[#0E0E10]/80 mb-8 font-medium leading-relaxed">
            We are currently building our secure payment infrastructure. Check back soon to top up your coin balance and unlock premium features!
          </p>
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 bg-[#FAFAF8] border-2 border-[#0E0E10] px-4 py-2 text-sm font-bold text-[#0E0E10] rounded-sm">
            <Wrench size={16} strokeWidth={2} className="text-[#4B3AFF]" />
            <span>Under Construction</span>
          </div>
          
        </div>
      </main>
    </div>
  );
}