import { Metadata } from 'next';
import { aboutPageMetadata } from '@/lib/seo';
import AboutPageClient from './AboutPageClient';

export const metadata: Metadata = aboutPageMetadata;

export default function AboutUsPage() {
  return <AboutPageClient />;
} 