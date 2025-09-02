import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AnnouncementBannerForm } from '@/components/admin/AnnouncementBannerForm';

export const metadata: Metadata = {
  title: 'Announcement Banner | Admin Dashboard',
  description: 'Manage the announcement banner displayed on your website',
  robots: 'noindex, nofollow',
};

async function getAnnouncementBanner() {
  try {
    const announcement = await prisma.announcementBanner.findFirst({
      where: { isActive: true }
    });
    return announcement;
  } catch (error) {
    console.error('Error fetching announcement banner:', error);
    return null;
  }
}

export default async function AnnouncementBannerPage() {
  const session = await getServerSession(authOptions);
  const announcement = await getAnnouncementBanner();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Announcement Banner</h1>
        <p className="text-muted-foreground">
          Manage the announcement banner that appears at the top of your website
        </p>
      </div>

      <AnnouncementBannerForm announcement={announcement} />
    </div>
  );
}
