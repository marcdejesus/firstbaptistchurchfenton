"use client";

import React, { useState, useEffect } from 'react';
import { EventCard } from '@/components/events/EventCard';
import { EventsCalendar } from '@/components/events/EventsCalendar';
import { CreateEventForm } from '@/components/events/CreateEventForm';
import type { Event as EventType } from '@/types';
import { Button } from '@/components/ui/button';
import { PlusCircle, X } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const initialEvents: EventType[] = [
  {
    id: '1',
    title: 'Annual Church Picnic',
    date: '2025-05-15',
    time: '12:00 PM',
    location: 'Fenton Community Park',
    description: 'Join us for our annual church picnic! Food, games, and fellowship for all ages. Please bring a dish to share if you can.',
    summary: 'A fun-filled annual church picnic at Fenton Community Park on May 15th, 12 PM, featuring food, games, and fellowship. Attendees are encouraged to bring a dish.',
    rsvps: 45,
    isUserRsvped: false,
  },
  {
    id: '2',
    title: 'Youth Group Lock-In',
    date: '2025-06-05',
    time: '8:00 PM - 7:00 AM',
    location: 'Church Youth Hall',
    description: 'An exciting overnight event for our youth group (ages 12-18). Games, movies, devotional time, and lots of fun. Parental consent form required.',
    summary: 'An overnight lock-in for youth (12-18) at the Church Youth Hall from June 5th, 8 PM to June 6th, 7 AM, with games, movies, and devotionals. Consent form needed.',
    rsvps: 22,
    isUserRsvped: false,
  },
  {
    id: '3',
    title: 'Worship Night',
    date: '2025-05-30',
    time: '7:00 PM',
    location: 'Church Sanctuary',
    description: 'An evening dedicated to worship through music and prayer. Come lift your voices and hearts together.',
    rsvps: 60,
    summary: 'Join us for a Worship Night on May 30th at 7 PM in the Church Sanctuary for an evening of music and prayer.',
    isUserRsvped: false,
  },
  {
    id: '4',
    title: 'Mother\'s Day Brunch',
    date: '2025-05-11',
    time: '10:00 AM',
    location: 'Fellowship Hall',
    description: 'Celebrate all the wonderful mothers in our congregation with a special brunch after morning service. Honoring the women who shape our lives.',
    summary: 'A special Mother\'s Day brunch on May 11th at 10 AM in the Fellowship Hall to honor and celebrate mothers.',
    rsvps: 75,
    isUserRsvped: false,
  },
  {
    id: '5',
    title: 'Men\'s Prayer Breakfast',
    date: '2025-05-03',
    time: '7:00 AM',
    location: 'Church Kitchen',
    description: 'Monthly gathering for men to share breakfast, fellowship, and prayer. A time to strengthen bonds and support one another in faith.',
    summary: 'Monthly men\'s prayer breakfast on May 3rd at 7 AM in the Church Kitchen for fellowship and prayer.',
    rsvps: 18,
    isUserRsvped: false,
  },
  {
    id: '6',
    title: 'Vacation Bible School',
    date: '2025-06-16',
    time: '9:00 AM - 12:00 PM',
    location: 'Church Education Wing',
    description: 'A week-long adventure for kids ages 4-12! Bible stories, crafts, games, and snacks. Registration required.',
    summary: 'Vacation Bible School for kids 4-12 from June 16th, 9 AM to 12 PM in the Church Education Wing. Registration required.',
    rsvps: 35,
    isUserRsvped: false,
  },
  {
    id: '7',
    title: 'Senior Saints Luncheon',
    date: '2025-05-22',
    time: '12:30 PM',
    location: 'Fellowship Hall',
    description: 'Monthly luncheon for our senior members (55+). Great food, fellowship, and special guest speakers.',
    summary: 'Monthly Senior Saints luncheon on May 22nd at 12:30 PM in Fellowship Hall for members 55+ with food and fellowship.',
    rsvps: 28,
    isUserRsvped: false,
  },
  {
    id: '8',
    title: 'Community Service Day',
    date: '2025-06-07',
    time: '8:00 AM - 4:00 PM',
    location: 'Various Locations',
    description: 'Join us as we serve our community through various projects: park cleanup, food bank volunteering, and visiting nursing homes.',
    summary: 'Community service day on June 7th from 8 AM to 4 PM at various locations including park cleanup and food bank volunteering.',
    rsvps: 42,
    isUserRsvped: false,
  },
  {
    id: '9',
    title: 'Father\'s Day BBQ',
    date: '2025-06-15',
    time: '1:00 PM',
    location: 'Church Parking Lot',
    description: 'Celebrating all the fathers with a special BBQ lunch. Grilled favorites, games, and time to honor the men in our lives.',
    summary: 'Father\'s Day BBQ on June 15th at 1 PM in the Church Parking Lot to celebrate and honor fathers.',
    rsvps: 55,
    isUserRsvped: false,
  },
  {
    id: '10',
    title: 'Women\'s Bible Study',
    date: '2025-05-08',
    time: '10:00 AM',
    location: 'Conference Room',
    description: 'Weekly women\'s Bible study focusing on the book of Proverbs. All women welcome, regardless of Bible knowledge level.',
    summary: 'Women\'s Bible study on May 8th at 10 AM in the Conference Room focusing on Proverbs. All women welcome.',
    rsvps: 16,
    isUserRsvped: false,
  },
  {
    id: '11',
    title: 'Graduation Sunday',
    date: '2025-06-01',
    time: '10:30 AM',
    location: 'Church Sanctuary',
    description: 'Special service honoring our high school and college graduates. Celebrating their achievements and praying for their future.',
    summary: 'Graduation Sunday service on June 1st at 10:30 AM in the Church Sanctuary honoring high school and college graduates.',
    rsvps: 85,
    isUserRsvped: false,
  },
  {
    id: '12',
    title: 'Kids Movie Night',
    date: '2025-05-17',
    time: '6:00 PM',
    location: 'Fellowship Hall',
    description: 'Family-friendly movie night with popcorn and snacks. Kids can come in pajamas! This month featuring a classic animated film.',
    summary: 'Kids movie night on May 17th at 6 PM in Fellowship Hall with popcorn and snacks. Kids welcome in pajamas.',
    rsvps: 32,
    isUserRsvped: false,
  },
  {
    id: '13',
    title: 'Church Workday',
    date: '2025-06-21',
    time: '8:00 AM - 2:00 PM',
    location: 'Church Grounds',
    description: 'Help beautify our church grounds! Landscaping, painting, and general maintenance. Lunch provided for all volunteers.',
    summary: 'Church workday on June 21st from 8 AM to 2 PM on church grounds for landscaping and maintenance. Lunch provided.',
    rsvps: 25,
    isUserRsvped: false,
  }
];

