"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PageLayout } from '@/components/layout/PageLayout';
import { Send, Heart, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface PrayerFormData {
  name: string;
  email: string;
  phone: string;
  request: string;
  isConfidential: boolean;
}

export default function PrayerPage() {
  const [formData, setFormData] = useState<PrayerFormData>({
    name: '',
    email: '',
    phone: '',
    request: '',
    isConfidential: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isConfidential: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/prayer-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', request: '', isConfidential: false });
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.error || 'Failed to submit prayer request. Please try again.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
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
              All requests sent to <a href="mailto:prayer@fbfenton.org" className="underline text-primary">prayer@fbfenton.org</a> will be shared with our pastoral and prayer teams.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitStatus === 'success' && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Thank you for sharing your prayer request. Our prayer team will be lifting you up in prayer.
                </AlertDescription>
              </Alert>
            )}
            
            {submitStatus === 'error' && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {errorMessage}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="name">Your Name *</Label>
                    <Input 
                      id="name" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required 
                      disabled={isSubmitting}
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="email">Your Email</Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      placeholder="Optional - for follow-up"
                    />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  name="phone"
                  type="tel" 
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="Optional"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="request">Your Prayer Request *</Label>
                <Textarea
                  id="request"
                  name="request"
                  value={formData.request}
                  onChange={handleInputChange}
                  placeholder="Share what's on your heart..."
                  required
                  rows={6}
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="confidential" 
                  checked={formData.isConfidential}
                  onCheckedChange={handleCheckboxChange}
                  disabled={isSubmitting}
                />
                <Label htmlFor="confidential" className="font-normal">
                  Keep this request confidential (pastors only)
                </Label>
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting Prayer Request...
                  </>
                ) : (
                  <>
                    Submit Prayer Request
                    <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
} 