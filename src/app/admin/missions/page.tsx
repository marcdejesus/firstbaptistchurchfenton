import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, EyeOff, Globe, MapPin, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Mission Partners | Admin Dashboard',
  description: 'Manage mission partners and outreach programs',
  robots: 'noindex, nofollow',
};

async function getMissionPartners() {
  try {
    const partners = await prisma.missionPartner.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
          }
        }
      }
    });
    return partners;
  } catch (error) {
    console.error('Error fetching mission partners:', error);
    return [];
  }
}

export default async function MissionsAdminPage() {
  const session = await getServerSession(authOptions);
  const partners = await getMissionPartners();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Mission Partners</h1>
          <p className="text-muted-foreground">
            Manage your mission partners and outreach programs
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/missions/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Partner
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{partners.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {partners.filter(partner => partner.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Local</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {partners.filter(partner => partner.type === 'LOCAL').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">International</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {partners.filter(partner => partner.type === 'INTERNATIONAL').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Partners List */}
      <Card>
        <CardHeader>
          <CardTitle>All Mission Partners</CardTitle>
          <CardDescription>
            Manage your mission partners and outreach programs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {partners.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {/* Image */}
                  <div className="relative mb-4">
                    <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      {partner.imageUrl ? (
                        <Image
                          src={partner.imageUrl}
                          alt={partner.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Globe className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Type Badge */}
                    <div className="absolute top-2 left-2">
                      <Badge 
                        variant={partner.type === 'LOCAL' ? 'default' : 'secondary'}
                        className={
                          partner.type === 'LOCAL' ? 'bg-blue-600' : 'bg-purple-600'
                        }
                      >
                        {partner.type}
                      </Badge>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                      <Badge variant={partner.isActive ? "default" : "secondary"}>
                        {partner.isActive ? "Active" : "Hidden"}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{partner.name}</h3>
                    
                    {partner.location && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        {partner.location}
                      </div>
                    )}
                    
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {partner.description}
                    </p>
                    
                    {partner.website && (
                      <div className="flex items-center text-sm text-blue-600">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        <a 
                          href={partner.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="text-xs text-muted-foreground">
                      {new Date(partner.updatedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/missions/${partner.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={partner.isActive ? "text-gray-500" : "text-green-600"}
                      >
                        {partner.isActive ? (
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
                <Globe className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium mb-2">No mission partners yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by adding your first mission partner.
              </p>
              <Button asChild>
                <Link href="/admin/missions/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Partner
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Mission Partner Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700 space-y-2">
          <p>• Use compelling images that show the impact of each partner's work</p>
          <p>• Write clear descriptions that explain their mission and your partnership</p>
          <p>• Include location information to help visitors understand the global reach</p>
          <p>• Link to partner websites to provide more information</p>
          <p>• Organize partners by local vs. international to show different types of outreach</p>
        </CardContent>
      </Card>
    </div>
  );
}
