import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { MinistryForm } from '@/components/admin/MinistryForm';

export const metadata: Metadata = {
  title: 'Edit Ministry | Admin Dashboard',
  description: 'Edit church ministry or program',
  robots: 'noindex, nofollow',
};

interface EditMinistryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditMinistryPage({ params }: EditMinistryPageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
    redirect('/login');
  }

  const { id: idParam } = await params;
  const id = parseInt(idParam);
  if (isNaN(id)) {
    notFound();
  }

  const ministry = await prisma.ministry.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
        }
      }
    }
  });

  if (!ministry) {
    notFound();
  }

  return <MinistryForm ministry={ministry} isNew={false} />;
}
