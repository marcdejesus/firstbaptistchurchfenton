"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Slide {
  id: number;
  title?: string | null;
  subtitle?: string | null;
  imageUrl: string;
  imageKey: string;
  linkUrl?: string | null;
  linkText?: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface SlideshowFormProps {
  slide?: Slide | null;
  isNew: boolean;
}

export function SlideshowForm({ slide, isNew }: SlideshowFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: slide?.title || '',
    subtitle: slide?.subtitle || '',
    imageUrl: slide?.imageUrl || '',
    imageKey: slide?.imageKey || '',
    linkUrl: slide?.linkUrl || '',
    linkText: slide?.linkText || '',
    order: slide?.order || 0,
    isActive: slide?.isActive ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.imageUrl) {
      toast({
        title: 'Image required',
        description: 'Please upload an image for the slide.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const url = isNew ? '/api/admin/slideshow' : `/api/admin/slideshow/${slide?.id}`;
      const method = isNew ? 'POST' : 'PUT';

      // For existing slides, send image, order, and active status
      const requestBody = isNew ? formData : {
        imageUrl: formData.imageUrl,
        imageKey: formData.imageKey,
        order: formData.order,
        isActive: formData.isActive,
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        toast({
          title: isNew ? 'Slide created!' : 'Slide updated!',
          description: isNew
            ? 'The new slide has been created successfully.'
            : 'The slide has been updated successfully.',
        });
        router.push('/admin/home/slideshow');
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
        description: 'Failed to save slide. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!slide || isNew) return;

    if (!confirm('Are you sure you want to delete this slide? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/slideshow/${slide.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Slide deleted!',
          description: 'The slide has been deleted successfully.',
        });
        router.push('/admin/home/slideshow');
        router.refresh();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to delete slide.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete slide. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };



  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" asChild>
        <Link href="/admin/home/slideshow">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Slideshow
        </Link>
      </Button>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>{isNew ? 'Create New Slide' : 'Edit Slide'}</CardTitle>
                  <CardDescription>
          {isNew
            ? 'Fill in the details below to create a new slideshow slide.'
            : 'Update the slide image, order, and active status.'
          }
        </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Slide Image *</Label>
              <ImageUpload
                title="Slide Image"
                description="Upload a high-quality image for your slideshow. Recommended size: 1920x1080px."
                uploadType="slideshowUploader"
                currentImage={formData.imageUrl ? { url: formData.imageUrl, key: formData.imageKey } : null}
                onImageChange={(image) => {
                  if (image) {
                    setFormData(prev => ({ ...prev, imageUrl: image.url, imageKey: image.key }));
                  } else {
                    setFormData(prev => ({ ...prev, imageUrl: '', imageKey: '' }));
                  }
                }}
              />
            </div>

            {/* Order */}
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

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleChange('isActive', checked)}
                disabled={isLoading}
              />
              <Label htmlFor="isActive">
                Active (visible in slideshow)
              </Label>
            </div>

            {/* Metadata */}
            {!isNew && slide && (
              <div className="text-sm text-muted-foreground space-y-1 pt-4 border-t">
                <p>Created on {new Date(slide.createdAt).toLocaleDateString()}</p>
                {slide.updatedAt && slide.updatedAt !== slide.createdAt && (
                  <p>Last updated on {new Date(slide.updatedAt).toLocaleDateString()}</p>
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
                    Delete Slide
                  </Button>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" asChild disabled={isLoading}>
                  <Link href="/admin/home/slideshow">Cancel</Link>
                </Button>
                <Button type="submit" disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading
                    ? 'Saving...'
                    : isNew
                    ? 'Create Slide'
                    : 'Update Slide'
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
