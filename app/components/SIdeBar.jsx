'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  ImageIcon,
  History,
  CreditCard,
  User,
  Upload,
  Settings,
  LogOut,
  Coins,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Camera
} from 'lucide-react';
import Image from 'next/image';

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const pathname = usePathname(); 

  const navItems = [
    { name: 'Generate images', icon: ImageIcon, href: '/dashboard' },
    { name: 'History', icon: History, href: '/history' },
    { name: 'Buy coins', icon: CreditCard, href: '/payment' },
    { name: 'credits', icon: Coins, href: '/credits' },
    
    { name: 'Upload', icon: Upload, href: '/upload' },
  ];

  return (
    <>
      {/* Mobile Top Navigation Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#FAFAF8] border-b-2 border-[#0E0E10] px-4 flex justify-between items-center z-40">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center bg-[#0E0E10] rounded-sm">
            <div className="rounded-lg">
              <Image
                src="/logo1.png"
                alt="Libdesk"
                width={24}
                height={24}
                className="rounded-lg"
              />
            </div>
          </div>
          <span className="font-bold font-['Space_Grotesk',_sans-serif] text-lg text-[#0E0E10]">
            LibDesk
          </span>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 bg-white border-2 border-[#0E0E10] rounded-sm transition-all active:translate-y-0.5 shadow-[2px_2px_0_#0E0E10] active:shadow-none"
        >
          <Menu size={20} strokeWidth={2} color="#0E0E10" />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-[#0E0E10]/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Changed h-screen to h-[100dvh] for perfect mobile sizing */}
      <aside
        className={`fixed lg:static top-0 left-0 h-[100dvh] bg-[#FAFAF8] border-r-2 border-[#0E0E10] flex flex-col font-['Inter',_sans-serif] z-50 transition-all duration-300 ease-in-out overflow-x-hidden
          ${isCollapsed ? 'lg:w-[84px]' : 'lg:w-64'}
          ${isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Mobile Drawer Header */}
        <div className="flex lg:hidden items-center justify-between p-4 border-b-2 border-[#0E0E10] mb-4">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center bg-[#0E0E10] rounded-sm shrink-0">
              <div className="rounded-lg">
                <Image
                  src="/logo1.png"
                  alt="Libdesk"
                  width={24}
                  height={24}
                  className="rounded-lg"
                />
              </div>
            </div>
            <span className="font-bold font-['Space_Grotesk',_sans-serif] text-base text-[#0E0E10]">
              LibDesk
            </span>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1.5 bg-white border-2 border-[#0E0E10] rounded-sm transition-all active:translate-y-0.5 shadow-[2px_2px_0_#0E0E10] active:shadow-none"
          >
            <X size={18} strokeWidth={2} color="#0E0E10" />
          </button>
        </div>

        {/* Desktop Logo and Collapse Toggle Row */}
        <div className="hidden lg:flex items-center justify-between p-5 mb-2 min-h-[32px]">
          <Link 
            href="/"
            className={`flex items-center overflow-hidden transition-all duration-300 ease-in-out ${
              isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[150px] opacity-100'
            }`}
          >
            <div className="w-7 h-7 flex items-center justify-center bg-[#0E0E10] rounded-sm shrink-0">
              <div className="rounded-lg">
                <Image
                  src="/logo1.png"
                  alt="Libdesk"
                  width={24}
                  height={24}
                  className="rounded-lg"
                />
              </div>
            </div>
            <span className="font-bold font-['Space_Grotesk',_sans-serif] text-base text-[#0E0E10] whitespace-nowrap pl-2.5">
              LibDesk
            </span>
          </Link>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 bg-white border-2 border-[#0E0E10] rounded-sm transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#0E0E10] active:translate-y-0.5 active:shadow-none shadow-[2px_2px_0_#0E0E10] shrink-0"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={16} strokeWidth={2} color="#0E0E10"/> : <ChevronLeft size={16} strokeWidth={2} color="#0E0E10" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2.5 overflow-y-auto overflow-x-hidden px-4 lg:px-5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            
            return (
              <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="block">
                <div
                  className={`flex items-center p-2.5 border-2 border-[#0E0E10] rounded-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#0E0E10] active:translate-y-0.5 active:shadow-none font-semibold text-sm cursor-pointer shadow-[3px_3px_0_#0E0E10]
                    ${isActive ? 'bg-[#4B3AFF] text-white' : 'bg-white text-[#0E0E10]'}
                  `}
                >
                  <item.icon strokeWidth={2} size={17} className="shrink-0" />
                  
                  <span 
                    className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out
                      ${isCollapsed ? 'lg:max-w-0 lg:opacity-0 lg:pl-0' : 'lg:max-w-[200px] lg:opacity-100 lg:pl-2.5'}
                      max-w-[200px] opacity-100 pl-2.5
                    `}
                  >
                    {item.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions - Changed mt-6 to mt-auto to anchor it properly */}
        <div className="mt-auto p-4 lg:p-5 border-t-2 border-[#0E0E10] overflow-x-hidden bg-[#FAFAF8] z-10 shrink-0">
          <button 
            onClick={() => signOut({ callbackUrl: '/' })} 
            className="w-full flex items-center p-2.5 bg-white border-2 border-[#0E0E10] rounded-sm font-semibold text-sm text-[#0E0E10] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#0E0E10] active:translate-y-0.5 active:shadow-none shadow-[3px_3px_0_#0E0E10]"
          >
            <LogOut strokeWidth={2} size={17} className="text-[#FF4D6D] shrink-0" />
            <span 
              className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out
                ${isCollapsed ? 'lg:max-w-0 lg:opacity-0 lg:pl-0' : 'lg:max-w-[200px] lg:opacity-100 lg:pl-2.5'}
                max-w-[200px] opacity-100 pl-2.5
              `}
            >
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}