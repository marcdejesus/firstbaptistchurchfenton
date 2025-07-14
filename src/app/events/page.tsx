"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calendar, Info, MapPin, Clock, Users, Loader2, Search, Filter } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { eventsService, eventRSVPService } from '@/lib/firestore/events';
import { useUser } from '@/contexts/UserContext';
import type { Event } from '@/types';

interface EventCardProps {
  event: Event;
  onRSVP: (eventId: string, status: 'attending' | 'not_attending') => Promise<void>;
  userRSVPStatus?: 'attending' | 'not_attending' | null;
  isRSVPing: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, onRSVP, userRSVPStatus, isRSVPing }) => {
  const { user } = useUser();
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const isUpcoming = new Date(event.date) >= new Date();

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="font-heading text-xl mb-2">{event.title}</CardTitle>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(event.date)}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {event.time}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {event.location}
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {event.rsvps} {event.rsvps === 1 ? 'person' : 'people'} attending
              </div>
            </div>
          </div>
          {event.category && (
            <Badge variant="secondary" className="ml-2">
              {event.category.name}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <CardDescription className="flex-1 mb-4">
          {event.description}
        </CardDescription>
        
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {event.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* RSVP Section */}
        {user && isUpcoming && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Button
                variant={userRSVPStatus === 'attending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onRSVP(event.id, 'attending')}
                disabled={isRSVPing}
                className="flex-1"
              >
                {isRSVPing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Attending'}
              </Button>
              <Button
                variant={userRSVPStatus === 'not_attending' ? 'destructive' : 'outline'}
                size="sm"
                onClick={() => onRSVP(event.id, 'not_attending')}
                disabled={isRSVPing}
                className="flex-1"
              >
                {isRSVPing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Can't Attend"}
              </Button>
            </div>
            {userRSVPStatus && (
              <p className="text-xs text-center text-muted-foreground">
                You marked yourself as {userRSVPStatus === 'attending' ? 'attending' : 'not attending'}
              </p>
            )}
          </div>
        )}

        {!user && isUpcoming && (
          <div className="text-center">
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">Sign in to RSVP</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [userRSVPs, setUserRSVPs] = useState<Record<string, 'attending' | 'not_attending'>>({});
  const [rsvpLoading, setRsvpLoading] = useState<Record<string, boolean>>({});

  const { user } = useUser();

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Events" },
  ];

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const upcomingEvents = await eventsService.getUpcomingEvents();
        setEvents(upcomingEvents);
        setFilteredEvents(upcomingEvents);

        // Load user RSVPs if user is logged in
        if (user) {
          const rsvpPromises = upcomingEvents.map(async (event) => {
            const userRSVP = await eventRSVPService.getUserRSVP(event.id, user.id);
            return { eventId: event.id, status: userRSVP?.status || null };
          });

          const rsvpResults = await Promise.all(rsvpPromises);
          const rsvpMap: Record<string, 'attending' | 'not_attending'> = {};
          rsvpResults.forEach(({ eventId, status }) => {
            if (status && (status === 'attending' || status === 'not_attending')) {
              rsvpMap[eventId] = status;
            }
          });
          setUserRSVPs(rsvpMap);
        }
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [user]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredEvents(filtered);
    }
  }, [searchTerm, events]);

  const handleRSVP = async (eventId: string, status: 'attending' | 'not_attending') => {
    if (!user) return;

    setRsvpLoading(prev => ({ ...prev, [eventId]: true }));

    try {
      const existingRSVP = await eventRSVPService.getUserRSVP(eventId, user.id);
      
      if (existingRSVP) {
        await eventRSVPService.updateRSVP(existingRSVP.id, { status });
      } else {
        await eventRSVPService.createRSVP({
          eventId,
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          status,
          guestCount: 0,
        });
      }

      setUserRSVPs(prev => ({ ...prev, [eventId]: status }));

      // Update local event RSVP count
      setEvents(prev => prev.map(event => {
        if (event.id === eventId) {
          const previousStatus = userRSVPs[eventId];
          let newCount = event.rsvps;
          
          if (status === 'attending' && previousStatus !== 'attending') {
            newCount += 1;
          } else if (status !== 'attending' && previousStatus === 'attending') {
            newCount -= 1;
          }
          
          return { ...event, rsvps: newCount };
        }
        return event;
      }));

    } catch (error) {
      console.error('Error updating RSVP:', error);
    } finally {
      setRsvpLoading(prev => ({ ...prev, [eventId]: false }));
    }
  };

  if (loading) {
    return (
      <PageLayout
        title="Church Events"
        subtitle="Join us for fellowship, growth, and service."
        breadcrumbs={breadcrumbs}
      >
        <div className="flex justify-center items-center min-h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </PageLayout>
    );
  }

  if (events.length === 0) {
    return (
      <PageLayout
        title="Church Events"
        subtitle="Join us for fellowship, growth, and service."
        breadcrumbs={breadcrumbs}
      >
        <div className="text-center py-24 bg-background-secondary rounded-lg">
          <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-3xl font-heading font-bold mb-4">No Upcoming Events</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            No events are currently scheduled. Please check back soon or contact the church office for more information.
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

  return (
    <PageLayout
      title="Church Events"
      subtitle="Join us for fellowship, growth, and service."
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-8">
        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Results */}
        {filteredEvents.length === 0 && searchTerm.trim() !== '' ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-heading font-semibold mb-2">No events found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or browse all events below.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setSearchTerm('')}
              className="mt-4"
            >
              Clear Search
            </Button>
          </div>
        ) : (
          <>
            {searchTerm.trim() !== '' && (
              <div className="text-sm text-muted-foreground">
                Found {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} 
                {searchTerm && ` for "${searchTerm}"`}
              </div>
            )}

            {/* Events Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onRSVP={handleRSVP}
                  userRSVPStatus={userRSVPs[event.id] || null}
                  isRSVPing={rsvpLoading[event.id] || false}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
}