export default function EventsPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { user } = useUser(); // Assuming admin role check would happen here if implemented

  useEffect(() => {
    setEvents(initialEvents);
    setIsMounted(true);
  }, []);

  const handleAddEvent = (newEvent: EventType) => {
    setEvents(prevEvents => [newEvent, ...prevEvents]);
    setIsCreateEventOpen(false); // Close dialog after adding event
  };

  const handleRsvp = (eventId: string) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId
          ? { ...event, rsvps: event.isUserRsvped ? event.rsvps -1 : event.rsvps + 1, isUserRsvped: !event.isUserRsvped }
          : event
      )
    );
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const clearDateFilter = () => {
    setSelectedDate(undefined);
  };

  // Filter events based on selected date
  const filteredEvents = selectedDate 
    ? events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === selectedDate.toDateString();
      })
    : events;

  if (!isMounted) {
    // Basic loading state to prevent hydration issues with initialEvents
    return <div className="text-center py-10">Loading events...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-lora font-bold text-primary-foreground">Upcoming Events</h1>
        {user && ( // Simplified: show create button if user is logged in. In reality, this would be role-based.
          <Dialog open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <PlusCircle className="mr-2 h-5 w-5" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-card">
              <DialogHeader>
                <DialogTitle className="font-lora text-2xl">Create New Event</DialogTitle>
                <DialogDescription>
                  Fill in the details for the new event. An AI summary will be generated.
                </DialogDescription>
              </DialogHeader>
              <CreateEventForm onEventCreated={handleAddEvent} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Calendar and Events Layout */}
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Calendar Widget - Takes 1 column on large screens */}
        <div className="lg:col-span-1">
          <EventsCalendar 
            events={events}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
        </div>

        {/* Events Section - Takes 3 columns on large screens */}
        <div className="lg:col-span-3 space-y-6">
          {/* Date Filter Display */}
          {selectedDate && (
            <div className="flex items-center justify-between bg-accent/10 border border-accent/20 rounded-lg p-4">
              <div>
                <h3 className="font-medium text-primary-foreground">
                  Events for {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearDateFilter}
                className="border-accent text-accent hover:bg-accent/10"
              >
                <X className="mr-2 h-4 w-4" />
                Show All Events
              </Button>
            </div>
          )}

          {/* Events Grid */}
          {filteredEvents.length === 0 ? (
            <div className="text-center py-10">
              {selectedDate ? (
                <div className="space-y-2">
                  <p className="text-muted-foreground">No events scheduled for this date.</p>
                  <Button variant="link" onClick={clearDateFilter} className="text-accent">
                    View all events
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground">No upcoming events. Check back soon!</p>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredEvents.map(event => (
                <EventCard key={event.id} event={event} onRsvp={handleRsvp} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
