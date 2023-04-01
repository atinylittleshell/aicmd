import './globals.css';

import { Source_Code_Pro } from 'next/font/google';
import { Metadata } from 'next/types';

import ClientSideProviders from '../components/ClientSideProviders';

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
      <body className="h-screen w-screen flex flex-col">
        <div className="self-center text-4xl m-4">AICMD</div>
        <div className="flex-1 flex flex-col">
          <ClientSideProviders>{children}</ClientSideProviders>
        </div>
      </body>
    </html>
  );
}
