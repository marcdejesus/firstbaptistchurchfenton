"use client";

import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';
import type { Event } from '@/types';

interface EventsCalendarProps {
  events: Event[];
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
}

export function EventsCalendar({ events, selectedDate, onDateSelect }: EventsCalendarProps) {
  // Get dates that have events for indicators
  const eventDates = events.map(event => new Date(event.date));
  
  // Create modifiers for dates with events
  const modifiers = {
    hasEvents: eventDates,
  };

  const modifiersStyles = {
    hasEvents: {
      position: 'relative' as const,
    }
  };

  return (
    <Card className="shadow-lg bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center font-lora text-xl text-card-foreground">
          <CalendarDays className="mr-2 h-5 w-5 text-accent" />
          Events Calendar
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          className="rounded-md border"
        />
        
        {/* Custom CSS for event indicators */}
        <style jsx>{`
          :global(.rdp-day_has-events::after) {
            content: '';
            position: absolute;
            bottom: 2px;
            left: 50%;
            transform: translateX(-50%);
            width: 4px;
            height: 4px;
            background-color: hsl(var(--accent));
            border-radius: 50%;
          }
        `}</style>
        
        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <div className="w-1 h-1 bg-accent rounded-full"></div>
              <span>Has Events</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-primary/20 rounded-sm"></div>
              <span>Today</span>
            </div>
            {selectedDate && (
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-accent rounded-sm"></div>
                <span>Selected</span>
              </div>
            )}
          </div>
        </div>

        {/* Show selected date info */}
        {selectedDate && (
          <div className="mt-4 p-3 bg-accent/10 rounded-lg">
            <p className="text-sm text-center">
              <span className="font-medium">Selected:</span>{' '}
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-xs text-center text-muted-foreground mt-1">
              {eventDates.some(date => date.toDateString() === selectedDate.toDateString())
                ? `${events.filter(e => new Date(e.date).toDateString() === selectedDate.toDateString()).length} event(s) on this date`
                : 'No events on this date'
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 