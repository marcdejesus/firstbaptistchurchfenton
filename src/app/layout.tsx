import type { Metadata } from 'next';
import { Lora, Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from '@/contexts/UserContext';

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'First Baptist Church of Fenton',
  description: 'First Baptist Church Fenton - Connect with our community.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lora.variable} ${inter.variable}`}>
      <body className="flex flex-col min-h-screen font-inter antialiased grid-background">
        <UserProvider>
          <Header />
          <main className="flex-grow container mx-auto px-4">
            {children}
          </main>
          <Footer />
          <Toaster />
        </UserProvider>
      </body>
    </html>
  );
}
