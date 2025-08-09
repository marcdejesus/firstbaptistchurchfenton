"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calendar, Info } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';

export default function EventsPage() {
  return (
    <PageLayout
        title="Church Events"
        subtitle="Join us for fellowship, growth, and service."
    >
        <Alert>
            <Info className="h-5 w-5" />
            <AlertTitle className="font-heading">Calendar Integration Coming Soon!</AlertTitle>
            <AlertDescription>
              We are working on integrating our full events calendar. For specific dates and times, please check our weekly bulletin or <Link href="/contact" className="underline font-semibold">contact us</Link>.
            </AlertDescription>
        </Alert>
        
        <div className="text-center py-24 bg-background-secondary rounded-lg mt-8">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-3xl font-heading font-bold mb-4">Check Back Soon</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Our full event calendar will be available here shortly. We look forward to seeing you!
            </p>
            <div className="mt-6">
                <Button asChild>
                  <Link href="/contact">Contact Church Office</Link>
              </Button>
            </div>
        </div>
    </PageLayout>
  );
}
