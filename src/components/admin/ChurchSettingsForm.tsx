"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, Save, Loader2 } from 'lucide-react';

interface ChurchSettings {
  id: number;
  contactEmail: string;
  prayerEmail: string;
  createdAt: string;
  updatedAt: string;
}

export function ChurchSettingsForm() {
  const [settings, setSettings] = useState<ChurchSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    contactEmail: '',
    prayerEmail: '',
  });
  const { toast } = useToast();

  // Fetch current settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/church-settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
          setFormData({
            contactEmail: data.contactEmail,
            prayerEmail: data.prayerEmail,
          });
        } else {
          throw new Error('Failed to fetch settings');
        }
      } catch (error) {
        console.error('Error fetching church settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load church settings',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/admin/church-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedSettings = await response.json();
        setSettings(updatedSettings);
        toast({
          title: 'Settings Updated',
          description: 'Church email settings have been saved successfully.',
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating church settings:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update church settings',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Church Email Settings
          </CardTitle>
          <CardDescription>
            Manage contact and prayer request email addresses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading settings...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Church Email Settings
        </CardTitle>
        <CardDescription>
          Manage contact and prayer request email addresses. These emails will receive notifications from the contact form and prayer request form.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Form Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                placeholder="info@fbfenton.org"
                required
              />
              <p className="text-sm text-muted-foreground">
                This email will receive notifications from the contact form.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prayerEmail">Prayer Request Email</Label>
              <Input
                id="prayerEmail"
                type="email"
                value={formData.prayerEmail}
                onChange={(e) => handleInputChange('prayerEmail', e.target.value)}
                placeholder="prayer@fbfenton.org"
                required
              />
              <p className="text-sm text-muted-foreground">
                This email will receive notifications from the prayer request form.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {settings && (
                <span>Last updated: {new Date(settings.updatedAt).toLocaleDateString()}</span>
              )}
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
