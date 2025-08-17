import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import type { User } from '@/types/cms';

export const metadata: Metadata = {
  title: {
    template: '%s | Admin Dashboard | First Baptist Church Fenton',
    default: 'Admin Dashboard | First Baptist Church Fenton',
  },
  description: 'Website administration for First Baptist Church Fenton',
  robots: 'noindex, nofollow', // Prevent search engines from indexing admin pages
};

// Mock authentication check - replace with actual authentication logic
async function getCurrentUser(): Promise<User | null> {
  // In a real implementation, this would:
  // 1. Check for authentication cookies/tokens
  // 2. Validate the session
  // 3. Fetch user data from database
  // 4. Return null if not authenticated
  
  // For now, return a mock admin user
  return {
    id: 1,
    uuid: 'user-1',
    email: 'admin@fbcfenton.org',
    name: 'Admin User',
    role: 'admin',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/admin/login');
  }

  // Redirect if user is not active
  if (!user.isActive) {
    redirect('/admin/unauthorized');
  }

  return <AdminLayout user={user}>{children}</AdminLayout>;
}
