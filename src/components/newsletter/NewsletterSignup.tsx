"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, Loader2, Mail, ArrowRight } from 'lucide-react';

interface NewsletterSignupProps {
  variant?: 'full' | 'compact' | 'inline';
  className?: string;
}

export function NewsletterSignup({ variant = 'full', className = '' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // TODO: Integration with your email service (Mailchimp, ConvertKit, etc.)
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (response.ok) {
        setIsSubmitted(true);
        setEmail('');
      } else {
        throw new Error('Subscription failed');
      }
    } catch (error) {
      console.error('Newsletter signup failed:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (isSubmitted) {
    return (
      <Card className={`text-center p-8 bg-accent/5 border-accent/20 ${className}`}>
        <CardContent className="p-0">
          <CheckCircle className="h-12 w-12 text-accent mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-primary-foreground">Thank You!</h3>
          <p className="text-muted-foreground mb-4">
            Welcome to our church family newsletter! Please check your email to confirm your subscription.
          </p>
          <Button 
            variant="outline" 
            onClick={() => setIsSubmitted(false)}
            className="mt-2"
          >
            Subscribe Another Email
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Full variant (for dedicated section)
  if (variant === 'full') {
    return (
      <section className={`py-16 bg-gradient-to-r from-primary/5 to-accent/5 ${className}`}>
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <Mail className="h-12 w-12 text-accent mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-lora font-bold text-primary-foreground mb-4">
                Stay Connected
              </h2>
              <p className="text-lg text-muted-foreground mb-2">
                Get weekly spiritual insights, church updates, and community news delivered to your inbox
              </p>
              <p className="text-sm text-muted-foreground">
                Join our church family newsletter and never miss what's happening at FBC
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 h-12 text-base"
                  disabled={isSubmitting}
                />
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="h-12 px-8 bg-accent hover:bg-accent-600"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Subscribe
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
              <p className="text-xs text-muted-foreground mt-3">
                We respect your privacy. Unsubscribe at any time. No spam, ever.
              </p>
            </form>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mt-12 text-left">
              <div className="text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="h-6 w-6 text-accent" />
                </div>
                <h4 className="font-semibold mb-2">Weekly Updates</h4>
                <p className="text-sm text-muted-foreground">
                  Get "This Week at FBC" delivered every Sunday with upcoming events and spiritual insights.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-accent" />
                </div>
                <h4 className="font-semibold mb-2">Special Announcements</h4>
                <p className="text-sm text-muted-foreground">
                  Be the first to know about special services, events, and community opportunities.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ArrowRight className="h-6 w-6 text-accent" />
                </div>
                <h4 className="font-semibold mb-2">Easy Unsubscribe</h4>
                <p className="text-sm text-muted-foreground">
                  No commitment required. Manage your preferences or unsubscribe with one click.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Compact variant (for sidebars or cards)
  if (variant === 'compact') {
    return (
      <Card className={`p-6 ${className}`}>
        <CardContent className="p-0">
          <div className="text-center mb-4">
            <Mail className="h-8 w-8 text-accent mx-auto mb-2" />
            <h3 className="font-semibold text-lg mb-1">Stay Connected</h3>
            <p className="text-sm text-muted-foreground">
              Weekly insights & church updates
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
            <Button 
              type="submit" 
              className="w-full bg-accent hover:bg-accent-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Subscribe'
              )}
            </Button>
            {error && (
              <p className="text-red-500 text-xs">{error}</p>
            )}
          </form>
          
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Unsubscribe anytime. No spam.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Inline variant (for footers or inline placement)
  return (
    <div className={`${className}`}>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md">
        <Input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1"
          disabled={isSubmitting}
        />
        <Button 
          type="submit" 
          variant="outline"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Subscribe'
          )}
        </Button>
      </form>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}

// Footer variant specifically for footer placement
export function NewsletterSignupFooter() {
  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-lg">Newsletter</h4>
      <p className="text-sm text-muted-foreground">
        Get weekly updates and spiritual insights delivered to your inbox.
      </p>
      <NewsletterSignup variant="inline" />
    </div>
  );
} 