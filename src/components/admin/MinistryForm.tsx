"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { ArrowLeft, Save, Trash2, Heart } from 'lucide-react';
import Link from 'next/link';

interface Ministry {
  id: number;
  name: string;
  description: string;
  imageUrl?: string | null;
  imageKey?: string | null;
  targetAudience?: string | null;
  meetingTime?: string | null;
  contactEmail?: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface MinistryFormProps {
  ministry?: Ministry | null;
  isNew: boolean;
}

export function MinistryForm({ ministry, isNew }: MinistryFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: ministry?.name || '',
    description: ministry?.description || '',
    imageUrl: ministry?.imageUrl || '',
    imageKey: ministry?.imageKey || '',
    targetAudience: ministry?.targetAudience || 'Adults',
    meetingTime: ministry?.meetingTime || '',
    contactEmail: ministry?.contactEmail || '',
    order: ministry?.order || 0,
    isActive: ministry?.isActive ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description) {
      toast({
        title: 'Required fields missing',
        description: 'Please fill in the ministry name and description.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const url = isNew ? '/api/admin/ministries' : `/api/admin/ministries/${ministry?.id}`;
      const method = isNew ? 'POST' : 'PUT';

      console.log("📤 [MinistryForm] Submitting form data:", {
        url,
        method,
        formData,
        hasImage: !!formData.imageUrl,
        imageUrl: formData.imageUrl,
        imageKey: formData.imageKey
      });

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: isNew ? 'Ministry created!' : 'Ministry updated!',
          description: isNew
            ? 'The new ministry has been created successfully.'
            : 'The ministry has been updated successfully.',
        });
        router.push('/admin/ministries');
        router.refresh();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Something went wrong.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save ministry. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!ministry || isNew) return;

    if (!confirm('Are you sure you want to delete this ministry? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/ministries/${ministry.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Ministry deleted!',
          description: 'The ministry has been deleted successfully.',
        });
        router.push('/admin/ministries');
        router.refresh();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to delete ministry.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete ministry. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Debug: Log when component mounts
  useEffect(() => {
    console.log("🎯 [MinistryForm] Component mounted successfully");
    console.log("🎯 [MinistryForm] Initial formData:", formData);
  }, []);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" asChild>
        <Link href="/admin/ministries">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Ministries
        </Link>
      </Button>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            {isNew ? 'Create New Ministry' : 'Edit Ministry'}
          </CardTitle>
          <CardDescription>
            {isNew
              ? 'Fill in the details below to create a new ministry.'
              : 'Update the ministry content and settings below.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Ministry Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g., Youth Ministry, Bible Study"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Select
                  value={formData.targetAudience}
                  onValueChange={(value) => handleChange('targetAudience', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Adults">Adults</SelectItem>
                    <SelectItem value="Youth">Youth</SelectItem>
                    <SelectItem value="Children">Children</SelectItem>
                    <SelectItem value="All Ages">All Ages</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe the ministry's purpose, activities, and what participants can expect..."
                rows={4}
                disabled={isLoading}
                required
              />
              <p className="text-sm text-muted-foreground">
                Provide a clear description that will help people understand and connect with this ministry.
              </p>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Ministry Image</Label>
              <ImageUpload
                title="Ministry Image"
                description="Upload an image that represents this ministry. Recommended size: 800x600px."
                uploadType="ministryUploader"
                currentImage={formData.imageUrl ? { url: formData.imageUrl, key: formData.imageKey || '' } : null}
                onImageChange={(image) => {
                  console.log("🔄 [MinistryForm] Image change callback triggered:", image);
                  if (image) {
                    console.log("✅ [MinistryForm] Setting new image:", { url: image.url, key: image.key });
                    setFormData(prev => ({ ...prev, imageUrl: image.url, imageKey: image.key }));
                  } else {
                    console.log("🗑️ [MinistryForm] Clearing image");
                    setFormData(prev => ({ ...prev, imageUrl: '', imageKey: '' }));
                  }
                }}
              />
            </div>

            {/* Meeting Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meetingTime">Meeting Time</Label>
                <Input
                  id="meetingTime"
                  value={formData.meetingTime}
                  onChange={(e) => handleChange('meetingTime', e.target.value)}
                  placeholder="e.g., Sundays at 9:00 AM"
                  disabled={isLoading}
                />
                <p className="text-sm text-muted-foreground">
                  When does this ministry typically meet?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  placeholder="ministry@church.org"
                  disabled={isLoading}
                />
                <p className="text-sm text-muted-foreground">
                  Email for people to get more information
                </p>
              </div>
            </div>

            {/* Order and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => handleChange('order', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  disabled={isLoading}
                  min="0"
                />
                <p className="text-sm text-muted-foreground">
                  Lower numbers appear first. Use 0 for automatic ordering.
                </p>
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleChange('isActive', checked)}
                  disabled={isLoading}
                />
                <Label htmlFor="isActive">
                  Active (visible on website)
                </Label>
              </div>
            </div>

            {/* Metadata */}
            {!isNew && ministry && (
              <div className="text-sm text-muted-foreground space-y-1 pt-4 border-t">
                <p>Created on {new Date(ministry.createdAt).toLocaleDateString()}</p>
                {ministry.updatedAt && ministry.updatedAt !== ministry.createdAt && (
                  <p>Last updated on {new Date(ministry.updatedAt).toLocaleDateString()}</p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t">
              <div>
                {!isNew && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Ministry
                  </Button>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" asChild disabled={isLoading}>
                  <Link href="/admin/ministries">Cancel</Link>
                </Button>
                <Button type="submit" disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading
                    ? 'Saving...'
                    : isNew
                    ? 'Create Ministry'
                    : 'Update Ministry'
                  }
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
