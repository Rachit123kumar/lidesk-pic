'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Sparkles,
  HelpCircle
} from 'lucide-react';

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', icon: ImageIcon, href: '/admin-bittu' },
    { name: 'Styles', icon: History, href: '/admin-bittu/styles' },
    { name: 'Generate images', icon: Sparkles, href: '/admin-bittu/generated-images' },
    { name: 'Users', icon: User, href: '/admin-bittu/users' },
    { name: 'Payments', icon: CreditCard, href: '/admin-bittu/payment' },
    { name: 'Settings', icon: Settings, href: '/admin-bittu/settings' },
    { name: 'Help', icon: HelpCircle, href: '/admin-bittu/support' },
  ];

  return (
    <>
      {/* Mobile Top Navigation Bar */}
      <div className="lg:hidden fixed top-0 w-full bg-[#09090b]/80 backdrop-blur-xl border-b border-white/[0.08] px-5 py-3 flex justify-between items-center z-[60]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg shadow-blue-500/20">
            <Sparkles size={16} strokeWidth={2.5} className="text-white" />
          </div>
          <span className="font-semibold text-white tracking-tight">
            LibDesk
          </span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[50] lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Sidebar (Desktop Static / Mobile Drawer) */}
      <aside
        className={`fixed lg:static top-0 left-0 h-[100vh] max-h-[100vh] bg-[#09090b]/95 backdrop-blur-xl border-r border-white/[0.08] flex flex-col p-4 z-[70] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-x-hidden shadow-2xl lg:shadow-none
          ${isCollapsed ? 'lg:w-[80px]' : 'lg:w-[260px]'}
          ${isMobileMenuOpen ? 'translate-x-0 pt-20 w-[260px]' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo and Collapse Toggle Row (Desktop Only) */}
        <div className="hidden lg:flex items-center justify-between mb-8 mt-2 px-2">
          <div
            className={`flex items-center overflow-hidden transition-all duration-300 ease-in-out ${
              isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[150px] opacity-100'
            }`}
          >
            <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg shadow-blue-500/20 shrink-0">
              <Sparkles size={16} strokeWidth={2.5} className="text-white" />
            </div>
            <span className="font-semibold text-white tracking-tight whitespace-nowrap pl-3">
              LibDesk
            </span>
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-md transition-colors shrink-0"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            
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
                    className={`shrink-0 transition-transform duration-200 ${!isActive && 'group-hover:scale-110'} ${isCollapsed && 'mx-auto'}`} 
                  />
                  
                  <span
                    className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out font-medium text-[14px] ${
                      isCollapsed 
                        ? 'max-w-0 opacity-0 pl-0 lg:max-w-0 lg:opacity-0' 
                        : 'max-w-[200px] opacity-100 pl-3'
                    }`}
                  >
                    {item.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="space-y-2 mt-6 pt-6 border-t border-white/[0.08] overflow-x-hidden">
          
          {/* Premium Token/Coin Badge */}
          <div
            className={`flex items-center px-3 py-2.5 bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-xl transition-all ${
              isCollapsed && 'justify-center'
            }`}
          >
            <Coins strokeWidth={2} size={18} className="text-amber-400 shrink-0 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]" />
            <span
              className={`whitespace-nowrap overflow-hidden transition-all duration-300 font-semibold text-[13px] text-amber-400 ${
                isCollapsed 
                  ? 'max-w-0 opacity-0 pl-0 lg:max-w-0 lg:opacity-0' 
                  : 'max-w-[200px] opacity-100 pl-3'
              }`}
            >
              35 Credits
            </span>
          </div>

          {/* Logout Button */}
          <button
            className={`w-full flex items-center px-3 py-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group ${
              isCollapsed && 'justify-center'
            }`}
          >
            <LogOut strokeWidth={2} size={18} className="shrink-0 transition-transform group-hover:-translate-x-1" />
            <span
              className={`whitespace-nowrap overflow-hidden transition-all duration-300 font-medium text-[14px] ${
                isCollapsed 
                  ? 'max-w-0 opacity-0 pl-0 lg:max-w-0 lg:opacity-0' 
                  : 'max-w-[200px] opacity-100 pl-3'
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