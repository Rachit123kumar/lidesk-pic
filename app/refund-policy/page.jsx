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
  { id: 'credit-purchases', title: 'Digital Credit Purchases' },
  { id: 'used-credits', title: 'Credits That Have Already Been Used' },
  { id: 'failed-generation', title: 'Failed AI Generation' },
  { id: 'not-received', title: 'Payment Successful but Credits Not Received' },
  { id: 'duplicate', title: 'Duplicate Payments' },
  { id: 'unauthorized', title: 'Unauthorized Transactions' },
  { id: 'exceptional', title: 'Exceptional Refunds' },
  { id: 'refund-method', title: 'Refund Method' },
  { id: 'cancellation', title: 'Cancellation' },
  { id: 'chargebacks', title: 'Chargebacks' },
  { id: 'assistance', title: 'How to Request Assistance' },
  { id: 'applicable-law', title: 'Applicable Law' },
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

export default function RefundPolicyPage() {
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
            Refund &amp; Cancellation Policy
          </h1>
          <p className="text-sm text-[#5A5648] max-w-2xl leading-relaxed">
            This Refund &amp; Cancellation Policy applies to purchases made through{' '}
            <strong className="text-[#0E0E10]">LibDesk</strong>. Our Service provides digital AI image-generation
            services and digital credits. Because digital credits and AI-generation services can be delivered
            immediately, purchases are generally non-refundable once credits have been successfully delivered to
            an account.
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
            <Section num={1} id="credit-purchases" title="Digital Credit Purchases">
              <p>When you purchase a credit package, the credits are normally added to your account after successful payment confirmation.</p>
              <p>Because the credits are digital and may be immediately available for use:</p>
              <p className="font-bold text-[#0E0E10]">All successfully delivered credit purchases are generally non-refundable.</p>
              <p>This means that simply changing your mind, deciding not to use the credits, or purchasing the wrong package does not normally qualify for a refund.</p>
            </Section>

            <Section num={2} id="used-credits" title="Credits That Have Already Been Used">
              <p>Credits that have already been consumed for successful AI generations are generally non-refundable.</p>
              <p>For example, if you purchase 10 credits and use 4 credits to successfully generate images, the 4 consumed credits are generally not refundable.</p>
            </Section>

            <Section num={3} id="failed-generation" title="Failed AI Generation">
              <p>If a generation fails because of a technical problem with our Service or an underlying AI provider, we may restore the credit used for that failed generation.</p>
              <p>Where technically possible, the system may automatically restore the credit.</p>
              <p>A failed generation does not automatically entitle the user to a cash refund.</p>
            </Section>

            <Section num={4} id="not-received" title="Payment Successful but Credits Not Received">
              <p>If your payment was successfully completed but the purchased credits were not added to your account because of a technical problem, please contact us.</p>
              <p>We will verify the payment and account records.</p>
              <p>Depending on the circumstances, we may:</p>
              <Bullets
                items={[
                  'Add the missing credits; or',
                  'Provide another appropriate resolution; or',
                  'Issue a refund where appropriate.',
                ]}
              />
            </Section>

            <Section num={5} id="duplicate" title="Duplicate Payments">
              <p>If you were charged more than once for the same purchase because of a technical or payment-processing error, please contact us.</p>
              <p>After verification, we may correct the duplicate transaction by restoring the appropriate balance or issuing a refund where appropriate.</p>
            </Section>

            <Section num={6} id="unauthorized" title="Unauthorized Transactions">
              <p>If you believe that a transaction was made without your authorization, contact us immediately.</p>
              <p>We may request transaction information necessary to investigate the issue.</p>
              <p>You should also contact your bank or card issuer where appropriate.</p>
            </Section>

            <Section num={7} id="exceptional" title="Exceptional Refunds">
              <p>Although purchases are generally non-refundable, we may, at our sole discretion and subject to applicable law, provide a refund in exceptional circumstances.</p>
              <p>Examples may include:</p>
              <Bullets
                items={[
                  'A confirmed technical billing error;',
                  'A duplicate charge;',
                  'A payment captured but the purchased credits were not delivered and cannot reasonably be restored;',
                  'Other circumstances where a refund is required by applicable law.',
                ]}
              />
              <p>Providing a refund in one case does not create an obligation to provide refunds in future cases with different circumstances.</p>
            </Section>

            <Section num={8} id="refund-method" title="Refund Method">
              <p>Where a refund is approved, it will generally be processed through the original payment method used for the transaction.</p>
              <p>The time required for the refund to appear in your account may depend on the payment provider, card network, bank, or other financial institution.</p>
              <p>We do not control the processing time of the customer's bank or card issuer.</p>
            </Section>

            <Section num={9} id="cancellation" title="Cancellation">
              <p>A credit purchase generally cannot be cancelled after payment has been successfully processed and the credits have been delivered.</p>
              <p>If you believe that a payment was processed incorrectly, contact us as soon as possible.</p>
            </Section>

            <Section num={10} id="chargebacks" title="Chargebacks">
              <p>We encourage customers to contact us before initiating a chargeback where the issue concerns a purchase, missing credits, failed generation, or billing problem.</p>
              <p>We will investigate legitimate concerns and attempt to resolve them.</p>
              <p>Fraudulent or abusive payment disputes may result in account restrictions, subject to applicable law.</p>
            </Section>

            <Section num={11} id="assistance" title="How to Request Assistance">
              <p>To request a refund review or report a payment problem, contact:</p>
              <div className="border-2 border-[#0E0E10] bg-white rounded-sm p-4 shadow-[3px_3px_0_#0E0E10] mt-2">
                <p><strong className="text-[#0E0E10]">Email:</strong> hellobittukumar12@gmail.com</p>
              </div>
              <p className="pt-2">Please include:</p>
              <Bullets
                items={[
                  'Your account email;',
                  'Payment/order ID;',
                  'Date of transaction;',
                  'Amount paid;',
                  'Description of the problem.',
                ]}
              />
              <p className="font-semibold text-[#0E0E10]">Do not send your full card number, CVV, password, or other sensitive payment credentials by email.</p>
            </Section>

            <Section num={12} id="applicable-law" title="Applicable Law">
              <p>Nothing in this policy is intended to remove or restrict any refund, cancellation, consumer, or other legal right that cannot legally be excluded.</p>
              <p>This policy describes our normal commercial refund approach for digital services.</p>
              <p className="text-xs text-[#8A8677] pt-2">Last Updated: September 5, 2026</p>
            </Section>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}