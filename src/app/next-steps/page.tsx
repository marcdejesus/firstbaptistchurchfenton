"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Church, Users, HandHelping, UserPlus } from 'lucide-react';
import Link from 'next/link';

const involvementPath = [
  {
    icon: Church,
    title: 'Step 1: Worship With Us',
    description: 'Start by joining us on Sunday mornings at 10:30 AM. Each service is designed to help you encounter God through biblical teaching, gospel-centered worship, and a welcoming community.',
  },
  {
    icon: Users,
    title: 'Step 2: Find Your People',
    description: 'We want you to belong, not just attend. Join one of our small groups, where you can build meaningful relationships, study God’s Word together, and grow in your faith.',
  },
  {
    icon: HandHelping,
    title: 'Step 3: Serve on a Ministry Team',
    description: 'Everyone has a role to play. Use your gifts to make a difference by serving in a ministry—from hospitality to kids, worship to tech, or community outreach.',
  },
  {
    icon: UserPlus,
    title: 'Step 4: Make Disciples',
    description: 'As you grow, we want to equip you to train and disciple others—whether that’s mentoring someone one-on-one, leading a group, or helping someone take their next step too.',
  },
];

const programDetails = [
    {
        title: "Sunday Worship",
        details: "When: Sundays at 10:30 AM | Where: Main Worship Center",
        contact: "info@fbfenton.org",
        link: "/visit"
    },
    {
        title: "Small Groups",
        details: "When: Various days/times throughout the week | Where: On campus and in homes",
        contact: "smallgroups@fbfenton.org",
        link: "/community"
    },
    {
        title: "Ministry Teams",
        details: "Opportunities: Greeters, Kids Ministry, Youth, Tech, Worship, Outreach, Hospitality",
        contact: "serve@fbfenton.org",
        link: "/volunteer"
    },
    {
        title: "Membership & Discipleship",
        details: "Membership Class offered quarterly. Discipleship training available year-round.",
        contact: "discipleship@fbfenton.org",
        link: "/contact"
    }
];

export default function NextStepsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold font-heading">Take Your Next Step</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          We believe every follower of Jesus is on a journey—and no one should walk that journey alone. Whether you’re new to faith or have followed Jesus for years, we want to help you take your next step.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
        {involvementPath.map((step, index) => (
          <Card key={index} className="w-full text-center hover:shadow-xl transition-shadow flex flex-col">
            <CardHeader>
              <div className="mx-auto bg-accent/10 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                <step.icon className="h-8 w-8 text-accent" />
              </div>
              <CardTitle>{step.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{step.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

       <div className="text-center mb-12">
        <h2 className="text-3xl font-bold font-heading">Program Details & Signups</h2>
        <p className="mt-3 text-md text-muted-foreground max-w-2xl mx-auto">
          Ready to get started? Here’s how you can get connected with each of our core programs.
        </p>
      </div>
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
        {programDetails.map(program => (
            <Card key={program.title}>
                <CardHeader>
                    <CardTitle>{program.title}</CardTitle>
                    <CardDescription>{program.details}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href={program.link}>
                            Learn More <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                     <p className="text-sm text-muted-foreground mt-4">
                        Or contact: <a href={`mailto:${program.contact}`} className="underline hover:text-primary">{program.contact}</a>
                    </p>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
} 