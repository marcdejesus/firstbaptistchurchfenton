import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, EyeOff, Users, Shield, UserCheck, Calendar } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'User Management | Admin Dashboard',
  description: 'Manage user accounts and permissions',
  robots: 'noindex, nofollow',
};

async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        uuid: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            blogPosts: true,
            faqs: true,
          }
        }
      }
    });
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  const users = await getUsers();

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-600';
      case 'EDITOR': return 'bg-blue-600';
      case 'VIEWER': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
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
        <Button asChild>
          <Link href="/admin/users/new">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Link>
        </Button>
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
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {users.filter(user => user.isActive).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            Manage user accounts and their access permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  
                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-lg">{user.name}</h3>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role}
                      </Badge>
                      {!user.isActive && (
                        <Badge variant="secondary">
                          Inactive
                        </Badge>
                      )}
                      {user.email === session?.user?.email && (
                        <Badge variant="outline">
                          You
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {user.email}
                    </p>
                    
                    <div className="flex items-center text-xs text-muted-foreground space-x-4">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                      {user.lastLoginAt && (
                        <span className="flex items-center">
                          <UserCheck className="h-3 w-3 mr-1" />
                          Last login: {new Date(user.lastLoginAt).toLocaleDateString()}
                        </span>
                      )}
                      {(user._count.blogPosts > 0 || user._count.faqs > 0) && (
                        <span className="flex items-center">
                          <Edit className="h-3 w-3 mr-1" />
                          {user._count.blogPosts} posts, {user._count.faqs} FAQs
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/users/${user.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={user.isActive ? "text-gray-500" : "text-green-600"}
                      disabled={user.email === session?.user?.email}
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
                      disabled={user.email === session?.user?.email}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
              <Button asChild>
                <Link href="/admin/users/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First User
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">User Roles</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700 space-y-2">
          <div className="flex items-center space-x-2">
            <Badge className="bg-red-600">ADMIN</Badge>
            <span>Full access to all features including user management and settings</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-blue-600">EDITOR</Badge>
            <span>Can create and edit content but cannot manage users or system settings</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-gray-600">VIEWER</Badge>
            <span>Read-only access to admin dashboard for monitoring purposes</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
