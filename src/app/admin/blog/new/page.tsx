import { Metadata } from 'next';
import { BlogForm } from '@/components/admin/BlogForm';

export const metadata: Metadata = {
  title: 'New Blog Post | Admin Dashboard',
  description: 'Create a new blog post',
  robots: 'noindex, nofollow',
};

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Blog Post</h1>
        <p className="text-muted-foreground">
          Write and publish a new blog post or article
        </p>
      </div>

      <BlogForm isNew={true} />
    </div>
  );
}
