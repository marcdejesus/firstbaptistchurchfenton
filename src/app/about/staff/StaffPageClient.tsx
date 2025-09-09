"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useStaff } from '@/hooks/useStaff';
import { formatDescription } from '@/lib/text-formatting';
import Image from 'next/image';

// Helper function to generate meeting link based on staff member
const getMeetingLink = (name: string, email: string): string | null => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('james') || lowerName.includes('pastor')) {
    return 'https://calendly.com/fbc-fenton-james/30min';
  }
  return null;
};

const organization = {
  title: "How We're Organized",
  description: "We're led by a team of elders and supported by seven core ministry teams:",
  teams: [
    "Outreach Team – Local events, serve days, widow care",
    "Missions Team – International partnerships and training",
    "Worship Team – Music, tech, production",
    "Discipleship Team – Groups, classes, mentoring",
    "Care Team – Hospital visits, funeral meals, encouragement",
    "Property & Security Team – Maintenance and safety",
    "Administrative Team – Office support, scheduling, communications"
  ],
  closing: "Everyone has a role to play. If you're ready to serve, there's a place for you."
};

const vision = {
  title: "Where We're Headed",
  description: "We're focused on:",
  points: [
    "Helping broken people find healing in Jesus",
    "Strengthening families",
    "Raising up leaders",
    "Revitalizing churches",
    "Equipping pastors here and around the world"
  ],
  closing: "We're not about performance or polish. We're about the gospel, real community, and being faithful to the mission of Jesus."
};

export default function StaffPageClient() {
  const { staffMembers, loading, error } = useStaff();

  if (loading) {
    return (
      <main className="bg-gray-50">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-heading tracking-tight lg:text-5xl">Meet Our Team</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Meet the team of pastors and leaders who are dedicated to serving our church and community.
            </p>
          </div>
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading staff information...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-gray-50">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-heading tracking-tight lg:text-5xl">Meet Our Team</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Meet the team of pastors and leaders who are dedicated to serving our church and community.
            </p>
          </div>
          <div className="text-center py-20">
            <p className="text-destructive text-lg">Error loading staff information: {error}</p>
            <p className="mt-2 text-muted-foreground">Please try refreshing the page.</p>
          </div>
        </div>
      </main>
    );
  }

  if (!staffMembers || staffMembers.length === 0) {
    return (
      <main className="bg-gray-50">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-heading tracking-tight lg:text-5xl">Meet Our Team</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Meet the team of pastors and leaders who are dedicated to serving our church and community.
            </p>
          </div>
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No staff information available at the moment.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-heading tracking-tight lg:text-5xl">Meet Our Team</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Meet the team of pastors and leaders who are dedicated to serving our church and community.
          </p>
        </div>

        <div className="space-y-16">
          {staffMembers.map((staff) => {
            const formattedBio = staff.description ? formatDescription(staff.description) : [];
            const meetingLink = getMeetingLink(staff.name, staff.email || '');

            return (
              <Card key={staff.id} className="overflow-hidden shadow-lg border-2 border-gray-100">
                <div className="p-6 md:p-8 flex flex-col">
                  {/* Profile Picture and Header */}
                  <div className="flex items-start space-x-6 mb-6">
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                        <Image
                          src={staff.photoUrl || '/placeholder.jpg'}
                          alt={staff.name}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                          priority
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardHeader className="p-0">
                        <CardTitle className="text-3xl font-heading font-bold">{staff.name}</CardTitle>
                        <CardDescription className="font-semibold text-primary text-lg">{staff.position}</CardDescription>
                      </CardHeader>
                    </div>
                  </div>
                  
                  <CardContent className="p-0 space-y-4 text-muted-foreground">
                    {formattedBio}
                  </CardContent>
                  <div className="mt-auto pt-6 flex items-center space-x-4">
                    {staff.email && (
                      <Button asChild variant="outline">
                        <Link href={`mailto:${staff.email}`} className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" /> Email
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-24 grid md:grid-cols-2 gap-16">
          <Card className="p-8">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-3xl font-heading font-bold">{organization.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-muted-foreground mb-4">{organization.description}</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                {organization.teams.map(item => <li key={item}>{item}</li>)}
              </ul>
              <p className="text-muted-foreground mt-4 font-semibold">{organization.closing}</p>
            </CardContent>
          </Card>
           <Card className="p-8">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-3xl font-heading font-bold">{vision.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-muted-foreground mb-4">{vision.description}</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                {vision.points.map(item => <li key={item}>{item}</li>)}
              </ul>
              <p className="text-muted-foreground mt-4 font-semibold">{vision.closing}</p>
            </CardContent>
          </Card>
        </div>

      </div>
    </main>
  );
}
