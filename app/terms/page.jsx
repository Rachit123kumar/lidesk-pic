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
  { id: 'about', title: 'About the Service' },
  { id: 'eligibility', title: 'Eligibility' },
  { id: 'account', title: 'Account Registration' },
  { id: 'credits', title: 'Digital Credits' },
  { id: 'payments', title: 'Payments' },
  { id: 'ai-content', title: 'AI-Generated Content' },
  { id: 'user-content', title: 'User-Uploaded Content' },
  { id: 'prohibited', title: 'Prohibited Use' },
  { id: 'sensitive', title: 'Sensitive and Illegal Content' },
  { id: 'ip', title: 'Intellectual Property' },
  { id: 'third-party', title: 'Third-Party Services' },
  { id: 'availability', title: 'Service Availability' },
  { id: 'refunds', title: 'Refunds and Cancellations' },
  { id: 'chargebacks', title: 'Chargebacks and Payment Disputes' },
  { id: 'suspension', title: 'Account Suspension and Termination' },
  { id: 'disclaimer', title: 'Disclaimer' },
  { id: 'liability', title: 'Limitation of Liability' },
  { id: 'indemnification', title: 'Indemnification' },
  { id: 'changes', title: 'Changes to These Terms' },
  { id: 'governing-law', title: 'Governing Law and Dispute Resolution' },
  { id: 'contact', title: 'Contact' },
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

