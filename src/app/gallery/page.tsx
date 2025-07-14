"use client";

import React from 'react';
import { Camera, Upload, Users, Calendar, Heart } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import Link from 'next/link';

export default function GalleryPage() {
    const { user } = useUser();
    
    const breadcrumbs = [
        { label: "Home", href: "/" },
        { label: "Gallery" },
    ];

    const placeholderAlbums = [
        {
            title: "Sunday Services",
            description: "Moments from our weekly worship services",
            icon: Calendar,
            imageCount: 0,
        },
        {
            title: "Community Events",
            description: "Fellowship gatherings and special occasions",
            icon: Users,
            imageCount: 0,
        },
        {
            title: "Youth Ministry",
            description: "Activities and events for our young people",
            icon: Heart,
            imageCount: 0,
        },
    ];

    return (
        <PageLayout
            title="Photo & Video Gallery"
            subtitle="A collection of moments from our church life, services, and community events."
            breadcrumbs={breadcrumbs}
        >
            <div className="space-y-8">
                {/* Albums Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {placeholderAlbums.map((album, index) => (
                        <Card key={index} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <album.icon className="h-8 w-8 text-primary" />
                                    <span className="text-sm text-muted-foreground">
                                        {album.imageCount} photos
                                    </span>
                                </div>
                                <CardTitle className="font-heading">{album.title}</CardTitle>
                                <CardDescription>{album.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                                    <Camera className="h-12 w-12 text-muted-foreground" />
                                </div>
                                <Button variant="outline" className="w-full mt-4" disabled>
                                    View Album
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Coming Soon Section */}
                <div className="text-center py-16 bg-background-secondary rounded-lg">
                    <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                    <h2 className="text-3xl font-heading font-bold mb-4">Gallery Coming Soon</h2>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-6">
                        We're working on building our photo and video gallery. Soon you'll be able to browse and share memories from our church community.
                    </p>
                    
                    {user?.role === 'admin' && (
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                As an admin, you'll be able to upload and manage photos once the gallery is ready.
                            </p>
                            <Button disabled className="gap-2">
                                <Upload className="h-4 w-4" />
                                Upload Photos (Coming Soon)
                            </Button>
                        </div>
                    )}
                    
                    {!user && (
                        <p className="text-sm text-muted-foreground">
                            <Link href="/login" className="text-primary hover:underline">Sign in</Link> to access member photo albums when available.
                        </p>
                    )}
                </div>

                {/* Info Card */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center space-y-2">
                            <h3 className="font-heading font-semibold">Share Your Memories</h3>
                            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                                Have photos from church events you'd like to share? Contact our office or admin team to contribute to our community gallery.
                            </p>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/contact">Contact Us</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </PageLayout>
    );
} 