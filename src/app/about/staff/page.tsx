"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, Phone } from 'lucide-react';
import Link from 'next/link';

// Mock data for staff members
// TODO: Replace with data fetched from Firebase
const staffMembers = [
  {
    id: 'pastor-john-doe',
    name: 'John Doe',
    title: 'Lead Pastor',
    bio: 'Pastor John has a passion for expository preaching and seeing people grow in their love for Christ. He has been leading our church since 2015.',
    imageUrl: '/images/staff/pastor-john.jpg',
    email: 'john.doe@fbc.com',
    phone: '555-123-4567',
  },
  {
    id: 'pastor-jane-smith',
    name: 'Jane Smith',
    title: 'Associate Pastor of Community',
    bio: 'Pastor Jane oversees our small groups and community outreach efforts. She loves connecting people and helping them find their place in the church.',
    imageUrl: '/images/staff/pastor-jane.jpg',
    email: 'jane.smith@fbc.com',
    phone: '555-123-4568',
  },
  {
    id: 'mike-johnson',
    name: 'Mike Johnson',
    title: 'Worship Director',
    bio: 'Mike leads our congregation in worship each week. He is a gifted musician and has a heart for creating an atmosphere of praise.',
    imageUrl: '/images/staff/worship-mike.jpg',
    email: 'mike.johnson@fbc.com',
    phone: '555-123-4569',
  },
  {
    id: 'emily-white',
    name: 'Emily White',
    title: "Children's Ministry Director",
    bio: "Emily has a love for teaching children about Jesus in a fun and engaging way. She leads our dedicated team of volunteers.",
    imageUrl: '/images/staff/kids-emily.jpg',
    email: 'emily.white@fbc.com',
    phone: '555-123-4570',
  },
];

export default function StaffPage() {
  return (
    <div className="bg-gray-50/50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Our Leadership</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Meet the team of pastors and directors who are dedicated to serving our church and community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {staffMembers.map((staff) => (
            <Card key={staff.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-1/3 h-48 sm:h-auto bg-gray-200">
                  <img src={staff.imageUrl} alt={staff.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/200x300/E2E8F0/A0AEC0?text=Staff'; }} />
                </div>
                <div className="sm:w-2/3 p-6 flex flex-col">
                  <div>
                    <CardTitle>{staff.name}</CardTitle>
                    <CardDescription className="font-medium text-primary">{staff.title}</CardDescription>
                    <p className="mt-4 text-muted-foreground text-sm flex-grow">{staff.bio}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <Link href={`mailto:${staff.email}`} className="flex items-center hover:text-primary">
                           <Mail className="h-4 w-4 mr-1.5" /> Email
                        </Link>
                         <Link href={`tel:${staff.phone}`} className="flex items-center hover:text-primary">
                           <Phone className="h-4 w-4 mr-1.5" /> Call
                        </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 