"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Share2, 
  Facebook, 
  Twitter, 
  Mail, 
  Link2, 
  MessageSquare,
  Check,
  Copy
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
// Simple toast replacement for notifications
const toast = {
  success: (message: string) => {
    // In a real app, you might use a proper toast library
    console.log('Success:', message);
  },
  error: (message: string) => {
    console.error('Error:', message);
  }
};

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  hashtags?: string[];
  via?: string;
  className?: string;
  variant?: 'button' | 'dropdown' | 'inline';
}

interface SharePlatform {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  getUrl: (props: SocialShareProps) => string;
}

const sharePlatforms: SharePlatform[] = [
  {
    name: 'Facebook',
    icon: Facebook,
    color: 'text-blue-600 hover:bg-blue-50',
    getUrl: ({ url, title, description }) => {
      const params = new URLSearchParams({
        u: url,
        quote: `${title}${description ? ` - ${description}` : ''}`
      });
      return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
    }
  },
  {
    name: 'Twitter',
    icon: Twitter,
    color: 'text-sky-500 hover:bg-sky-50',
    getUrl: ({ url, title, hashtags, via }) => {
      const params = new URLSearchParams({
        url,
        text: title,
        ...(hashtags && { hashtags: hashtags.join(',') }),
        ...(via && { via })
      });
      return `https://twitter.com/intent/tweet?${params.toString()}`;
    }
  },
  {
    name: 'Email',
    icon: Mail,
    color: 'text-gray-600 hover:bg-gray-50',
    getUrl: ({ url, title, description }) => {
      const subject = encodeURIComponent(title);
      const body = encodeURIComponent(
        `${title}\n\n${description || ''}\n\nRead more: ${url}\n\nShared from First Baptist Church Fenton`
      );
      return `mailto:?subject=${subject}&body=${body}`;
    }
  },
  {
    name: 'SMS',
    icon: MessageSquare,
    color: 'text-green-600 hover:bg-green-50',
    getUrl: ({ url, title }) => {
      const text = encodeURIComponent(`${title} - ${url}`);
      return `sms:?body=${text}`;
    }
  }
];

export function SocialShare({ 
  url, 
  title, 
  description, 
  hashtags = ['FBCFenton', 'Faith', 'Community'], 
  via = 'FBCFenton',
  className = '',
  variant = 'dropdown'
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;

  const handleShare = async (platform: SharePlatform) => {
    const shareUrl = platform.getUrl({ url: fullUrl, title, description, hashtags, via });
    
    if (platform.name === 'Email' || platform.name === 'SMS') {
      window.location.href = shareUrl;
    } else {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const handleNativeShare = async () => {
    const shareData = {
      title,
      text: description || title,
      url: fullUrl,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // User cancelled sharing or error occurred
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback to copy to clipboard
      await handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  if (variant === 'inline') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <span className="text-sm font-medium text-muted-foreground">Share:</span>
        {sharePlatforms.map((platform) => {
          const Icon = platform.icon;
          return (
            <Button
              key={platform.name}
              variant="ghost"
              size="sm"
              onClick={() => handleShare(platform)}
              className={`h-8 w-8 p-0 ${platform.color}`}
              title={`Share on ${platform.name}`}
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyLink}
          className="h-8 w-8 p-0 text-gray-600 hover:bg-gray-50"
          title="Copy link"
        >
          {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
        </Button>
      </div>
    );
  }

  if (variant === 'button') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleNativeShare}
        className={`border-accent text-accent hover:bg-accent/10 ${className}`}
      >
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>
    );
  }

  // Default dropdown variant
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`border-accent text-accent hover:bg-accent/10 ${className}`}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {sharePlatforms.map((platform) => {
          const Icon = platform.icon;
          return (
            <DropdownMenuItem
              key={platform.name}
              onClick={() => handleShare(platform)}
              className="cursor-pointer"
            >
              <Icon className={`h-4 w-4 mr-3 ${platform.color.split(' ')[0]}`} />
              Share on {platform.name}
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
          {copied ? (
            <Check className="h-4 w-4 mr-3 text-green-600" />
          ) : (
            <Copy className="h-4 w-4 mr-3 text-gray-600" />
          )}
          {copied ? 'Copied!' : 'Copy link'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Specialized sharing components for different content types
export function BlogShareButtons({ post }: { post: { slug: string; title: string; excerpt: string; category?: string } }) {
  const hashtags = ['FBCFenton', 'Faith'];
  if (post.category) {
    hashtags.push(post.category.replace(/\s+/g, ''));
  }

  return (
    <SocialShare
      url={`/blog/${post.slug}`}
      title={post.title}
      description={post.excerpt}
      hashtags={hashtags}
      variant="inline"
      className="justify-center"
    />
  );
}

export function EventShareButtons({ event }: { event: { id: string; title: string; description?: string; date: string } }) {
  return (
    <SocialShare
      url={`/events/${event.id}`}
      title={`Join us: ${event.title}`}
      description={`${event.description || ''} - ${event.date}`}
      hashtags={['FBCFenton', 'ChurchEvent', 'Community']}
      variant="dropdown"
    />
  );
}

// Floating share widget for articles
export function FloatingShareWidget({ 
  url, 
  title, 
  description 
}: { 
  url: string; 
  title: string; 
  description?: string; 
}) {
  return (
    <Card className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 shadow-lg border-0 bg-white/90 backdrop-blur-sm hidden lg:block">
      <CardContent className="p-3">
        <div className="flex flex-col space-y-2">
          <span className="text-xs font-medium text-muted-foreground text-center mb-1">
            Share
          </span>
          {sharePlatforms.slice(0, 3).map((platform) => {
            const Icon = platform.icon;
            return (
              <Button
                key={platform.name}
                variant="ghost"
                size="sm"
                onClick={() => {
                  const shareUrl = platform.getUrl({ url, title, description });
                  if (platform.name === 'Email') {
                    window.location.href = shareUrl;
                  } else {
                    window.open(shareUrl, '_blank', 'width=600,height=400');
                  }
                }}
                className={`h-10 w-10 p-0 ${platform.color}`}
                title={`Share on ${platform.name}`}
              >
                <Icon className="h-5 w-5" />
              </Button>
            );
          })}
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(url.startsWith('http') ? url : `${window.location.origin}${url}`);
                toast.success('Link copied!');
              } catch (error) {
                toast.error('Failed to copy link');
              }
            }}
            className="h-10 w-10 p-0 text-gray-600 hover:bg-gray-50"
            title="Copy link"
          >
            <Link2 className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 