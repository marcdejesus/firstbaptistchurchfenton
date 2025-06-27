"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Globe, ExternalLink, Heart } from 'lucide-react';

// Mock data for missionaries/organizations
// TODO: Replace with data fetched from Firebase
const missionaries = [
  {
    id: 'the-gomez-family',
    name: 'The Gomez Family',
    location: 'Guatemala',
    region: 'Central America',
    description: 'Serving local communities through education and church planting initiatives. Their focus is on empowering the next generation of leaders.',
    imageUrl: '/images/missions/missionary-1.jpg', // Placeholder image path
    website: 'https://missionary-example.com/gomez',
  },
  {
    id: 'hope-for-asia',
    name: 'Hope for Asia Initiative',
    location: 'Thailand',
    region: 'Southeast Asia',
    description: 'Providing humanitarian aid, medical care, and sharing the Gospel in remote villages. They partner with local believers to establish sustainable projects.',
    imageUrl: '/images/missions/missionary-2.jpg', // Placeholder image path
    website: 'https://missionary-example.com/hope-for-asia',
  },
  {
    id: 'sahara-outreach',
    name: 'Sahara Outreach Project',
    location: 'Niger',
    region: 'West Africa',
    description: 'Focused on water well projects and agricultural training to combat famine and create opportunities for community development.',
    imageUrl: '/images/missions/missionary-3.jpg', // Placeholder image path
    website: 'https://missionary-example.com/sahara-outreach',
  }
];

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
  return (
    <div className="bg-gray-50/50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Missions & Outreach</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            We believe in taking the Gospel to our community, our nation, and the world. Discover the missionaries and organizations we partner with.
          </p>
        </div>

        {/* <WorldMap /> */}

        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-10">Our Partners in the Field</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {missionaries.map((missionary) => (
              <Card key={missionary.id} className="flex flex-col hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                   {/* In a real app, you'd use Next/Image here */}
                  <img src={missionary.imageUrl} alt={missionary.name} className="h-full w-full object-cover rounded-t-lg" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x300/E2E8F0/A0AEC0?text=Mission+Partner'; }} />
                </div>
                <CardHeader>
                  <CardTitle>{missionary.name}</CardTitle>
                  <p className="text-sm font-medium text-muted-foreground">{missionary.location}</p>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <p className="text-muted-foreground flex-grow">{missionary.description}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <Button asChild variant="secondary">
                        <Link href={missionary.website} target="_blank">
                            Learn More <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/donate">
                            Support <Heart className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center bg-white p-8 rounded-lg shadow-inner border">
          <h3 className="text-2xl font-bold">How Can You Get Involved?</h3>
          <p className="mt-3 max-w-2xl mx-auto text-muted-foreground">
            Your prayers, financial support, and willingness to go are all vital parts of our missions effort. 
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Button size="lg" asChild>
                <Link href="/donate">Give to Missions</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Join a Team</Link>
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
} 