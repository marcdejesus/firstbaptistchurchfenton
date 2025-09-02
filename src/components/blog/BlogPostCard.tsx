import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { BlogPost } from '@/hooks/useBlogPosts';

interface BlogPostCardProps {
  post: BlogPost;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
      <div className="relative h-48 overflow-hidden">
        {post.thumbnailUrl ? (
          <Image
            src={post.thumbnailUrl}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <div className="text-blue-600 text-4xl font-bold">📝</div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2 mb-2">
          <Badge variant="secondary" className="text-xs">
            Blog Post
          </Badge>
        </div>
        <CardTitle className="text-xl font-semibold group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">
          {post.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow">
        {post.excerpt && (
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}
        
        <div className="flex items-center text-sm text-muted-foreground space-x-4 mb-4">
          <span className="flex items-center">
            <User className="h-3 w-3 mr-1" />
            {post.author.name}
          </span>
          <span className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(post.publishedAt || post.createdAt)}
          </span>
        </div>
        
        <Link 
          href={`/blog/${post.slug}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium group/link"
        >
          Read More
          <ArrowRight className="h-4 w-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </CardContent>
    </Card>
  );
}
