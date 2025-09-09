import { Metadata } from 'next';
import { blogPageMetadata } from '@/lib/seo';
import BlogPageClient from './BlogPageClient';

export const metadata: Metadata = blogPageMetadata;

export default function BlogPage() {
  return <BlogPageClient />;
} 