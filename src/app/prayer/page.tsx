"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { PageLayout } from '@/components/layout/PageLayout';
import { Send, Heart } from 'lucide-react';

export default function PrayerPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [request, setRequest] = useState('');
  const [isConfidential, setIsConfidential] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!request || !name || !email) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/prayer-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, request, isConfidential }),
      });

      if (!response.ok) {
        throw new Error('Something went wrong. Please try again.');
      }

      toast({
        title: "Request Submitted",
        description: "Thank you. Your prayer request has been received.",
      });

      // Reset form
      setName('');
      setEmail('');
      setRequest('');
      setIsConfidential(false);
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout
      title="Prayer Requests"
      subtitle="We believe in the power of prayer. Let us know how we can pray for you. Requests can be submitted confidentially."
    >
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Submit a Prayer Request</CardTitle>
            <CardDescription>
              All requests sent to <a href="mailto:prayer@fbfenton.org" className="underline">prayer@fbfenton.org</a> will be shared with our pastoral and prayer teams.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="email">Your Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="request">Your Prayer Request</Label>
                <Textarea
                  id="request"
                  value={request}
                  onChange={(e) => setRequest(e.target.value)}
                  placeholder="Share what's on your heart..."
                  required
                  rows={6}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="confidential" checked={isConfidential} onCheckedChange={(checked) => setIsConfidential(checked as boolean)} />
                <Label htmlFor="confidential" className="font-normal">Keep this request confidential (pastors only)</Label>
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Submitting...' : 'Submit Prayer Request'}
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
} 