import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminLayout from '@/components/admin/AdminLayout';

export const metadata: Metadata = {
  title: {
    template: '%s | Admin Dashboard | First Baptist Church Fenton',
    default: 'Admin Dashboard | First Baptist Church Fenton',
  },
  description: 'Website administration for First Baptist Church Fenton',
  robots: 'noindex, nofollow', // Prevent search engines from indexing admin pages
};

async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return null;
  }

  // Fetch full user data from database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      uuid: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    }
  });

  return user;
}

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/login?callbackUrl=/admin');
  }

  // Check if user has admin access
  if (!['ADMIN', 'EDITOR'].includes(user.role)) {
    redirect('/unauthorized');
  }

  // Redirect if user is not active
  if (!user.isActive) {
    redirect('/unauthorized');
  }

  return <AdminLayout user={user}>{children}</AdminLayout>;
}
