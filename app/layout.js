
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import Providers from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Libdesk | AI Headshots",
  description:
    "Create professional AI headshots with Libdesk. Generate polished, professional photos for LinkedIn, resumes, profiles, and more.",
  icons: {
    icon: "/logo1.png?v=2",
    shortcut: "/logo1.png?v=2",
    apple: "/logo1.png?v=2",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
        </Providers>

        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}

