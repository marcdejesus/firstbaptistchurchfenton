"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PageLayout } from '@/components/layout/PageLayout';
import { Send, Heart, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { prayerRequestsService } from '@/lib/firestore/prayers';
import { useUser } from '@/contexts/UserContext';
import Link from 'next/link';

export default function PrayerPage() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'other' as 'healing' | 'guidance' | 'thanksgiving' | 'protection' | 'other',
    urgency: 'medium' as 'low' | 'medium' | 'high',
    isAnonymous: false,
    isPublic: true,
    submitterName: '',
    submitterEmail: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const { user } = useUser();

  // Pre-fill user data if logged in
  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        submitterName: user.name,
        submitterEmail: user.email,
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate form
    if (!formData.title.trim()) {
      setError('Please provide a title for your prayer request.');
      setIsLoading(false);
      return;
    }

    if (!formData.content.trim()) {
      setError('Please share your prayer request.');
      setIsLoading(false);
      return;
    }

    if (!formData.isAnonymous && !formData.submitterName.trim()) {
      setError('Please provide your name or mark this as anonymous.');
      setIsLoading(false);
      return;
    }

    try {
      await prayerRequestsService.createPrayerRequest({
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
        urgency: formData.urgency,
        isAnonymous: formData.isAnonymous,
        isPublic: formData.isPublic,
        submitterName: formData.isAnonymous ? undefined : formData.submitterName,
        submitterEmail: formData.isAnonymous ? undefined : formData.submitterEmail,
        submitterUserId: user?.id,
      });

      setSuccess(true);

      // Reset form after success
      setTimeout(() => {
        setFormData({
          title: '',
          content: '',
          category: 'other',
          urgency: 'medium',
          isAnonymous: false,
          isPublic: true,
          submitterName: user?.name || '',
          submitterEmail: user?.email || '',
        });
        setSuccess(false);
      }, 3000);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to submit prayer request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (success) {
    return (
      <PageLayout
        title="Prayer Request Submitted"
        subtitle="Thank you for sharing your heart with us."
        variant="narrow"
      >
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-heading font-bold">Request Submitted</h2>
              <p className="text-muted-foreground">
                Your prayer request has been received and will be reviewed by our prayer team.
              </p>
              {formData.isPublic && (
                <p className="text-sm text-muted-foreground">
                  If approved, your request will be visible on our prayer wall for the community to pray together.
                </p>
              )}
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={() => setSuccess(false)}>
                  Submit Another Request
                </Button>
                <Button asChild>
                  <Link href="/prayer/wall">View Prayer Wall</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Prayer Requests"
      subtitle="We believe in the power of prayer. Let us know how we can pray for you."
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Submit a Prayer Request
            </CardTitle>
            <CardDescription>
              Share what's on your heart. Our pastoral and prayer teams are here to support you in prayer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Prayer Request Title</Label>
                <Input
                  id="title"
                  placeholder="Brief description of your prayer need"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Your Prayer Request</Label>
                <Textarea
                  id="content"
                  placeholder="Share what's on your heart..."
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  required
                  rows={6}
                  disabled={isLoading}
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange('category', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="healing">Healing</SelectItem>
                    <SelectItem value="guidance">Guidance</SelectItem>
                    <SelectItem value="thanksgiving">Thanksgiving</SelectItem>
                    <SelectItem value="protection">Protection</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Urgency */}
              <div className="space-y-3">
                <Label>Urgency Level</Label>
                <RadioGroup
                  value={formData.urgency}
                  onValueChange={(value) => handleInputChange('urgency', value)}
                  disabled={isLoading}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low">Low - General prayer support</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium">Medium - Ongoing prayer needed</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high">High - Urgent prayer needed</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Privacy Settings */}
              <div className="space-y-3">
                <Label>Privacy Settings</Label>
                <RadioGroup
                  value={formData.isPublic ? (formData.isAnonymous ? 'public-anonymous' : 'public') : 'private'}
                  onValueChange={(value) => {
                    if (value === 'public') {
                      handleInputChange('isPublic', true);
                      handleInputChange('isAnonymous', false);
                    } else if (value === 'public-anonymous') {
                      handleInputChange('isPublic', true);
                      handleInputChange('isAnonymous', true);
                    } else {
                      handleInputChange('isPublic', false);
                      handleInputChange('isAnonymous', false);
                    }
                  }}
                  disabled={isLoading}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="public" />
                    <Label htmlFor="public">Share publicly with my name</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public-anonymous" id="public-anonymous" />
                    <Label htmlFor="public-anonymous">Share publicly but keep me anonymous</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="private" />
                    <Label htmlFor="private">Keep private (pastors and prayer team only)</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Contact Information (if not anonymous) */}
              {!formData.isAnonymous && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      value={formData.submitterName}
                      onChange={(e) => handleInputChange('submitterName', e.target.value)}
                      required={!formData.isAnonymous}
                      disabled={isLoading}
                      placeholder={user ? "Using your account name" : "Enter your name"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Your Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.submitterEmail}
                      onChange={(e) => handleInputChange('submitterEmail', e.target.value)}
                      disabled={isLoading}
                      placeholder={user ? "Using your account email" : "Enter your email"}
                    />
                  </div>
                </div>
              )}

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Prayer Request
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h3 className="font-heading font-semibold">Need someone to talk to?</h3>
              <p className="text-sm text-muted-foreground">
                Our pastoral team is available for confidential conversations and counseling.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/contact">Contact a Pastor</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
} 