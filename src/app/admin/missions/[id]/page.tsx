import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { MissionPartnerForm } from '@/components/admin/MissionPartnerForm';
import { notFound, redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Edit Mission Partner | Admin Dashboard',
  description: 'Edit mission partner information',
  robots: 'noindex, nofollow',
};

interface EditMissionPartnerPageProps {
  params: {
    id: string;
  };
}

async function getMissionPartner(id: string) {
  try {
    const missionPartner = await prisma.missionPartner.findUnique({
      where: { id: parseInt(id) },
    });
    return missionPartner;
  } catch (error) {
    console.error('Error fetching mission partner:', error);
    return null;
  }
}

export default async function EditMissionPartnerPage({ params }: EditMissionPartnerPageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  const missionPartner = await getMissionPartner(params.id);
  
  if (!missionPartner) {
    notFound();
  }

  return <MissionPartnerForm missionPartner={missionPartner} isEditing={true} />;
}
