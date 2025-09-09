"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, EyeOff, Users, Shield, UserCheck, Calendar } from 'lucide-react';
import { AddUserDialog } from '@/components/admin/AddUserDialog';
import { EditUserDialog } from '@/components/admin/EditUserDialog';
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
  _count: {
    blogPosts: number;
    faqs: number;
  };
}

interface UsersClientProps {
  initialUsers: User[];
  currentUserEmail: string;
}

export function UsersClient({ initialUsers, currentUserEmail }: UsersClientProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-600';
      case 'EDITOR': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  };

  const refreshUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const updatedUsers = await response.json();
        setUsers(updatedUsers);
      }
    } catch (error) {
      console.error('Error refreshing users:', error);
      toast({
        title: "Error",
        description: "Failed to refresh user list",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUserAdded = () => {
    refreshUsers();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <AddUserDialog onUserAdded={handleUserAdded} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {users.filter(user => user.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {users.filter(user => user.role === 'ADMIN').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Editors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {users.filter(user => user.role === 'EDITOR').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            Manage user accounts and their permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`p-4 border rounded-lg transition-colors ${
                    user.isActive ? 'bg-white' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  {/* User Info */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-lg">{user.name}</h3>
                          <Badge className={`${getRoleBadgeColor(user.role)} text-white`}>
                            {user.role}
                          </Badge>
                          {!user.isActive && (
                            <Badge variant="outline" className="text-gray-500">
                              Inactive
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
                        
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Joined {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                          {user.lastLoginAt && (
                            <div className="flex items-center">
                              <UserCheck className="h-3 w-3 mr-1" />
                              Last login {new Date(user.lastLoginAt).toLocaleDateString()}
                            </div>
                          )}
                          <div className="flex items-center">
                            <Shield className="h-3 w-3 mr-1" />
                            {user._count.blogPosts} posts, {user._count.faqs} FAQs
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <EditUserDialog 
                        user={user} 
                        currentUserEmail={currentUserEmail}
                        onUserUpdated={refreshUsers}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className={user.isActive ? "text-gray-500" : "text-green-600"}
                        disabled={user.email === currentUserEmail}
                      >
                        {user.isActive ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600"
                        disabled={user.email === currentUserEmail}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <Users className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium mb-2">No users yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by adding your first user account.
              </p>
              <AddUserDialog onUserAdded={handleUserAdded} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">User Roles</CardTitle>
          <CardDescription className="text-blue-700">
            Understanding the different permission levels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-3">
            <Badge className="bg-red-600 text-white mt-1">ADMIN</Badge>
            <div>
              <p className="font-medium text-blue-900">Administrator</p>
              <p className="text-sm text-blue-700">
                Superuser with full access to all features including user management and system settings.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Badge className="bg-blue-600 text-white mt-1">EDITOR</Badge>
            <div>
              <p className="font-medium text-blue-900">Editor</p>
              <p className="text-sm text-blue-700">
                Can create and edit content but cannot manage users or system settings.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
