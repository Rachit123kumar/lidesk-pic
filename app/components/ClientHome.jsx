'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import {
  ImageIcon,
  Upload,
  Zap,
  CheckCircle2,
  Menu,
  X,
  Settings,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { Space_Grotesk, Inter } from 'next/font/google';
import { useRouter } from 'next/navigation';
import Footer from './footer'

const display = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-display',
});

const body = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
});

// --- DATA ---
const FORMATS = ['JPG', 'PNG', 'WEBP'];

const STEPS = [
  { title: 'Upload your photo', desc: 'A clear selfie is enough — no studio, no lighting kit required.', icon: Upload },
  { title: 'Choose a look', desc: 'Professional, cinematic, festive — pick from ten finished styles.', icon: ImageIcon },
  { title: 'Download & share', desc: 'Studio-quality portraits, ready in seconds, yours to keep.', icon: CheckCircle2 },
];

const GALLERY_IMAGES = [
  { id: 1, style: 'Cyberpunk', height: 'h-96', url: 'https://pub-105fec70566540d1a4cf3698e960bfa4.r2.dev/generations/cmtm1dnh00000w0vo5mdmenl6/cmtyjm72u00058wvo0ztkkb16.jpg' },
  { id: 2, style: 'Professional', height: 'h-64', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80' },
  { id: 3, style: 'Hollywood', height: 'h-80', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80' },
  { id: 4, style: 'Vintage', width:'w-72', url: 'https://pub-105fec70566540d1a4cf3698e960bfa4.r2.dev/generations/cmtm1dnh00000w0vo5mdmenl6/cmtyjail100038wvob3bwjrkm.webp' },
  { id: 7, style: 'Modern', width:'w-72', url: 'https://pub-105fec70566540d1a4cf3698e960bfa4.r2.dev/generations/cmtm1dnh00000w0vo5mdmenl6/cmtzvuqnx000004l4wtbpz797.jpg' },
  { id: 8, style: 'Royal', height: 'h-96', url: 'https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=600&q=80' },
  { id: 9, style: 'Tinder Charm', height: 'h-72', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=80' },
  { id: 11, style: 'Cyberpunk', width:'w-92', url: 'https://pub-105fec70566540d1a4cf3698e960bfa4.r2.dev/generations/cmtm1dnh00000w0vo5mdmenl6/cmtyjm72u00058wvo0ztkkb16.jpg' },
  { id: 12, style: 'Professional', height: 'h-96', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80' }
];

const HERO_POLAROIDS = [
  { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80', color: '#4B3AFF', rotate: -8, label: 'Hollywood' },
  { url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80', color: '#FF4D6D', rotate: 5, label: 'Professional' },
  { url: 'https://pub-105fec70566540d1a4cf3698e960bfa4.r2.dev/generations/cmtm1dnh00000w0vo5mdmenl6/cmtykq4wg000a8wvo1fqhv42q.jpg', color: '#FFC93C', rotate: -3, label: 'Pop Star' },
];

const INPUT_SELFIES = [
  'https://pub-105fec70566540d1a4cf3698e960bfa4.r2.dev/styles/482b7b3e-1d29-4fb9-accb-a27c4ae6128c.jpg',
  'https://pub-105fec70566540d1a4cf3698e960bfa4.r2.dev/styles/d14b5a27-3900-4b37-87dd-bc8902129bd3.png'
];

const GENERATED_OUTPUTS = [
  { id: 1, url: 'https://pub-105fec70566540d1a4cf3698e960bfa4.r2.dev/generations/cmtm1dnh00000w0vo5mdmenl6/cmtygy5h2000004lhj24opzg3.webp', aspect: 'aspect-[3/4]', style: 'Professional', color: '#4B3AFF' },
  { id: 2, url: 'https://pub-105fec70566540d1a4cf3698e960bfa4.r2.dev/generations/cmtm1dnh00000w0vo5mdmenl6/cmu5k66ub000104l2wqxr06na.jpg', aspect: 'aspect-[4/5]', style: 'Hollywood', color: '#FF4D6D' },
  { id: 3, url: 'https://pub-105fec70566540d1a4cf3698e960bfa4.r2.dev/generations/cmtm1dnh00000w0vo5mdmenl6/cmu0hje0400007gvor05hvaa8.jpg', aspect: 'aspect-square', style: 'Tinder Charm', color: '#FFC93C' },
  { id: 4, url: 'https://pub-105fec70566540d1a4cf3698e960bfa4.r2.dev/generations/cmtm1dnh00000w0vo5mdmenl6/cmtyjail100038wvob3bwjrkm.webp', aspect: 'aspect-[4/5]', style: 'Vintage', color: '#1FA774' },
  { id: 5, url: 'https://pub-105fec70566540d1a4cf3698e960bfa4.r2.dev/generations/cmtpsvcm9000004jgnlj82byo/cmu68jb76000004l268soawq7.jpg', aspect: 'aspect-[2/3]', style: 'Royal', color: '#4B3AFF' },
  { id: 6, url: 'https://pub-105fec70566540d1a4cf3698e960bfa4.r2.dev/generations/cmtm1dnh00000w0vo5mdmenl6/cmtyjm72u00058wvo0ztkkb16.jpg', aspect: 'aspect-square', style: 'Cyberpunk', color: '#FF4D6D' }
];

export default function ClientHome({ session }) {
  const router = useRouter(); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(FORMATS[0]);

  const [demoPhase, setDemoPhase] = useState(0); 
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let timer;
    if (demoPhase === 0) {
      setUploadProgress(0);
      timer = setTimeout(() => setDemoPhase(1), 1500); 
    } else if (demoPhase === 1) {
      setTimeout(() => setUploadProgress(100), 100); 
      timer = setTimeout(() => setDemoPhase(2), 2500);
    } else if (demoPhase === 2) {
      timer = setTimeout(() => setDemoPhase(3), 1500);
    } else if (demoPhase === 3) {
      timer = setTimeout(() => setDemoPhase(0), 6000);
    }
    return () => clearTimeout(timer);
  }, [demoPhase]);

  const handleAuthClick = (e) => {
    e.preventDefault();
    if (session) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  return (
    <div
      className={`${display.variable} ${body.variable} min-h-screen bg-[#FAFAF8] text-[#0E0E10] selection:bg-[#4B3AFF] selection:text-white`}
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <style>{`
        html { scroll-behavior: smooth; scroll-padding-top: 88px; }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .masonry-item:nth-child(1) { animation: float 6s infinite ease-in-out; animation-delay: 0s; }
        .masonry-item:nth-child(2) { animation: float 7s infinite ease-in-out; animation-delay: 0.5s; }
        .masonry-item:nth-child(3) { animation: float 6.5s infinite ease-in-out; animation-delay: 1s; }
        .masonry-item:nth-child(4) { animation: float 7.5s infinite ease-in-out; animation-delay: 0.2s; }
        .masonry-item:nth-child(5) { animation: float 6s infinite ease-in-out; animation-delay: 0.8s; }
        .masonry-item:nth-child(6) { animation: float 8s infinite ease-in-out; animation-delay: 0.4s; }
      `}</style>

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 border-b-2 ${scrolled ? 'bg-[#FAFAF8] border-[#0E0E10]' : 'bg-transparent border-transparent'}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center bg-[#0E0E10] rounded-lg overflow-hidden">
              <Image src="/logo1.png" alt="Libdesk" width={32} height={32} />
            </div>
            <span className="text-lg" style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>LibDesk</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-[14px] font-medium">
            <a href="#how-it-works" className="hover:text-[#4B3AFF] transition-colors">How it works</a>
            <a href="#showcase" className="hover:text-[#4B3AFF] transition-colors">Demo</a>
            <a href="#gallery" className="hover:text-[#4B3AFF] transition-colors">Gallery</a>
            <a href="#pricing" className="hover:text-[#4B3AFF] transition-colors">Pricing</a>
            <a
              onClick={handleAuthClick}
              className="px-5 py-2.5 bg-[#4B3AFF] cursor-pointer text-white font-bold border-2 border-[#0E0E10] transition-transform hover:-translate-y-0.5"
              style={{ boxShadow: '3px 3px 0 #0E0E10' }}
            >
              {session ? "Go to desk" : "Get started"}
            </a>
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#FAFAF8] border-b-2 border-[#0E0E10] p-6 flex flex-col gap-5 font-medium">
            <a href="#how-it-works" onClick={() => setIsMenuOpen(false)}>How it works</a>
            <a href="#showcase" onClick={() => setIsMenuOpen(false)}>Demo</a>
            <a href="#gallery" onClick={() => setIsMenuOpen(false)}>Gallery</a>
            <a href="#pricing" onClick={() => setIsMenuOpen(false)}>Pricing</a>
            <a
              onClick={(e) => {
                setIsMenuOpen(false);
                handleAuthClick(e);
              }}
              className="mt-2 px-5 py-3 bg-[#4B3AFF] cursor-pointer text-white font-bold text-center border-2 border-[#0E0E10]"
              style={{ boxShadow: '3px 3px 0 #0E0E10' }}
            >
              {session ? "Go to desk" : "Get started"}
            </a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-24 md:pt-40 md:pb-28 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-6">
            <h1 className="text-[46px] md:text-[64px] leading-[1.02] mb-6" style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              Same you.<br />Ten new looks.
            </h1>
            <p className="text-[17px] text-[#4A473F] mb-9 max-w-md leading-relaxed">
              Upload one selfie, pick a style — professional, cinematic, festive, or seven more — and get studio-quality portraits back in seconds. Perfect for your resume or LinkedIn profile.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <a
                href="#how-it-works"
                className="px-7 py-3.5 bg-[#4B3AFF] text-white font-bold border-2 border-[#0E0E10] inline-flex items-center gap-2 transition-transform hover:-translate-y-0.5"
                style={{ boxShadow: '4px 4px 0 #0E0E10' }}
              >
                <Upload className="w-4 h-4" />
                Upload your photo
              </a>
              <a
                href="#gallery"
                className="px-7 py-3.5 bg-white text-[#0E0E10] font-bold border-2 border-[#0E0E10] inline-flex items-center gap-2 transition-transform hover:-translate-y-0.5"
                style={{ boxShadow: '4px 4px 0 #0E0E10' }}
              >
                View gallery
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 relative h-[360px] md:h-[420px]">
            {HERO_POLAROIDS.map((p, i) => (
              <div
                key={i}
                className="absolute bg-white border-2 border-[#0E0E10] p-3 pb-10 w-[190px] md:w-[220px]"
                style={{
                  boxShadow: '6px 6px 0 #0E0E10',
                  transform: `rotate(${p.rotate}deg)`,
                  top: i === 0 ? '0%' : i === 1 ? '18%' : '38%',
                  left: i === 0 ? '8%' : i === 1 ? '42%' : '4%',
                  zIndex: i,
                }}
              >
                <div className="w-full aspect-square overflow-hidden" style={{ background: p.color }}>
                  <img src={p.url} alt={p.label} className="w-full h-full object-cover mix-blend-luminosity opacity-90" />
                </div>
                <p className="absolute bottom-2 left-3 text-[13px] font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                  {p.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ANIMATED PIPELINE SHOWCASE */}
      <section id="showcase" className="py-24 border-t-2 border-[#0E0E10] px-6 bg-white overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 max-w-xl text-center mx-auto">
            <h2 className="text-3xl md:text-4xl mb-4" style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              One photo. Infinite possibilities.
            </h2>
            <p className="text-[#4A473F] text-[16px] leading-relaxed">
              Upload your selfies once. Our AI automatically renders dozens of studio-quality portraits in varying styles instantly.
            </p>
          </div>

          <div className="relative w-full h-[550px] md:h-[650px] border-2 border-[#0E0E10] bg-[#FAFAF8] shadow-[8px_8px_0_#0E0E10] overflow-hidden flex items-center justify-center">
            
            {/* PHASE 0 & 1 */}
            <div className={`absolute transition-all duration-700 ease-in-out flex flex-col items-center justify-center ${(demoPhase === 0 || demoPhase === 1) ? 'opacity-100 scale-100 z-20' : 'opacity-0 scale-75 pointer-events-none z-0'}`}>
              <div className="relative w-full max-w-[340px] h-[280px] mb-8 flex justify-center items-center">
                <div 
                  className={`absolute border-2 border-[#0E0E10] bg-white p-2.5 shadow-[4px_4px_0_#0E0E10] transition-all duration-1000 ease-in-out
                    ${demoPhase === 0 ? '-translate-x-[70px] -rotate-[10deg] scale-100' : 'translate-x-[15px] rotate-[8deg] scale-90 opacity-80'}`}
                  style={{ width: '170px', aspectRatio: '4/5', zIndex: 1 }}
                >
                  <img src={INPUT_SELFIES[1]} alt="Input 2" className="w-full h-full object-cover filter grayscale-[10%]" />
                  <div className="absolute -bottom-3 right-3 bg-[#FFC93C] text-[10px] font-bold border-2 border-[#0E0E10] px-2 py-1 rotate-[-6deg]">Selfie 2</div>
                </div>
                
                <div 
                  className={`absolute border-2 border-[#0E0E10] bg-white p-2.5 shadow-[6px_6px_0_#0E0E10] transition-all duration-1000 ease-in-out
                    ${demoPhase === 0 ? 'translate-x-[70px] rotate-[10deg] scale-100' : '-translate-x-[10px] -rotate-[4deg] scale-105'}`}
                  style={{ width: '170px', aspectRatio: '4/5', zIndex: 2 }}
                >
                  <img src={INPUT_SELFIES[0]} alt="Input 1" className="w-full h-full object-cover" />
                  <div className="absolute -top-3 -left-3 bg-[#4B3AFF] text-white text-[10px] font-bold border-2 border-[#0E0E10] px-2 py-1 rotate-[-12deg]">Your selfie</div>
                </div>
              </div>
              
              <div className={`transition-all duration-500 ease-in-out ${demoPhase === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="w-56 h-3 bg-white border-2 border-[#0E0E10] rounded-full overflow-hidden mx-auto">
                  <div className="h-full bg-[#4B3AFF]" style={{ width: `${uploadProgress}%`, transition: demoPhase === 1 ? 'width 2.4s linear' : 'none' }} />
                </div>
                <p className="mt-4 text-[14px] font-bold text-[#0E0E10] animate-pulse text-center" style={{ fontFamily: 'var(--font-display)' }}>
                  Uploading and analyzing...
                </p>
              </div>
            </div>

            {/* PHASE 2 */}
            <div className={`absolute transition-all duration-500 ease-in-out flex flex-col items-center justify-center ${demoPhase === 2 ? 'opacity-100 scale-100 z-20' : 'opacity-0 scale-110 pointer-events-none z-0'}`}>
              <Sparkles className="w-14 h-14 text-[#FFC93C] mb-4 animate-bounce" strokeWidth={2} />
              <h3 className="text-2xl font-bold text-[#0E0E10] text-center px-4" style={{ fontFamily: 'var(--font-display)' }}>
                Generating 6 unique styles...
              </h3>
            </div>

            {/* PHASE 3 */}
            <div className={`absolute inset-0 w-full h-full p-4 md:p-8 transition-all duration-700 ease-out flex items-center justify-center bg-[#FAFAF8] ${demoPhase === 3 ? 'opacity-100 scale-100 z-20' : 'opacity-0 scale-95 pointer-events-none z-0'}`}>
               <div className="w-full max-w-4xl columns-2 md:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6">
                 {GENERATED_OUTPUTS.map((out) => {
                   const textColor = out.color === '#FFC93C' ? '#0E0E10' : '#FFFFFF';
                   return (
                     <div key={out.id} className="masonry-item break-inside-avoid relative border-2 border-[#0E0E10] bg-white p-1.5 shadow-[4px_4px_0_#0E0E10] hover:-translate-y-1 transition-transform">
                     <img src={out.url} alt={out.style} className={`w-full ${out.aspect} object-cover object-top`} />
                        <div className="absolute bottom-2 left-2 text-[10px] md:text-[11px] font-bold border-2 border-[#0E0E10] px-2 py-1" style={{ background: out.color, color: textColor }}>
                          {out.style}
                        </div>
                     </div>
                   );
                 })}
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* MASONRY GALLERY */}
      <section id="gallery" className="py-24 border-t-2 border-[#0E0E10] px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14 max-w-xl">
            <h2 className="text-3xl md:text-4xl mb-4" style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              Recently generated
            </h2>
            <p className="text-[#4A473F] text-[16px] leading-relaxed">
              A running stream of results across every style, generated by people using LibDesk today.
            </p>
          </div>

          <div className="columns-2 md:columns-3 lg:columns-4 gap-5 space-y-5">
            {GALLERY_IMAGES.map((img) => (
              <div key={img.id} className="break-inside-avoid relative group overflow-hidden border-2 border-[#0E0E10] transition-transform hover:-translate-y-1" style={{ boxShadow: '4px 4px 0 #0E0E10' }}>
                <img src={img.url} alt={`${img.style} AI generated`} loading="lazy" className={`w-full ${img.height} object-cover`} />
                <div className="absolute bottom-0 left-0 right-0 bg-[#0E0E10] px-3 py-2 flex items-center justify-between">
                  <span className="text-white text-[12px] font-semibold">{img.style}</span>
                  <Zap className="w-3.5 h-3.5 text-[#FFC93C]" strokeWidth={2} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <a href="#pricing" className="px-7 py-3.5 bg-white border-2 border-[#0E0E10] font-bold inline-flex items-center gap-2 transition-transform hover:-translate-y-0.5" style={{ boxShadow: '4px 4px 0 #0E0E10' }}>
              Generate your own
            </a>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 border-t-2 border-[#0E0E10] px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14 max-w-xl">
            <h2 className="text-3xl md:text-4xl mb-4" style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              Three steps
            </h2>
            <p className="text-[#4A473F] text-[16px] leading-relaxed">
              From selfie to finished portrait, without leaving the browser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step, idx) => {
              const colors = ['#4B3AFF', '#FF4D6D', '#1FA774'];
              return (
                <div key={idx} className="bg-white p-7 border-2 border-[#0E0E10]" style={{ boxShadow: '5px 5px 0 #0E0E10' }}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-10 h-10 flex items-center justify-center border-2 border-[#0E0E10]" style={{ background: colors[idx] }}>
                      <step.icon className="w-5 h-5 text-white" strokeWidth={2} />
                    </div>
                    <span className="text-3xl" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: colors[idx] }}>
                      0{idx + 1}
                    </span>
                  </div>
                  <h3 className="text-lg mb-2" style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{step.title}</h3>
                  <p className="text-[#4A473F] text-[14px] leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 border-t-2 border-[#0E0E10] px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14 max-w-xl">
            <h2 className="text-3xl md:text-4xl mb-4" style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              Simple pricing. No subscription.
            </h2>
            <p className="text-[#4A473F] text-[16px] leading-relaxed">
              Buy credits once and use them whenever you need professional headshots. No monthly commitment.
            </p>
          </div>

          <div className="mb-14 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pb-8 border-b-2 border-[#0E0E10]">
            <div className="flex items-center gap-2 text-[14px] font-semibold">
              <Settings className="w-4 h-4 text-[#4B3AFF]" strokeWidth={2} />
              <span>Output format</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {FORMATS.map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setSelectedFormat(fmt)}
                  className="px-4 py-2 text-[13px] font-bold border-2 border-[#0E0E10] transition-all hover:-translate-y-0.5"
                  style={{
                    background: selectedFormat === fmt ? '#0E0E10' : '#FFFFFF',
                    color: selectedFormat === fmt ? '#FFFFFF' : '#0E0E10',
                  }}
                >
                  .{fmt}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Starter */}
            <div className="relative flex flex-col p-7 border-2 border-[#0E0E10] bg-white" style={{ boxShadow: '4px 4px 0 #0E0E10' }}>
              <div className="mb-7">
                <p className="text-[12px] font-bold uppercase tracking-wider text-[#4B3AFF] mb-2">Starter</p>
                <h3 className="text-2xl mb-2" style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>10 Credits</h3>
                <p className="text-[14px] text-[#4A473F] min-h-[42px]">Perfect for trying out your first professional headshots.</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl" style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>₹399</span>
                <span className="text-[13px] text-[#4A473F] ml-1">one-time</span>
              </div>
              <ul className="flex flex-col gap-3.5 mb-8 flex-grow text-[14px]">
                <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#4B3AFF]" /><span>10 coins</span></li>
                <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#4B3AFF]" /><span>Multiple professional styles</span></li>
                <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#4B3AFF]" /><span>High-quality output</span></li>
                <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#4B3AFF]" /><span>Credits never expire</span></li>
              </ul>
              <button onClick={handleAuthClick} className="w-full py-3.5 font-bold border-2 border-[#0E0E10] bg-[#0E0E10] text-white transition-transform hover:-translate-y-0.5">
                Get 10 Credits
              </button>
            </div>

            {/* Popular */}
            <div className="relative flex flex-col p-7 border-2 border-[#0E0E10]" style={{ background: '#4B3AFF', color: '#FFFFFF', boxShadow: '6px 6px 0 #0E0E10' }}>
              <span className="absolute -top-3 left-6 text-[11px] font-bold px-2.5 py-1 border-2 border-[#0E0E10]" style={{ background: '#FFC93C', color: '#0E0E10' }}>Most chosen</span>
              <div className="mb-7">
                <p className="text-[12px] font-bold uppercase tracking-wider text-[#FFC93C] mb-2">Popular</p>
                <h3 className="text-2xl mb-2" style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>25 Credits</h3>
                <p className="text-[14px] min-h-[42px] opacity-90">A balanced pack for creating several looks and profiles.</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl" style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>₹790</span>
                <span className="text-[13px] ml-1 opacity-80">one-time</span>
              </div>
              <ul className="flex flex-col gap-3.5 mb-8 flex-grow text-[14px]">
                <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#FFC93C]" /><span>25 AI headshot generations</span></li>
                <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#FFC93C]" /><span>All professional styles</span></li>
                <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#FFC93C]" /><span>Credits never expire</span></li>
              </ul>
              <button onClick={handleAuthClick} className="w-full py-3.5 font-bold border-2 border-[#0E0E10] bg-[#0E0E10] text-white transition-transform hover:-translate-y-0.5">
                Get 25 Credits
              </button>
            </div>

            {/* Pro */}
            <div className="relative flex flex-col p-7 border-2 border-[#0E0E10] bg-white" style={{ boxShadow: '4px 4px 0 #0E0E10' }}>
              <div className="mb-7">
                <p className="text-[12px] font-bold uppercase tracking-wider text-[#4B3AFF] mb-2">Pro</p>
                <h3 className="text-2xl mb-2" style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>50 Credits</h3>
                <p className="text-[14px] text-[#4A473F] min-h-[42px]">Great for frequent profile, portfolio and career updates.</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl" style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>₹1580</span>
                <span className="text-[13px] text-[#4A473F] ml-1">one-time</span>
              </div>
              <ul className="flex flex-col gap-3.5 mb-8 flex-grow text-[14px]">
                <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#4B3AFF]" /><span>50 AI headshot generations</span></li>
                <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#4B3AFF]" /><span>All professional styles</span></li>
                <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#4B3AFF]" /><span>Credits never expire</span></li>
              </ul>
              <button onClick={handleAuthClick} className="w-full py-3.5 font-bold border-2 border-[#0E0E10] bg-[#0E0E10] text-white transition-transform hover:-translate-y-0.5">
                Get 50 Credits
              </button>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-[13px] text-[#4A473F]">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#1FA774]" strokeWidth={2} />
              <span><span className="font-semibold text-[#0E0E10]">5 free credits</span> included when you create an account.</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-[#1FA774]" strokeWidth={2} />
              <span>Secure checkout. Card details are never stored.</span>
            </div>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}