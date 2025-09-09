import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UsersClient } from '@/components/admin/UsersClient';

export const metadata: Metadata = {
  title: 'User Management | Admin Dashboard',
  description: 'Manage user accounts and permissions',
  robots: 'noindex, nofollow',
};

async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        uuid: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            blogPosts: true,
            faqs: true,
          }
        }
      }
    });
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  const users = await getUsers();

  if (!session?.user) {
    return <div>Unauthorized</div>;
  }

  return (
    <UsersClient 
      initialUsers={users} 
      currentUserEmail={session.user.email || ''} 
    />
  );
}