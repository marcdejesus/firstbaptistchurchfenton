"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, EyeOff, Users, Mail, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';
import { formatDescriptionAsPlainText } from '@/lib/text-formatting';

interface StaffMember {
  id: number;
  name: string;
  position: string;
  description: string | null;
  email: string | null;
  photoUrl: string | null;
  photoKey: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    name: string;
  };
}

export default function LeadershipAdminPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchStaffMembers();
  }, []);

  const fetchStaffMembers = async () => {
    try {
      const response = await fetch('/api/admin/staff');
      if (!response.ok) {
        throw new Error('Failed to fetch staff members');
      }
      const data = await response.json();
      setStaff(data);
    } catch (error) {
      console.error('Error fetching staff members:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch staff members',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleActiveStatus = async (id: number, currentStatus: boolean) => {
    setUpdating(id);
    try {
      const staffMember = staff.find(s => s.id === id);
      if (!staffMember) return;

      const response = await fetch(`/api/admin/staff/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...staffMember,
          isActive: !currentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update staff member');
      }

      setStaff(prev => prev.map(s => 
        s.id === id ? { ...s, isActive: !currentStatus } : s
      ));

      toast({
        title: 'Status Updated',
        description: `Staff member is now ${!currentStatus ? 'active' : 'hidden'}`,
      });
    } catch (error) {
      console.error('Error updating staff member:', error);
      toast({
        title: 'Error',
        description: 'Failed to update staff member status',
        variant: 'destructive',
      });
    } finally {
      setUpdating(null);
    }
  };

  const deleteStaffMember = async (id: number) => {
    if (!confirm('Are you sure you want to delete this staff member? This action cannot be undone.')) {
      return;
    }

    setDeleting(id);
    try {
      const response = await fetch(`/api/admin/staff/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete staff member');
      }

      setStaff(prev => prev.filter(s => s.id !== id));

      toast({
        title: 'Staff Member Deleted',
        description: 'Staff member has been removed successfully',
      });
    } catch (error) {
      console.error('Error deleting staff member:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete staff member',
        variant: 'destructive',
      });
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Staff & Leadership</h1>
          <p className="text-muted-foreground">
            Manage your church staff and leadership team information
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/leadership/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Staff Member
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staff.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {staff.filter(member => member.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">With Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {staff.filter(member => member.photoUrl).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff List */}
      <Card>
        <CardHeader>
          <CardTitle>All Staff Members</CardTitle>
          <CardDescription>
            Manage your church staff and leadership team
          </CardDescription>
        </CardHeader>
        <CardContent>
          {staff.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {staff.map((member, index) => (
                <div
                  key={member.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {/* Photo and Order */}
                  <div className="relative mb-4">
                    <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      {member.photoUrl ? (
                        <Image
                          src={member.photoUrl}
                          alt={member.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Users className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    {/* Order Badge */}
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary">
                        #{member.order || index + 1}
                      </Badge>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                      <Badge variant={member.isActive ? "default" : "secondary"}>
                        {member.isActive ? "Active" : "Hidden"}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <p className="text-sm text-blue-600 font-medium">{member.position}</p>
                    
                    {member.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {formatDescriptionAsPlainText(member.description, 150)}
                      </p>
                    )}
                    
                    {member.email && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="h-3 w-3 mr-1" />
                        {member.email}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="text-xs text-muted-foreground">
                      {new Date(member.updatedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/leadership/${member.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={member.isActive ? "text-gray-500" : "text-green-600"}
                        onClick={() => toggleActiveStatus(member.id, member.isActive)}
                        disabled={updating === member.id}
                      >
                        {updating === member.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : member.isActive ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600"
                        onClick={() => deleteStaffMember(member.id)}
                        disabled={deleting === member.id}
                      >
                        {deleting === member.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Users className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium mb-2">No staff members yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by adding your first staff member.
              </p>
              <Button asChild>
                <Link href="/admin/leadership/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Staff Member
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Staff Management Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700 space-y-2">
          <p>• Use professional headshots with consistent styling</p>
          <p>• Write compelling descriptions that highlight experience and passion</p>
          <p>• Use the order field to control the display sequence</p>
          <p>• Include contact emails for staff who should be reachable</p>
          <p>• Update information regularly to keep it current</p>
        </CardContent>
      </Card>
    </div>
  );
}
