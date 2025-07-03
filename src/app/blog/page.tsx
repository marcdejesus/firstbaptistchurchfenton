"use client";

import React from 'react';
import { BookOpen } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';

export default function BlogPage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Blog" },
  ];

  return (
    <PageLayout
        title="From the Blog"
        subtitle="Articles, devotionals, and updates from our church leadership and community."
        breadcrumbs={breadcrumbs}
    >
        <div className="text-center py-24 bg-background-secondary rounded-lg">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-3xl font-heading font-bold mb-4">Coming Soon</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                We're currently working on bringing our blog to life. Please check back soon for articles and stories from our church family.
            </p>
        </div>
    </PageLayout>
  );
} 