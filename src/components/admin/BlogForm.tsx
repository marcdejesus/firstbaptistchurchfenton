"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { ArrowLeft, Save, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';

interface BlogPost {
  id: number;
  uuid: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  thumbnailUrl?: string | null;
  thumbnailKey?: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  author?: {
    name: string;
  } | null;
}

interface BlogFormProps {
  post?: BlogPost | null;
  isNew: boolean;
}

export function BlogForm({ post, isNew }: BlogFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    thumbnailUrl: post?.thumbnailUrl || '',
    thumbnailKey: post?.thumbnailKey || '',
    status: post?.status || 'DRAFT' as const,
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      toast({
        title: 'Required fields missing',
        description: 'Please fill in the title and content.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const slug = formData.slug || generateSlug(formData.title);
      
      const url = isNew ? '/api/admin/blog' : `/api/admin/blog/${post?.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          slug,
        }),
      });

      if (response.ok) {
        toast({
          title: isNew ? 'Blog post created!' : 'Blog post updated!',
          description: isNew
            ? 'The new blog post has been created successfully.'
            : 'The blog post has been updated successfully.',
        });
        router.push('/admin/blog');
        router.refresh();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Something went wrong.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save blog post. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!post || isNew) return;

    if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/blog/${post.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Blog post deleted!',
          description: 'The blog post has been deleted successfully.',
        });
        router.push('/admin/blog');
        router.refresh();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to delete blog post.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete blog post. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-generate slug when title changes
      if (field === 'title' && !formData.slug) {
        updated.slug = generateSlug(value);
      }
      
      return updated;
    });
  };



  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" asChild>
        <Link href="/admin/blog">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Link>
      </Button>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>{isNew ? 'Create New Blog Post' : 'Edit Blog Post'}</CardTitle>
          <CardDescription>
            {isNew
              ? 'Fill in the details below to create a new blog post.'
              : 'Update the blog post content and settings below.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter post title..."
                required
                disabled={isLoading}
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                placeholder="url-friendly-slug"
                disabled={isLoading}
              />
              <p className="text-sm text-muted-foreground">
                The URL-friendly version of the title. Leave blank to auto-generate.
              </p>
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => handleChange('excerpt', e.target.value)}
                placeholder="A brief summary of the post..."
                rows={3}
                disabled={isLoading}
              />
              <p className="text-sm text-muted-foreground">
                A short summary shown in blog listings and previews.
              </p>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleChange('content', e.target.value)}
                placeholder="Write your blog post content here..."
                rows={12}
                required
                disabled={isLoading}
              />
              <p className="text-sm text-muted-foreground">
                The main content of your blog post. You can use markdown formatting.
              </p>
            </div>

            {/* Thumbnail */}
            <div className="space-y-2">
              <Label>Thumbnail Image</Label>
              <ImageUpload
                title="Blog Thumbnail"
                description="Optional: Upload a thumbnail image for the blog post."
                uploadType="imageUploader"
                currentImage={formData.thumbnailUrl ? { url: formData.thumbnailUrl, key: formData.thumbnailKey || '' } : null}
                onImageChange={(image) => {
                  if (image) {
                    setFormData(prev => ({ ...prev, thumbnailUrl: image.url, thumbnailKey: image.key }));
                  } else {
                    setFormData(prev => ({ ...prev, thumbnailUrl: '', thumbnailKey: '' }));
                  }
                }}
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange('status', value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Draft posts are not visible to visitors. Published posts are live on your website.
              </p>
            </div>

            {/* Metadata */}
            {!isNew && post && (
              <div className="text-sm text-muted-foreground space-y-1 pt-4 border-t">
                <p>Created by {post.author?.name || 'Unknown'} on {new Date(post.createdAt).toLocaleDateString()}</p>
                {post.updatedAt && post.updatedAt !== post.createdAt && (
                  <p>Last updated on {new Date(post.updatedAt).toLocaleDateString()}</p>
                )}
                {post.publishedAt && (
                  <p>Published on {new Date(post.publishedAt).toLocaleDateString()}</p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t">
              <div>
                {!isNew && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Post
                  </Button>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" asChild disabled={isLoading}>
                  <Link href="/admin/blog">Cancel</Link>
                </Button>
                {!isNew && post?.status === 'PUBLISHED' && (
                  <Button variant="outline" asChild disabled={isLoading}>
                    <Link href={`/blog/${post.slug}`} target="_blank">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Link>
                  </Button>
                )}
                <Button type="submit" disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading
                    ? 'Saving...'
                    : isNew
                    ? 'Create Post'
                    : 'Update Post'
                  }
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
