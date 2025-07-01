"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calendar, Info } from 'lucide-react';

const eventCategories = [
  "Worship & Services",
  "Youth & Students",
  "Men's Ministry",
  "Women's Ministry",
  "Family Events",
  "Community Outreach",
  "Missions & Global Impact",
  "Serve Days"
];

const recurringEvents = [
  {
    title: "Easter Sunday & Community Egg Hunt",
    description: "A powerful celebration of the resurrection followed by a massive egg hunt for kids and families."
  },
  {
    title: "4th of July BBQ & Family Day",
    description: "Held on the holiday weekend with water slides, slip-n-slides, food, and fun for all ages."
  },
  {
    title: "Trunk-or-Treat Fall Festival",
    description: "A family-friendly outreach with decorated cars, candy, games, and costumes."
  },
  {
    title: "Thanksgiving Outreach",
    description: "Meal assistance and family dinners for those in need, both in our church and in the community."
  },
  {
    title: "Global Missions Training & Trips",
    description: "Ongoing partnerships with national pastors and churches in Pakistan, India, and Thailand, with training, support, and occasional mission trips."
  },
  {
    title: "Youth Events & Trips",
    description: "Monthly student activities, mission trips, Cedar Point trips, and summer youth camps."
  },
  {
    title: "Serve Days",
    description: "Hands-on service projects helping the elderly, widows, and local ministries like Center of Hope."
  },
  {
    title: "Cookie Ministry",
    description: "Ongoing encouragement outreach through baked goods and personal delivery."
  },
  {
    title: "Family Nights & Seasonal Activities",
    description: "Events designed to help families connect, play, and grow together."
  }
];

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-heading font-bold">Church Events</h1>
        <p className="mt-4 text-xl max-w-3xl mx-auto text-muted-foreground">
          Join us for fellowship, growth, and service. Here are some of our major recurring events.
        </p>
      </div>

      <Alert className="mb-12 bg-blue-50 border-blue-200">
        <Info className="h-5 w-5 text-blue-700" />
        <AlertTitle className="text-blue-800 font-semibold">Calendar Integration Coming Soon!</AlertTitle>
        <AlertDescription className="text-blue-700">
          We are working on integrating our full events calendar. For now, please see our major recurring events below.
          For specific dates and times, please check our weekly bulletin or <Link href="/contact" className="underline">contact us</Link>.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Major Recurring Events</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-4">
              {recurringEvents.map(event => (
                <li key={event.title}>
                  <h3 className="font-semibold text-lg">{event.title}</h3>
                  <p className="text-muted-foreground">{event.description}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Event Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              We organize our events into the following categories to help you find what you're looking for.
            </p>
            <div className="flex flex-wrap gap-2">
              {eventCategories.map(category => (
                <Button key={category} variant="outline" className="cursor-default">
                  {category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

       <div className="mt-16 text-center">
          <Card className="bg-gray-50/70 p-8 inline-block">
              <CardTitle className="text-2xl font-bold mb-2">Looking for the Full Calendar?</CardTitle>
              <CardContent className="p-0">
                  <p className="max-w-xl mx-auto text-muted-foreground mb-4">
                      Our full, up-to-date calendar will be available here soon. In the meantime, the best way to stay informed is by joining us on Sundays or contacting the church office.
                  </p>
                  <Button asChild>
                      <Link href="/contact">Contact Church Office</Link>
                  </Button>
              </CardContent>
          </Card>
      </div>
    </div>
  );
}
