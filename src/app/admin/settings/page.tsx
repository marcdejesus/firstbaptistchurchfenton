import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings, Database, Shield, Upload, Mail, Calendar, Globe, Server } from 'lucide-react';

export const metadata: Metadata = {
  title: 'System Settings | Admin Dashboard',
  description: 'Manage system settings and configuration',
  robots: 'noindex, nofollow',
};

async function getSystemStats() {
  try {
    const [
      totalUsers,
      totalBlogPosts,
      totalFAQs,
      totalStaffMembers,
      totalMinistries,
      totalMissionPartners,
      totalSlides,
      totalContactSubmissions,
      totalPrayerRequests
    ] = await Promise.all([
      prisma.user.count(),
      prisma.blogPost.count(),
      prisma.fAQ.count(),
      prisma.staffMember.count(),
      prisma.ministry.count(),
      prisma.missionPartner.count(),
      prisma.homeSlideshow.count(),
      prisma.contactSubmission.count(),
      prisma.prayerRequest.count()
    ]);

    return {
      totalUsers,
      totalBlogPosts,
      totalFAQs,
      totalStaffMembers,
      totalMinistries,
      totalMissionPartners,
      totalSlides,
      totalContactSubmissions,
      totalPrayerRequests
    };
  } catch (error) {
    console.error('Error fetching system stats:', error);
    return {
      totalUsers: 0,
      totalBlogPosts: 0,
      totalFAQs: 0,
      totalStaffMembers: 0,
      totalMinistries: 0,
      totalMissionPartners: 0,
      totalSlides: 0,
      totalContactSubmissions: 0,
      totalPrayerRequests: 0
    };
  }
}

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const stats = await getSystemStats();

  const settingsCards = [
    {
      title: 'Website Configuration',
      description: 'Basic website settings and information',
      icon: Globe,
      items: [
        { label: 'Site Title', value: 'First Baptist Church Fenton', status: 'configured' },
        { label: 'Contact Email', value: 'info@fbcfenton.org', status: 'configured' },
        { label: 'Phone Number', value: '(810) 629-9550', status: 'configured' },
        { label: 'Address', value: '15300 Silver Lake Rd, Fenton, MI', status: 'configured' }
      ]
    },
    {
      title: 'Database Status',
      description: 'Database connection and content statistics',
      icon: Database,
      items: [
        { label: 'Connection Status', value: 'Connected', status: 'healthy' },
        { label: 'Total Users', value: stats.totalUsers.toString(), status: 'info' },
        { label: 'Content Items', value: (stats.totalBlogPosts + stats.totalFAQs + stats.totalStaffMembers).toString(), status: 'info' },
        { label: 'Total Submissions', value: (stats.totalContactSubmissions + stats.totalPrayerRequests).toString(), status: 'info' }
      ]
    },
    {
      title: 'File Storage',
      description: 'UploadThing file storage configuration',
      icon: Upload,
      items: [
        { label: 'Storage Provider', value: 'UploadThing', status: 'configured' },
        { label: 'Max File Size', value: '8MB', status: 'configured' },
        { label: 'Allowed Types', value: 'Images (JPG, PNG, WebP)', status: 'configured' },
        { label: 'CDN Status', value: 'Active', status: 'healthy' }
      ]
    },
    {
      title: 'Authentication',
      description: 'User authentication and security settings',
      icon: Shield,
      items: [
        { label: 'Provider', value: 'NextAuth.js', status: 'configured' },
        { label: 'Session Strategy', value: 'JWT', status: 'configured' },
        { label: 'Password Hashing', value: 'bcrypt', status: 'configured' },
        { label: 'Google OAuth', value: 'Disabled', status: 'warning' }
      ]
    },
    {
      title: 'Email Configuration',
      description: 'Email sending and notification settings',
      icon: Mail,
      items: [
        { label: 'Email Provider', value: 'Not Configured', status: 'warning' },
        { label: 'SMTP Status', value: 'Not Connected', status: 'warning' },
        { label: 'Contact Form', value: 'Working (Basic)', status: 'info' },
        { label: 'Notifications', value: 'Disabled', status: 'warning' }
      ]
    },
    {
      title: 'Calendar Integration',
      description: 'Google Calendar API and event management',
      icon: Calendar,
      items: [
        { label: 'Google Calendar', value: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? 'Connected' : 'Not Connected', status: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? 'healthy' : 'warning' },
        { label: 'Calendar ID', value: process.env.CHURCH_CALENDAR_ID ? 'Configured' : 'Not Set', status: process.env.CHURCH_CALENDAR_ID ? 'configured' : 'warning' },
        { label: 'Event Sync', value: 'Automatic', status: 'configured' },
        { label: 'Fallback Events', value: 'Enabled', status: 'configured' }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-600';
      case 'configured': return 'bg-blue-600';
      case 'warning': return 'bg-yellow-600';
      case 'error': return 'bg-red-600';
      case 'info': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'healthy': return 'Healthy';
      case 'configured': return 'Configured';
      case 'warning': return 'Needs Attention';
      case 'error': return 'Error';
      case 'info': return 'Info';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-muted-foreground">
            Monitor and configure your website's system settings
          </p>
        </div>
      </div>

      {/* System Overview */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Server className="h-6 w-6 text-primary" />
            <CardTitle className="text-primary">System Overview</CardTitle>
          </div>
          <CardDescription>
            Current system status and quick statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.totalUsers}</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.totalBlogPosts + stats.totalFAQs}</div>
              <div className="text-sm text-muted-foreground">Content Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.totalSlides}</div>
              <div className="text-sm text-muted-foreground">Slideshow Images</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.totalContactSubmissions}</div>
              <div className="text-sm text-muted-foreground">Messages</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsCards.map((card, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <card.icon className="h-5 w-5 text-primary" />
                <CardTitle>{card.title}</CardTitle>
              </div>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {card.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.label}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">{item.value}</span>
                      <Badge className={getStatusColor(item.status)} variant="default">
                        {getStatusText(item.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common administrative tasks and configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto flex flex-col items-center p-4 space-y-2">
              <Database className="h-6 w-6" />
              <span>Database Backup</span>
              <span className="text-xs text-muted-foreground">Export data</span>
            </Button>
            
            <Button variant="outline" className="h-auto flex flex-col items-center p-4 space-y-2">
              <Mail className="h-6 w-6" />
              <span>Email Setup</span>
              <span className="text-xs text-muted-foreground">Configure SMTP</span>
            </Button>
            
            <Button variant="outline" className="h-auto flex flex-col items-center p-4 space-y-2">
              <Calendar className="h-6 w-6" />
              <span>Calendar Sync</span>
              <span className="text-xs text-muted-foreground">Google Calendar</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Environment Info */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-gray-700">Environment Information</CardTitle>
          <CardDescription>
            Technical details about your deployment environment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Framework:</strong> Next.js 15.x
            </div>
            <div>
              <strong>Database:</strong> Neon PostgreSQL
            </div>
            <div>
              <strong>ORM:</strong> Prisma
            </div>
            <div>
              <strong>Storage:</strong> UploadThing CDN
            </div>
            <div>
              <strong>Authentication:</strong> NextAuth.js
            </div>
            <div>
              <strong>Deployment:</strong> Vercel (recommended)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-900">Security Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="text-yellow-700 space-y-2">
          <p>• Keep your NEXTAUTH_SECRET secure and unique for production</p>
          <p>• Regularly review user accounts and permissions</p>
          <p>• Enable Google OAuth for additional security options</p>
          <p>• Set up email notifications for critical system events</p>
          <p>• Regularly backup your database and content</p>
        </CardContent>
      </Card>
    </div>
  );
}
