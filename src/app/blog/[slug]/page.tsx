"use client";

import React from 'react';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, UserCircle, Calendar, Tag } from 'lucide-react';

// Mock data for blog posts - this would be in a shared lib/api file in a real app
const blogPosts = [
    {
      slug: 'the-heart-of-worship',
      title: 'The True Heart of Worship',
      author: 'Pastor John Doe',
      date: 'October 26, 2023',
      excerpt: 'What does it truly mean to worship God? Is it just singing songs on a Sunday, or is there something more? Let\'s dive into what the Bible says about a heart of worship.',
      imageUrl: '/images/blog/worship.jpg',
      tags: ['Worship', 'Theology'],
      content: `
        <p class="lead">What does it truly mean to worship God? Is it just singing songs on a Sunday, or is there something more? Let's dive into what the Bible says about a heart of worship.</p>
        <p>In John 4:24, Jesus says, "God is spirit, and his worshipers must worship in the Spirit and in truth." This single verse gives us a profound framework for understanding true worship. It's not about a place, a style of music, or a certain liturgy. It's about the posture of our hearts and the focus of our minds.</p>
        <h2>Worship in Spirit</h2>
        <p>To worship in Spirit means that our worship must be authentic and internal. It's not about outward performance but an inward connection with God, prompted and guided by the Holy Spirit. It's about engaging our emotions, our will, and our intellect to give God the glory He deserves. It flows from a heart that genuinely loves Him.</p>
        <h2>Worship in Truth</h2>
        <p>To worship in truth means our worship must be based on who God has revealed Himself to be in the Scriptures. It's not enough to have sincere feelings; our worship must be grounded in the reality of who God is. We worship Him for His holiness, His love, His justice, and His grace, as revealed from Genesis to Revelation.</p>
        <p>When our Spirit-led affection is aligned with biblical truth, we experience worship in its purest form. It becomes a 24/7 lifestyle, not just a Sunday morning event.</p>
      `
    },
    // ... other posts from the main page would be here
];

// In a real app, this would be an API call, e.g., getPostBySlug(slug)
const getPost = (slug: string) => blogPosts.find(p => p.slug === slug);


export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          
          <div className="mb-8">
            <Button asChild variant="ghost">
              <Link href="/blog" className="text-muted-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </div>

          <article>
            <div className="mb-8">
              <div className="h-64 md:h-96 w-full rounded-lg bg-gray-200 mb-6">
                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover rounded-lg" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/800x600/E2E8F0/A0AEC0?text=Blog+Post'; }} />
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">{post.title}</h1>
              
              <div className="flex flex-wrap items-center text-muted-foreground text-sm mb-4">
                <div className="flex items-center mr-4 mb-2">
                    <UserCircle className="h-4 w-4 mr-1.5" /> {post.author}
                </div>
                <div className="flex items-center mr-4 mb-2">
                    <Calendar className="h-4 w-4 mr-1.5" /> {post.date}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
              </div>
            </div>

            <div 
              className="prose lg:prose-xl max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }} 
            />
          </article>
          
        </div>
      </div>
    </div>
  );
} 