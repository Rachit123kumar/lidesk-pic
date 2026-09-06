'use client';

import Link from 'next/link';
import { Camera, ArrowLeft } from 'lucide-react';
import { Space_Grotesk, Inter } from 'next/font/google';
import Footer from '../components/footer';

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

const SECTIONS = [
  { id: 'digital-service', title: 'Digital Service' },
  { id: 'credit-delivery', title: 'Delivery of Digital Credits' },
  { id: 'image-delivery', title: 'AI Image Delivery' },
  { id: 'failed-generations', title: 'Failed Generations' },
  { id: 'downloading', title: 'Downloading Generated Images' },
  { id: 'delivery-problems', title: 'Delivery Problems' },
  { id: 'no-physical', title: 'No Physical Shipping' },
];

function Section({ num, id, title, children }) {
  return (
    <section id={id} className="scroll-mt-24 py-8 border-t-2 border-[#0E0E10] first:border-t-0 first:pt-0">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-7 h-7 flex items-center justify-center bg-[#0E0E10] text-white text-xs font-bold rounded-sm shrink-0">
          {num}
        </span>
        <h2 className="text-base sm:text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>
          {title}
        </h2>
      </div>
      <div className="text-sm text-[#3A3730] leading-relaxed space-y-3 sm:pl-10">
        {children}
      </div>
    </section>
  );
}

function Bullets({ items }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5">
          <span className="w-1.5 h-1.5 bg-[#4B3AFF] mt-1.5 shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ShippingPolicyPage() {
  return (
    <div
      className={`${display.variable} ${body.variable} min-h-screen bg-[#FAFAF8] text-[#0E0E10]`}
      style={{ fontFamily: 'var(--font-body)' }}
    >
      {/* Top bar */}
      <div className="border-b-2 border-[#0E0E10] px-4 sm:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 flex items-center justify-center bg-[#0E0E10] rounded-sm">
            <Camera size={14} strokeWidth={2} className="text-[#FAFAF8]" />
          </div>
          <span className="font-bold text-base" style={{ fontFamily: 'var(--font-display)' }}>
            LibDesk
          </span>
        </Link>
        <Link
          href="/"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 border-2 border-[#0E0E10] bg-white rounded-sm shadow-[2px_2px_0_#0E0E10] hover:-translate-y-0.5 transition-transform"
        >
          <ArrowLeft size={13} strokeWidth={2} />
          Back to home
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
        {/* Header */}
        <div className="mb-10">
          <span className="inline-block text-xs font-bold px-2.5 py-1 border-2 border-[#0E0E10] bg-[#FFC93C] rounded-sm mb-4">
            Last updated: September 5, 2026
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Shipping &amp; Delivery Policy
          </h1>
          <p className="text-sm text-[#5A5648] max-w-2xl leading-relaxed">
            <strong className="text-[#0E0E10]">LibDesk</strong> provides digital AI image-generation services.
            This page explains how digital credits and generated images are delivered to your account — there is
            no physical shipping involved.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10">
          {/* TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-8 border-2 border-[#0E0E10] bg-white rounded-sm p-4 shadow-[3px_3px_0_#0E0E10]">
              <p className="text-xs font-bold uppercase tracking-wide mb-3 text-[#8A8677]">On this page</p>
              <nav className="flex flex-col gap-1.5 max-h-[70vh] overflow-y-auto pr-1">
                {SECTIONS.map((s, i) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="text-xs font-medium text-[#5A5648] hover:text-[#4B3AFF] transition-colors leading-snug"
                  >
                    {i + 1}. {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="min-w-0">
            <Section num={1} id="digital-service" title="Digital Service">
              <p>LibDesk provides digital AI image-generation services.</p>
              <p>We do not sell or ship physical products.</p>
              <p>Therefore, no physical shipping, courier delivery, or physical delivery fee applies to purchases made through our Website.</p>
            </Section>

            <Section num={2} id="credit-delivery" title="Delivery of Digital Credits">
              <p>When you purchase a digital credit package, the credits are normally delivered electronically to your account after successful payment confirmation.</p>
              <p>In most cases, credits are available shortly after the payment has been successfully processed.</p>
            </Section>

            <Section num={3} id="image-delivery" title="AI Image Delivery">
              <p>Generated images are delivered electronically through the Website.</p>
              <p>Depending on the generation method and current system load, image generation may take some time.</p>
              <p>Some requests may experience delays because of:</p>
              <Bullets
                items={[
                  'AI provider processing;',
                  'Queue times;',
                  'Server load;',
                  'Technical issues;',
                  'Network problems;',
                  'Maintenance.',
                ]}
              />
            </Section>

            <Section num={4} id="failed-generations" title="Failed Generations">
              <p>If an AI generation fails because of a technical problem, the applicable credit may be restored according to our service rules.</p>
              <p>Please contact support if you experience a problem that is not automatically resolved.</p>
            </Section>

            <Section num={5} id="downloading" title="Downloading Generated Images">
              <p>Once an image has been successfully generated, you may be able to view and download it through the Website.</p>
              <p>You are responsible for downloading and safely storing any generated images that you wish to retain.</p>
            </Section>

            <Section num={6} id="delivery-problems" title="Delivery Problems">
              <p>If you have successfully completed a payment but do not receive your purchased credits, or if a successfully generated image does not appear in your account, please contact:</p>
              <div className="border-2 border-[#0E0E10] bg-white rounded-sm p-4 shadow-[3px_3px_0_#0E0E10] mt-2">
                <p><strong className="text-[#0E0E10]">Email:</strong> hellobittukumar12@gmail.com</p>
              </div>
              <p className="pt-2">Please provide your account email and transaction/order ID so that we can investigate the issue.</p>
            </Section>

            <Section num={7} id="no-physical" title="No Physical Shipping">
              <p>Because our Service is entirely digital:</p>
              <Bullets
                items={[
                  'No courier is used;',
                  'No shipping address is required for digital delivery;',
                  'No physical package will be sent;',
                  'No international shipping fee applies.',
                ]}
              />
              <p className="text-xs text-[#8A8677] pt-2">Last Updated: September 5, 2026</p>
            </Section>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}