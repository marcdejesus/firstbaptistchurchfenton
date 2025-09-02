import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import PrayerRequestsClient from './PrayerRequestsClient';

export const metadata: Metadata = {
  title: 'Prayer Requests | Admin Dashboard',
  description: 'Manage prayer requests from your community',
  robots: 'noindex, nofollow',
};

async function getPrayerRequests() {
  try {
    const requests = await prisma.prayerRequest.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
          }
        }
      }
    });
    return requests;
  } catch (error) {
    console.error('Error fetching prayer requests:', error);
    return [];
  }
}

export default async function PrayerRequestsPage() {
  const session = await getServerSession(authOptions);
  const requests = await getPrayerRequests();

  return <PrayerRequestsClient initialRequests={requests} />;
}