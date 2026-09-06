import React from 'react';
import {
  Camera,
  Mail,
  MapPin
} from 'lucide-react';

const InstagramIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
  </svg>
);

export default function Footer() {
  return (
    <footer className="border-t-2 border-[#0E0E10] bg-[#0E0E10] text-white pt-16 pb-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 pb-12 border-b border-white/15">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 flex items-center justify-center bg-[#4B3AFF]">
                <Camera className="w-4 h-4 text-white" strokeWidth={2} />
              </div>
              <span className="text-lg" style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>LibDesk</span>
            </div>
            <p className="text-white/70 max-w-sm mb-8 leading-relaxed text-[14px]">
              Professional, cinematic, and festive portraits, generated from a single photo.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/libdesk.online"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center border-2 border-white/20 hover:border-[#FFC93C] hover:text-[#FFC93C] transition-colors"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="mailto:hellobittukumar12@gmail.com"
                className="w-9 h-9 flex items-center justify-center border-2 border-white/20 hover:border-[#FFC93C] hover:text-[#FFC93C] transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-5 text-[13px] font-bold">Contact</h4>
            <ul className="flex flex-col gap-3.5 text-white/70 text-[14px]">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#FFC93C] shrink-0 mt-0.5" strokeWidth={2} />
                <a href="mailto:hellobittukumar12@gmail.com" className="hover:text-white transition-colors">hellobittukumar12@gmail.com</a>
              </li>
              <li className="flex items-start gap-2.5">
                <InstagramIcon className="w-4 h-4 text-[#FFC93C] shrink-0 mt-0.5" />
                <a href="https://www.instagram.com/libdesk.online" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">@libdesk.online</a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FFC93C] shrink-0 mt-0.5" strokeWidth={2} />
                <span>Ara, Bihar, India</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-[13px] font-bold">Legal</h4>
            <ul className="flex flex-col gap-3 text-white/70 text-[14px]">
              <li><a href="/terms" className="hover:text-[#FFC93C] transition-colors">Terms &amp; Conditions</a></li>
              <li><a href="/privacy" className="hover:text-[#FFC93C] transition-colors">Privacy Policy</a></li>
              <li><a href="/refund-policy" className="hover:text-[#FFC93C] transition-colors">Refund &amp; Cancellation</a></li>
              <li><a href="/shipping-policy" className="hover:text-[#FFC93C] transition-colors">Shipping &amp; Delivery</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-white/50 text-[13px]">
          <p>&copy; {new Date().getFullYear()} LibDesk. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}