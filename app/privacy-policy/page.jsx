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
  { id: 'information-we-collect', title: 'Information We Collect' },
  { id: 'why-we-use', title: 'Why We Use Your Information' },
  { id: 'processing-images', title: 'Processing of Uploaded Images' },
  { id: 'generated-images', title: 'Generated Images' },
  { id: 'service-providers', title: 'Service Providers' },
  { id: 'international', title: 'International Processing' },
  { id: 'payment-info', title: 'Payment Information' },
  { id: 'security', title: 'Data Security' },
  { id: 'retention', title: 'Data Retention' },
  { id: 'choices', title: 'Your Choices and Rights' },
  { id: 'deletion', title: 'Account Deletion' },
  { id: 'children', title: "Children's Privacy" },
  { id: 'third-party', title: 'Third-Party Websites' },
  { id: 'changes', title: 'Changes to This Privacy Policy' },
  { id: 'contact', title: 'Contact and Grievances' },
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

function SubHeading({ children }) {
  return (
    <h3 className="text-sm font-bold pt-1" style={{ fontFamily: 'var(--font-display)' }}>
      {children}
    </h3>
  );
}

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-sm text-[#5A5648] max-w-2xl leading-relaxed">
            At <strong className="text-[#0E0E10]">LibDesk</strong>, we respect your privacy and are committed to
            protecting the information you provide when using our AI image-generation services. This Privacy
            Policy explains what information we collect, why we collect it, how we use it, when we share it, and
            the choices available to you.
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
            <Section num={1} id="information-we-collect" title="Information We Collect">
              <p>Depending on how you use the Service, we may collect the following information.</p>

              <SubHeading>1.1 Account Information</SubHeading>
              <p>When you create an account, we may collect:</p>
              <Bullets
                items={[
                  'Name;',
                  'Email address;',
                  'Account/login information;',
                  'Profile information that you choose to provide.',
                ]}
              />

              <SubHeading>1.2 Uploaded Images</SubHeading>
              <p>When you use our image-generation features, you may upload photographs or other images.</p>
              <p>These images may contain personal information, including identifiable people.</p>
              <p>We process uploaded images to provide the image-generation or image-transformation service requested by you.</p>
              <p>Please do not upload an image unless you have the right and necessary permission to do so.</p>

              <SubHeading>1.3 Prompts and Generation Information</SubHeading>
              <p>We may collect:</p>
              <Bullets
                items={[
                  'Text prompts;',
                  'Generation settings;',
                  'Selected styles;',
                  'Generation history;',
                  'Generated images;',
                  'Generation status;',
                  'Credits used for generation.',
                ]}
              />

              <SubHeading>1.4 Payment Information</SubHeading>
              <p>When you purchase credits, payment processing is performed by our payment providers.</p>
              <p>We may receive information such as:</p>
              <Bullets
                items={[
                  'Payment ID;',
                  'Order ID;',
                  'Transaction amount;',
                  'Currency;',
                  'Payment status;',
                  'Payment method type;',
                  'Transaction timestamps.',
                ]}
              />
              <p>We do not intentionally store complete card numbers, CVV numbers, or other sensitive payment-instrument credentials on our servers.</p>
              <p>Payment information is processed by the applicable payment provider under its own terms and privacy policies.</p>

              <SubHeading>1.5 Technical Information</SubHeading>
              <p>We may automatically collect limited technical information such as:</p>
              <Bullets
                items={[
                  'IP address;',
                  'Browser type;',
                  'Device type;',
                  'Operating system;',
                  'Approximate usage information;',
                  'Log information;',
                  'Error information;',
                  'Security information.',
                ]}
              />
              <p>We use this information to operate, secure, monitor, and improve the Service.</p>

              <SubHeading>1.6 Cookies and Similar Technologies</SubHeading>
              <p>We may use cookies and similar technologies for:</p>
              <Bullets
                items={[
                  'Authentication;',
                  'Maintaining sessions;',
                  'Security;',
                  'Preferences;',
                  'Analytics;',
                  'Service functionality.',
                ]}
              />
              <p>You may be able to control cookies through your browser settings, although disabling certain cookies may affect the functionality of the Website.</p>
            </Section>

            <Section num={2} id="why-we-use" title="Why We Use Your Information">
              <p>We may process your information to:</p>
              <Bullets
                items={[
                  'Create and maintain your account;',
                  'Provide AI image-generation services;',
                  'Process payments;',
                  'Deliver purchased credits;',
                  'Maintain your generation history;',
                  'Provide customer support;',
                  'Detect fraud and abuse;',
                  'Protect the security of our systems;',
                  'Troubleshoot technical problems;',
                  'Improve our Service;',
                  'Comply with legal obligations;',
                  'Enforce our Terms and policies.',
                ]}
              />
              <p>We will not use personal information for purposes incompatible with the purpose for which it was collected except where permitted or required by applicable law.</p>
            </Section>

            <Section num={3} id="processing-images" title="Processing of Uploaded Images">
              <p>Uploaded images are processed to provide the requested AI service.</p>
              <p>Depending on the particular feature and AI technology used, an uploaded image may be transmitted to a third-party AI or infrastructure provider for processing.</p>
              <p>We use service providers that are necessary for operating our Service and take reasonable steps to require appropriate handling of information.</p>
              <p>We do not sell your uploaded photographs to third parties.</p>
              <p>Unless explicitly stated otherwise for a particular feature, we do not use your uploaded personal photographs for public advertising or public display without an appropriate legal basis or permission.</p>
            </Section>

            <Section num={4} id="generated-images" title="Generated Images">
              <p>Generated images may be stored to allow you to:</p>
              <Bullets
                items={[
                  'View your generation history;',
                  'Download your images;',
                  'Re-access previously generated content;',
                  'Resolve support requests;',
                  'Maintain the Service.',
                ]}
              />
              <p>We may retain generated images for as long as reasonably necessary for these purposes or as otherwise disclosed.</p>
              <p>You may contact us to request deletion where applicable.</p>
            </Section>

            <Section num={5} id="service-providers" title="Service Providers">
              <p>We may share information with trusted service providers that help us operate the Website.</p>
              <p>These may include:</p>
              <Bullets
                items={[
                  'Payment processors;',
                  'AI model providers;',
                  'Cloud-storage providers;',
                  'Hosting providers;',
                  'Authentication providers;',
                  'Email providers;',
                  'Analytics providers;',
                  'Security and fraud-prevention providers.',
                ]}
              />
              <p>These providers receive only the information reasonably necessary to provide their services.</p>
              <p>For example, a payment processor may receive information necessary to process your payment, while an AI provider may receive an image and prompt necessary to perform an image-generation request.</p>
            </Section>

            <Section num={6} id="international" title="International Processing">
              <p>Some of our service providers may process information on servers located outside India.</p>
              <p>Where personal information is transferred internationally, we will take reasonable steps to comply with applicable data-protection requirements.</p>
            </Section>

            <Section num={7} id="payment-info" title="Payment Information">
              <p>Payments may be processed by Razorpay or another payment processor.</p>
              <p>We do not store your complete payment-card credentials.</p>
              <p>Payment providers may independently process your information according to their own privacy policies.</p>
              <p>You should review the privacy policy of the payment provider used for your transaction.</p>
            </Section>

            <Section num={8} id="security" title="Data Security">
              <p>We use reasonable technical and organizational measures designed to protect information against unauthorized access, loss, misuse, alteration, or disclosure.</p>
              <p>However, no Internet transmission or electronic storage system can be guaranteed to be completely secure.</p>
              <p>You should use a strong password and avoid sharing your account credentials.</p>
            </Section>

            <Section num={9} id="retention" title="Data Retention">
              <p>We retain information only for as long as reasonably necessary for:</p>
              <Bullets
                items={[
                  'Providing the Service;',
                  'Maintaining account history;',
                  'Processing transactions;',
                  'Preventing fraud;',
                  'Resolving disputes;',
                  'Maintaining security;',
                  'Complying with legal and regulatory obligations.',
                ]}
              />
              <p>When information is no longer reasonably required, we may delete, anonymize, or securely dispose of it, subject to applicable legal and operational requirements.</p>
            </Section>

            <Section num={10} id="choices" title="Your Choices and Rights">
              <p>Depending on the law applicable to you, you may have rights concerning your personal information, which may include:</p>
              <Bullets
                items={[
                  'Requesting access to certain personal information;',
                  'Requesting correction of inaccurate information;',
                  'Requesting deletion where legally available;',
                  'Withdrawing consent where processing is based on consent;',
                  'Requesting information about processing;',
                  'Raising a complaint or grievance.',
                ]}
              />
              <p>Requests may be submitted using the contact information below.</p>
              <p>We may need to verify your identity before processing certain requests.</p>
            </Section>

            <Section num={11} id="deletion" title="Account Deletion">
              <p>You may request deletion of your account by contacting us at:</p>
              <p>Email: hellobittukumar12@gmail.com</p>
              <p>When an account is deleted, we may delete or anonymize associated information where reasonably possible.</p>
              <p>Some information may need to be retained where required for legal compliance, fraud prevention, financial records, dispute resolution, or other legitimate purposes.</p>
            </Section>

            <Section num={12} id="children" title="Children's Privacy">
              <p>Our Service is not intended to encourage unlawful use by children.</p>
              <p>Users must comply with the age requirements applicable to them under their local law.</p>
              <p>We do not knowingly collect personal information from children in circumstances where such collection is prohibited by applicable law.</p>
              <p>If you believe a child has provided personal information to us improperly, please contact us.</p>
            </Section>

            <Section num={13} id="third-party" title="Third-Party Websites">
              <p>Our Website may contain links to third-party websites or services.</p>
              <p>We are not responsible for the privacy practices of third-party websites.</p>
              <p>You should review their respective privacy policies before providing information.</p>
            </Section>

            <Section num={14} id="changes" title="Changes to This Privacy Policy">
              <p>We may update this Privacy Policy periodically.</p>
              <p>When we make material changes, we may update the "Last Updated" date and provide additional notice where appropriate.</p>
            </Section>

            <Section num={15} id="contact" title="Contact and Grievances">
              <p>If you have questions, privacy requests, or complaints concerning your personal information, contact:</p>
              <div className="border-2 border-[#0E0E10] bg-white rounded-sm p-4 shadow-[3px_3px_0_#0E0E10] mt-2">
                <p className="mb-1"><strong className="text-[#0E0E10]">Business/Website Name:</strong> LibDesk</p>
                <p className="mb-1"><strong className="text-[#0E0E10]">Email:</strong> hellobittukumar12@gmail.com</p>
                <p className="mb-1"><strong className="text-[#0E0E10]">Support Email:</strong> hellobittukumar12@gmail.com</p>
                <p><strong className="text-[#0E0E10]">Business Address:</strong> Ara, Bihar, India</p>
              </div>
              <p>We will review and respond to privacy requests within the time required by applicable law.</p>
              <p className="text-xs text-[#8A8677] pt-2">Last Updated: September 5, 2026</p>
            </Section>
          </div>
        </div>
      </div>
      <Footer/> 
    </div>
  );
}