import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Dashboard from '@/components/admin/Dashboard';

export const metadata: Metadata = {
  title: 'Admin Dashboard | First Baptist Church Fenton',
  description: 'Website administration dashboard for First Baptist Church Fenton',
  robots: 'noindex, nofollow', // Prevent search engines from indexing admin pages
};

async function getDashboardStats() {
  try {
    // Get actual stats from database
    const [
      totalBlogPosts,
      publishedPosts,
      draftPosts,
      totalUsers,
      totalFAQs,
      totalStaffMembers,
      totalMinistries,
      totalMissionPartners,
      activeAnnouncement,
      recentContactSubmissions,
      recentPrayerRequests
    ] = await Promise.all([
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { status: 'PUBLISHED' } }),
      prisma.blogPost.count({ where: { status: 'DRAFT' } }),
      prisma.user.count({ where: { isActive: true } }),
      prisma.fAQ.count({ where: { isActive: true } }),
      prisma.staffMember.count({ where: { isActive: true } }),
      prisma.ministry.count({ where: { isActive: true } }),
      prisma.missionPartner.count({ where: { isActive: true } }),
      prisma.announcementBanner.findFirst({ where: { isActive: true } }),
      prisma.contactSubmission.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true } } }
      }),
      prisma.prayerRequest.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        where: { isPublic: true }
      })
    ]);

    // Format recent activity from contact submissions
    const recentActivity = recentContactSubmissions.map((submission, index) => ({
      id: submission.id,
      userId: submission.createdBy || 0,
      userName: submission.user?.name || 'Anonymous',
      action: 'submitted',
      resourceType: 'contact form',
      resourceId: submission.id,
      createdAt: submission.createdAt,
    }));

    return {
      totalBlogPosts,
      publishedPosts,
      draftPosts,
      totalUsers,
      totalFAQs,
      totalStaffMembers,
      totalMinistries,
      totalMissionPartners,
      activeAnnouncement,
      recentActivity,
      recentContactSubmissions,
      recentPrayerRequests,
      storageUsed: 0, // Would calculate from UploadThing if needed
      storageLimit: 1024 * 1024 * 1024, // 1GB
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Return default stats if there's an error
    return {
      totalBlogPosts: 0,
      publishedPosts: 0,
      draftPosts: 0,
      totalUsers: 0,
      totalFAQs: 0,
      totalStaffMembers: 0,
      totalMinistries: 0,
      totalMissionPartners: 0,
      recentActivity: [],
      recentContactSubmissions: [],
      recentPrayerRequests: [],
      storageUsed: 0,
      storageLimit: 1024 * 1024 * 1024,
    };
  }
}

async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return null;
  }

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

export default async function AdminDashboardPage() {
  const [stats, user] = await Promise.all([
    getDashboardStats(),
    getCurrentUser()
  ]);

  if (!user) {
    return null; // This shouldn't happen due to layout protection
  }

  return <Dashboard stats={stats} userRole={user.role} />;
}