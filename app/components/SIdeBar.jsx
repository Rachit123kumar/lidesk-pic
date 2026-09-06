'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ImageIcon,
  History,
  CreditCard,
  User,
  Settings,
  LogOut,
  Coins,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Camera
} from 'lucide-react';

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { name: 'Generate images', icon: ImageIcon, active: true, href: '/dashboard' },
    { name: 'History', icon: History, active: false, href: '/history' },
    { name: 'Payments', icon: CreditCard, active: false, href: '/payment' },
    { name: 'Membership', icon: User, active: false, href: '/membership' },
    { name: 'Settings', icon: Settings, active: false, href: '/setting' },
  ];

  return (
    <>
      {/* Mobile Top Navigation Bar */}
      <div className="lg:hidden fixed top-0 w-full bg-[#FAFAF8] border-b-2 border-[#0E0E10] px-4 py-2.5 flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 flex items-center justify-center bg-[#0E0E10] rounded-sm">
            <Camera size={13} strokeWidth={2} className="text-[#FAFAF8]" />
          </div>
          <span className="font-bold font-['Space_Grotesk',_sans-serif] text-sm text-[#0E0E10]">
            LibDesk
          </span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 bg-white border-2 border-[#0E0E10] rounded-sm transition-all active:translate-y-0.5 shadow-[2px_2px_0_#0E0E10] active:shadow-none"
        >
          {isMobileMenuOpen ? <X size={18} strokeWidth={2} /> : <Menu size={18} strokeWidth={2} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-[#0E0E10]/20 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar (Desktop Static / Mobile Drawer) */}
      <aside
        className={`fixed lg:static top-0 left-0 h-[100vh] max-h-[100vh] bg-[#FAFAF8] border-r-2 border-[#0E0E10] flex flex-col p-4 sm:p-5 font-['Inter',_sans-serif] z-50 transition-all duration-300 ease-in-out overflow-x-hidden
          ${isCollapsed ? 'lg:w-[84px]' : 'lg:w-60'}
          ${isMobileMenuOpen ? 'translate-x-0 pt-20 w-64' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo and Collapse Toggle Row (Desktop Only) */}
        <div className="hidden lg:flex items-center justify-between mb-6 min-h-[32px]">
          
          {/* Logo with smooth CSS expansion */}
          <div 
            className={`flex items-center overflow-hidden transition-all duration-300 ease-in-out ${
              isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[150px] opacity-100'
            }`}
          >
            <div className="w-7 h-7 flex items-center justify-center bg-[#0E0E10] rounded-sm shrink-0">
              <Camera size={14} strokeWidth={2} className="text-[#FAFAF8]" />
            </div>
            <span className="font-bold font-['Space_Grotesk',_sans-serif] text-base text-[#0E0E10] whitespace-nowrap pl-2.5">
              LibDesk
            </span>
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 bg-white border-2 border-[#0E0E10] rounded-sm transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#0E0E10] active:translate-y-0.5 active:shadow-none shadow-[2px_2px_0_#0E0E10] shrink-0"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={16} strokeWidth={2} /> : <ChevronLeft size={16} strokeWidth={2} />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2.5 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="block">
              <div
                className={`flex items-center p-2.5 border-2 border-[#0E0E10] rounded-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#0E0E10] active:translate-y-0.5 active:shadow-none font-semibold text-sm cursor-pointer shadow-[3px_3px_0_#0E0E10]
                  ${item.active ? 'bg-[#4B3AFF] text-white' : 'bg-white text-[#0E0E10]'}
                `}
              >
                <item.icon strokeWidth={2} size={17} className="shrink-0" />
                
                {/* Text with CSS expansion logic */}
                <span 
                  className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                    isCollapsed ? 'max-w-0 opacity-0 pl-0' : 'max-w-[200px] opacity-100 pl-2.5'
                  }`}
                >
                  {item.name}
                </span>
              </div>
            </Link>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="space-y-2.5 mt-6 pt-6 border-t-2 border-[#0E0E10] overflow-x-hidden">
          <div
            className={`flex items-center p-2.5 bg-white border-2 border-[#0E0E10] rounded-sm font-semibold text-sm text-[#0E0E10] shadow-[3px_3px_0_#0E0E10]`}
          >
            <Coins strokeWidth={2} size={17} className="text-[#FFC93C] shrink-0" />
            <span 
              className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                isCollapsed ? 'max-w-0 opacity-0 pl-0' : 'max-w-[200px] opacity-100 pl-2.5'
              }`}
            >
              35 coins
            </span>
          </div>

          <button
            className={`w-full flex items-center p-2.5 bg-white border-2 border-[#0E0E10] rounded-sm font-semibold text-sm text-[#0E0E10] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#0E0E10] active:translate-y-0.5 active:shadow-none shadow-[3px_3px_0_#0E0E10]`}
          >
            <LogOut strokeWidth={2} size={17} className="text-[#FF4D6D] shrink-0" />
            <span 
              className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                isCollapsed ? 'max-w-0 opacity-0 pl-0' : 'max-w-[200px] opacity-100 pl-2.5'
              }`}
            >
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}