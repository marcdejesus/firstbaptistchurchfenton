import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { MissionPartnerForm } from '@/components/admin/MissionPartnerForm';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Add New Mission Partner | Admin Dashboard',
  description: 'Add a new mission partner to your global missions network',
  robots: 'noindex, nofollow',
};

export default async function NewMissionPartnerPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  return <MissionPartnerForm />;
}
