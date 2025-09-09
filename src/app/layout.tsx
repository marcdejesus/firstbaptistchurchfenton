import type { Metadata } from 'next';
import { Cardo, Proza_Libre } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from '@/components/auth/SessionProvider';
import { ChurchStructuredData } from '@/components/seo/StructuredData';
import { SkipLink } from '@/components/accessibility/FocusManager';
import { ScrollToTop, MobilePerformanceProvider } from '@/components/mobile/MobileOptimizations';
import { HomepageDataProvider } from '@/components/home/HomepageDataProvider';

const cardo = Cardo({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-heading',
  display: 'swap',
});

const prozaLibre = Proza_Libre({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'First Baptist Church of Fenton - Growing in Faith, Sharing God\'s Love',
    template: '%s | First Baptist Church Fenton'
  },
  description: 'Join First Baptist Church Fenton, a welcoming community in Fenton, Michigan. Sunday services at 10:30 AM. Experience authentic worship, biblical teaching, and genuine fellowship. All are welcome!',
  metadataBase: new URL('https://fbcfenton.org'),
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cardo.variable} ${prozaLibre.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <ChurchStructuredData />
      </head>
      <body className="flex flex-col min-h-screen bg-background font-body antialiased">
        <SkipLink />
        <MobilePerformanceProvider>
          <SessionProvider>
            <Header />
            <HomepageDataProvider />
            <main id="main-content" className="flex-grow" tabIndex={-1}>
              {children}
            </main>
            <Footer />
            <ScrollToTop />
            <Toaster />
          </SessionProvider>
        </MobilePerformanceProvider>
      </body>
    </html>
  );
}
