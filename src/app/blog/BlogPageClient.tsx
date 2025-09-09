"use client";

import React from 'react';
import { BookOpen, Loader2 } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { BlogPostCard } from '@/components/blog/BlogPostCard';
import { useBlogPosts } from '@/hooks/useBlogPosts';

export default function BlogPageClient() {
  const { posts, loading, error } = useBlogPosts();

  if (loading) {
    return (
      <PageLayout
        title="From the Blog"
        subtitle="Articles, devotionals, and updates from our church leadership and community."
      >
        <div className="text-center py-24">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading blog posts...</p>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout
        title="From the Blog"
        subtitle="Articles, devotionals, and updates from our church leadership and community."
      >
        <div className="text-center py-24 bg-background-secondary rounded-lg">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-3xl font-heading font-bold mb-4">Something went wrong</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            We're having trouble loading our blog posts. Please try again later.
          </p>
        </div>
      </PageLayout>
    );
  }

  if (posts.length === 0) {
    return (
      <PageLayout
        title="From the Blog"
        subtitle="Articles, devotionals, and updates from our church leadership and community."
      >
        <div className="text-center py-24 bg-background-secondary rounded-lg">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-3xl font-heading font-bold mb-4">Coming Soon</h2>
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
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </PageLayout>
  );
}
