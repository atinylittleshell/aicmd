import './globals.css';

import { Inter } from 'next/font/google';
import { Metadata } from 'next/types';

import ClientSideProviders from '../components/ClientSideProviders';

const interFont = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'wePaint.ai',
  description: 'We paint. We learn. We share.',
  viewport: 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no',
  icons: '/favicon.ico',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dracula" className={interFont.className}>
      <body>
        <ClientSideProviders>{children}</ClientSideProviders>
      </body>
    </html>
  );
}