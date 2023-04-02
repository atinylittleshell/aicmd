import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import { Source_Code_Pro } from 'next/font/google';
import { Metadata } from 'next/types';

import BuyMeACoffeeButton from '../components/BuyMeACoffeeButton';
import ClientSideProviders from '../components/ClientSideProviders';
import GithubButton from '../components/GithubButton';

const codeFont = Source_Code_Pro({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'aicmd.app',
  description: 'AICMD - A CLI program that allows you to run shell commands using nautral language.',
  viewport: 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no',
  icons: '/favicon.ico',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="night" className={codeFont.className}>
      <body className="h-screen w-screen flex flex-col p-2">
        <div className="flex justify-center text-4xl">aicmd</div>
        <div className="flex-1 flex flex-col">
          <ClientSideProviders>{children}</ClientSideProviders>
        </div>
        <div className="flex items-center justify-center gap-4 my-4">
          <BuyMeACoffeeButton />
          <GithubButton />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
