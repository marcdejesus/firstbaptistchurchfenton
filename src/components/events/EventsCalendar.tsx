"use client";

import React from 'react';
import { DayPicker } from 'react-day-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';
import type { Event } from '@/types';
import 'react-day-picker/dist/style.css';

interface EventsCalendarProps {
  events: Event[];
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
}

export function EventsCalendar({ events, selectedDate, onDateSelect }: EventsCalendarProps) {
  // Get dates that have events for indicators
  const eventDates = events.map(event => new Date(event.date));
  
  // Get today's date for highlighting
  const today = new Date();

  // Custom day content to show event indicators
  const renderDay = (date: Date) => {
    const hasEvent = eventDates.some(eventDate => 
      eventDate.toDateString() === date.toDateString()
    );
    
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <span>{date.getDate()}</span>
        {hasEvent && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-accent rounded-full"></div>
        )}
      </div>
    );
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
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          today={today}
          showOutsideDays={true}
          className="rdp-custom"
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center text-card-foreground font-medium",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-card-foreground hover:bg-accent/20 rounded-md",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem] text-center",
            row: "flex w-full mt-2",
            cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent/20 [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
            day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-accent/20 rounded-md text-card-foreground relative",
            day_selected: "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            day_today: "bg-primary/20 text-primary-foreground font-semibold",
            day_outside: "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
            day_disabled: "text-muted-foreground opacity-50",
            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
          }}
          components={{
            DayContent: ({ date }) => renderDay(date)
          }}
        />
        
        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
              <span>Has Events</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-primary/20 rounded-sm"></div>
              <span>Today</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 