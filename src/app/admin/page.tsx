"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth'; // Placeholder hook
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
                <TableCell><Badge variant={post.status === 'Published' ? 'success' : 'outline'}>{post.status}</Badge></TableCell>
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
              <TableCell><Badge variant={req.status === 'Approved' ? 'success' : 'destructive'}>{req.status}</Badge></TableCell>
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="blog">Blog Posts</TabsTrigger>
          <TabsTrigger value="prayer">Prayer Requests</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="mt-4">
          <UserManagement />
        </TabsContent>
        <TabsContent value="blog" className="mt-4">
          <BlogManagement />
        </TabsContent>
        <TabsContent value="prayer" className="mt-4">
          <PrayerManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
} 