"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ImageUpload } from './ImageUpload';
import { Loader2, Save, X, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface StaffFormData {
  name: string;
  position: string;
  description: string;
  email: string;
  photoUrl: string;
  photoKey: string;
  order: number;
  isActive: boolean;
}

interface StaffFormProps {
  staffMember?: {
    id: number;
    name: string;
    position: string;
    description: string;
    email: string;
    photoUrl: string;
    photoKey: string;
    order: number;
    isActive: boolean;
  };
  isEditing?: boolean;
}

export function StaffForm({ staffMember, isEditing = false }: StaffFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<StaffFormData>({
    name: '',
    position: '',
    description: '',
    email: '',
    photoUrl: '',
    photoKey: '',
    order: 1,
    isActive: true,
  });

  useEffect(() => {
    if (staffMember) {
      setFormData({
        name: staffMember.name || '',
        position: staffMember.position || '',
        description: staffMember.description || '',
        email: staffMember.email || '',
        photoUrl: staffMember.photoUrl || '',
        photoKey: staffMember.photoKey || '',
        order: staffMember.order || 1,
        isActive: staffMember.isActive ?? true,
      });
    }
  }, [staffMember]);

  const handleInputChange = (field: keyof StaffFormData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (url: string, key: string) => {
    setFormData(prev => ({
      ...prev,
      photoUrl: url,
      photoKey: key,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing 
        ? `/api/admin/staff/${staffMember?.id}`
        : '/api/admin/staff';
      
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
        throw new Error(error.message || 'Failed to save staff member');
      }

      toast({
        title: isEditing ? 'Staff Member Updated' : 'Staff Member Created',
        description: `${formData.name} has been ${isEditing ? 'updated' : 'created'} successfully.`,
      });

      router.push('/admin/leadership');
    } catch (error) {
      console.error('Error saving staff member:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save staff member',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/leadership');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {isEditing ? 'Edit Staff Member' : 'Add New Staff Member'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing 
              ? 'Update the information for this staff member'
              : 'Add a new staff member to your leadership team'
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
          {/* Left Column - Photo Upload */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Profile Photo</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  currentImageUrl={formData.photoUrl}
                  currentImageKey={formData.photoKey}
                  onImageUpload={handleImageUpload}
                  aspectRatio="square"
                  placeholder={
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <Users className="h-12 w-12 mb-2" />
                      <p className="text-sm">Upload Photo</p>
                    </div>
                  }
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Recommended: Square image, at least 400x400px
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
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position/Title *</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      placeholder="e.g., Lead Pastor, Worship Leader"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="staff@church.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Bio/Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Tell us about this staff member's background, experience, and passion for ministry..."
                    rows={6}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="order">Display Order</Label>
                    <Input
                      id="order"
                      type="number"
                      min="1"
                      value={formData.order}
                      onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 1)}
                      placeholder="1"
                    />
                    <p className="text-xs text-muted-foreground">
                      Lower numbers appear first
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Inactive staff members won't be displayed on the public website
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
            {isEditing ? 'Update Staff Member' : 'Create Staff Member'}
          </Button>
        </div>
      </form>
    </div>
  );
}
