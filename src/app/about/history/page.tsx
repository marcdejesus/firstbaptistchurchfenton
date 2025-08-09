"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PageLayout } from '@/components/layout/PageLayout';
import { historyMilestones, historyIntro, historyToday } from './content';

export default function HistoryPage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Our History" },
  ];

  return (
    <main>
      <PageLayout
        title={historyIntro.title}
        subtitle={historyIntro.subtitle}
        variant="wide"
        breadcrumbs={breadcrumbs}
      >
        <div className="mb-12 text-center">
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-body leading-relaxed">{historyIntro.paragraph}</p>
        </div>
        <div className="space-y-6">
          <h2 className="text-4xl font-heading font-bold text-center">Key Moments in Our Story</h2>
        </div>
        <div className="relative mt-8">
          {/* The timeline vertical line */}
          <div className="absolute left-1/2 h-full w-0.5 bg-primary/20 transform -translate-x-1/2" />

          {historyMilestones.map((milestone, index) => (
            <div key={index} className="relative mb-12">
              <div className={`flex items-center ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                <div className="w-1/2 px-8">
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                      <CardHeader>
                        <CardTitle className="text-3xl font-heading">{milestone.title}</CardTitle>
                        <CardDescription className="text-md pt-1">{milestone.year}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{milestone.description}</p>
                      </CardContent>
                    </Card>
                </div>
                <div className="w-1/2" />
              </div>
              {/* Timeline circle */}
              <div className="absolute left-1/2 top-1/2 w-5 h-5 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 border-4 border-background" />
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-3xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-3xl font-heading">Today</CardTitle>
              <CardDescription>Our ongoing mission and focus</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{historyToday.paragraph}</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                {historyToday.bullets.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    </main>
  );
} 