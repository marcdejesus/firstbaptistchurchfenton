"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Globe, ExternalLink, MapPin } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { useMissionPartners } from '@/hooks/useMissionPartners';

// A simple component to represent the world map
// In a real application, this could be an interactive map library like react-simple-maps
const WorldMap = () => (
    <div className="relative bg-blue-100 rounded-lg p-4 h-64 md:h-96 flex items-center justify-center overflow-hidden">
        <Globe className="text-blue-300 w-48 h-48 md:w-64 md:h-64 opacity-50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-blue-800">Our Global Impact</h2>
            <p className="mt-2 text-blue-600 max-w-md">
                From our neighborhood to the nations, we are committed to making a difference for Christ.
            </p>
        </div>
    </div>
);

export default function MissionsPage() {
  const { missionPartners, loading, error } = useMissionPartners();

  if (loading) {
    return (
      <PageLayout
        title="Global Missions"
        subtitle="We are passionate about making disciples of all nations by equipping local leaders to reach their own communities. Our approach is simple: train and support national pastors and leaders already doing the work."
      >
        <div className="mt-16">
          <h2 className="text-3xl font-heading font-bold text-center mb-10">Our Partners in the Field</h2>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading mission partners...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout
        title="Global Missions"
        subtitle="We are passionate about making disciples of all nations by equipping local leaders to reach their own communities. Our approach is simple: train and support national pastors and leaders already doing the work."
      >
        <div className="mt-16">
          <h2 className="text-3xl font-heading font-bold text-center mb-10">Our Partners in the Field</h2>
          <div className="text-center py-8">
            <p className="text-red-600">Error loading mission partners. Please try again later.</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Global Missions"
      subtitle="We are passionate about making disciples of all nations by equipping local leaders to reach their own communities. Our approach is simple: train and support national pastors and leaders already doing the work."
    >
      <div className="mt-16">
        <h2 className="text-3xl font-heading font-bold text-center mb-10">Our Partners in the Field</h2>
        {missionPartners.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {missionPartners.map((partner) => (
              <Card key={partner.id} className="flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Globe className="h-6 w-6 text-primary" />
                    <CardTitle className="text-2xl font-heading">
                      {partner.name}
                    </CardTitle>
                  </div>
                  {partner.location && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {partner.location}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{partner.description}</p>
                  {partner.website && (
                    <div className="mt-4">
                      <Button variant="outline" size="sm" asChild>
                        <a href={partner.website} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit Website
                        </a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Globe className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium mb-2">No mission partners yet</h3>
            <p className="text-muted-foreground">
              Check back soon for updates on our global mission partnerships.
            </p>
          </div>
        )}
      </div>

      <div className="mt-16 text-center bg-background-primary p-8 rounded-lg shadow-inner border">
        <h3 className="text-2xl font-heading font-bold">How Can You Get Involved?</h3>
        <p className="mt-3 max-w-2xl mx-auto text-muted-foreground">
          "The harvest is plentiful, but the laborers are few…" — Luke 10:2
          <br/><br/>
          Your prayers, financial support, and willingness to go are all vital parts of our missions effort. Attend a missions interest meeting to learn more.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Button size="lg" asChild>
              <Link href="/donate">Give to Missions</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Ask About a Trip</Link>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
} 