import Sidebar from '../../components/SIdeBar';
import {
  Bell,
  Heart,
  Gift,
  Flame,
  Briefcase,
  Camera,
  Plane,
  Film,
  Sparkles,
  Music
} from 'lucide-react';

// Custom SVG to replace the missing Lucide Instagram export
const InstagramIcon = ({ size = 24, strokeWidth = 2, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

// One accent per card. Once real generated preview images exist, swap the
// colored placeholder div below for an <img src={style.previewUrl} />.
const ACCENTS = ['#4B3AFF', '#FF4D6D', '#FFC93C', '#1FA774'];

export default function DashboardPage() {
  const styles = [
    { name: 'Dating', icon: Heart },
    { name: 'Christmas', icon: Gift },
    { name: 'Diwali', icon: Flame },
    { name: 'Professional headshot', icon: Briefcase },
    { name: 'Rakshabandhan', icon: Camera },
    { name: 'Instagram', icon: InstagramIcon },
    { name: 'Travel', icon: Plane },
    { name: 'Cinematic', icon: Film },
    { name: 'Festival vibes', icon: Sparkles },
    { name: 'Music video', icon: Music },
    { name: 'Casual holiday', icon: Gift },
    { name: 'Action sports', icon: Flame },
  ].map((s, i) => ({ ...s, color: ACCENTS[i % ACCENTS.length] }));

  return (
    <div className="h-screen max-h-screen bg-[#FAFAF8] text-[#0E0E10] flex flex-col lg:flex-row overflow-hidden">
      <Sidebar />

      {/* Main content area */}
      <main className="flex-1 flex flex-col h-full pt-14 lg:pt-0 w-full relative font-['Inter',_sans-serif]">

        {/* Slim header — title + a small icon button, nothing else */}
        <div className="flex items-center justify-between px-4 sm:px-8 py-3 border-b-2 border-[#0E0E10] bg-[#FAFAF8] z-10">
          <h1 className="text-sm font-bold font-['Space_Grotesk',_sans-serif]">
            Choose a style
          </h1>

          <button
            className="w-7 h-7 flex items-center justify-center bg-white border-2 border-[#0E0E10] rounded-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[2px_2px_0_#0E0E10] active:translate-y-0.5 active:shadow-none relative shrink-0"
            aria-label="Notifications"
          >
            <Bell strokeWidth={2} size={14} className="text-[#0E0E10]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#FF4D6D] border border-[#0E0E10]" />
          </button>
        </div>

        {/* Scrollable grid */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-5 pb-24">
          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {styles.map((style, index) => (
              <button
                key={index}
                className="border-2 border-[#0E0E10] rounded-sm overflow-hidden flex flex-col text-left transition-all duration-150 shadow-[3px_3px_0_#0E0E10] hover:-translate-y-1 hover:shadow-[5px_5px_0_#0E0E10] active:translate-y-0.5 active:shadow-none"
              >
                {/* Placeholder image area — swap for <img src={style.previewUrl} className="w-full h-full object-cover" /> */}
                <div
                  className="aspect-[4/5] w-full flex items-center justify-center"
                  style={{ background: style.color }}
                >
                  <style.icon size={28} strokeWidth={2} className="text-white/40" />
                </div>

                <div className="px-2.5 py-2 border-t-2 border-[#0E0E10] bg-white">
                  <span className="font-bold text-xs leading-tight line-clamp-1">
                    {style.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}