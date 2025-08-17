import { Metadata } from 'next';
import Dashboard from '@/components/admin/Dashboard';
import type { DashboardStats } from '@/types/cms';

export const metadata: Metadata = {
  title: 'Admin Dashboard | First Baptist Church Fenton',
  description: 'Website administration dashboard for First Baptist Church Fenton',
  robots: 'noindex, nofollow', // Prevent search engines from indexing admin pages
};

// Mock data - replace with actual API calls
async function getDashboardStats(): Promise<DashboardStats> {
  // In a real implementation, this would fetch from your database
  return {
    totalBlogPosts: 25,
    publishedPosts: 20,
    draftPosts: 5,
    totalMediaFiles: 150,
    totalUsers: 3,
    recentActivity: [
      {
        id: 1,
        userId: 1,
        userName: 'John Smith',
        action: 'updated',
        resourceType: 'page content',
        resourceId: 1,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        id: 2,
        userId: 2,
        userName: 'Mary Johnson',
        action: 'published',
        resourceType: 'blog post',
        resourceId: 5,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      },
      {
        id: 3,
        userId: 1,
        userName: 'John Smith',
        action: 'uploaded',
        resourceType: 'media file',
        resourceId: 25,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      }
    ],
    upcomingScheduledPosts: [
      {
        id: 10,
        uuid: 'post-10',
        title: 'Preparing Our Hearts for Christmas',
        slug: 'preparing-hearts-christmas',
        status: 'scheduled' as const,
        scheduledFor: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        tags: [],
        viewCount: 0,
        isFeatured: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 11,
        uuid: 'post-11',
        title: 'Youth Ministry Winter Retreat Recap',
        slug: 'youth-winter-retreat-recap',
        status: 'scheduled' as const,
        scheduledFor: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        tags: [],
        viewCount: 0,
        isFeatured: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    storageUsed: 250 * 1024 * 1024, // 250MB
    storageLimit: 1024 * 1024 * 1024, // 1GB
  };
}

// Mock user data - replace with actual authentication
function getCurrentUser() {
  return {
    id: 1,
    uuid: 'user-1',
    email: 'admin@fbcfenton.org',
    name: 'Admin User',
    role: 'admin' as const,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const user = getCurrentUser();

  return <Dashboard stats={stats} userRole={user.role} />;
}