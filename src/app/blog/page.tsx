"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Filter, Loader2, Calendar, User, ChevronRight } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { blogService, type BlogPost } from '@/lib/firestore/blog';
import Link from 'next/link';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      {post.featuredImageUrl && (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <img
            src={post.featuredImageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader className="flex-grow">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Calendar className="h-4 w-4" />
          {formatDate(post.publishedAt)}
          <User className="h-4 w-4 ml-2" />
          {post.authorName}
        </div>
        <CardTitle className="font-heading line-clamp-2">
          <Link 
            href={`/blog/${post.slug}`} 
            className="hover:text-primary transition-colors"
          >
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription className="line-clamp-3">
          {post.excerpt || post.content.slice(0, 150) + '...'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {post.categories.slice(0, 2).map((category) => (
              <Badge key={category} variant="secondary" className="text-xs">
                {category}
              </Badge>
            ))}
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/blog/${post.slug}`}>
              Read More
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Blog" },
  ];

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const publishedPosts = await blogService.getPublishedPosts();
        setPosts(publishedPosts);
        setFilteredPosts(publishedPosts);
      } catch (error) {
        console.error('Error loading blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredPosts(filtered);
    }
  }, [searchTerm, posts]);

  if (loading) {
    return (
      <PageLayout
        title="From the Blog"
        subtitle="Articles, devotionals, and updates from our church leadership and community."
        breadcrumbs={breadcrumbs}
      >
        <div className="flex justify-center items-center min-h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </PageLayout>
    );
  }

  if (posts.length === 0) {
    return (
      <PageLayout
        title="From the Blog"
        subtitle="Articles, devotionals, and updates from our church leadership and community."
        breadcrumbs={breadcrumbs}
      >
        <div className="text-center py-24 bg-background-secondary rounded-lg">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-3xl font-heading font-bold mb-4">No Posts Yet</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            We're currently working on bringing our blog to life. Please check back soon for articles and stories from our church family.
          </p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="From the Blog"
      subtitle="Articles, devotionals, and updates from our church leadership and community."
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-8">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {/* TODO: Add category filter dropdown */}
        </div>

        {/* Results */}
        {filteredPosts.length === 0 && searchTerm.trim() !== '' ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-heading font-semibold mb-2">No articles found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or browse all articles below.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setSearchTerm('')}
              className="mt-4"
            >
              Clear Search
            </Button>
          </div>
        ) : (
          <>
            {searchTerm.trim() !== '' && (
              <div className="text-sm text-muted-foreground">
                Found {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} 
                {searchTerm && ` for "${searchTerm}"`}
              </div>
            )}

            {/* Blog Posts Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
} 