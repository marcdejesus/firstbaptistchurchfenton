import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, Calendar, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Blog Management | Admin Dashboard',
  description: 'Manage blog posts and articles',
  robots: 'noindex, nofollow',
};

async function getBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            name: true,
          }
        }
      }
    });
    return posts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export default async function BlogAdminPage() {
  const session = await getServerSession(authOptions);
  const posts = await getBlogPosts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Blog Management</h1>
          <p className="text-muted-foreground">
            Create and manage blog posts and articles for your website
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/new">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {posts.filter(post => post.status === 'PUBLISHED').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {posts.filter(post => post.status === 'DRAFT').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Archived</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-500">
              {posts.filter(post => post.status === 'ARCHIVED').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Blog Posts List */}
      <Card>
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
          <CardDescription>
            Manage your blog posts and articles
          </CardDescription>
        </CardHeader>
        <CardContent>
          {posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                    {post.thumbnailUrl ? (
                      <Image
                        src={post.thumbnailUrl}
                        alt={post.title}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Edit className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg">{post.title}</h3>
                      <Badge 
                        variant={
                          post.status === 'PUBLISHED' ? 'default' : 
                          post.status === 'DRAFT' ? 'secondary' : 'outline'
                        }
                      >
                        {post.status}
                      </Badge>
                    </div>
                    
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {post.excerpt}
                      </p>
                    )}
                    
                    <div className="flex items-center text-xs text-muted-foreground space-x-4">
                      <span className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {post.author?.name || 'Unknown Author'}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Created: {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      {post.publishedAt && (
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          Published: {new Date(post.publishedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/blog/${post.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    {post.status === 'PUBLISHED' && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
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
                <Edit className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium mb-2">No blog posts yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first blog post.
              </p>
              <Button asChild>
                <Link href="/admin/blog/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Write Your First Post
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Blog Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700 space-y-2">
          <p>• Write engaging titles that capture attention</p>
          <p>• Use excerpts to give readers a preview of your content</p>
          <p>• Add thumbnails to make your posts more visually appealing</p>
          <p>• Save drafts frequently while writing</p>
          <p>• Preview posts before publishing to check formatting</p>
        </CardContent>
      </Card>
    </div>
  );
}
