import { Metadata } from 'next';
import { staffPageMetadata } from '@/lib/seo';
import StaffPageClient from './StaffPageClient';

export const metadata: Metadata = staffPageMetadata;

export default function StaffPage() {
  return <StaffPageClient />;
} 