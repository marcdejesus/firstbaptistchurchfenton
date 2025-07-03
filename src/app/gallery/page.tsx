"use client";

import React from 'react';
import { Camera } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';

export default function GalleryPage() {
    const breadcrumbs = [
        { label: "Home", href: "/" },
        { label: "Gallery" },
    ];

    return (
        <PageLayout
            title="Photo & Video Gallery"
            subtitle="A collection of moments from our church life, services, and community events."
            breadcrumbs={breadcrumbs}
        >
            <div className="text-center py-24 bg-background-secondary rounded-lg">
                <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <h2 className="text-3xl font-heading font-bold mb-4">Our Gallery is Coming Soon</h2>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                    We are currently curating a collection of photos and videos to share with you. Please check back soon to see moments from our church family.
                </p>
            </div>
        </PageLayout>
    );
} 