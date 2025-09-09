"use client";

import React from 'react';
import { Loader2, Calendar, User, ArrowLeft } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  thumbnailUrl: string | null;
  thumbnailKey: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  author: {
    name: string;
  };
}

interface BlogPostClientProps {
  post: BlogPost;
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>

        {/* Article header */}
        <article className="prose prose-lg max-w-none">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            
            {post.excerpt && (
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-6">
              <span className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                {post.author.name}
              </span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(post.publishedAt || post.createdAt)}
              </span>
            </div>
          </header>

          {/* Featured image */}
          {post.thumbnailUrl && (
            <div className="mb-8">
              <Image
                src={post.thumbnailUrl}
                alt={post.title}
                width={800}
                height={400}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Article content */}
          <div className="prose prose-lg max-w-none">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </div>
    </PageLayout>
  );
}
