'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, RefreshCw, Home, ExternalLink, Clock } from 'lucide-react';

export default function EventsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Events page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-destructive/5 to-secondary/5 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Error Visual */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <Calendar className="h-10 w-10 text-destructive" />
          </div>
          <div className="w-24 h-1 bg-destructive mx-auto rounded-full"></div>
        </div>

        {/* Content */}
        <Card className="mb-8 shadow-xl">
          <CardContent className="p-8 text-center">
            <h1 className="text-3xl font-lora font-bold text-card-foreground mb-4">
              Events Unavailable
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              We're having trouble loading our church events. This could be due to a 
              connection issue with our calendar system.
            </p>
            
            {/* Development Error Details */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-6 p-4 bg-destructive/10 rounded-lg text-left">
                <h3 className="font-semibold text-destructive mb-2">Error Details (Development Only):</h3>
                <code className="text-sm text-destructive/80 break-all">
                  {error.message}
                </code>
              </div>
            )}
            
            {/* Recovery Actions */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={reset}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reload Events
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Go Home
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alternative Options */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-card-foreground text-center">
              Alternative Ways to Stay Connected
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a 
                href="https://calendar.google.com/calendar/embed?src=your-church-calendar@group.calendar.google.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 rounded-lg hover:bg-secondary/50 transition-colors group border border-border"
              >
                <ExternalLink className="h-5 w-5 text-accent mr-3 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="font-medium text-sm">Google Calendar</div>
                  <div className="text-xs text-muted-foreground">View events directly</div>
                </div>
              </a>
              <Link 
                href="/contact" 
                className="flex items-center p-4 rounded-lg hover:bg-secondary/50 transition-colors group border border-border"
              >
                <Clock className="h-5 w-5 text-accent mr-3 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="font-medium text-sm">Service Times</div>
                  <div className="text-xs text-muted-foreground">Regular worship schedule</div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Service Times Fallback */}
        <Card className="mt-6 shadow-lg">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold text-lg mb-4">Regular Service Times</h3>
            <div className="space-y-2 text-muted-foreground">
              <p><strong>Sunday Morning Worship:</strong> 10:30 AM</p>
              <p><strong>Sunday Evening Service:</strong> 6:00 PM</p>
              <p><strong>Wednesday Bible Study:</strong> 7:00 PM</p>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              For the most current information, please{' '}
              <Link href="/contact" className="text-accent hover:underline">contact us</Link>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 