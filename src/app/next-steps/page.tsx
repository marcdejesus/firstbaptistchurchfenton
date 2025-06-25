"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, UserCheck, Users, HandHelping, Handshake } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    icon: UserCheck,
    title: 'Attend a Service',
    description: 'The best way to get to know us is to join us for a Sunday service. Experience our worship, hear a message from the Bible, and see what our community is all about.',
    cta: 'Plan Your Visit',
    link: '/visit',
  },
  {
    icon: Users,
    title: 'Join a Small Group',
    description: 'Life is better together. Small Groups are where you can build relationships, grow in your faith, and find a supportive community to walk through life with.',
    cta: 'Find a Group',
    link: '/community', 
  },
  {
    icon: HandHelping,
    title: 'Serve on a Team',
    description: 'Use your unique gifts to make a difference in the lives of others. Serving is one of the most rewarding ways to get involved and be a part of what God is doing here.',
    cta: 'See Opportunities',
    link: '/volunteer',
  },
  {
    icon: Handshake,
    title: 'Become a Member',
    description: 'Ready to make First Baptist your home? Membership is about committing to our church family and partnering with us in our mission to make disciples.',
    cta: 'Learn About Membership',
    link: '/contact',
  },
];

export default function NextStepsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Your Next Steps</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Whether you're new to faith or have been a Christian for years, everyone has a next step. Here's a simple path to help you grow and get connected.
        </p>
      </div>

      <div className="relative">
        {/* Dotted line for desktop */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-transparent">
            <div className="h-full w-full border-t-2 border-dashed border-gray-300"></div>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center">
              <Card className="w-full text-center hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="mx-auto bg-accent/10 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                    <step.icon className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle>{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-6">{step.description}</CardDescription>
                  <Link href={step.link}>
                    <Button>
                      {step.cta} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 