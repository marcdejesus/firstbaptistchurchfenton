"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Landmark } from 'lucide-react';

// Mock data for church history
// TODO: Replace with your church's actual historical milestones
const historyMilestones = [
  {
    year: '1985',
    title: 'A Humble Beginning',
    description: 'First Baptist Church was founded by a small group of families in a local school gymnasium with a shared vision to create a Bible-centered community.',
  },
  {
    year: '1992',
    title: 'Our First Building',
    description: 'After years of prayer and fundraising, the congregation celebrated the opening of its first dedicated sanctuary on Main Street.',
  },
  {
    year: '2005',
    title: 'Missions Expansion',
    description: 'The church launched its first international missions partnership, sending a team to support a new church plant in Guatemala.',
  },
  {
    year: '2015',
    title: 'Leadership Transition',
    description: 'Our founding pastor retired, and the church prayerfully welcomed our current lead pastor to guide us into the next chapter.',
  },
  {
    year: 'Present',
    title: 'Continuing the Mission',
    description: 'Today, we continue to grow, serving our local community and striving to make a global impact for the cause of Christ. The best is yet to come!',
  },
];

export default function HistoryPage() {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Our History</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              A journey of faith, community, and God's faithfulness through the years.
            </p>
          </div>

          <div className="relative">
            {/* The timeline vertical line */}
            <div className="absolute left-1/2 h-full w-0.5 bg-gray-200 transform -translate-x-1/2"></div>

            {historyMilestones.map((milestone, index) => (
              <div key={index} className="relative mb-8">
                <div className="flex items-center">
                  <div className="w-1/2 pr-8 text-right">
                    {index % 2 === 0 && (
                      <Card className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <CardTitle>{milestone.title}</CardTitle>
                          <CardDescription>{milestone.year}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p>{milestone.description}</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                  <div className="w-1/2 pl-8">
                    {index % 2 !== 0 && (
                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader>
                            <CardTitle>{milestone.title}</CardTitle>
                            <CardDescription>{milestone.year}</CardDescription>
                            </CardHeader>
                            <CardContent>
                            <p>{milestone.description}</p>
                            </CardContent>
                        </Card>
                    )}
                  </div>
                </div>
                {/* Timeline circle */}
                <div className="absolute left-1/2 top-1/2 w-4 h-4 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 border-4 border-white"></div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
} 