"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageLayout } from '@/components/layout/PageLayout';
import { historyMilestones, historyIntro, historyToday } from './content';

export default function HistoryPage() {
  return (
    <main>
      <PageLayout
        title={historyIntro.title}
        subtitle={historyIntro.subtitle}
        variant="wide"
      >
        <div className="mb-12 text-center">
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-body leading-relaxed">{historyIntro.paragraph}</p>
        </div>

        <div className="space-y-6 mb-12">
          <h2 className="text-4xl font-heading font-bold text-center">Our Journey Through Time</h2>
        </div>

        {/* Simplified Timeline Layout - Stacked cards for all screen sizes */}
        <div className="space-y-8 max-w-4xl mx-auto">
          {historyMilestones.map((milestone, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-lg font-semibold text-primary">{milestone.year}</span>
                </div>
                <CardTitle className="text-2xl md:text-3xl font-heading">{milestone.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-base md:text-lg">{milestone.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Today Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-4 h-4 bg-primary rounded-full"></div>
                <span className="text-lg font-semibold text-primary">Present Day</span>
              </div>
              <CardTitle className="text-3xl font-heading">Today & Beyond</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground leading-relaxed text-center text-lg">{historyToday.paragraph}</p>
              <div className="grid md:grid-cols-2 gap-4">
                {historyToday.bullets.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    </main>
  );
} 