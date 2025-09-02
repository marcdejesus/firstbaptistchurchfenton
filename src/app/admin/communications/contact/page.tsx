import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ContactSubmissionsClient from './ContactSubmissionsClient';

export const metadata: Metadata = {
  title: 'Contact Submissions | Admin Dashboard',
  description: 'Manage contact form submissions',
  robots: 'noindex, nofollow',
};

async function getContactSubmissions() {
  try {
    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
          }
        }
      }
    });
    return submissions;
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    return [];
  }
}

export default async function ContactSubmissionsPage() {
  const session = await getServerSession(authOptions);
  const submissions = await getContactSubmissions();

  return <ContactSubmissionsClient initialSubmissions={submissions} />;
}