"use client";

import React from 'react';
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

const UserManagement = () => (
    <Card>
        <CardHeader>
            <CardTitle className="font-heading">Manage Users</CardTitle>
            <CardDescription>View, edit roles, and approve members.</CardDescription>
        </CardHeader>
        <CardContent>
            <PlaceholderContent title="User Management" />
        </CardContent>
    </Card>
);

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

const AnalyticsDashboard = () => (
    <Card>
        <CardHeader>
            <CardTitle className="font-heading">Analytics Dashboard</CardTitle>
            <CardDescription>View website traffic and engagement.</CardDescription>
        </CardHeader>
        <CardContent>
            <PlaceholderContent title="Analytics" />
        </CardContent>
    </Card>
);

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
  const TABS = [
    { value: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { value: 'users', label: 'Users', icon: Users },
    { value: 'blog', label: 'Blog', icon: FileText },
    { value: 'prayer', label: 'Prayer Requests', icon: MessageSquare },
    { value: 'newsletter', label: 'Newsletter', icon: Mail },
    { value: 'events', label: 'Events', icon: Calendar },
    { value: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <main className="bg-background-secondary min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-heading font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">Welcome, Admin.</p>
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