'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Calendar,
  Users
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';


interface DashboardStats {
  totalBlogPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalUsers: number;
  totalFAQs?: number;
  totalStaffMembers?: number;
  totalMinistries?: number;
  totalMissionPartners?: number;
  activeAnnouncement?: any;
  recentActivity: any[];
  recentContactSubmissions?: any[];
  recentPrayerRequests?: any[];
  storageUsed: number;
  storageLimit: number;
}

interface DashboardProps {
  stats: DashboardStats;
  userRole: 'ADMIN' | 'EDITOR' | 'VIEWER';
}

export function Dashboard({ stats, userRole }: DashboardProps) {

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8">
      {/* Statistics Overview */}
      <div>
        <h2 className="text-2xl font-heading font-bold mb-4">Website Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBlogPosts}</div>
              <div className="flex space-x-2 mt-2">
                <Badge variant="secondary">{stats.publishedPosts} published</Badge>
                <Badge variant="outline">{stats.draftPosts} drafts</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Content Items</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(stats.totalFAQs || 0) + (stats.totalStaffMembers || 0) + (stats.totalMinistries || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                FAQ, Staff, Ministries
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Including editors and admins
              </p>
            </CardContent>
          </Card>



          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Announcement</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.activeAnnouncement ? 'Active' : 'None'}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {stats.activeAnnouncement ? 'Banner is showing' : 'No active banner'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest changes to your website content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.length > 0 ? (
                stats.recentActivity.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{activity.userName || 'Unknown'}</span>{' '}
                        {activity.action} {activity.resourceType}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.createdAt.toLocaleDateString()} at{' '}
                        {activity.createdAt.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Prayer Requests</CardTitle>
            <CardDescription>
              Latest prayer requests from church members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentPrayerRequests && stats.recentPrayerRequests.length > 0 ? (
                stats.recentPrayerRequests.slice(0, 3).map((request, index) => (
                  <div key={request.id || index} className="flex items-start space-x-3">
                    <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{request.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {request.message?.substring(0, 100)}...
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Link href="/admin/communications/prayer">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent prayer requests</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Help Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Need Help?</CardTitle>
          <CardDescription className="text-blue-700">
            Resources to help you manage your website effectively
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" asChild className="h-auto p-4 text-left">
              <Link href="/admin/help/getting-started">
                <div>
                  <h4 className="font-semibold">Getting Started Guide</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Learn the basics of managing your website
                  </p>
                </div>
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="h-auto p-4 text-left">
              <Link href="/admin/help/video-tutorials">
                <div>
                  <h4 className="font-semibold">Video Tutorials</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Step-by-step video guides for common tasks
                  </p>
                </div>
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="h-auto p-4 text-left">
              <Link href="/admin/help/contact-support">
                <div>
                  <h4 className="font-semibold">Contact Support</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Get help when you need it most
                  </p>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
