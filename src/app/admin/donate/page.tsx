import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DonateSettingsForm } from '@/components/admin/DonateSettingsForm';

export const metadata: Metadata = {
  title: 'Donate Settings | Admin Dashboard',
  description: 'Manage donation settings and links',
  robots: 'noindex, nofollow',
};

async function getDonateSettings() {
  try {
    const settings = await prisma.donateSettings.findFirst({
      where: { isActive: true }
    });
    return settings;
  } catch (error) {
    console.error('Error fetching donate settings:', error);
    return null;
  }
}

export default async function DonateSettingsPage() {
  const session = await getServerSession(authOptions);
  const settings = await getDonateSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Donate Settings</h1>
        <p className="text-muted-foreground">
          Configure your donation page settings and links
        </p>
      </div>

      <DonateSettingsForm settings={settings} />
    </div>
  );
}
