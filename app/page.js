import { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
// Import your NextAuth options here if required by your setup
import { authOptions } from "./api/auth/[...nextauth]/route"
import ClientHome from './components/ClientHome';

export const metadata = {
  title: 'LibDesk | AI Professional Headshots for LinkedIn & Resumes',
  description: 'Upload your selfie and instantly generate studio-quality professional headshots. Perfect for LinkedIn profiles, resumes, and corporate portfolios.',
  keywords: [
    'AI headshots', 
    'professional portrait', 
    'LinkedIn profile picture', 
    'resume photo', 
    'AI photo generator', 
    'LibDesk'
  ],
  openGraph: {
    title: 'LibDesk | AI Professional Headshots',
    description: 'Transform everyday selfies into studio-quality professional portraits instantly.',
    type: 'website',
    url: 'https://libdesk.online',
    siteName: 'LibDesk',
  }
};

export default async function Page() {
  // Fetch the session on the server side
  const session = await getServerSession(authOptions); 
  
  return <ClientHome session={session} />;
}