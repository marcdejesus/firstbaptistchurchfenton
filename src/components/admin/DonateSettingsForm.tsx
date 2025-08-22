"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Save, ExternalLink } from 'lucide-react';

interface DonateSettings {
  id: number;
  donateUrl: string;
  description?: string | null;
  isActive: boolean;
  updatedAt: Date;
}

interface DonateSettingsFormProps {
  settings?: DonateSettings | null;
}

export function DonateSettingsForm({ settings }: DonateSettingsFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    donateUrl: settings?.donateUrl || '',
    description: settings?.description || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.donateUrl) {
      toast({
        title: 'Donation URL required',
        description: 'Please enter a valid donation URL.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/donate-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: 'Settings updated!',
          description: 'Donation settings have been updated successfully.',
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
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Current Settings Info */}
      {settings && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-900">Current Settings</CardTitle>
          </CardHeader>
          <CardContent className="text-green-700">
            <div className="space-y-2">
              <p><strong>Donation URL:</strong> {settings.donateUrl}</p>
              {settings.description && (
                <p><strong>Description:</strong> {settings.description}</p>
              )}
              <p className="text-sm">
                Last updated: {new Date(settings.updatedAt).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings Form */}
      <Card>
        <CardHeader>
          <CardTitle>Donation Settings</CardTitle>
          <CardDescription>
            Configure the donation URL and description that will be displayed on your website.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Donation URL */}
            <div className="space-y-2">
              <Label htmlFor="donateUrl">Donation URL *</Label>
              <div className="flex space-x-2">
                <Input
                  id="donateUrl"
                  type="url"
                  value={formData.donateUrl}
                  onChange={(e) => handleChange('donateUrl', e.target.value)}
                  placeholder="https://your-church.churchcenter.com/giving"
                  required
                  disabled={isLoading}
                  className="flex-1"
                />
                {formData.donateUrl && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    asChild
                    disabled={isLoading}
                  >
                    <a 
                      href={formData.donateUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      title="Test donation link"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                The URL where visitors will be directed to make donations. This should be a secure HTTPS link.
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Your generous giving helps us fulfill our mission to serve our community and spread God's love..."
                rows={4}
                disabled={isLoading}
              />
              <p className="text-sm text-muted-foreground">
                Optional message displayed on the donation page to encourage and thank donors.
              </p>
            </div>

            {/* Metadata */}
            {settings && (
              <div className="text-sm text-muted-foreground pt-4 border-t">
                <p>Settings last updated on {new Date(settings.updatedAt).toLocaleDateString()}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end pt-6 border-t">
              <Button type="submit" disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Donation Page Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700 space-y-2">
          <p>• Use a trusted, secure donation platform like Church Center, PayPal, or your bank's online giving</p>
          <p>• Always use HTTPS URLs for security</p>
          <p>• Test the donation process yourself to ensure it works smoothly</p>
          <p>• Consider mentioning how donations are used to encourage giving</p>
          <p>• Update the description seasonally to reflect current needs or campaigns</p>
        </CardContent>
      </Card>
    </div>
  );
}
