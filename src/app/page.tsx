import { Metadata } from 'next';
import { homePageMetadata } from '@/lib/seo';
import HomePageClient from './HomePageClient';

export const metadata: Metadata = homePageMetadata;

export default function Home() {
  return <HomePageClient />;
}
