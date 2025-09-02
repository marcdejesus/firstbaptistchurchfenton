"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { ArrowLeft, Save, Calendar } from 'lucide-react';
import Link from 'next/link';

interface SeriesFormProps {
  series: {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    imageKey: string;
    startDate: Date;
    endDate: Date | null;
    isActive: boolean;
  };
  isNew?: boolean;
}

export function SeriesForm({ series, isNew = false }: SeriesFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: series.title,
    description: series.description,
    imageUrl: series.imageUrl,
    imageKey: series.imageKey,
    startDate: series.startDate.toISOString().split('T')[0],
    endDate: series.endDate ? series.endDate.toISOString().split('T')[0] : '',
    isActive: series.isActive
  });

  const [currentImage, setCurrentImage] = useState<{ url: string; key: string } | null>(
    series.imageUrl ? { url: series.imageUrl, key: series.imageKey } : null
  );

  // Debug: Log when component mounts
  useEffect(() => {
    console.log("🎯 [SeriesForm] Component mounted successfully");
    console.log("🎯 [SeriesForm] Initial formData:", formData);
  }, []);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (imageData: { url: string; key: string } | null) => {
    console.log("🔄 [SeriesForm] Image change callback triggered:", imageData);
    
    if (imageData) {
      console.log("✅ [SeriesForm] Setting new image:", imageData);
      setCurrentImage(imageData);
      setFormData(prev => ({
        ...prev,
        imageUrl: imageData.url,
        imageKey: imageData.key
      }));
    } else {
      console.log("🗑️ [SeriesForm] Removing image");
      setCurrentImage(null);
      setFormData(prev => ({
        ...prev,
        imageUrl: '',
        imageKey: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const hasImage = !!currentImage;
      const imageUrl = currentImage?.url || '';
      const imageKey = currentImage?.key || '';

      console.log("📤 [SeriesForm] Submitting form data:", {
        url: `/api/admin/series/${series.id}`,
        method: 'PUT',
        formData,
        hasImage,
        imageUrl,
        imageKey
      });

      const url = isNew ? '/api/admin/series' : `/api/admin/series/${series.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          imageUrl,
          imageKey,
          startDate: new Date(formData.startDate),
          endDate: formData.endDate ? new Date(formData.endDate) : null,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isNew ? 'create' : 'update'} series: ${response.statusText}`);
      }

      toast({
        title: `Series ${isNew ? 'created' : 'updated'} successfully!`,
        description: `The series has been ${isNew ? 'created' : 'updated'} and saved.`,
      });

      router.push('/admin/home/series');
    } catch (error) {
      console.error('Error updating series:', error);
      toast({
        title: 'Update failed',
        description: error instanceof Error ? error.message : 'Something went wrong while updating the series.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {isNew ? 'New Series' : 'Series Details'}
        </CardTitle>
        <CardDescription>
          {isNew ? 'Create a new sermon series' : 'Update the information for this sermon series'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Series Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter series title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                min={formData.startDate}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="isActive">Active Status</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleChange('isActive', checked)}
                />
                <Label htmlFor="isActive">
                  {formData.isActive ? 'Active' : 'Inactive'}
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe the series theme, topics, and what attendees can expect"
              rows={4}
              required
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Series Image</Label>
            <ImageUpload
              title="Series Image"
              description="Upload an image that represents this series. Recommended size: 800x600px."
              uploadType="imageUploader"
              currentImage={currentImage}
              onImageChange={handleImageChange}
              maxFileSize="4MB"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6">
            <Button variant="outline" asChild>
              <Link href="/admin/home/series">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Series
              </Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? (isNew ? 'Creating...' : 'Updating...') : (isNew ? 'Create Series' : 'Update Series')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
