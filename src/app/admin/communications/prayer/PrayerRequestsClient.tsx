'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Mail, Phone, Heart, User, Check, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PrayerRequest {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  isPublic: boolean;
  isAnswered: boolean;
  createdAt: Date;
  user: {
    name: string;
  } | null;
}

interface PrayerRequestsClientProps {
  initialRequests: PrayerRequest[];
}

export default function PrayerRequestsClient({ initialRequests }: PrayerRequestsClientProps) {
  const [requests, setRequests] = useState(initialRequests);
  const [loadingStates, setLoadingStates] = useState<{ [key: number]: boolean }>({});
  const { toast } = useToast();

  const toggleAnswered = async (id: number, isAnswered: boolean) => {
    setLoadingStates(prev => ({ ...prev, [id]: true }));
    
    try {
      const response = await fetch(`/api/admin/prayer-requests/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isAnswered }),
      });

      if (response.ok) {
        setRequests(prev => 
          prev.map(req => 
            req.id === id ? { ...req, isAnswered } : req
          )
        );
        
        toast({
          title: isAnswered ? "Marked as Answered" : "Marked as Unanswered",
          description: "Prayer request status updated successfully.",
        });
      } else {
        throw new Error('Failed to update prayer request');
      }
    } catch (error) {
      console.error('Error updating prayer request:', error);
      toast({
        title: "Error",
        description: "Failed to update prayer request status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: false }));
    }
  };

  const deleteRequest = async (id: number) => {
    if (!confirm('Are you sure you want to delete this prayer request? This action cannot be undone.')) {
      return;
    }

    setLoadingStates(prev => ({ ...prev, [id]: true }));
    
    try {
      const response = await fetch(`/api/admin/prayer-requests/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRequests(prev => prev.filter(req => req.id !== id));
        
        toast({
          title: "Prayer Request Deleted",
          description: "Prayer request has been permanently deleted.",
        });
      } else {
        throw new Error('Failed to delete prayer request');
      }
    } catch (error) {
      console.error('Error deleting prayer request:', error);
      toast({
        title: "Error",
        description: "Failed to delete prayer request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: false }));
    }
  };

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
                        onClick={() => toggleAnswered(request.id, !request.isAnswered)}
                        disabled={loadingStates[request.id]}
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
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => deleteRequest(request.id)}
                        disabled={loadingStates[request.id]}
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
