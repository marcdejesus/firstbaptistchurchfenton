import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { BlogForm } from '@/components/admin/BlogForm';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  if (id === 'new') {
    return {
      title: 'New Blog Post | Admin Dashboard',
      description: 'Create a new blog post',
      robots: 'noindex, nofollow',
    };
  }

  const post = await getBlogPost(id);
  if (!post) {
    return {
      title: 'Blog Post Not Found | Admin Dashboard',
      robots: 'noindex, nofollow',
    };
  }

  return {
    title: `Edit Post: ${post.title} | Admin Dashboard`,
    description: 'Edit blog post',
    robots: 'noindex, nofollow',
  };
}

async function getBlogPost(id: string) {
  if (id === 'new') return null;

  try {
    const post = await prisma.blogPost.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: {
          select: {
            name: true,
          }
        }
      }
    });
    return post;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export default async function BlogEditPage({ params }: Props) {
  const { id } = await params;
  const post = await getBlogPost(id);
  const isNew = id === 'new';

  if (!isNew && !post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {isNew ? 'Create New Blog Post' : 'Edit Blog Post'}
        </h1>
        <p className="text-muted-foreground">
          {isNew
            ? 'Write and publish a new blog post or article'
            : 'Update the blog post content and settings'
          }
        </p>
      </div>

      <BlogForm post={post} isNew={isNew} />
    </div>
  );
}
