'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  ImageIcon,
  History,
  CreditCard,
  Upload,
  LogOut,
  Coins,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
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
    { name: 'Credits', icon: Coins, href: '/credits' },
    { name: 'Upload', icon: Upload, href: '/upload' },
    { name: 'help', icon: HelpCircle, href: '/help' },
  
  ];

  return (
    <>
      {/* Mobile Top Navigation Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/[0.08] px-5 flex justify-between items-center z-40">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg shadow-inner overflow-hidden">
            <Image
              src="/logo1.png"
              alt="Libdesk"
              width={24}
              height={24}
              className="object-cover"
            />
          </div>
          <span className="font-semibold tracking-tight text-white text-lg">
            LibDesk
          </span>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <Menu size={20} strokeWidth={2} />
        </button>
      </div>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Sidebar - Desktop Static / Mobile Drawer */}
      <aside
        className={`fixed lg:static top-0 left-0 h-[100dvh] bg-[#09090b]/95 backdrop-blur-xl border-r border-white/[0.08] flex flex-col font-sans z-50 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-x-hidden shadow-2xl lg:shadow-none
          ${isCollapsed ? 'lg:w-[80px]' : 'lg:w-[260px]'}
          ${isMobileMenuOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Mobile Drawer Header */}
        <div className="flex lg:hidden items-center justify-between p-5 border-b border-white/[0.08] mb-2">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg shadow-inner overflow-hidden shrink-0">
              <Image
                src="/logo1.png"
                alt="Libdesk"
                width={24}
                height={24}
                className="object-cover"
              />
            </div>
            <span className="font-semibold tracking-tight text-white text-base">
              LibDesk
            </span>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Desktop Logo and Collapse Toggle Row */}
        <div className="hidden lg:flex items-center justify-between p-5 mb-2 mt-2">
          <Link 
            href="/"
            className={`flex items-center overflow-hidden transition-all duration-300 ease-in-out ${
              isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[150px] opacity-100'
            }`}
          >
            <div className="w-8 h-8 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg shadow-inner overflow-hidden shrink-0">
              <Image
                src="/logo1.png"
                alt="Libdesk"
                width={24}
                height={24}
                className="object-cover"
              />
            </div>
            <span className="font-semibold tracking-tight text-white text-base whitespace-nowrap pl-3">
              LibDesk
            </span>
          </Link>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-md transition-colors shrink-0"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto overflow-x-hidden px-3 lg:px-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            
            return (
              <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="block">
                <div
                  className={`flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group relative
                    ${isActive 
                      ? 'bg-blue-500/10 text-blue-400' 
                      : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                    }
                  `}
                >
                  {/* Active Indicator Line */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                  )}

                  <item.icon 
                    strokeWidth={isActive ? 2.5 : 2} 
                    size={18} 
                    className={`shrink-0 transition-transform duration-200 ${!isActive && 'group-hover:scale-110'} ${isCollapsed && 'lg:mx-auto'}`} 
                  />
                  
                  <span
                    className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out font-medium text-[14px]
                      ${isCollapsed ? 'lg:max-w-0 lg:opacity-0 lg:pl-0' : 'lg:max-w-[200px] lg:opacity-100 lg:pl-3'}
                      max-w-[200px] opacity-100 pl-3
                    `}
                  >
                    {item.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="mt-auto p-4 border-t border-white/[0.08] overflow-x-hidden shrink-0 z-10">
          <button 
            onClick={() => signOut({ callbackUrl: '/' })} 
            className={`w-full flex items-center px-3 py-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group
              ${isCollapsed && 'lg:justify-center'}
            `}
          >
            <LogOut strokeWidth={2} size={18} className="shrink-0 transition-transform group-hover:-translate-x-1" />
            <span 
              className={`whitespace-nowrap overflow-hidden transition-all duration-300 font-medium text-[14px]
                ${isCollapsed ? 'lg:max-w-0 lg:opacity-0 lg:pl-0' : 'lg:max-w-[200px] lg:opacity-100 lg:pl-3'}
                max-w-[200px] opacity-100 pl-3
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