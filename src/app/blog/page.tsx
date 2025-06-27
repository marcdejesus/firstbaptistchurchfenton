"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { ArrowRight, UserCircle, Calendar, Search, BookOpen, Heart, Share2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { ArticleCard } from '@/components/blog/ArticleCard';

// TODO: Replace with data fetched from Firebase
const blogPosts = [
  {
    slug: 'the-heart-of-worship',
    title: 'The True Heart of Worship',
    author: 'Pastor John Bell',
    date: 'December 20, 2024',
    readTime: '5 min read',
    excerpt: 'What does it truly mean to worship God? Is it just singing songs on a Sunday, or is there something more? Let\'s dive into what the Bible says about a heart of worship.',
    imageUrl: '/front-art.png',
    tags: ['Worship', 'Theology', 'Spiritual Growth'],
    category: 'spiritual-growth',
    featured: true,
    likes: 42,
    views: 156,
  },
  {
    slug: 'finding-community-in-a-big-church',
    title: 'Finding Community in Our Church Family',
    author: 'Pastor John Bell',
    date: 'December 15, 2024',
    readTime: '4 min read',
    excerpt: 'It can be easy to feel lost in a crowd. Here are three practical ways to get connected and build meaningful relationships within our church family.',
    imageUrl: '/front-art.png',
    tags: ['Community', 'Church Life', 'Fellowship'],
    category: 'community',
    likes: 28,
    views: 89,
  },
    {
    slug: 'advent-season-reflection',
    title: 'Preparing Our Hearts for Christmas',
    author: 'Pastor John Bell',
    date: 'December 10, 2024',
    readTime: '6 min read',
    excerpt: 'As we enter the Advent season, let\'s reflect on the true meaning of Christmas and how we can prepare our hearts to celebrate the birth of our Savior.',
    imageUrl: '/front-art.png',
    tags: ['Advent', 'Christmas', 'Reflection'],
    category: 'seasonal',
    likes: 67,
    views: 203,
  },
  {
    slug: 'parenting-with-grace',
    title: 'Parenting with Grace and Wisdom',
    author: 'Sarah Johnson',
    date: 'December 5, 2024',
    readTime: '7 min read',
    excerpt: 'Navigating the challenges of parenthood is no small task. Discover biblical principles that can help you lead your family with love, patience, and grace.',
    imageUrl: '/front-art.png',
    tags: ['Family', 'Parenting', 'Children'],
    category: 'family',
    likes: 35,
    views: 124,
  },
];

const blogCategories = [
  { id: 'all', name: 'All Articles', color: 'bg-gray-100 text-gray-700' },
  { id: 'spiritual-growth', name: 'Spiritual Growth', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'community', name: 'Community', color: 'bg-blue-100 text-blue-700' },
  { id: 'family', name: 'Family', color: 'bg-purple-100 text-purple-700' },
  { id: 'youth', name: 'Youth', color: 'bg-orange-100 text-orange-700' },
  { id: 'ministry', name: 'Ministry', color: 'bg-teal-100 text-teal-700' },
  { id: 'seasonal', name: 'Seasonal', color: 'bg-indigo-100 text-indigo-700' },
];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const filteredPosts = useMemo(() => {
    let filtered = blogPosts;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query)) ||
        post.author.toLowerCase().includes(query)
      );
    }
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popularity': return (b.likes + b.views) - (a.likes + a.views);
        case 'title': return a.title.localeCompare(b.title);
        default: return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
    return filtered;
  }, [searchQuery, selectedCategory, sortBy]);

  const featuredPost = blogPosts.find(p => p.featured);
  const otherPosts = filteredPosts.filter(p => !p.featured);

  const handleShare = async (post: typeof blogPosts[0]) => {
    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: `${window.location.origin}/blog/${post.slug}`,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${post.title} - ${shareData.url}`);
      }
    } else {
      await navigator.clipboard.writeText(`${post.title} - ${shareData.url}`);
    }
  };

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-lora font-bold text-primary mb-4">From the Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Articles, devotionals, and updates from our church leadership and community.
          </p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {blogCategories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Latest</SelectItem>
              <SelectItem value="popularity">Popular</SelectItem>
              <SelectItem value="title">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-16">
            <h2 className="text-3xl font-lora font-bold mb-6 text-center">Featured Article</h2>
            <Card className="grid md:grid-cols-2 overflow-hidden shadow-lg border-border">
              <div className="relative h-64 md:h-full">
                <Image src={featuredPost.imageUrl} alt={featuredPost.title} fill className="object-cover"/>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <CardTitle className="text-3xl font-lora mb-4">{featuredPost.title}</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground mb-4 space-x-4">
                  <span>{featuredPost.author}</span>
                  <span>{featuredPost.date}</span>
                  <span>{featuredPost.readTime}</span>
                </div>
                <p className="mb-6">{featuredPost.excerpt}</p>
                <Button asChild size="lg">
                  <Link href={`/blog/${featuredPost.slug}`}>Read Full Article <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Article Grid */}
        <div>
          <h2 className="text-3xl font-lora font-bold mb-8 text-center">
            {searchQuery || selectedCategory !== 'all' ? 'Search Results' : 'Recent Articles'}
          </h2>
          {otherPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherPosts.map((post) => (
                <ArticleCard
                  key={post.slug}
                  post={post}
                  categoryName={blogCategories.find(c => c.id === post.category)?.name || 'Article'}
                  categoryColor={blogCategories.find(c => c.id === post.category)?.color || 'bg-gray-200'}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold">No articles found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 