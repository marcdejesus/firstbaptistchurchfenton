import { Metadata } from 'next';
import { contactPageMetadata } from '@/lib/seo';
import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = contactPageMetadata;

export default function ContactPage() {
  return <ContactPageClient />;
} 