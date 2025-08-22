import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Mail, Phone, MessageSquare, Calendar, User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Submissions | Admin Dashboard',
  description: 'Manage contact form submissions',
  robots: 'noindex, nofollow',
};

async function getContactSubmissions() {
  try {
    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
          }
        }
      }
    });
    return submissions;
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    return [];
  }
}

export default async function ContactSubmissionsPage() {
  const session = await getServerSession(authOptions);
  const submissions = await getContactSubmissions();

  const markAsRead = async (id: number) => {
    try {
      await fetch(`/api/admin/contact-submissions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRead: true }),
      });
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contact Submissions</h1>
          <p className="text-muted-foreground">
            Manage messages and inquiries from your website visitors
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {submissions.filter(sub => !sub.isRead).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {submissions.filter(sub => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return sub.createdAt > weekAgo;
              }).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Volunteer Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {submissions.filter(sub => sub.subject?.toLowerCase().includes('volunteer')).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submissions List */}
      <Card>
        <CardHeader>
          <CardTitle>All Contact Submissions</CardTitle>
          <CardDescription>
            Review and respond to messages from website visitors
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submissions.length > 0 ? (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className={`p-4 border rounded-lg transition-colors ${
                    submission.isRead ? 'bg-white' : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-lg">{submission.subject}</h3>
                      {!submission.isRead && (
                        <Badge variant="default" className="bg-red-600">
                          New
                        </Badge>
                      )}
                      {submission.subject?.toLowerCase().includes('volunteer') && (
                        <Badge variant="outline" className="border-green-200 text-green-700">
                          Volunteer
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(submission.createdAt).toLocaleDateString()} at{' '}
                      {new Date(submission.createdAt).toLocaleTimeString()}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="flex items-center space-x-6 mb-3 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {submission.name}
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      <a 
                        href={`mailto:${submission.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {submission.email}
                      </a>
                    </div>
                    {submission.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        <a 
                          href={`tel:${submission.phone}`}
                          className="text-blue-600 hover:underline"
                        >
                          {submission.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Message */}
                  <div className="bg-gray-50 p-3 rounded border-l-4 border-l-primary/30">
                    <p className="text-sm whitespace-pre-wrap">{submission.message}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <div className="text-xs text-muted-foreground">
                      {submission.user?.name && `Created by ${submission.user.name}`}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a href={`mailto:${submission.email}?subject=Re: ${submission.subject}`}>
                          <Mail className="h-4 w-4 mr-2" />
                          Reply
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={submission.isRead ? "text-gray-500" : "text-blue-600"}
                        onClick={() => markAsRead(submission.id)}
                      >
                        {submission.isRead ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
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
                <MessageSquare className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium mb-2">No contact submissions yet</h3>
              <p className="text-muted-foreground">
                Messages from your website contact form will appear here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
