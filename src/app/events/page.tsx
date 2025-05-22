"use client";

import React, { useState, useEffect } from 'react';
import { EventCard } from '@/components/events/EventCard';
import { CreateEventForm } from '@/components/events/CreateEventForm';
import type { Event as EventType } from '@/types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
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
    date: '2024-08-15',
    time: '12:00 PM',
    location: 'Fenton Community Park',
    description: 'Join us for our annual church picnic! Food, games, and fellowship for all ages. Please bring a dish to share if you can.',
    summary: 'A fun-filled annual church picnic at Fenton Community Park on August 15th, 12 PM, featuring food, games, and fellowship. Attendees are encouraged to bring a dish.',
    rsvps: 45,
    isUserRsvped: false,
  },
  {
    id: '2',
    title: 'Youth Group Lock-In',
    date: '2024-09-05',
    time: '8:00 PM - 7:00 AM',
    location: 'Church Youth Hall',
    description: 'An exciting overnight event for our youth group (ages 12-18). Games, movies, devotional time, and lots of fun. Parental consent form required.',
    summary: 'An overnight lock-in for youth (12-18) at the Church Youth Hall from Sep 5th, 8 PM to Sep 6th, 7 AM, with games, movies, and devotionals. Consent form needed.',
    rsvps: 22,
    isUserRsvped: false,
  },
  {
    id: '3',
    title: 'Worship Night',
    date: '2024-07-30',
    time: '7:00 PM',
    location: 'Church Sanctuary',
    description: 'An evening dedicated to worship through music and prayer. Come lift your voices and hearts together.',
    rsvps: 60,
    summary: 'Join us for a Worship Night on July 30th at 7 PM in the Church Sanctuary for an evening of music and prayer.',
    isUserRsvped: false,
  }
];

export default function EventsPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
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

      {events.length === 0 ? (
        <p className="text-center text-muted-foreground py-10">No upcoming events. Check back soon!</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard key={event.id} event={event} onRsvp={handleRsvp} />
          ))}
        </div>
      )}
    </div>
  );
}
