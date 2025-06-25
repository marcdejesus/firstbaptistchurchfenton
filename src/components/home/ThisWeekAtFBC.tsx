"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowRight, Share2, Heart } from 'lucide-react';
import { format } from 'date-fns';

interface ThisWeekAtFBCProps {
  title: string;
  excerpt: string;
  imageUrl?: string;
  readMoreLink: string;
  publishDate: Date;
  author?: string;
  category?: string;
}

// Sample data - this would come from your CMS or API
const sampleContent: ThisWeekAtFBCProps = {
  title: "Growing in Grace: Our January Journey Together",
  excerpt: "This month, we're focusing on what it means to grow in grace - both receiving God's grace and extending it to others. Join us as we explore how grace transforms our daily lives, relationships, and community. From our new sermon series to upcoming fellowship events, discover how you can be part of this journey of faith.",
  imageUrl: "/front-art.png", // Using existing church image
  readMoreLink: "/blog/growing-in-grace-january-2025",
  publishDate: new Date('2025-01-12'),
  author: "Pastor Bell",
  category: "Weekly Reflection"
};

export function ThisWeekAtFBC(props?: Partial<ThisWeekAtFBCProps>) {
  const content = { ...sampleContent, ...props };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: content.title,
        text: content.excerpt,
        url: window.location.origin + content.readMoreLink,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.origin + content.readMoreLink);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-accent/5 to-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="text-accent-foreground bg-accent/10 mb-4">
            Featured Content
          </Badge>
          <h2 className="text-3xl md:text-4xl font-lora font-bold text-primary-foreground mb-3">
            This Week at FBC
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay connected with what's happening in our church community
          </p>
        </div>
        
        <Card className="max-w-4xl mx-auto overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="md:flex">
            {content.imageUrl && (
              <div className="md:w-2/5 relative">
                <div className="h-64 md:h-full relative overflow-hidden">
                  <Image 
                    src={content.imageUrl}
                    alt={content.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                  {content.category && (
                    <Badge 
                      variant="default" 
                      className="absolute top-4 left-4 bg-accent text-accent-foreground"
                    >
                      {content.category}
                    </Badge>
                  )}
                </div>
              </div>
            )}
            <CardContent className={`${content.imageUrl ? 'md:w-3/5' : 'w-full'} p-8`}>
              <div className="flex items-center mb-4 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                {format(content.publishDate, 'MMMM d, yyyy')}
                {content.author && (
                  <>
                    <span className="mx-2">•</span>
                    <User className="h-4 w-4 mr-1" />
                    {content.author}
                  </>
                )}
              </div>
              
              <h3 className="text-2xl md:text-3xl font-lora font-bold text-primary-foreground mb-4 leading-tight">
                {content.title}
              </h3>
              
              <p className="text-muted-foreground mb-6 leading-relaxed text-lg">
                {content.excerpt}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <Button variant="default" asChild className="bg-accent hover:bg-accent-600">
                  <Link href={content.readMoreLink}>
                    Read Full Article
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleShare}
                    className="flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="flex items-center gap-2 text-muted-foreground hover:text-accent"
                  >
                    <Heart className="h-4 w-4" />
                    Save
                  </Button>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Quick Links */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Looking for more ways to stay connected?
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/blog">All Articles</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/events">Upcoming Events</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/sermons">Recent Sermons</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/newsletter">Newsletter Archive</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Alternative compact version for different layouts
export function ThisWeekAtFBCCompact(props: ThisWeekAtFBCProps = sampleContent) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center mb-3">
          <Badge variant="secondary" className="text-accent-foreground bg-accent/10 mr-3">
            This Week
          </Badge>
          <span className="text-sm text-muted-foreground">
            {format(props.publishDate, 'MMM d')}
          </span>
        </div>
        
        <h3 className="font-lora font-bold text-xl mb-3 leading-tight">
          {props.title}
        </h3>
        
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {props.excerpt}
        </p>
        
        <Button variant="outline" size="sm" asChild>
          <Link href={props.readMoreLink}>
            Read More
            <ArrowRight className="ml-2 h-3 w-3" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
} 