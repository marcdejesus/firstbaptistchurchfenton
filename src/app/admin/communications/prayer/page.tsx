import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Mail, Phone, Heart, Calendar, User, Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Prayer Requests | Admin Dashboard',
  description: 'Manage prayer requests from your community',
  robots: 'noindex, nofollow',
};

async function getPrayerRequests() {
  try {
    const requests = await prisma.prayerRequest.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
          }
        }
      }
    });
    return requests;
  } catch (error) {
    console.error('Error fetching prayer requests:', error);
    return [];
  }
}

export default async function PrayerRequestsPage() {
  const session = await getServerSession(authOptions);
  const requests = await getPrayerRequests();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Prayer Requests</h1>
          <p className="text-muted-foreground">
            Manage prayer requests from your community members
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Public</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {requests.filter(req => req.isPublic).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Private</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {requests.filter(req => !req.isPublic).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Answered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {requests.filter(req => req.isAnswered).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prayer Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>All Prayer Requests</CardTitle>
          <CardDescription>
            Review prayer requests and mark them as answered when appropriate
          </CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length > 0 ? (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className={`p-4 border rounded-lg transition-colors ${
                    request.isAnswered ? 'bg-green-50 border-green-200' : 'bg-white'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-lg">Prayer Request</h3>
                      {request.isPublic ? (
                        <Badge variant="default" className="bg-blue-600">
                          Public
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          Private
                        </Badge>
                      )}
                      {request.isAnswered && (
                        <Badge variant="default" className="bg-green-600">
                          <Check className="h-3 w-3 mr-1" />
                          Answered
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(request.createdAt).toLocaleDateString()} at{' '}
                      {new Date(request.createdAt).toLocaleTimeString()}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="flex items-center space-x-6 mb-3 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {request.name}
                    </div>
                    {request.email && (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        <a 
                          href={`mailto:${request.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {request.email}
                        </a>
                      </div>
                    )}
                    {request.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        <a 
                          href={`tel:${request.phone}`}
                          className="text-blue-600 hover:underline"
                        >
                          {request.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Prayer Request */}
                  <div className="bg-gray-50 p-3 rounded border-l-4 border-l-primary/30">
                    <p className="text-sm whitespace-pre-wrap">{request.message}</p>
                  </div>

                  {/* Privacy Notice */}
                  {!request.isPublic && (
                    <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                      <strong>Private Request:</strong> This prayer request is confidential and should not be shared publicly.
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <div className="text-xs text-muted-foreground">
                      {request.user?.name && `Submitted by ${request.user.name}`}
                    </div>
                    <div className="flex items-center space-x-2">
                      {request.email && (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a href={`mailto:${request.email}?subject=Your Prayer Request`}>
                            <Mail className="h-4 w-4 mr-2" />
                            Contact
                          </a>
                        </Button>
                      )}
                      <Button
                        variant={request.isAnswered ? "outline" : "default"}
                        size="sm"
                        className={request.isAnswered ? "" : "bg-green-600 hover:bg-green-700"}
                      >
                        {request.isAnswered ? (
                          <>
                            <Eye className="h-4 w-4 mr-2" />
                            Mark Unanswered
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Mark Answered
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <Heart className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium mb-2">No prayer requests yet</h3>
              <p className="text-muted-foreground">
                Prayer requests from your website will appear here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Prayer Request Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700 space-y-2">
          <p>• Respect the privacy of confidential prayer requests</p>
          <p>• Follow up with individuals who provide contact information</p>
          <p>• Mark requests as answered when prayers are fulfilled</p>
          <p>• Public requests may be shared in church communications</p>
          <p>• Private requests should remain confidential to leadership</p>
        </CardContent>
      </Card>
    </div>
  );
}
