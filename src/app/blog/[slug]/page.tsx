import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateBlogPostMetadata } from '@/lib/seo';
import { prisma } from '@/lib/prisma';
import BlogPostClient from './BlogPostClient';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

async function getBlogPost(slug: string) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });
    return post;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getBlogPost(resolvedParams.slug);
  
  if (!post) {
    return {
      title: 'Blog Post Not Found - First Baptist Church Fenton',
      description: 'The requested blog post could not be found.',
    };
  }

  return generateBlogPostMetadata({
    title: post.title,
    excerpt: post.excerpt || undefined,
    thumbnailUrl: post.thumbnailUrl || undefined,
    publishedAt: post.publishedAt?.toISOString() || undefined,
    author: post.author ? { name: post.author.name } : undefined,
    slug: post.slug,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = await getBlogPost(resolvedParams.slug);
  
  if (!post) {
    notFound();
  }

  return <BlogPostClient post={post} />;
}