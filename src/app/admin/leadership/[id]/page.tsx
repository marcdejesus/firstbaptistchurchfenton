import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { StaffForm } from '@/components/admin/StaffForm';
import { notFound, redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Edit Staff Member | Admin Dashboard',
  description: 'Edit staff member information',
  robots: 'noindex, nofollow',
};

interface EditStaffPageProps {
  params: {
    id: string;
  };
}

async function getStaffMember(id: string) {
  try {
    const staffMember = await prisma.staffMember.findUnique({
      where: { id: parseInt(id) },
    });
    return staffMember;
  } catch (error) {
    console.error('Error fetching staff member:', error);
    return null;
  }
}

export default async function EditStaffPage({ params }: EditStaffPageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  const resolvedParams = await params;
  const staffMember = await getStaffMember(resolvedParams.id);
  
  if (!staffMember) {
    notFound();
  }

  return <StaffForm staffMember={staffMember} isEditing={true} />;
}
