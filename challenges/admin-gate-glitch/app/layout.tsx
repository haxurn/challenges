import './globals.css';
import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import { Providers } from '@/components/Providers';
import { AmbientAudio } from '@/components/AmbientAudio';

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: 'Admin Gate Glitch',
  description: 'Crack the system. Claim the flag.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} font-sans antialiased`}>
        <AmbientAudio />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}