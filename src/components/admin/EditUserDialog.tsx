"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Edit, Loader2, AlertCircle, CheckCircle, 
  User, Mail, Shield, Key, Eye 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  uuid: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'EDITOR';
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface EditUserDialogProps {
  user: User;
  currentUserEmail: string;
  onUserUpdated?: () => void;
}

interface FormData {
  name: string;
  email: string;
  role: 'ADMIN' | 'EDITOR';
  isActive: boolean;
  password: string;
  confirmPassword: string;
}

export function EditUserDialog({ user, currentUserEmail, onUserUpdated }: EditUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<FormData>({
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    password: '',
    confirmPassword: '',
  });

  const [showPasswordFields, setShowPasswordFields] = useState(false);

  // Reset form when user changes
  useEffect(() => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      password: '',
      confirmPassword: '',
    });
    setShowPasswordFields(false);
  }, [user]);

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.email.trim()) return 'Email is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return 'Please enter a valid email address';
    
    if (showPasswordFields) {
      if (!formData.password) return 'Password is required when changing password';
      if (formData.password.length < 8) return 'Password must be at least 8 characters long';
      if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const updateData: any = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        isActive: formData.isActive,
      };

      if (showPasswordFields && formData.password) {
        updateData.password = formData.password;
      }

      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update user');
      }

      setSuccess(true);
      toast({
        title: "User updated successfully",
        description: `${data.name}'s profile has been updated.`,
      });

      // Reset form after a brief delay
      setTimeout(() => {
        setFormData({
          name: data.name,
          email: data.email,
          role: data.role,
          isActive: data.isActive,
          password: '',
          confirmPassword: '',
        });
        setShowPasswordFields(false);
        setSuccess(false);
        setOpen(false);
        onUserUpdated?.();
      }, 1500);

    } catch (error) {
      console.error('Error updating user:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      password: '',
      confirmPassword: '',
    });
    setShowPasswordFields(false);
    setError(null);
    setSuccess(false);
  };

  const getUserInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const isOwnProfile = user.email === currentUserEmail;

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) {
        resetForm();
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information and permissions.
          </DialogDescription>
        </DialogHeader>
        
        {/* User Overview */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="text-sm font-semibold">
              {getUserInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground">
              Created {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
          {isOwnProfile && (
            <div className="ml-auto">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Your Profile
              </span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Full Name
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={isSubmitting}
                placeholder="Enter full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email" className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Email Address
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={isSubmitting}
                placeholder="Enter email address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-role" className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Role
              </Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => handleInputChange('role', value)}
                disabled={isSubmitting || isOwnProfile}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select user role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">
                    <div className="flex flex-col">
                      <span className="font-medium">Admin</span>
                      <span className="text-xs text-muted-foreground">
                        Full access to all features including user management
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="EDITOR">
                    <div className="flex flex-col">
                      <span className="font-medium">Editor</span>
                      <span className="text-xs text-muted-foreground">
                        Can create and edit content but cannot manage users
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {isOwnProfile && (
                <p className="text-xs text-muted-foreground">
                  You cannot change your own role
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  Account Status
                </Label>
                <p className="text-sm text-muted-foreground">
                  {formData.isActive ? 'Account is active' : 'Account is inactive'}
                </p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                disabled={isSubmitting || isOwnProfile}
              />
            </div>
            {isOwnProfile && (
              <p className="text-xs text-muted-foreground">
                You cannot deactivate your own account
              </p>
            )}
          </div>

          <Separator />

          {/* Password Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center">
                  <Key className="h-4 w-4 mr-2" />
                  Change Password
                </Label>
                <p className="text-sm text-muted-foreground">
                  Update the user's password
                </p>
              </div>
              <Switch
                checked={showPasswordFields}
                onCheckedChange={setShowPasswordFields}
                disabled={isSubmitting}
              />
            </div>

            {showPasswordFields && (
              <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="edit-password">New Password</Label>
                  <Input
                    id="edit-password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    disabled={isSubmitting}
                    placeholder="Enter new password (min 8 characters)"
                    minLength={8}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-confirm-password">Confirm New Password</Label>
                  <Input
                    id="edit-confirm-password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    disabled={isSubmitting}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                User updated successfully!
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || success}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Updated
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Update User
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
