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
  description: 'Join First Baptist Church Fenton, a welcoming community in Fenton, Michigan. Sunday services at 10 AM. Experience authentic worship, biblical teaching, and genuine fellowship. All are welcome!',
  keywords: [
    'First Baptist Church',
    'Fenton Michigan',
    'Baptist Church',
    'Christian Community',
    'Sunday Service',
    'Bible Study',
    'Youth Ministry',
    'Family Church',
    'Worship',
    'Faith Community'
  ],
  authors: [{ name: 'First Baptist Church Fenton' }],
  creator: 'First Baptist Church Fenton',
  publisher: 'First Baptist Church Fenton',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://fbcfenton.org'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'First Baptist Church of Fenton - Growing in Faith, Sharing God\'s Love',
    description: 'Join our welcoming community in Fenton, Michigan. Sunday services at 10 AM. Experience authentic worship, biblical teaching, and genuine fellowship.',
    url: 'https://fbcfenton.org',
    siteName: 'First Baptist Church Fenton',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'First Baptist Church Fenton - Welcome Home',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'First Baptist Church of Fenton',
    description: 'Growing in Faith, Sharing God\'s Love - Join us Sundays at 10 AM',
    images: ['/og-image.jpg'],
    creator: '@FBCFenton',
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
            {/* Announcement Banner */}
            <div className="relative z-30 bg-accent text-white">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center flex items-center justify-center">
                <p className="text-sm text-white">
                  <span className="inline-block animate-pulse">
                    Welcome! Join us Sundays at 10:30 AM —
                    <a href="/visit" className="underline font-semibold ml-1 text-white hover:text-white/80">Plan your visit</a>
                  </span>
                </p>
              </div>
            </div>
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
