import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FAQ Management | Admin Dashboard',
  description: 'Manage frequently asked questions',
  robots: 'noindex, nofollow',
};

async function getFAQs() {
  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: { order: 'asc' },
      include: {
        user: {
          select: {
            name: true,
          }
        }
      }
    });
    return faqs;
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }
}

export default async function FAQAdminPage() {
  const session = await getServerSession(authOptions);
  const faqs = await getFAQs();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">FAQ Management</h1>
          <p className="text-muted-foreground">
            Manage frequently asked questions displayed on your website
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/faq/new">
            <Plus className="h-4 w-4 mr-2" />
            Add FAQ
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total FAQs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{faqs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {faqs.filter(faq => faq.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hidden</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-500">
              {faqs.filter(faq => !faq.isActive).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ List */}
      <Card>
        <CardHeader>
          <CardTitle>All FAQs</CardTitle>
          <CardDescription>
            Manage the order and visibility of frequently asked questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {faqs.length > 0 ? (
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={faq.id}
                  className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {/* Order Number */}
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                    {faq.order || index + 1}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium text-lg">{faq.question}</h3>
                      <Badge variant={faq.isActive ? "default" : "secondary"}>
                        {faq.isActive ? "Active" : "Hidden"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {faq.answer}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground space-x-4">
                      <span>
                        Created by {faq.user?.name || 'Unknown'}
                      </span>
                      <span>
                        {new Date(faq.createdAt).toLocaleDateString()}
                      </span>
                      {faq.updatedAt && faq.updatedAt !== faq.createdAt && (
                        <span>
                          Updated {new Date(faq.updatedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/faq/${faq.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={faq.isActive ? "text-gray-500" : "text-green-600"}
                    >
                      {faq.isActive ? (
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
                <Plus className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium mb-2">No FAQs yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first frequently asked question.
              </p>
              <Button asChild>
                <Link href="/admin/faq/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First FAQ
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
