"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Loader2, User, Settings, Bell, Shield, CheckCircle, AlertCircle, Edit, Save, X } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { useUser } from '@/contexts/UserContext';
import { usersService, type UserProfile } from '@/lib/firestore/users';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user } = useUser();
  const router = useRouter();
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    birthday: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      newsletterSubscription: true
    }
  });

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "My Profile" },
  ];

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const loadUserProfile = async () => {
      try {
        const profile = await usersService.getUserById(user.id);
        if (profile) {
          setUserProfile(profile);
          setFormData({
            name: profile.name || '',
            email: profile.email || '',
            phone: profile.profile?.phone || '',
            address: profile.profile?.address || '',
            birthday: profile.profile?.birthday || '',
            emergencyContact: profile.profile?.emergencyContact || {
              name: '',
              phone: '',
              relationship: ''
            },
            preferences: {
              emailNotifications: profile.preferences?.emailNotifications ?? true,
              smsNotifications: profile.preferences?.smsNotifications ?? false,
              newsletterSubscription: profile.preferences?.newsletterSubscription ?? true
            }
          });
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        setError('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [user, router]);

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Update basic user info
      await usersService.updateUser(user.id, {
        name: formData.name,
        email: formData.email,
      });

      // Update profile data
      await usersService.updateUserProfile(user.id, {
        phone: formData.phone,
        address: formData.address,
        birthday: formData.birthday,
        emergencyContact: formData.emergencyContact.name ? formData.emergencyContact : undefined,
      });

      // Update preferences
      await usersService.updateUserPreferences(user.id, formData.preferences);

      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Reload profile data
      const updatedProfile = await usersService.getUserById(user.id);
      if (updatedProfile) {
        setUserProfile(updatedProfile);
      }
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleCancel = () => {
    if (!userProfile) return;
    
    setFormData({
      name: userProfile.name || '',
      email: userProfile.email || '',
      phone: userProfile.profile?.phone || '',
      address: userProfile.profile?.address || '',
      birthday: userProfile.profile?.birthday || '',
      emergencyContact: userProfile.profile?.emergencyContact || {
        name: '',
        phone: '',
        relationship: ''
      },
      preferences: {
        emailNotifications: userProfile.preferences?.emailNotifications ?? true,
        smsNotifications: userProfile.preferences?.smsNotifications ?? false,
        newsletterSubscription: userProfile.preferences?.newsletterSubscription ?? true
      }
    });
    setIsEditing(false);
    setError('');
  };

  if (loading) {
    return (
      <PageLayout title="My Profile" breadcrumbs={breadcrumbs}>
        <div className="flex justify-center items-center min-h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </PageLayout>
    );
  }

  if (!user || !userProfile) {
    return (
      <PageLayout title="My Profile" breadcrumbs={breadcrumbs}>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Profile Not Found</h3>
              <p className="text-muted-foreground">Unable to load your profile information.</p>
            </div>
          </CardContent>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="My Profile" breadcrumbs={breadcrumbs}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage 
                    src={userProfile.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userProfile.name)}`} 
                    alt={userProfile.name} 
                  />
                  <AvatarFallback>
                    {userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-3xl font-heading">{userProfile.name}</CardTitle>
                  <CardDescription className="text-lg">{userProfile.email}</CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      userProfile.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {userProfile.role === 'admin' ? 'Administrator' : 'Member'}
                    </span>
                    {userProfile.isApprovedMember && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant={isEditing ? "outline" : "default"}
                onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
              >
                {isEditing ? (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Status Messages */}
        {success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Profile Tabs */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Personal Info
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Account
            </TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and contact information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthday">Birthday</Label>
                    <Input
                      id="birthday"
                      type="date"
                      value={formData.birthday}
                      onChange={(e) => handleInputChange('birthday', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Street address, city, state, zip code"
                    rows={3}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold">Emergency Contact</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergency-name">Name</Label>
                      <Input
                        id="emergency-name"
                        value={formData.emergencyContact.name}
                        onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergency-relationship">Relationship</Label>
                      <Input
                        id="emergency-relationship"
                        value={formData.emergencyContact.relationship}
                        onChange={(e) => handleInputChange('emergencyContact.relationship', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Spouse, parent, sibling, etc."
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergency-phone">Phone Number</Label>
                    <Input
                      id="emergency-phone"
                      value={formData.emergencyContact.phone}
                      onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
                      disabled={!isEditing}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how you'd like to receive updates and communications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="email-notifications"
                      checked={formData.preferences.emailNotifications}
                      onCheckedChange={(checked) => 
                        handleInputChange('preferences.emailNotifications', checked)
                      }
                      disabled={!isEditing}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="email-notifications" className="text-sm font-medium">
                        Email Notifications
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Receive notifications about events, prayer requests, and church updates via email.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sms-notifications"
                      checked={formData.preferences.smsNotifications}
                      onCheckedChange={(checked) => 
                        handleInputChange('preferences.smsNotifications', checked)
                      }
                      disabled={!isEditing}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="sms-notifications" className="text-sm font-medium">
                        SMS Notifications
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Receive urgent notifications and reminders via text message.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="newsletter"
                      checked={formData.preferences.newsletterSubscription}
                      onCheckedChange={(checked) => 
                        handleInputChange('preferences.newsletterSubscription', checked)
                      }
                      disabled={!isEditing}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="newsletter" className="text-sm font-medium">
                        Newsletter Subscription
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Receive our weekly newsletter with church news and announcements.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  View your account status and security information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Account Status</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Member Since:</span>
                        <span>{userProfile.createdAt?.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Login:</span>
                        <span>{userProfile.lastLoginAt?.toLocaleDateString() || 'Never'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email Verified:</span>
                        <span className={userProfile.isEmailVerified ? 'text-green-600' : 'text-red-600'}>
                          {userProfile.isEmailVerified ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Account Type:</span>
                        <span className="capitalize">{userProfile.role}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Security</h4>
                    <div className="space-y-3">
                      <Button variant="outline" size="sm" disabled>
                        Change Password
                      </Button>
                      <Button variant="outline" size="sm" disabled>
                        Two-Factor Authentication
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Security features coming soon. Contact church administration for password changes.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        {isEditing && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
}
