"use client";

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, UserCircle, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock data for blog posts
// TODO: Replace with data fetched from Firebase
const blogPosts = [
  {
    slug: 'the-heart-of-worship',
    title: 'The True Heart of Worship',
    author: 'Pastor John Doe',
    date: 'October 26, 2023',
    excerpt: 'What does it truly mean to worship God? Is it just singing songs on a Sunday, or is there something more? Let\'s dive into what the Bible says about a heart of worship.',
    imageUrl: '/images/blog/worship.jpg',
    tags: ['Worship', 'Theology'],
    featured: true,
  },
  {
    slug: 'finding-community-in-a-big-church',
    title: 'Finding Community in a Big Church',
    author: 'Pastor Jane Smith',
    date: 'October 22, 2023',
    excerpt: 'It can be easy to feel lost in a crowd. Here are three practical ways to get connected and build meaningful relationships within our church family.',
    imageUrl: '/images/blog/community.jpg',
    tags: ['Community', 'Church Life'],
  },
  {
    slug: 'parenting-with-grace',
    title: 'Parenting with Grace (and a Lot of Coffee)',
    author: 'Emily White',
    date: 'October 18, 2023',
    excerpt: 'Navigating the challenges of parenthood is no small task. Discover biblical principles that can help you lead your family with love, patience, and grace.',
    imageUrl: '/images/blog/parenting.jpg',
    tags: ['Family', 'Parenting'],
  },
  {
    slug: 'why-we-serve',
    title: 'The "Why" Behind Our Service',
    author: 'Mike Johnson',
    date: 'October 15, 2023',
    excerpt: 'Serving is a core part of our church\'s DNA. Explore the biblical reasons why we give our time and talents to serve others in the church and our community.',
    imageUrl: '/images/blog/serving.jpg',
    tags: ['Serving', 'Volunteer'],
  },
];

const featuredPost = blogPosts.find(p => p.featured);
const otherPosts = blogPosts.filter(p => !p.featured);

export default function BlogPage() {
  return (
    <div className="bg-gray-50/50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">From the Blog</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Articles, devotionals, and updates from our church leadership and community.
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <Card className="mb-12 overflow-hidden shadow-lg">
            <div className="grid md:grid-cols-2">
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <Badge variant="secondary" className="w-fit mb-2">Featured</Badge>
                <CardTitle className="text-3xl font-bold mb-3">{featuredPost.title}</CardTitle>
                <CardDescription className="mb-4 text-base">{featuredPost.excerpt}</CardDescription>
                <div className="flex items-center text-sm text-muted-foreground mb-6">
                    <UserCircle className="h-4 w-4 mr-1.5" /> {featuredPost.author}
                    <span className="mx-2">|</span>
                    <Calendar className="h-4 w-4 mr-1.5" /> {featuredPost.date}
                </div>
                <CardFooter className="p-0">
                  <Button asChild size="lg">
                    <Link href={`/blog/${featuredPost.slug}`}>
                      Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </div>
              <div className="h-64 md:h-full bg-gray-200">
                 <img src={featuredPost.imageUrl} alt={featuredPost.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/600x400/E2E8F0/A0AEC0?text=Blog+Image'; }} />
              </div>
            </div>
          </Card>
        )}

        {/* Recent Posts */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherPosts.map((post) => (
            <Card key={post.slug} className="flex flex-col hover:shadow-lg transition-shadow">
               <div className="h-48 bg-gray-200 rounded-t-lg">
                  <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover rounded-t-lg" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x300/E2E8F0/A0AEC0?text=Blog+Image'; }} />
                </div>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <div className="flex items-center text-xs text-muted-foreground pt-1">
                    <UserCircle className="h-3 w-3 mr-1" /> {post.author}
                    <span className="mx-1.5">|</span>
                    <Calendar className="h-3 w-3 mr-1" /> {post.date}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{post.excerpt}</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="secondary" className="w-full">
                  <Link href={`/blog/${post.slug}`}>Read More</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 