"use client";

import React, { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { Calendar, User, Tag, ArrowLeft, Heart, Share2, Loader2 } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { blogService, type BlogPost } from '@/lib/firestore/blog';
import Link from 'next/link';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const blogPost = await blogService.getPostBySlug(params.slug);
        
        if (!blogPost) {
          notFound();
          return;
        }

        setPost(blogPost);

        // Increment view count
        await blogService.incrementViewCount(blogPost.id);

        // Load related posts
        const related = await blogService.getRelatedPosts(
          blogPost.id, 
          blogPost.tags, 
          3
        );
        setRelatedPosts(related);

      } catch (error) {
        console.error('Error loading blog post:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [params.slug]);

  const handleLike = async () => {
    if (!post) return;
    
    try {
      await blogService.toggleLike(post.id, !isLiked);
      setIsLiked(!isLiked);
      
      // Update local post state
      setPost(prev => prev ? {
        ...prev,
        likes: isLiked ? prev.likes - 1 : prev.likes + 1
      } : null);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleShare = async () => {
    if (!post) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt || `Read "${post.title}" on First Baptist Church Fenton blog`,
          url: window.location.href,
        });
      } catch (error) {
        // User canceled sharing
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        // You could show a toast notification here
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <PageLayout variant="narrow">
        <div className="flex justify-center items-center min-h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </PageLayout>
    );
  }

  if (!post) {
    return notFound();
  }

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: post.title },
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbs} variant="narrow">
      <article className="space-y-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/blog">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
        </Button>

        {/* Featured Image */}
        {post.featuredImageUrl && (
          <div className="aspect-video w-full overflow-hidden rounded-lg">
            <img
              src={post.featuredImageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Header */}
        <header className="space-y-4">
          <h1 className="text-4xl font-heading font-bold leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formatDate(post.publishedAt)}
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {post.authorName}
            </div>
            <div className="flex items-center gap-2">
              <span>{post.viewCount} views</span>
            </div>
          </div>

          {/* Categories and Tags */}
          {(post.categories.length > 0 || post.tags.length > 0) && (
            <div className="flex flex-wrap gap-2">
              {post.categories.map((category) => (
                <Badge key={category} variant="default">
                  {category}
                </Badge>
              ))}
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="gap-1">
                  <Tag className="h-3 w-3" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        {/* Article Content */}
        <Card>
          <CardContent className="prose prose-lg max-w-none pt-6">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </CardContent>
        </Card>

        {/* Article Actions */}
        <div className="flex items-center justify-between border-t pt-6">
          <div className="flex items-center gap-4">
            <Button
              variant={isLiked ? "default" : "outline"}
              size="sm"
              onClick={handleLike}
              className="gap-2"
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              {post.likes} {post.likes === 1 ? 'Like' : 'Likes'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="space-y-6 border-t pt-8">
            <h2 className="text-2xl font-heading font-bold">Related Articles</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">
                      <Link 
                        href={`/blog/${relatedPost.slug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {relatedPost.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {relatedPost.excerpt || relatedPost.content.slice(0, 100) + '...'}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatDate(relatedPost.publishedAt)}</span>
                      <span>{relatedPost.authorName}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </article>
    </PageLayout>
  );
}