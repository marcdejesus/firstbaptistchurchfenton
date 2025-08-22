import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, EyeOff, Users, Mail } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Staff & Leadership | Admin Dashboard',
  description: 'Manage staff members and leadership team',
  robots: 'noindex, nofollow',
};

async function getStaffMembers() {
  try {
    const staff = await prisma.staffMember.findMany({
      orderBy: { order: 'asc' },
      include: {
        user: {
          select: {
            name: true,
          }
        }
      }
    });
    return staff;
  } catch (error) {
    console.error('Error fetching staff members:', error);
    return [];
  }
}

export default async function LeadershipAdminPage() {
  const session = await getServerSession(authOptions);
  const staff = await getStaffMembers();

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
                        {member.description}
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
                      >
                        {member.isActive ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
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
