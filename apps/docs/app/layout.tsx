import '@workspace/ui/globals.css';
import './globals.css';

import { RootProvider } from 'fumadocs-ui/provider';
import { Inter } from 'next/font/google';
import Providers from './providers';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata = {
  title: 'OProgress - Lightweight progress bar',
  description:
    'A lightweight and customizable progress bar for better user experience.',
  keywords: [
    'next',
    'next.js',
    'progress',
    'progress bar',
    'nprogress',
    'oprogress',
    'oprogress',
    'next-progress',
    'next-nprogress',
    'next-nprogress-bar',
    'nprogress-v2',
    '@oprogress/core',
    '@oprogress/react',
    '@oprogress/next',
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="DvEmYfEcqg4qdrj348IH1EyyCQXagUvrXC9JzHcE6nU"
        />
      </head>

      <body className="flex flex-col min-h-screen">
        <Providers>
          <RootProvider
            theme={{
              defaultTheme: 'dark',
            }}
          >
            {children}
          </RootProvider>
        </Providers>
      </body>
    </html>
  );
}
