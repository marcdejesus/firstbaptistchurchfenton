"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, UserCircle, Calendar, Heart } from 'lucide-react';

// Using the BlogPost type from the blog page - consider moving to a shared types file
type BlogPost = {
  slug: string;
  title: string;
  author: string;
  date: string;
  readTime: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  likes: number;
};

interface ArticleCardProps {
  post: BlogPost;
  categoryColor: string;
  categoryName: string;
}

export function ArticleCard({ post, categoryColor, categoryName }: ArticleCardProps) {
  return (
    <Card className="group flex flex-col hover:shadow-xl transition-all duration-300 border-border bg-card overflow-hidden h-full">
      <div className="relative h-48">
        <Image 
          src={post.imageUrl} 
          alt={post.title} 
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { 
            e.currentTarget.src = '/front-art.png'; 
          }} 
        />
        <div className="absolute top-3 left-3">
          <Badge className={categoryColor}>{categoryName}</Badge>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-lora font-semibold group-hover:text-accent transition-colors leading-tight h-14 overflow-hidden">
            {post.title}
        </CardTitle>
        <div className="flex items-center text-sm text-muted-foreground pt-2 space-x-3">
          <div className="flex items-center">
            <UserCircle className="h-4 w-4 mr-1 text-accent" />
            <span className="font-medium">{post.author}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-accent" />
            <span>{post.date}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow pb-4">
        <p className="text-muted-foreground leading-relaxed line-clamp-3 mb-4">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-3 text-muted-foreground">
            <span className="font-medium text-accent">{post.readTime}</span>
            <div className="flex items-center">
              <Heart className="h-4 w-4 mr-1 text-red-500/80" />
              <span>{post.likes}</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/blog/${post.slug}`}>
            Read Article
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
} 