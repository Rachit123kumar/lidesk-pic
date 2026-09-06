'use client';
import React, { useState, useEffect } from 'react';
import {
  Camera,
  Image as ImageIcon,
  Upload,
  Heart,
  Briefcase,
  Gift,
  Zap,
  Crown,
  Star,
  Rocket,
  Music,
  Glasses,
  MoveHorizontal,
  CheckCircle2,
  Menu,
  X,
  Mail,
  Settings,
  ShieldCheck,
  MapPin
} from 'lucide-react';
import { Space_Grotesk, Inter } from 'next/font/google';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Footer from './components/footer';

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

const STYLES = [
  { id: 1, name: 'Professional', icon: Briefcase, desc: 'Corporate headshots for LinkedIn & CVs.', color: '#4B3AFF' },
  { id: 2, name: 'Tinder Charm', icon: Heart, desc: 'Dressed sharp holding a red flower.', color: '#FF4D6D' },
  { id: 3, name: 'Santa Claus', icon: Gift, desc: 'Festive holiday portraits as Santa.', color: '#1FA774' },
  { id: 4, name: 'Cyberpunk', icon: Zap, desc: 'Neon lights and futuristic vibes.', color: '#4B3AFF' },
  { id: 5, name: 'Royal', icon: Crown, desc: 'Elegant renaissance and royal attire.', color: '#FFC93C' },
  { id: 6, name: 'Hollywood', icon: Star, desc: 'Red carpet ready glamorous shots.', color: '#FF4D6D' },
  { id: 7, name: 'Astronaut', icon: Rocket, desc: 'Exploring the cosmos in a spacesuit.', color: '#4B3AFF' },
  { id: 8, name: 'Pop Star', icon: Music, desc: 'Concert lighting and rockstar energy.', color: '#FF4D6D' },
  { id: 9, name: 'Vintage', icon: Camera, desc: 'Classic 90s film aesthetic.', color: '#FFC93C' },
  { id: 10, name: 'Academic', icon: Glasses, desc: 'Smart, scholarly look in a library.', color: '#1FA774' },
];

const FORMATS = ['JPG', 'PNG', 'WEBP'];

const PRICING_PLANS = [
  {
    name: 'Starter',
    price: '$9',
    description: 'A first set, to see if it fits you.',
    features: ['50 AI generated photos', '3 standard styles', 'Standard resolution', '24 hour delivery'],
    popular: false
  },
  {
    name: 'Premium',
    price: '$19',
    description: 'The set most people settle on.',
    features: ['200 AI generated photos', 'All 10 styles', '4K resolution', '1 hour delivery', 'No watermark'],
    popular: true
  },
  {
    name: 'Unlimited',
    price: '$49',
    description: 'For the particular and the prolific.',
    features: ['Unlimited photos', 'All current & future styles', '8K resolution', 'Instant generation', 'Commercial license'],
    popular: false
  }
];

const STEPS = [
  { title: 'Upload your photo', desc: 'A clear selfie is enough — no studio, no lighting kit required.', icon: Upload },
  { title: 'Choose a look', desc: 'Professional, cinematic, festive — pick from ten finished styles.', icon: ImageIcon },
  { title: 'Download & share', desc: 'Studio-quality portraits, ready in seconds, yours to keep.', icon: CheckCircle2 },
];

