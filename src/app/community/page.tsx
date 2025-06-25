"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, Pin, Clock, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


// Mock data for community groups
// TODO: Replace with data fetched from Firebase
const groups = [
  {
    id: 'mens-saturday-study',
    title: "Men's Saturday Study",
    leader: 'John Smith',
    category: 'men',
    schedule: 'Saturdays, 8:00 AM',
    location: 'Fellowship Hall',
    description: 'A time for men to gather, study the Word, and encourage one another in their walk with Christ.',
  },
  {
    id: 'womens-tuesday-connect',
    title: "Women's Tuesday Connect",
    leader: 'Jane Doe',
    category: 'women',
    schedule: 'Tuesdays, 7:00 PM',
    location: 'Room 201',
    description: 'Connect with other women through fellowship, prayer, and study. All ages are welcome.',
  },
  {
    id: 'young-adults-gathering',
    title: 'Young Adults Gathering',
    leader: 'Mike Johnson',
    category: 'young-adults',
    schedule: 'Thursdays, 7:30 PM',
    location: "Pastor Mike's Home",
    description: 'A group for those ages 18-30 to hang out, discuss relevant topics, and grow together.',
  },
  {
    id: 'marriage-enrichment',
    title: 'Marriage Enrichment Group',
    leader: 'The Millers',
    category: 'couples',
    schedule: 'Bi-weekly Fridays, 7:00 PM',
    location: 'Online via Zoom',
    description: 'Whether you are newly married or have been for decades, this group helps you invest in your relationship.',
  },
  {
    id: 'youth-group',
    title: 'Ignite Youth Group',
    leader: 'Sarah Williams',
    category: 'youth',
    schedule: 'Wednesdays, 6:30 PM',
    location: 'Youth Center',
    description: 'A dynamic and fun environment for students (grades 6-12) to grow in their faith and build friendships.',
  },
  {
    id: 'seniors-fellowship',
    title: "Seniors' Fellowship",
    leader: 'Bob Anderson',
    category: 'seniors',
    schedule: 'First Monday of the month, 10:00 AM',
    location: 'Chapel',
    description: 'A wonderful time of hymns, devotion, and fellowship for our senior members.',
  },
];

const categories = [
    { value: 'all', label: 'All Groups' },
    { value: 'men', label: 'Men' },
    { value: 'women', label: 'Women' },
    { value: 'couples', label: 'Couples' },
    { value: 'young-adults', label: 'Young Adults' },
    { value: 'youth', label: 'Youth' },
    { value: 'seniors', label: 'Seniors' },
]

export default function CommunityPage() {
  const [filter, setFilter] = useState('all');

  const filteredGroups = filter === 'all' 
    ? groups 
    : groups.filter(group => group.category === filter);

  return (
    <div className="bg-gray-50/50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Find Your Community</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Life is not meant to be lived alone. Find a group where you can build relationships, grow in your faith, and do life together.
          </p>
        </div>

        <div className="flex justify-center mb-10">
            <div className="w-full max-w-xs">
                <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filter by category..." />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map(cat => (
                            <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGroups.map((group) => (
              <Card key={group.id} className="flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>{group.title}</CardTitle>
                        <Badge variant="secondary">{group.category}</Badge>
                    </div>
                  <CardDescription>Led by {group.leader}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <p className="text-muted-foreground flex-grow mb-4">{group.description}</p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{group.schedule}</span>
                      </div>
                      <div className="flex items-center">
                          <Pin className="h-4 w-4 mr-2" />
                          <span>{group.location}</span>
                      </div>
                  </div>
                  <div className="mt-6">
                    <Button asChild className="w-full">
                        <Link href={`/contact?group=${group.id}`}>
                            Request to Join
                        </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
        
        {filteredGroups.length === 0 && (
            <div className="text-center py-16">
                <p className="text-muted-foreground">No groups found for this category. Check back soon!</p>
            </div>
        )}

        <div className="mt-16 text-center bg-white p-8 rounded-lg shadow-inner border">
          <h3 className="text-2xl font-bold">Can't Find a Group?</h3>
          <p className="mt-3 max-w-2xl mx-auto text-muted-foreground">
            If you don't see a group that fits your needs or are interested in starting a new one, we'd love to talk.
          </p>
          <div className="mt-6">
            <Button size="lg" asChild>
                <Link href="/contact">Contact a Pastor</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 