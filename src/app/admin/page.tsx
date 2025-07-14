"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { usersService } from '@/lib/firestore/users';
import { blogService } from '@/lib/firestore/blog';
import { prayerRequestsService } from '@/lib/firestore/prayers';
import { eventsService } from '@/lib/firestore/events';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Mail, 
  Plus, 
  Edit, 
  Trash2, 
  Send,
  BarChart3,
  Calendar,
  Settings,
  Shield,
  Loader2
} from 'lucide-react';

const PlaceholderContent = ({ title }: { title: string }) => (
    <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">{title} - Data not available.</p>
    </div>
);

const UserManagement = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const allUsers = await usersService.getAllUsers();
                setUsers(allUsers);
            } catch (error) {
                console.error('Error loading users:', error);
            } finally {
                setLoading(false);
            }
        };
        loadUsers();
    }, []);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="font-heading">Manage Users</CardTitle>
                    <CardDescription>View, edit roles, and approve members.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-48">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-heading">Manage Users</CardTitle>
                <CardDescription>View, edit roles, and approve members.</CardDescription>
            </CardHeader>
            <CardContent>
                {users.length === 0 ? (
                    <PlaceholderContent title="No users found" />
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-muted rounded-lg">
                                <div className="text-2xl font-bold">{users.length}</div>
                                <div className="text-sm text-muted-foreground">Total Users</div>
                            </div>
                            <div className="text-center p-4 bg-muted rounded-lg">
                                <div className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</div>
                                <div className="text-sm text-muted-foreground">Admins</div>
                            </div>
                            <div className="text-center p-4 bg-muted rounded-lg">
                                <div className="text-2xl font-bold">{users.filter(u => !u.isApprovedMember).length}</div>
                                <div className="text-sm text-muted-foreground">Pending Approval</div>
                            </div>
                        </div>
                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.slice(0, 10).map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                                    {user.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={user.isApprovedMember ? 'default' : 'secondary'}>
                                                    {user.isApprovedMember ? 'Approved' : 'Pending'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const BlogManagement = () => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="font-heading">Manage Blog Posts</CardTitle>
                <CardDescription>Create, edit, and publish articles.</CardDescription>
            </div>
            <Button disabled>Create New Post</Button>
        </CardHeader>
        <CardContent>
            <PlaceholderContent title="Blog Management" />
        </CardContent>
    </Card>
);

const PrayerManagement = () => (
    <Card>
        <CardHeader>
            <CardTitle className="font-heading">Manage Prayer Requests</CardTitle>
            <CardDescription>Approve or delete prayer wall submissions.</CardDescription>
        </CardHeader>
        <CardContent>
            <PlaceholderContent title="Prayer Requests" />
        </CardContent>
    </Card>
);

const NewsletterManagement = () => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="font-heading flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Newsletter Management
                </CardTitle>
                <CardDescription>Create and manage newsletter campaigns.</CardDescription>
            </div>
             <Button disabled>
              <Plus className="h-4 w-4 mr-2" />
              Create Newsletter
            </Button>
        </CardHeader>
        <CardContent>
            <PlaceholderContent title="Newsletter Management" />
        </CardContent>
    </Card>
);

const AnalyticsDashboard = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const [userStats, blogStats, prayerStats, eventStats] = await Promise.all([
                    usersService.getUserStats(),
                    blogService.getBlogStats(),
                    prayerRequestsService.getPrayerStats(),
                    eventsService.getEventStats(),
                ]);

                setStats({
                    users: userStats,
                    blog: blogStats,
                    prayers: prayerStats,
                    events: eventStats,
                });
            } catch (error) {
                console.error('Error loading stats:', error);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="font-heading">Analytics Dashboard</CardTitle>
                    <CardDescription>View website traffic and engagement.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-48">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!stats) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="font-heading">Analytics Dashboard</CardTitle>
                    <CardDescription>View website traffic and engagement.</CardDescription>
                </CardHeader>
                <CardContent>
                    <PlaceholderContent title="Unable to load analytics" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-heading">Analytics Dashboard</CardTitle>
                <CardDescription>View website traffic and engagement.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                        <div className="text-2xl font-bold text-blue-900">{stats.users.totalUsers}</div>
                        <div className="text-sm text-blue-700">Total Users</div>
                        <div className="text-xs text-blue-600 mt-1">{stats.users.pendingApproval} pending</div>
                    </div>
                    
                    <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                        <FileText className="h-8 w-8 mx-auto mb-2 text-green-600" />
                        <div className="text-2xl font-bold text-green-900">{stats.blog.publishedPosts}</div>
                        <div className="text-sm text-green-700">Published Posts</div>
                        <div className="text-xs text-green-600 mt-1">{stats.blog.draftPosts} drafts</div>
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <MessageSquare className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                        <div className="text-2xl font-bold text-purple-900">{stats.prayers.totalRequests}</div>
                        <div className="text-sm text-purple-700">Prayer Requests</div>
                        <div className="text-xs text-purple-600 mt-1">{stats.prayers.answeredRequests} answered</div>
                    </div>
                    
                    <div className="text-center p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <Calendar className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                        <div className="text-2xl font-bold text-orange-900">{stats.events.upcomingEvents}</div>
                        <div className="text-sm text-orange-700">Upcoming Events</div>
                        <div className="text-xs text-orange-600 mt-1">{stats.events.totalRSVPs} RSVPs</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const EventManagement = () => (
    <Card>
        <CardHeader>
            <CardTitle className="font-heading">Event Management</CardTitle>
            <CardDescription>Create, edit, and manage church events.</CardDescription>
        </CardHeader>
        <CardContent>
            <PlaceholderContent title="Event Management" />
        </CardContent>
    </Card>
);

const SiteSettings = () => (
    <Card>
        <CardHeader>
            <CardTitle className="font-heading">Site Settings</CardTitle>
            <CardDescription>Manage global site configurations.</CardDescription>
        </CardHeader>
        <CardContent>
            <PlaceholderContent title="Site Settings" />
        </CardContent>
    </Card>
);


export default function AdminPage() {
  const { user, isLoading } = useUser();

  const TABS = [
    { value: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { value: 'users', label: 'Users', icon: Users },
    { value: 'blog', label: 'Blog', icon: FileText },
    { value: 'prayer', label: 'Prayer Requests', icon: MessageSquare },
    { value: 'newsletter', label: 'Newsletter', icon: Mail },
    { value: 'events', label: 'Events', icon: Calendar },
    { value: 'settings', label: 'Settings', icon: Settings },
  ];

  if (isLoading) {
    return (
      <main className="bg-background-secondary min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="bg-background-secondary min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <CardTitle className="font-heading">Access Denied</CardTitle>
            <CardDescription>
              You need to be signed in to access the admin panel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => window.location.href = '/'}
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (user.role !== 'admin') {
    return (
      <main className="bg-background-secondary min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <CardTitle className="font-heading">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the admin panel. Admin privileges are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground text-center">
              <p>Signed in as: <strong>{user.name}</strong></p>
              <div>Role: <Badge variant="secondary">{user.role}</Badge></div>
            </div>
            <Button 
              className="w-full mt-4" 
              onClick={() => window.location.href = '/'}
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="bg-background-secondary min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-heading font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">Welcome, {user.name}.</p>
        </header>

        <Tabs defaultValue="dashboard">
          <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 mb-6">
            {TABS.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value} className="flex-1">
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="dashboard"><AnalyticsDashboard /></TabsContent>
          <TabsContent value="users"><UserManagement /></TabsContent>
          <TabsContent value="blog"><BlogManagement /></TabsContent>
          <TabsContent value="prayer"><PrayerManagement /></TabsContent>
          <TabsContent value="newsletter"><NewsletterManagement /></TabsContent>
          <TabsContent value="events"><EventManagement /></TabsContent>
          <TabsContent value="settings"><SiteSettings /></TabsContent>
        </Tabs>
      </div>
    </main>
  );
}