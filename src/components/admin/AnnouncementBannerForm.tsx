"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Save, Eye, EyeOff, Palette } from 'lucide-react';

interface AnnouncementBanner {
  id: number;
  message: string;
  isActive: boolean;
  backgroundColor?: string | null;
  textColor?: string | null;
  updatedAt: Date;
}

interface AnnouncementBannerFormProps {
  announcement?: AnnouncementBanner | null;
}

export function AnnouncementBannerForm({ announcement }: AnnouncementBannerFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    message: announcement?.message || '',
    backgroundColor: announcement?.backgroundColor || '#1e40af',
    textColor: announcement?.textColor || '#ffffff',
    isActive: announcement?.isActive ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.message.trim()) {
      toast({
        title: 'Message required',
        description: 'Please enter an announcement message.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/announcement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: 'Announcement updated!',
          description: 'Your announcement banner has been updated successfully.',
        });
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
        description: 'Failed to save announcement. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Current Announcement Preview */}
      {announcement && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-900">Current Announcement</CardTitle>
          </CardHeader>
          <CardContent className="text-green-700">
            <div className="space-y-2">
              <p><strong>Message:</strong> {announcement.message}</p>
              <p><strong>Background Color:</strong> {announcement.backgroundColor || 'Default'}</p>
              <p><strong>Text Color:</strong> {announcement.textColor || 'Default'}</p>
              <p><strong>Status:</strong> {announcement.isActive ? 'Active' : 'Inactive'}</p>
              <p className="text-sm">
                Last updated: {new Date(announcement.updatedAt).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Live Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Live Preview</CardTitle>
          <CardDescription>
            See how your announcement will look on the website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className="p-4 rounded-lg text-center"
            style={{
              backgroundColor: formData.backgroundColor,
              color: formData.textColor,
            }}
          >
            {formData.message || 'Your announcement message will appear here...'}
          </div>
        </CardContent>
      </Card>

      {/* Settings Form */}
      <Card>
        <CardHeader>
          <CardTitle>Announcement Settings</CardTitle>
          <CardDescription>
            Configure your announcement banner message and appearance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Announcement Message *</Label>
              <Textarea
                id="message"
                placeholder="Enter your announcement message..."
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                className="min-h-[100px]"
                required
              />
              <p className="text-sm text-muted-foreground">
                This message will be displayed prominently at the top of your website
              </p>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="backgroundColor">Background Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="backgroundColor"
                    type="color"
                    value={formData.backgroundColor}
                    onChange={(e) => handleChange('backgroundColor', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={formData.backgroundColor}
                    onChange={(e) => handleChange('backgroundColor', e.target.value)}
                    placeholder="#1e40af"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="textColor">Text Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="textColor"
                    type="color"
                    value={formData.textColor}
                    onChange={(e) => handleChange('textColor', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={formData.textColor}
                    onChange={(e) => handleChange('textColor', e.target.value)}
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isActive">Show Announcement</Label>
                <p className="text-sm text-muted-foreground">
                  Toggle to show or hide the announcement banner
                </p>
              </div>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleChange('isActive', checked)}
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" disabled={isLoading} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Announcement'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Tips for Effective Announcements</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700 space-y-2">
          <p>• Keep messages concise and clear</p>
          <p>• Use high contrast colors for better readability</p>
          <p>• Update regularly to keep information current</p>
          <p>• Consider using this for important events, service changes, or urgent updates</p>
        </CardContent>
      </Card>
    </div>
  );
}
