"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Heart, Globe, Users, ArrowRight } from 'lucide-react';

const localOutreach = [
  {
    title: "Center of Hope",
    description: "We partner with this local food pantry to provide groceries, meals, and hope to families in need right here in Fenton."
  },
  {
    title: "Biblical Counseling Ministry",
    description: "We offer gospel-centered counseling to individuals and families, helping people navigate life with truth and grace."
  },
  {
    title: "Jail Ministry",
    description: "Our team ministers to men and women in the local jail, offering prayer, Bible study, and support for a fresh start."
  },
  {
    title: "Serve Days & Widow Care",
    description: "We regularly mobilize teams to serve the elderly, single parents, and widows in our church and city with practical help and encouragement."
  },
  {
    title: "Community Events & Outreach",
    description: "From our Easter Egg Hunt and 4th of July BBQ to Trunk-or-Treat and Thanksgiving outreach, we're actively seeking to build bridges to the gospel through love and presence."
  }
];

export default function CommunityPage() {
  return (
    <div className="bg-gray-50/50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Community & Missions</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            At First Baptist Church of Fenton, we believe the gospel calls us to love our neighbors—across the street and around the world. Our mission is not just about what happens inside the church walls but how we serve outside them.
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Local Outreach</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {localOutreach.map((item) => (
              <Card key={item.title} className="flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                     <Heart className="h-6 w-6 text-primary" />
                     <CardTitle>{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center bg-white p-8 rounded-lg shadow-inner border">
          <h3 className="text-2xl font-bold">Ready to Make a Difference?</h3>
          <p className="mt-3 max-w-2xl mx-auto text-muted-foreground">
            Whether you're called to go, give, or serve, there's a place for you. Join a local serve team, support a missionary, or learn how you can be part of our outreach efforts.
          </p>
          <div className="mt-6 flex justify-center items-center gap-4">
            <Button size="lg" asChild>
                <Link href="/volunteer">Get Involved Locally</Link>
            </Button>
             <Button size="lg" variant="outline" asChild>
                <Link href="/missions">Explore Global Missions <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 