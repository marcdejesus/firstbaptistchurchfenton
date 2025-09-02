"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from './ImageUpload';
import { Loader2, Save, X, Globe } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MissionPartnerFormData {
  name: string;
  description: string;
  location: string;
  website: string;
  imageUrl: string;
  imageKey: string;
  type: 'LOCAL' | 'INTERNATIONAL';
  isActive: boolean;
}

interface MissionPartnerFormProps {
  missionPartner?: {
    id: number;
    name: string;
    description: string;
    location: string | null;
    website: string | null;
    imageUrl: string | null;
    imageKey: string | null;
    type: 'LOCAL' | 'INTERNATIONAL';
    isActive: boolean;
  };
  isEditing?: boolean;
}

export function MissionPartnerForm({ missionPartner, isEditing = false }: MissionPartnerFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<MissionPartnerFormData>({
    name: '',
    description: '',
    location: '',
    website: '',
    imageUrl: '',
    imageKey: '',
    type: 'INTERNATIONAL',
    isActive: true,
  });

  useEffect(() => {
    if (missionPartner) {
      setFormData({
        name: missionPartner.name || '',
        description: missionPartner.description || '',
        location: missionPartner.location || '',
        website: missionPartner.website || '',
        imageUrl: missionPartner.imageUrl || '',
        imageKey: missionPartner.imageKey || '',
        type: missionPartner.type || 'INTERNATIONAL',
        isActive: missionPartner.isActive ?? true,
      });
    }
  }, [missionPartner]);

  const handleInputChange = (field: keyof MissionPartnerFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (url: string, key: string) => {
    setFormData(prev => ({
      ...prev,
      imageUrl: url,
      imageKey: key,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing 
        ? `/api/admin/mission-partners/${missionPartner?.id}`
        : '/api/admin/mission-partners';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save mission partner');
      }

      toast({
        title: isEditing ? 'Mission Partner Updated' : 'Mission Partner Created',
        description: `${formData.name} has been ${isEditing ? 'updated' : 'created'} successfully.`,
      });

      router.push('/admin/missions');
    } catch (error) {
      console.error('Error saving mission partner:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save mission partner',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/missions');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {isEditing ? 'Edit Mission Partner' : 'Add New Mission Partner'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing 
              ? 'Update the information for this mission partner'
              : 'Add a new mission partner to your global missions network'
            }
          </p>
        </div>
        <Button variant="outline" onClick={handleCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Image Upload */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Partner Image</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  currentImageUrl={formData.imageUrl}
                  currentImageKey={formData.imageKey}
                  onImageUpload={handleImageUpload}
                  aspectRatio="16/9"
                  placeholder={
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <Globe className="h-12 w-12 mb-2" />
                      <p className="text-sm">Upload Image</p>
                    </div>
                  }
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Recommended: 16:9 aspect ratio, at least 800x450px
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Partner Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter partner name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Mission Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: 'LOCAL' | 'INTERNATIONAL') => handleInputChange('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select mission type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOCAL">Local</SelectItem>
                        <SelectItem value="INTERNATIONAL">International</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="e.g., Pakistan, India, Thailand"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the mission partner's work, impact, and how people can get involved..."
                    rows={6}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Display Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Display Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Inactive mission partners won't be displayed on the public website
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button variant="outline" onClick={handleCancel} type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Save className="h-4 w-4 mr-2" />
            {isEditing ? 'Update Mission Partner' : 'Create Mission Partner'}
          </Button>
        </div>
      </form>
    </div>
  );
}
