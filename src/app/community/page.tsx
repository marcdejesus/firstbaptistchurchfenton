"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  Plus, 
  Calendar, 
  User,
  Flag,
  Lock,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import type { ForumPost, ForumCategory, CreatePostForm } from '@/types';

// Mock data for development - replace with actual API calls when Supabase is set up
const mockCategories: ForumCategory[] = [
  { id: '1', name: 'Prayer Requests', description: 'Share prayer requests and praises', color: '#3B82F6', created_at: '', updated_at: '' },
  { id: '2', name: 'Event Planning', description: 'Coordinate and discuss upcoming events', color: '#10B981', created_at: '', updated_at: '' },
  { id: '3', name: 'General Discussion', description: 'General community conversation', color: '#8B5CF6', created_at: '', updated_at: '' },
  { id: '4', name: 'Bible Study', description: 'Discuss scripture and spiritual growth', color: '#F59E0B', created_at: '', updated_at: '' },
  { id: '5', name: 'Volunteer Opportunities', description: 'Find ways to serve in our community', color: '#EF4444', created_at: '', updated_at: '' },
  { id: '6', name: 'Announcements', description: 'Important church announcements', color: '#6366F1', created_at: '', updated_at: '' },
];

const mockPosts: ForumPost[] = [
  {
    id: '1',
    title: 'Welcome to our new Community Forum!',
    content: 'We are excited to launch this new platform for our church family to connect, share, and grow together.',
    author_id: '1',
    category_id: '6',
    attachments: [],
    is_flagged: false,
    flag_count: 0,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    author: { id: '1', name: 'Pastor Smith', email: 'pastor@church.com', avatarUrl: '', role: 'admin' },
    category: mockCategories[5],
    comment_count: 5
  },
  {
    id: '2',
    title: 'Prayer for healing',
    content: 'Please pray for my grandmother who is recovering from surgery. Thank you for your support.',
    author_id: '2',
    category_id: '1',
    attachments: [],
    is_flagged: false,
    flag_count: 0,
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    author: { id: '2', name: 'Sarah Johnson', email: 'sarah@email.com', avatarUrl: '', role: 'member' },
    category: mockCategories[0],
    comment_count: 3
  }
];

export default function CommunityPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [posts, setPosts] = useState<ForumPost[]>(mockPosts);
  const [categories, setCategories] = useState<ForumCategory[]>(mockCategories);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form state for creating new posts
  const [newPost, setNewPost] = useState<CreatePostForm>({
    title: '',
    content: '',
    category_id: '',
    attachments: []
  });

  // Filter posts by category
  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category_id === selectedCategory);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to create a post.',
        variant: 'destructive'
      });
      return;
    }

    if (!newPost.title.trim() || !newPost.content.trim() || !newPost.category_id) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      // const createdPost = await createForumPost(newPost, user.id);
      
      // Mock creation for now
      const mockCreatedPost: ForumPost = {
        id: Date.now().toString(),
        title: newPost.title,
        content: newPost.content,
        author_id: user.id,
        category_id: newPost.category_id,
        attachments: [],
        is_flagged: false,
        flag_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        author: user,
        category: categories.find(c => c.id === newPost.category_id),
        comment_count: 0
      };

      setPosts(prev => [mockCreatedPost, ...prev]);
      setNewPost({ title: '', content: '', category_id: '', attachments: [] });
      setIsCreateDialogOpen(false);

      toast({
        title: 'Post Created',
        description: 'Your post has been published successfully.',
      });
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: 'Error',
        description: 'Failed to create post. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show login prompt for non-authenticated users
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <Card className="shadow-xl bg-card">
          <CardHeader>
            <Lock className="mx-auto h-16 w-16 text-accent mb-4" />
            <CardTitle className="text-3xl font-lora text-card-foreground">
              Members Only
            </CardTitle>
            <CardDescription className="text-card-foreground/80 pt-2">
              The Community Forum is available to registered church members only.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-card-foreground/90">
              This is a private space for our church family to connect, share prayer requests, 
              coordinate events, and discuss spiritual growth together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/login">Log In</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/register">Register</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      {/* Header */}
      <div className="bg-primary/20 py-16 mb-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-lora font-bold text-primary-foreground mb-2">
                Community Forum
              </h1>
              <p className="text-lg text-primary-foreground/80">
                Connect, share, and grow together as a church family
              </p>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Post</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreatePost} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newPost.title}
                      onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter post title..."
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={newPost.category_id} 
                      onValueChange={(value) => setNewPost(prev => ({ ...prev, category_id: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: category.color }}
                              />
                              <span>{category.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={newPost.content}
                      onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Write your post content..."
                      rows={6}
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'Creating...' : 'Create Post'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All Categories
            </Button>
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center space-x-2"
              >
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: category.color }}
                />
                <span>{category.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                <p className="text-muted-foreground mb-4">
                  {selectedCategory === 'all' 
                    ? 'Be the first to start a conversation!'
                    : 'No posts in this category yet. Be the first to post!'}
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Post
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredPosts.map(post => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarImage src={post.author?.avatarUrl} />
                      <AvatarFallback>
                        {post.author?.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link 
                            href={`/community/posts/${post.id}`}
                            className="text-xl font-semibold hover:text-accent transition-colors"
                          >
                            {post.title}
                          </Link>
                          <div className="flex items-center space-x-3 mt-1 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{post.author?.name}</span>
                              {post.author?.role === 'admin' && (
                                <Badge variant="secondary" className="text-xs px-1 py-0">
                                  Admin
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDistanceToNow(new Date(post.created_at))} ago</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {post.category && (
                            <Badge 
                              variant="outline" 
                              className="border-2"
                              style={{ 
                                borderColor: post.category.color,
                                color: post.category.color 
                              }}
                            >
                              {post.category.name}
                            </Badge>
                          )}
                          <Button variant="ghost" size="sm">
                            <Flag className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground line-clamp-3">
                        {post.content}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <MessageSquare className="h-4 w-4" />
                          <span>{post.comment_count || 0} comments</span>
                        </div>
                        
                        <Link href={`/community/posts/${post.id}`}>
                          <Button variant="ghost" size="sm">
                            Read More
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
