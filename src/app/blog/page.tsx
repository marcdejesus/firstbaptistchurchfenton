"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { ArrowRight, UserCircle, Calendar, Search, Filter, Share2, BookOpen, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

// Enhanced blog posts data with additional fields
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
  {
    slug: 'why-we-serve',
    title: 'The Heart Behind Our Service',
    author: 'Mike Thompson',
    date: 'November 28, 2024',
    readTime: '5 min read',
    excerpt: 'Serving is a core part of our church\'s DNA. Explore the biblical reasons why we give our time and talents to serve others in the church and our community.',
    imageUrl: '/front-art.png',
    tags: ['Serving', 'Volunteer', 'Ministry'],
    category: 'ministry',
    likes: 23,
    views: 87,
  },
  {
    slug: 'youth-ministry-update',
    title: 'Exciting Updates from Youth Ministry',
    author: 'Jessica Davis',
    date: 'November 20, 2024',
    readTime: '3 min read',
    excerpt: 'Our youth ministry is growing and thriving! Read about our recent activities, upcoming events, and how you can support our young people.',
    imageUrl: '/front-art.png',
    tags: ['Youth', 'Ministry', 'Events'],
    category: 'youth',
    likes: 19,
    views: 76,
  },
];

// Blog categories for filtering
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

  // Filter and search functionality
  const filteredPosts = useMemo(() => {
    let filtered = blogPosts;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Search functionality
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query)) ||
        post.author.toLowerCase().includes(query)
      );
    }

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'popularity':
          return (b.likes + b.views) - (a.likes + a.views);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, sortBy]);

  const featuredPost = blogPosts.find(p => p.featured);
  const otherPosts = filteredPosts.filter(p => !p.featured);

  // Social sharing function
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
    <div className="min-h-screen bg-gradient-to-b from-transparent to-primary-50/30">
      {/* Enhanced Header with Design System */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-accent-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center mb-6">
              <BookOpen className="h-12 w-12 text-accent mr-4" />
              <h1 className="text-4xl md:text-6xl font-lora font-bold text-primary-foreground">
                From the Blog
              </h1>
            </div>
            <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto mb-8">
              Articles, devotionals, and updates from our church leadership and community. 
              Growing together in faith and understanding.
            </p>
            
            {/* Search and Filter Controls */}
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/80 backdrop-blur-sm"
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-white/80 backdrop-blur-sm">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {blogCategories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-white/80 backdrop-blur-sm">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Latest First</SelectItem>
                    <SelectItem value="popularity">Most Popular</SelectItem>
                    <SelectItem value="title">Alphabetical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Category Tags */}
              <div className="flex flex-wrap justify-center gap-2">
                {blogCategories.map(category => (
                  <Badge
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      selectedCategory === category.id 
                        ? 'bg-accent text-accent-foreground' 
                        : 'bg-white/80 hover:bg-accent/10'
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full translate-y-12 -translate-x-12"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">

        {/* Enhanced Featured Post */}
        {featuredPost && (
          <Card className="mb-12 overflow-hidden shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-accent/10 text-accent border-accent/20">Featured Article</Badge>
                  <Badge className={blogCategories.find(c => c.id === featuredPost.category)?.color}>
                    {blogCategories.find(c => c.id === featuredPost.category)?.name}
                  </Badge>
                </div>
                
                <CardTitle className="text-3xl md:text-4xl font-lora font-bold text-primary-foreground mb-4 leading-tight">
                  {featuredPost.title}
                </CardTitle>
                
                <CardDescription className="mb-6 text-lg text-muted-foreground leading-relaxed">
                  {featuredPost.excerpt}
                </CardDescription>
                
                <div className="flex items-center text-sm text-muted-foreground mb-6 space-x-4">
                  <div className="flex items-center">
                    <UserCircle className="h-4 w-4 mr-2 text-accent" />
                    <span className="font-medium">{featuredPost.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-accent" />
                    <span>{featuredPost.date}</span>
                  </div>
                  <span className="text-accent font-medium">{featuredPost.readTime}</span>
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-1 text-red-500" />
                      <span>{featuredPost.likes}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="h-4 w-4 mr-1">👁️</span>
                      <span>{featuredPost.views}</span>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare(featuredPost)}
                    className="border-accent text-accent hover:bg-accent/10"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
                
                <CardFooter className="p-0">
                  <Button asChild size="lg" className="bg-accent hover:bg-accent-600 w-full">
                    <Link href={`/blog/${featuredPost.slug}`}>
                      Read Full Article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </div>
              
              <div className="relative h-64 md:h-full bg-gradient-to-br from-primary-50 to-accent-50">
                <Image 
                  src={featuredPost.imageUrl} 
                  alt={featuredPost.title} 
                  fill
                  className="object-cover"
                  onError={(e) => { 
                    e.currentTarget.src = '/front-art.png'; 
                  }} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </Card>
        )}

        {/* Enhanced Article Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-lora font-bold text-primary-foreground">
              {searchQuery || selectedCategory !== 'all' 
                ? `${otherPosts.length} ${otherPosts.length === 1 ? 'Article' : 'Articles'} Found`
                : 'Recent Articles'
              }
            </h2>
            {(searchQuery || selectedCategory !== 'all') && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="border-accent text-accent hover:bg-accent/10"
              >
                Clear Filters
              </Button>
            )}
          </div>
          
          {otherPosts.length === 0 ? (
            <Card className="text-center py-12 bg-white/80 backdrop-blur-sm border-0">
              <CardContent>
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No articles found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search terms or category filters.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                >
                  View All Articles
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherPosts.map((post) => (
                <Card key={post.slug} className="group flex flex-col hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                  <div className="relative h-48 bg-gradient-to-br from-primary-50 to-accent-50">
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
                      <Badge className={blogCategories.find(c => c.id === post.category)?.color}>
                        {blogCategories.find(c => c.id === post.category)?.name}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl font-lora font-semibold group-hover:text-accent transition-colors leading-tight">
                      {post.title}
                    </CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground space-x-3">
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
                        <span className="text-accent font-medium">{post.readTime}</span>
                        <div className="flex items-center">
                          <Heart className="h-3 w-3 mr-1 text-red-500" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="h-3 w-3 mr-1">👁️</span>
                          <span>{post.views}</span>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare(post)}
                        className="h-8 w-8 p-0 hover:bg-accent/10"
                      >
                        <Share2 className="h-4 w-4 text-accent" />
                      </Button>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button asChild className="w-full bg-accent hover:bg-accent-600">
                      <Link href={`/blog/${post.slug}`}>
                        Read Article
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 