"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ExternalLink, Smartphone, Monitor, Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SubscribeToCalendarProps {
  className?: string;
}

export function SubscribeToCalendar({ className }: SubscribeToCalendarProps) {
  // Church calendar subscription URL (you'll need to replace this with your actual calendar ID)
  const calendarId = process.env.NEXT_PUBLIC_CHURCH_CALENDAR_ID || 'your-church-calendar@gmail.com';
  const googleCalendarUrl = `https://calendar.google.com/calendar/u/0?cid=${encodeURIComponent(calendarId)}`;
  const icsUrl = `https://calendar.google.com/calendar/ical/${encodeURIComponent(calendarId)}/public/basic.ics`;
  
  // Handle copying calendar URL to clipboard
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(icsUrl);
      toast({
        title: "Calendar URL Copied!",
        description: "The calendar subscription URL has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy URL to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle subscribing to Google Calendar
  const handleGoogleSubscribe = () => {
    window.open(googleCalendarUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className={`bg-card border shadow-sm ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-accent" />
          <CardTitle className="text-lg font-semibold">Subscribe to Church Calendar</CardTitle>
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          Never miss an event! Add our church calendar to your personal calendar app.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Google Calendar Subscription */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Monitor className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Google Calendar</span>
          </div>
          
          <Button 
            onClick={handleGoogleSubscribe}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            size="sm"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Subscribe in Google Calendar
          </Button>
          
          <p className="text-xs text-muted-foreground">
            Opens Google Calendar where you can add our church calendar to your account.
          </p>
        </div>

        {/* Calendar URL for Other Apps */}
        <div className="border-t pt-4 space-y-3">
          <div className="flex items-center space-x-2">
            <Smartphone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Other Calendar Apps</span>
          </div>
          
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              For Apple Calendar, Outlook, or other apps, use this subscription URL:
            </p>
            
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={icsUrl}
                readOnly
                className="flex-1 px-3 py-2 text-xs bg-muted border rounded-md font-mono"
              />
              <Button
                onClick={handleCopyUrl}
                size="sm"
                variant="outline"
                className="shrink-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-muted/50 p-3 rounded-md space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">How to Subscribe:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• <strong>Google Calendar:</strong> Click the button above</li>
            <li>• <strong>Apple Calendar:</strong> Copy URL and paste in Calendar app</li>
            <li>• <strong>Outlook:</strong> Add calendar by URL in settings</li>
            <li>• <strong>Phone:</strong> Most calendar apps support URL subscriptions</li>
          </ul>
        </div>

        {/* Benefits */}
        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground">
            ✨ Events automatically sync to your calendar
          </p>
          <p className="text-xs text-muted-foreground">
            📱 Get notifications on all your devices
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 