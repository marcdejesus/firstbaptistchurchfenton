import { Metadata } from 'next';
import { eventsPageMetadata } from '@/lib/seo';
import EventsPageClient from './EventsPageClient';

export const metadata: Metadata = eventsPageMetadata;

export default function EventsPage() {
  return <EventsPageClient />;
}
