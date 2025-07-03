"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PageLayout } from '@/components/layout/PageLayout';
import { Send, Heart } from 'lucide-react';

export default function PrayerPage() {
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
              All requests sent to <a href="mailto:prayer@fbfenton.org" className="underline text-primary">prayer@fbfenton.org</a> will be shared with our pastoral and prayer teams.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input id="name" required disabled />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="email">Your Email</Label>
                    <Input id="email" type="email" required disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="request">Your Prayer Request</Label>
                <Textarea
                  id="request"
                  placeholder="Share what's on your heart..."
                  required
                  rows={6}
                  disabled
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="confidential" disabled />
                <Label htmlFor="confidential" className="font-normal">Keep this request confidential (pastors only)</Label>
              </div>
              <Button type="submit" disabled className="w-full">
                Submit Prayer Request
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
} 