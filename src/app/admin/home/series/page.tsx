import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, EyeOff, Calendar } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Current Series | Admin Dashboard',
  description: 'Manage current sermon series',
  robots: 'noindex, nofollow',
};

async function getSeries() {
  try {
    const series = await prisma.currentSeries.findMany({
      orderBy: { startDate: 'desc' }
    });
    return series;
  } catch (error) {
    console.error('Error fetching series:', error);
    return [];
  }
}

export default async function SeriesAdminPage() {
  const session = await getServerSession(authOptions);
  const series = await getSeries();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Current Series</h1>
        <p className="text-muted-foreground">
          Manage the current sermon series displayed on your homepage
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Series</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{series.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {series.filter(s => s.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {series.filter(s => s.startDate > new Date()).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Series List */}
      <Card>
        <CardHeader>
          <CardTitle>All Series</CardTitle>
          <CardDescription>
            Manage your sermon series - only one should be active at a time
          </CardDescription>
        </CardHeader>
        <CardContent>
          {series.length > 0 ? (
            <div className="space-y-4">
              {series.map((seriesItem) => (
                <div
                  key={seriesItem.id}
                  className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {/* Image */}
                  <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                    {seriesItem.imageUrl ? (
                      <Image
                        src={seriesItem.imageUrl}
                        alt={seriesItem.title}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Calendar className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg">{seriesItem.title}</h3>
                      <Badge variant={seriesItem.isActive ? "default" : "secondary"}>
                        {seriesItem.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {seriesItem.startDate > new Date() && (
                        <Badge variant="outline">Upcoming</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {seriesItem.description}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground space-x-4">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Start: {new Date(seriesItem.startDate).toLocaleDateString()}
                      </span>
                      {seriesItem.endDate && (
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          End: {new Date(seriesItem.endDate).toLocaleDateString()}
                        </span>
                      )}
                      <span>
                        Created {new Date(seriesItem.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/home/series/${seriesItem.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={seriesItem.isActive ? "text-gray-500" : "text-green-600"}
                    >
                      {seriesItem.isActive ? (
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
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <Calendar className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium mb-2">No series yet</h3>
              <p className="text-muted-foreground mb-4">
                The current series will be displayed here once configured.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Series Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700 space-y-2">
          <p>• Only one series should be active at a time to avoid confusion</p>
          <p>• Use compelling images that represent the series theme</p>
          <p>• Include start and end dates to help with planning</p>
          <p>• Write engaging descriptions that will draw people to attend</p>
        </CardContent>
      </Card>
    </div>
  );
}
