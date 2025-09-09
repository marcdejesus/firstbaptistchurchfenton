import { Metadata } from 'next';
import { prayerPageMetadata } from '@/lib/seo';
import PrayerPageClient from './PrayerPageClient';

export const metadata: Metadata = prayerPageMetadata;

export default function PrayerPage() {
  return <PrayerPageClient />;
} 