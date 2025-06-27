"use client";

import React, { useState } from 'react';
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
  Shield
} from 'lucide-react';
// Mock useAuth hook for demo purposes
const useAuth = () => ({
  user: { role: 'admin', name: 'Admin User' },
  loading: false
});
import { useRouter } from 'next/navigation';

// Mock Data
const mockUsers = [
  { id: 'usr_1', name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', isApprovedMember: true, joined: '2023-01-15' },
  { id: 'usr_2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'User', isApprovedMember: true, joined: '2023-02-20' },
  { id: 'usr_3', name: 'Mike Johnson', email: 'mike.j@example.com', role: 'User', isApprovedMember: false, joined: '2023-03-10' },
];

const mockBlogPosts = [
  { id: 'post_1', title: 'The True Heart of Worship', author: 'John Doe', date: '2023-10-26', status: 'Published' },
  { id: 'post_2', title: 'Finding Community', author: 'Jane Smith', date: '2023-10-22', status: 'Draft' },
];

const mockPrayerRequests = [
    { id: 'pray_1', submittedBy: 'Anonymous', request: 'Healing for a family member.', date: '2023-10-28', status: 'Approved' },
    { id: 'pray_2', submittedBy: 'Jane Smith', request: 'Guidance on a major life decision.', date: '2023-10-27', status: 'Pending' },
];

// Newsletter data
const mockNewsletters = [
  { id: 'news_1', title: 'December Newsletter - Advent Season', subject: 'Preparing Our Hearts for Christmas', status: 'Sent', date: '2024-12-01', subscribers: 245 },
  { id: 'news_2', title: 'November Newsletter - Thanksgiving', subject: 'Gratitude in All Seasons', status: 'Draft', date: '2024-11-15', subscribers: 0 },
];

// Analytics data
const mockAnalytics = {
  totalUsers: 156,
  newUsersThisMonth: 23,
  totalNewsletterSubscribers: 245,
  newSubscribersThisMonth: 18,
  totalBlogPosts: 12,
  totalEvents: 8,
  totalPrayerRequests: 15,
};

// Placeholder Components for Management Sections
const UserManagement = () => (
  <Card>
    <CardHeader>
      <CardTitle>Manage Users</CardTitle>
      <CardDescription>View, edit roles, and approve members.</CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Approved</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockUsers.map(user => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell><Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>{user.role}</Badge></TableCell>
              <TableCell>{user.isApprovedMember ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">Edit</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

const BlogManagement = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Manage Blog Posts</CardTitle>
          <CardDescription>Create, edit, and publish articles.</CardDescription>
        </div>
        <Button>Create New Post</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockBlogPosts.map(post => (
              <TableRow key={post.id}>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.author}</TableCell>
                <TableCell>{post.date}</TableCell>
                <TableCell><Badge variant={post.status === 'Published' ? 'default' : 'outline'}>{post.status}</Badge></TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

const PrayerManagement = () => (
    <Card>
      <CardHeader>
        <CardTitle>Manage Prayer Requests</CardTitle>
        <CardDescription>Approve or delete prayer wall submissions.</CardDescription>
      </CardHeader>
      <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Submitted By</TableHead>
            <TableHead>Request</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockPrayerRequests.map(req => (
            <TableRow key={req.id}>
              <TableCell>{req.submittedBy}</TableCell>
              <TableCell className="max-w-xs truncate">{req.request}</TableCell>
              <TableCell>{req.date}</TableCell>
              <TableCell><Badge variant={req.status === 'Approved' ? 'default' : 'destructive'}>{req.status}</Badge></TableCell>
              <TableCell className="space-x-2">
                <Button variant="outline" size="sm">Approve</Button>
                <Button variant="destructive" size="sm">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </CardContent>
    </Card>
  );

// Newsletter Management Component
const NewsletterManagement = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newsletterTitle, setNewsletterTitle] = useState('');
  const [newsletterSubject, setNewsletterSubject] = useState('');
  const [newsletterContent, setNewsletterContent] = useState('');

  const handleCreateNewsletter = () => {
    // In a real app, this would create a new newsletter
    console.log('Creating newsletter:', { newsletterTitle, newsletterSubject, newsletterContent });
    setIsCreateDialogOpen(false);
    setNewsletterTitle('');
    setNewsletterSubject('');
    setNewsletterContent('');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2 text-accent" />
            Newsletter Management
          </CardTitle>
          <CardDescription>Create and manage newsletter campaigns.</CardDescription>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent-600">
              <Plus className="h-4 w-4 mr-2" />
              Create Newsletter
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Newsletter</DialogTitle>
              <DialogDescription>
                Create a new newsletter to send to your subscribers.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="newsletter-title">Newsletter Title</Label>
                <Input
                  id="newsletter-title"
                  value={newsletterTitle}
                  onChange={(e) => setNewsletterTitle(e.target.value)}
                  placeholder="e.g., December Newsletter - Advent Season"
                />
              </div>
              <div>
                <Label htmlFor="newsletter-subject">Email Subject</Label>
                <Input
                  id="newsletter-subject"
                  value={newsletterSubject}
                  onChange={(e) => setNewsletterSubject(e.target.value)}
                  placeholder="e.g., Preparing Our Hearts for Christmas"
                />
              </div>
              <div>
                <Label htmlFor="newsletter-content">Content</Label>
                <Textarea
                  id="newsletter-content"
                  value={newsletterContent}
                  onChange={(e) => setNewsletterContent(e.target.value)}
                  placeholder="Write your newsletter content here..."
                  rows={10}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateNewsletter} className="bg-accent hover:bg-accent-600">
                Create Newsletter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Subscribers</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockNewsletters.map(newsletter => (
              <TableRow key={newsletter.id}>
                <TableCell className="font-medium">{newsletter.title}</TableCell>
                <TableCell>{newsletter.subject}</TableCell>
                <TableCell>
                  <Badge variant={newsletter.status === 'Sent' ? 'default' : 'outline'}>
                    {newsletter.status}
                  </Badge>
                </TableCell>
                <TableCell>{newsletter.date}</TableCell>
                <TableCell>{newsletter.subscribers}</TableCell>
                <TableCell className="space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  {newsletter.status === 'Draft' && (
                    <Button size="sm" className="bg-accent hover:bg-accent-600">
                      <Send className="h-4 w-4 mr-1" />
                      Send
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// Analytics Dashboard Component
const AnalyticsDashboard = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{mockAnalytics.totalUsers}</p>
              <p className="text-sm text-emerald-600">+{mockAnalytics.newUsersThisMonth} this month</p>
            </div>
            <Users className="h-8 w-8 text-accent" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Newsletter Subscribers</p>
              <p className="text-2xl font-bold">{mockAnalytics.totalNewsletterSubscribers}</p>
              <p className="text-sm text-emerald-600">+{mockAnalytics.newSubscribersThisMonth} this month</p>
            </div>
            <Mail className="h-8 w-8 text-accent" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Blog Posts</p>
              <p className="text-2xl font-bold">{mockAnalytics.totalBlogPosts}</p>
              <p className="text-sm text-muted-foreground">Total published</p>
            </div>
            <FileText className="h-8 w-8 text-accent" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Events</p>
              <p className="text-2xl font-bold">{mockAnalytics.totalEvents}</p>
              <p className="text-sm text-muted-foreground">This month</p>
            </div>
            <Calendar className="h-8 w-8 text-accent" />
          </div>
        </CardContent>
      </Card>
    </div>
    
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-accent" />
          Quick Actions
        </CardTitle>
        <CardDescription>Common administrative tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
            <FileText className="h-6 w-6 text-accent" />
            <span>Create Blog Post</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
            <Mail className="h-6 w-6 text-accent" />
            <span>Send Newsletter</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
            <Calendar className="h-6 w-6 text-accent" />
            <span>Create Event</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
            <Settings className="h-6 w-6 text-accent" />
            <span>Site Settings</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Placeholder for security. In a real app, this would be more robust.
  if (loading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  if (!user || user.role !== 'admin') {
    // router.push('/login'); // Redirect non-admins
    return (
        <div className="container mx-auto px-4 py-8 text-center">
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p>You do not have permission to view this page.</p>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-transparent to-primary-50/30">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-accent-50 py-12">
        <div className="container mx-auto px-4">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-4">
                  <Shield className="h-8 w-8 text-accent mr-3" />
                  <h1 className="text-3xl md:text-4xl font-lora font-bold">
                    Admin Dashboard
                  </h1>
                </div>
                <p className="text-lg text-primary-foreground/80">
                  Welcome back, {user.name}. Manage your church website and community.
                </p>
              </div>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full translate-y-12 -translate-x-12"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="analytics" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Blog
            </TabsTrigger>
            <TabsTrigger value="newsletter" className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              Newsletter
            </TabsTrigger>
            <TabsTrigger value="prayer" className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Prayer
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
          <TabsContent value="blog">
            <BlogManagement />
          </TabsContent>
          <TabsContent value="newsletter">
            <NewsletterManagement />
          </TabsContent>
          <TabsContent value="prayer">
            <PrayerManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 