export default function TermsPage() {
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
          <span
            className="inline-block text-xs font-bold px-2.5 py-1 border-2 border-[#0E0E10] bg-[#FFC93C] rounded-sm mb-4"
          >
            Last updated: September 5, 2026
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Terms &amp; Conditions
          </h1>
          <p className="text-sm text-[#5A5648] max-w-2xl leading-relaxed">
            Welcome to <strong className="text-[#0E0E10]">LibDesk</strong> ("Website", "Service", "we", "us", or
            "our"). These Terms & Conditions ("Terms") govern your access to and use of our website, applications,
            AI image-generation services, digital credits, and related services. By accessing or using our Service,
            creating an account, purchasing credits, or generating an image, you agree to these Terms. If you do
            not agree with these Terms, please do not use the Service.
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
            <Section num={1} id="about" title="About the Service">
              <p>LibDesk provides online AI-powered image-generation and image-transformation services.</p>
              <p>Depending on the features available on the Website, users may be able to:</p>
              <Bullets
                items={[
                  'Upload images;',
                  'Enter text prompts;',
                  'Select image-generation styles or options;',
                  'Generate or transform images using artificial intelligence;',
                  'Purchase digital credits;',
                  'Use digital credits to access image-generation features;',
                  'Download or otherwise use generated images.',
                ]}
              />
              <p>The Service is provided digitally. We do not sell or ship physical products through the Service.</p>
            </Section>

            <Section num={2} id="eligibility" title="Eligibility">
              <p>You must be legally capable of entering into a binding agreement to use the Service.</p>
              <p>
                If you are below the legal age required to enter into contracts in your jurisdiction, you may use
                the Service only with the involvement and permission of a parent or legal guardian where permitted
                by applicable law.
              </p>
              <p>You are responsible for ensuring that your use of the Service complies with the laws applicable to you.</p>
            </Section>

            <Section num={3} id="account" title="Account Registration">
              <p>Certain features may require you to create an account.</p>
              <p>You agree to provide accurate and current information when creating an account.</p>
              <p>You are responsible for:</p>
              <Bullets
                items={[
                  'Maintaining the confidentiality of your account;',
                  'Protecting your login credentials;',
                  'All activities performed through your account;',
                  'Immediately notifying us if you believe your account has been compromised.',
                ]}
              />
              <p>We may suspend or terminate accounts that are used fraudulently, unlawfully, abusively, or in violation of these Terms.</p>
            </Section>

            <Section num={4} id="credits" title="Digital Credits">
              <p>Some features of the Service operate using digital credits.</p>
              <p>Credits may be purchased through the payment methods made available on the Website.</p>
              <p>The number of credits provided for each package will be displayed before purchase.</p>
              <p>Credits:</p>
              <Bullets
                items={[
                  'Have no cash value;',
                  'Cannot normally be exchanged for cash;',
                  'Cannot normally be transferred between accounts;',
                  'Cannot be sold or resold;',
                  'May only be used for the features for which they are made available;',
                  'May be subject to expiration where such expiration is clearly disclosed before purchase.',
                ]}
              />
              <p>
                We reserve the right to change credit pricing, credit packages, or the number of credits required
                for particular features. Changes will generally apply to future purchases and will not
                retroactively alter credits already consumed.
              </p>
            </Section>

            <Section num={5} id="payments" title="Payments">
              <p>
                Payments may be processed through third-party payment providers, including Razorpay and other
                payment providers that we may make available.
              </p>
              <p>We do not store your complete credit-card number, CVV, or other sensitive payment-instrument credentials on our servers.</p>
              <p>
                Payment processing is handled by the relevant payment provider according to its own terms,
                policies, security procedures, and applicable laws.
              </p>
              <p>The final amount payable, including applicable taxes or charges where applicable, will be displayed before you confirm a purchase.</p>
              <p>
                For international customers, currency conversion may be performed by the payment provider or the
                customer's card issuer. Exchange rates, foreign transaction fees, and other charges imposed by the
                customer's financial institution are outside our control.
              </p>
            </Section>

            <Section num={6} id="ai-content" title="AI-Generated Content">
              <p>Our Service uses artificial intelligence and third-party technology to generate or transform images.</p>
              <p>AI-generated results can be unpredictable.</p>
              <p>We do not guarantee that:</p>
              <Bullets
                items={[
                  'A generated image will exactly match your prompt;',
                  'A generated image will always be technically perfect;',
                  'A generated image will always contain every requested element;',
                  'The Service will always produce identical results from the same prompt;',
                  'The Service will always be available without interruption.',
                ]}
              />
              <p>
                Generation failures caused by technical problems may, at our discretion or according to our service
                rules, result in the restoration of the credit used for that generation.
              </p>
            </Section>

            <Section num={7} id="user-content" title="User-Uploaded Content">
              <p>You may upload photographs, images, prompts, or other materials ("User Content").</p>
              <p>You retain ownership of User Content that you own, subject to the rights necessary for us and our service providers to process it and provide the Service.</p>
              <p>By uploading User Content, you represent and warrant that:</p>
              <Bullets
                items={[
                  'You own the content or have sufficient rights and permissions to use it;',
                  'You have permission to upload and process photographs of other people where such permission is legally required;',
                  "Your upload does not violate another person's privacy, publicity, copyright, trademark, or other rights;",
                  'Your upload does not violate applicable law;',
                  'Your upload does not contain content that you are prohibited from processing or distributing.',
                ]}
              />
              <p>
                You grant us and our service providers a limited, non-exclusive, worldwide license to host,
                process, transmit, reproduce, modify, and otherwise use User Content only as reasonably necessary
                to provide, maintain, secure, and improve the Service, subject to our Privacy Policy and applicable
                law.
              </p>
            </Section>

            <Section num={8} id="prohibited" title="Prohibited Use">
              <p>You may not use the Service to:</p>
              <Bullets
                items={[
                  'Violate any applicable law;',
                  "Infringe another person's intellectual-property rights;",
                  'Impersonate another person for fraud or deception;',
                  'Create fraudulent identity documents or credentials;',
                  'Create content intended to facilitate criminal activity;',
                  'Upload malware or malicious code;',
                  'Attempt to gain unauthorized access to our systems;',
                  'Circumvent credit limits, payment systems, security controls, or usage restrictions;',
                  'Abuse, overload, or interfere with the Service;',
                  'Use automated systems to exploit the Service without our permission;',
                  'Attempt to reverse engineer or copy our proprietary systems;',
                  'Conduct payment fraud or intentionally initiate fraudulent chargebacks;',
                  'Use the Service in a manner that violates the policies of our payment providers or AI technology providers.',
                ]}
              />
              <p>We may refuse, remove, restrict, or terminate access to content or accounts that we reasonably believe violate these Terms or applicable law.</p>
            </Section>

            <Section num={9} id="sensitive" title="Sensitive and Illegal Content">
              <p>You must not upload or generate content that is unlawful or that you do not have the legal right to process.</p>
              <p>We may implement automated or manual safety systems to detect prohibited content.</p>
              <p>
                Where reasonably necessary, we may retain limited records relating to abuse, fraud, security
                incidents, or violations for compliance and security purposes.
              </p>
            </Section>

            <Section num={10} id="ip" title="Intellectual Property">
              <p>
                The Website, software, user interface, branding, logos, text, graphics, code, and other materials
                provided by us are owned by or licensed to us and are protected by applicable intellectual-property
                laws.
              </p>
              <p>Except as expressly permitted by us, you may not:</p>
              <Bullets
                items={[
                  'Copy our Website;',
                  'Reproduce our software;',
                  'Scrape our content or services;',
                  'Reverse engineer our systems;',
                  'Reproduce our branding;',
                  'Sell or redistribute our Service.',
                ]}
              />
              <p>Your rights in generated images may depend on the nature of the generation, your input, applicable law, and the terms of the underlying AI technology providers.</p>
              <p>We do not guarantee that every AI-generated output is eligible for copyright protection or that an output will be free from third-party rights.</p>
              <p>You are responsible for determining whether an output is suitable for your intended commercial or personal use.</p>
            </Section>

            <Section num={11} id="third-party" title="Third-Party Services">
              <p>Our Service may depend on third-party providers, including:</p>
              <Bullets
                items={[
                  'Payment processors;',
                  'Cloud-storage providers;',
                  'AI model providers;',
                  'Authentication providers;',
                  'Email providers;',
                  'Analytics and security providers.',
                ]}
              />
              <p>Third-party services may have their own terms and privacy policies.</p>
              <p>We are not responsible for failures, outages, or changes to third-party services that are outside our reasonable control.</p>
            </Section>

            <Section num={12} id="availability" title="Service Availability">
              <p>We aim to provide a reliable service but do not guarantee uninterrupted or error-free operation.</p>
              <p>The Service may occasionally be unavailable because of:</p>
              <Bullets
                items={[
                  'Maintenance;',
                  'Server problems;',
                  'AI provider outages;',
                  'Payment-provider problems;',
                  'Network failures;',
                  'Security incidents;',
                  'Force majeure events;',
                  'Other circumstances outside our reasonable control.',
                ]}
              />
            </Section>

            <Section num={13} id="refunds" title="Refunds and Cancellations">
              <p>
                Purchases of digital credits are generally non-refundable once the credits have been successfully
                delivered to your account, except where a refund is required by applicable law or where we
                determine that an exceptional refund is appropriate.
              </p>
              <p>Unused credits do not automatically create a right to a refund.</p>
              <p>Credits already consumed for successful generations are generally not refundable.</p>
              <p>
                If a payment succeeds but credits are not delivered because of a technical issue, please contact
                us. We will investigate the transaction and may restore the credits or issue a refund where
                appropriate.
              </p>
              <p>For complete details, please see our Refund & Cancellation Policy.</p>
            </Section>

            <Section num={14} id="chargebacks" title="Chargebacks and Payment Disputes">
              <p>If you believe a payment was made incorrectly, please contact us before initiating a payment dispute or chargeback.</p>
              <p>We will investigate legitimate payment issues and attempt to resolve them.</p>
              <p>Fraudulent or abusive chargebacks may result in suspension or termination of the associated account, subject to applicable law and payment-provider rules.</p>
            </Section>

            <Section num={15} id="suspension" title="Account Suspension and Termination">
              <p>We may suspend or terminate your account if we reasonably believe that:</p>
              <Bullets
                items={[
                  'You violated these Terms;',
                  'You engaged in fraud;',
                  'You abused the Service;',
                  'You attempted to circumvent payment or credit systems;',
                  'Your activity creates a security risk;',
                  'Your activity violates applicable law;',
                  'Your activity violates third-party provider requirements.',
                ]}
              />
              <p>Where appropriate, we may provide notice before termination. Immediate action may be taken where necessary for security, fraud prevention, legal compliance, or protection of other users.</p>
            </Section>

            <Section num={16} id="disclaimer" title="Disclaimer">
              <p>To the maximum extent permitted by applicable law, the Service is provided on an "as available" basis.</p>
              <p>We do not guarantee that the Service will always meet your individual requirements or that AI-generated content will be accurate, complete, unique, or suitable for a particular purpose.</p>
              <p>AI systems may produce unexpected or inaccurate results.</p>
              <p>You are responsible for reviewing generated content before using or publishing it.</p>
            </Section>

            <Section num={17} id="liability" title="Limitation of Liability">
              <p>To the maximum extent permitted by applicable law, we will not be liable for indirect, incidental, special, consequential, or unforeseeable losses arising from your use of the Service.</p>
              <p>Nothing in these Terms excludes or limits liability that cannot legally be excluded or limited under applicable law.</p>
              <p>Where permitted by law, our total liability arising from your use of the Service will be limited to the amount you paid to us for the relevant Service giving rise to the claim during the applicable period.</p>
            </Section>

            <Section num={18} id="indemnification" title="Indemnification">
              <p>To the extent permitted by applicable law, you agree to indemnify and hold harmless LibDesk, its owners, employees, contractors, and service providers from claims, losses, liabilities, damages, and expenses arising from:</p>
              <Bullets
                items={[
                  'Your violation of these Terms;',
                  'Your User Content;',
                  'Your unlawful use of the Service;',
                  "Your infringement of another person's rights;",
                  'Your fraudulent or abusive activity.',
                ]}
              />
            </Section>

            <Section num={19} id="changes" title="Changes to These Terms">
              <p>We may update these Terms from time to time.</p>
              <p>When we make material changes, we may update the "Last Updated" date and, where appropriate, provide additional notice.</p>
              <p>Your continued use of the Service after the updated Terms become effective constitutes acceptance of the revised Terms, subject to applicable law.</p>
            </Section>

            <Section num={20} id="governing-law" title="Governing Law and Dispute Resolution">
              <p>These Terms shall be governed by the laws applicable in India, unless applicable law requires otherwise.</p>
              <p>Any dispute shall first be submitted to us for good-faith resolution.</p>
              <p>Nothing in this section prevents a consumer from exercising mandatory rights or remedies available under applicable law.</p>
            </Section>

            <Section num={21} id="contact" title="Contact">
              <p>For questions, complaints, payment issues, refund requests, or other concerns, please contact:</p>
              <div className="border-2 border-[#0E0E10] bg-white rounded-sm p-4 shadow-[3px_3px_0_#0E0E10] mt-2 not-prose">
                <p className="mb-1"><strong className="text-[#0E0E10]">Business/Website Name:</strong> LibDesk</p>
                <p className="mb-1"><strong className="text-[#0E0E10]">Email:</strong> hellobittukumar12@gmail.com</p>
                <p className="mb-1"><strong className="text-[#0E0E10]">Phone:</strong> <span className="italic text-[#8A8677]">[PHONE NUMBER]</span></p>
                <p><strong className="text-[#0E0E10]">Business Address:</strong> Ara, Bihar, India</p>
              </div>
              <p className="text-xs text-[#8A8677] pt-2">Last Updated: September 5, 2026</p>
            </Section>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}