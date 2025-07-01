"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { HandHelping, Heart, Tv, Wrench, Users, Music, BookOpen, PenSquare, Mic, Handshake, Utensils } from 'lucide-react';
import Link from 'next/link';

const coreTeams = [
  {
    icon: Heart,
    title: 'Outreach Team',
    description: 'Leads local community outreach efforts including serve days, widow care, the cookie ministry, and seasonal events like Trunk-or-Treat, Easter Egg Hunt, and our 4th of July BBQ.',
  },
  {
    icon: Users,
    title: 'Missions Team',
    description: 'Supports global missions efforts and partnerships in Pakistan, India, and Thailand. Coordinates prayer, communication, care, and future missions trips.',
  },
  {
    icon: Wrench,
    title: 'Property, Grounds & Security Team',
    description: 'Keeps our church building and grounds clean, safe, and welcoming. Includes lawn care, minor repairs, building projects, and Sunday security.',
  },
    {
    icon: Handshake,
    title: 'Care Team',
    description: 'Offers care and encouragement to widows, shut-ins, grieving families, and those facing hardship. Helps with funeral meals, hospital visits, and follow-up care.',
  },
  {
    icon: Music,
    title: 'Worship Team',
    description: 'Leads our congregation in Christ-centered worship through music and song. Includes vocalists, musicians, and support roles.',
  },
  {
    icon: BookOpen,
    title: 'Discipleship Team',
    description: 'Oversees small groups, Bible studies, and discipleship pathways. Mentors new believers and helps others grow spiritually.',
  },
    {
    icon: PenSquare,
    title: 'Administrative Team',
    description: 'Supports behind-the-scenes work such as scheduling, communications, organizing materials, data entry, and ministry follow-up.',
  },
];

const additionalOpportunities = [
    { icon: Handshake, title: 'Greeters & Welcome Team', description: 'Create a friendly, inviting atmosphere at the doors and in the lobby.' },
    { icon: Users, title: 'Nursery & Kids Ministry', description: 'Care for babies and toddlers or teach children with crafts, songs, and Bible stories.' },
    { icon: Users, title: 'Youth Ministry', description: 'Mentor teens through weekly gatherings, events, and trips.' },
    { icon: Tv, title: 'Tech & Media Team', description: 'Run slides, audio, livestream, and video production. Training provided.' },
    { icon: Utensils, title: 'Hospitality & Events', description: 'Help with church meals, coffee, decor, and hosting for church-wide events.' },
]

export default function VolunteerPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <HandHelping className="mx-auto h-12 w-12 text-accent mb-4" />
        <h1 className="text-4xl font-bold font-heading">Volunteer at FBC Fenton</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Serving is one of the best ways to grow, connect, and live out your faith. There's a place for everyone to use their gifts—whether you're behind the scenes, leading a group, or welcoming first-time guests.
        </p>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-center mb-8">Our 7 Core Ministry Teams</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreTeams.map((team) => (
                <Card key={team.title} className="flex flex-col hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <div className="flex items-center space-x-4">
                            <team.icon className="h-8 w-8 text-accent"/>
                            <CardTitle>{team.title}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-muted-foreground">{team.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>

       <div className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-8">Additional Volunteer Opportunities</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {additionalOpportunities.map((opp) => (
                 <Card key={opp.title} className="p-4">
                    <div className="flex items-center space-x-4">
                        <opp.icon className="h-6 w-6 text-accent"/>
                        <div>
                            <h3 className="font-semibold">{opp.title}</h3>
                            <p className="text-sm text-muted-foreground">{opp.description}</p>
                        </div>
                    </div>
                 </Card>
            ))}
        </div>
      </div>

      <div className="mt-20 text-center bg-gray-50/70 p-8 rounded-lg border-t">
        <h2 className="text-3xl font-bold font-heading">Ready to Serve?</h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            There's no perfect person—only willing hearts. We'll train you, support you, and walk with you as you serve. Here's how to get started:
        </p>
        <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
            <Button size="lg" asChild>
                <Link href="/contact">Fill out an Interest Form</Link>
            </Button>
            <span className="text-muted-foreground font-semibold">OR</span>
            <Button size="lg" variant="outline" asChild>
                <a href="mailto:serve@fbfenton.org">Email serve@fbfenton.org</a>
            </Button>
            <span className="text-muted-foreground font-semibold">OR</span>
             <p className="text-muted-foreground basis-full">Visit the Welcome Center on Sunday to talk with someone in person.</p>
        </div>
      </div>
    </div>
  );
} 