const GALLERY_IMAGES = [
  { id: 1, style: 'Cyberpunk', height: 'h-96', url: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&q=80' },
  { id: 2, style: 'Professional', height: 'h-64', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80' },
  { id: 3, style: 'Hollywood', height: 'h-80', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80' },
  { id: 4, style: 'Vintage', height: 'h-72', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&q=80' },
  { id: 5, style: 'Pop Star', height: 'h-96', url: 'https://images.unsplash.com/photo-1493225457224-2fae205565e3?w=600&q=80' },
  { id: 6, style: 'Academic', height: 'h-64', url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&q=80' },
  { id: 7, style: 'Astronaut', height: 'h-80', url: 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?w=600&q=80' },
  { id: 8, style: 'Royal', height: 'h-96', url: 'https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=600&q=80' },
  { id: 9, style: 'Tinder Charm', height: 'h-72', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=80' },
  { id: 10, style: 'Santa Claus', height: 'h-64', url: 'https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=600&q=80' },
  { id: 11, style: 'Cyberpunk', height: 'h-80', url: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=600&q=80' },
  { id: 12, style: 'Professional', height: 'h-96', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80' }
];

const HERO_POLAROIDS = [
  { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80', color: '#4B3AFF', rotate: -8, label: 'Hollywood' },
  { url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80', color: '#FF4D6D', rotate: 5, label: 'Professional' },
  { url: 'https://images.unsplash.com/photo-1493225457224-2fae205565e3?w=400&q=80', color: '#FFC93C', rotate: -3, label: 'Pop Star' },
];

// --- COMPONENTS ---

const InstagramIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
  </svg>
);

const PlaceholderImage = ({ type, styleName, accent }) => (
  <div
    className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
    style={{ background: type === 'before' ? '#EFEEE8' : accent || '#4B3AFF' }}
  >
    <ImageIcon className="w-10 h-10 mb-3" style={{ color: type === 'before' ? '#9A9585' : '#FFFFFF', opacity: type === 'before' ? 1 : 0.9 }} strokeWidth={1.5} />
    <span
      className="text-lg mb-1"
      style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: type === 'before' ? '#0E0E10' : '#FFFFFF' }}
    >
      {type === 'before' ? 'Original photo' : styleName}
    </span>
    <span className="text-xs max-w-xs" style={{ color: type === 'before' ? '#6B6656' : 'rgba(255,255,255,0.85)' }}>
      Place the {type === 'before' ? "user's selfie" : 'generated result'} here
    </span>
  </div>
);

export default function App() {
  const { data: session, status } = useSession();
  const router = useRouter(); // <--- This correctly initializes the router

  const [activeStyleIndex, setActiveStyleIndex] = useState(0);
  const activeStyle = STYLES[activeStyleIndex];

  const [sliderPos, setSliderPos] = useState(50);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState(FORMATS[0]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveStyleIndex((prev) => (prev + 1) % STYLES.length);
      setSliderPos(50);
    }, 3500);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Unified auth click handler to keep code clean and prevent router errors
  const handleAuthClick = (e) => {
    e.preventDefault();
    if (status === "loading") return; 
    
    if (status === "authenticated") {
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
      `}</style>

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 border-b-2 ${scrolled ? 'bg-[#FAFAF8] border-[#0E0E10]' : 'bg-transparent border-transparent'}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center bg-[#0E0E10]">
              <Camera className="w-4 h-4 text-[#FAFAF8]" strokeWidth={2} />
            </div>
            <span className="text-lg" style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>LibDesk</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-[14px] font-medium">
            <a href="#how-it-works" className="hover:text-[#4B3AFF] transition-colors">How it works</a>
            <a href="#styles" className="hover:text-[#4B3AFF] transition-colors">Demo</a>
            <a href="#gallery" className="hover:text-[#4B3AFF] transition-colors">Gallery</a>
            <a href="#pricing" className="hover:text-[#4B3AFF] transition-colors">Pricing</a>
            <a
              onClick={handleAuthClick}
              className={`px-5 py-2.5 bg-[#4B3AFF] cursor-pointer text-white font-bold border-2 border-[#0E0E10] transition-transform hover:-translate-y-0.5 ${status === 'loading' ? 'opacity-75 cursor-wait' : ''}`}
              style={{ boxShadow: '3px 3px 0 #0E0E10' }}
            >
              {status === "loading" ? "Loading..." : status === "authenticated" ? "Go to desk" : "Get started"}
            </a>
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#FAFAF8] border-b-2 border-[#0E0E10] p-6 flex flex-col gap-5 font-medium">
            <a href="#how-it-works" onClick={() => setIsMenuOpen(false)}>How it works</a>
            <a href="#styles" onClick={() => setIsMenuOpen(false)}>Demo</a>
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
              {status === "loading" ? "Loading..." : status === "authenticated" ? "Go to desk" : "Get started"}
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
              Upload one selfie, pick a style — professional, cinematic, festive, or seven more — and get studio-quality portraits back in seconds.
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

      {/* INTERACTIVE SHOWCASE */}
      <section id="styles" className="py-24 border-t-2 border-[#0E0E10] px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14 max-w-xl">
            <h2 className="text-3xl md:text-4xl mb-4" style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              Ten looks, one photo
            </h2>
            <p className="text-[#4A473F] text-[16px] leading-relaxed">
              Pick a style and drag the divider to compare the original against the render.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4 order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-2.5">
                {STYLES.map((style, idx) => {
                  const isActive = activeStyle.id === style.id;
                  return (
                    <button
                      key={style.id}
                      onClick={() => {
                        setActiveStyleIndex(idx);
                        setSliderPos(50);
                        setIsAutoPlaying(false);
                      }}
                      className="flex items-center gap-2 py-2.5 px-3 border-2 border-[#0E0E10] text-left transition-transform hover:-translate-y-0.5"
                      style={{
                        background: isActive ? style.color : '#FFFFFF',
                        color: isActive ? '#FFFFFF' : '#0E0E10',
                        boxShadow: isActive ? '3px 3px 0 #0E0E10' : 'none',
                      }}
                    >
                      <style.icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                      <span className="text-[13px] font-semibold">{style.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-8 order-1 lg:order-2">
              <div className="border-2 border-[#0E0E10]" style={{ boxShadow: '6px 6px 0 #0E0E10' }}>
                <div className="relative w-full aspect-[4/5] sm:aspect-video mx-auto overflow-hidden select-none max-h-[70vh]">
                  <div className="absolute inset-0 w-full h-full">
                    <PlaceholderImage type="before" />
                  </div>

                  <div
                    className="absolute inset-0 w-full h-full"
                    style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
                  >
                    <PlaceholderImage type="after" styleName={activeStyle.name} accent={activeStyle.color} />
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPos}
                    onChange={(e) => setSliderPos(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                    aria-label="Image comparison slider"
                  />

                  <div className="absolute top-0 bottom-0 w-1 bg-[#0E0E10] pointer-events-none z-10" style={{ left: `${sliderPos}%` }}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white border-2 border-[#0E0E10] flex items-center justify-center">
                      <MoveHorizontal className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="absolute top-4 left-4 bg-white text-[11px] font-bold px-2.5 py-1 pointer-events-none border-2 border-[#0E0E10]">
                    BEFORE
                  </div>
                  <div
                    className="absolute top-4 right-4 text-[11px] font-bold px-2.5 py-1 pointer-events-none border-2 border-[#0E0E10] text-white"
                    style={{ background: activeStyle.color }}
                  >
                    {activeStyle.name}
                  </div>
                </div>

                <div className="p-5 border-t-2 border-[#0E0E10] bg-white">
                  <h3 className="text-lg mb-1" style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{activeStyle.name}</h3>
                  <p className="text-[#4A473F] text-[14px]">{activeStyle.desc}</p>
                </div>
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
            <a
              href="#pricing"
              className="px-7 py-3.5 bg-white border-2 border-[#0E0E10] font-bold inline-flex items-center gap-2 transition-transform hover:-translate-y-0.5"
              style={{ boxShadow: '4px 4px 0 #0E0E10' }}
            >
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
              Pricing
            </h2>
            <p className="text-[#4A473F] text-[16px] leading-relaxed">
              Pay once, keep the results. No subscription.
            </p>
          </div>

          <div className="mb-14 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pb-8 border-b-2 border-[#0E0E10]">
            <div className="flex items-center gap-2 text-[14px] font-semibold">
              <Settings className="w-4 h-4 text-[#4B3AFF]" strokeWidth={2} />
              <span>Output format</span>
            </div>
            <div className="flex gap-2">
              {FORMATS.map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setSelectedFormat(fmt)}
                  className="px-4 py-2 text-[13px] font-bold border-2 border-[#0E0E10] transition-colors"
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING_PLANS.map((plan, idx) => (
              <div
                key={idx}
                className="relative flex flex-col p-8 border-2 border-[#0E0E10]"
                style={{
                  background: plan.popular ? '#4B3AFF' : '#FFFFFF',
                  color: plan.popular ? '#FFFFFF' : '#0E0E10',
                  boxShadow: plan.popular ? '6px 6px 0 #0E0E10' : '4px 4px 0 #0E0E10',
                }}
              >
                {plan.popular && (
                  <span
                    className="absolute -top-3 left-7 text-[11px] font-bold px-2.5 py-1 border-2 border-[#0E0E10]"
                    style={{ background: '#FFC93C', color: '#0E0E10' }}
                  >
                    Most chosen
                  </span>
                )}
                <h3 className="text-xl mb-1.5" style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{plan.name}</h3>
                <p className="text-[14px] mb-7 h-10" style={{ opacity: plan.popular ? 0.9 : 0.7 }}>{plan.description}</p>
                <div className="mb-8">
                  <span className="text-4xl" style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{plan.price}</span>
                </div>

                <ul className="flex flex-col gap-3.5 mb-8 flex-grow">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[14px]">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: plan.popular ? '#FFC93C' : '#4B3AFF' }} strokeWidth={2} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className="w-full py-3.5 font-bold border-2 border-[#0E0E10] transition-transform hover:-translate-y-0.5"
                  style={{ background: '#0E0E10', color: '#FFFFFF' }}
                >
                  Choose {plan.name}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-3 text-[13px] text-[#4A473F]">
            <ShieldCheck className="w-4 h-4 text-[#1FA774]" strokeWidth={2} />
            <span>
              Secure checkout via <span className="font-semibold text-[#0E0E10]">Stripe</span> or{' '}
              <span className="font-semibold text-[#0E0E10]">UPI</span>. Card details are never stored.
            </span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
     <Footer/>
    </div>
  );
}