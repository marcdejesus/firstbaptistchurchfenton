"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { EventCard } from '@/components/events/EventCard';
import { EventsCalendar } from '@/components/events/EventsCalendar';
import { EventFilters } from '@/components/events/EventFilters';
import { CreateEventForm } from '@/components/events/CreateEventForm';
import type { Event as EventType, EventCategory, EventFilter } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, X, Calendar, Grid, LayoutGrid } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Enhanced event categories with icons and colors
const eventCategories: EventCategory[] = [
  { id: 'worship', name: 'Worship', icon: '🙏', color: '#8B5CF6', description: 'Worship services and spiritual gatherings' },
  { id: 'fellowship', name: 'Fellowship', icon: '🤝', color: '#06B6D4', description: 'Community and social events' },
  { id: 'outreach', name: 'Outreach', icon: '💝', color: '#10B981', description: 'Service and community outreach' },
  { id: 'education', name: 'Education', icon: '📚', color: '#F59E0B', description: 'Learning and Bible study' },
  { id: 'youth', name: 'Youth', icon: '🎯', color: '#EF4444', description: 'Youth and teen activities' },
  { id: 'family', name: 'Family', icon: '👨‍👩‍👧‍👦', color: '#EC4899', description: 'Family-oriented events' },
  { id: 'special', name: 'Special Events', icon: '⭐', color: '#6366F1', description: 'Special occasions and holidays' }
];

// Enhanced events with categories and additional data
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
    category: eventCategories.find(c => c.id === 'fellowship'),
    capacity: 150,
    isOutdoor: true,
    hasWeatherAlert: false,
    tags: ['food', 'games', 'outdoor', 'family-friendly'],
    directions: 'Fenton Community Park, 123 Park Drive, Fenton, MI',
    contactInfo: 'Contact Sarah at events@fbcfenton.org',
    forumDiscussionId: 'forum-post-1'
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
    category: eventCategories.find(c => c.id === 'youth'),
    capacity: 40,
    tags: ['overnight', 'youth', 'games', 'movies'],
    contactInfo: 'Contact Mark at youth@fbcfenton.org'
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
    category: eventCategories.find(c => c.id === 'worship'),
    capacity: 200,
    tags: ['worship', 'music', 'prayer'],
    forumDiscussionId: 'forum-post-3'
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
    category: eventCategories.find(c => c.id === 'special'),
    capacity: 100,
    tags: ['mothers-day', 'brunch', 'celebration'],
    contactInfo: 'Contact Women\'s Ministry at women@fbcfenton.org'
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
    category: eventCategories.find(c => c.id === 'fellowship'),
    capacity: 25,
    tags: ['men', 'breakfast', 'prayer', 'monthly']
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
    category: eventCategories.find(c => c.id === 'education'),
    capacity: 50,
    tags: ['kids', 'bible-school', 'crafts', 'games'],
    contactInfo: 'Contact Children\'s Ministry at kids@fbcfenton.org'
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
    category: eventCategories.find(c => c.id === 'fellowship'),
    capacity: 40,
    tags: ['seniors', 'luncheon', 'monthly', 'guest-speaker']
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
    category: eventCategories.find(c => c.id === 'outreach'),
    capacity: 80,
    isOutdoor: true,
    tags: ['service', 'community', 'volunteering', 'outreach'],
    forumDiscussionId: 'forum-post-8'
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
    category: eventCategories.find(c => c.id === 'special'),
    capacity: 120,
    isOutdoor: true,
    tags: ['fathers-day', 'bbq', 'outdoor', 'celebration']
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
    category: eventCategories.find(c => c.id === 'education'),
    capacity: 20,
    tags: ['women', 'bible-study', 'weekly', 'proverbs']
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
    category: eventCategories.find(c => c.id === 'special'),
    capacity: 200,
    tags: ['graduation', 'celebration', 'students']
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
    category: eventCategories.find(c => c.id === 'family'),
    capacity: 60,
    tags: ['kids', 'movie', 'family', 'snacks']
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
    category: eventCategories.find(c => c.id === 'outreach'),
    capacity: 50,
    isOutdoor: true,
    tags: ['workday', 'maintenance', 'volunteering', 'outdoor']
  }
];

export default function EventsPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [filters, setFilters] = useState<EventFilter>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showOnlyMyEvents, setShowOnlyMyEvents] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');
  const { user } = useUser();

  useEffect(() => {
    setEvents(initialEvents);
    setIsMounted(true);
  }, []);

  const handleAddEvent = (newEvent: EventType) => {
    setEvents(prevEvents => [newEvent, ...prevEvents]);
    setIsCreateEventOpen(false);
  };

  const handleRsvp = (eventId: string) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId
          ? { ...event, rsvps: event.isUserRsvped ? event.rsvps - 1 : event.rsvps + 1, isUserRsvped: !event.isUserRsvped }
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

  // Enhanced filtering logic
  const filteredEvents = useMemo(() => {
    let filtered = events;

    // Apply date filter from calendar selection
    if (selectedDate) {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === selectedDate.toDateString();
      });
    }

    // Apply advanced filters
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (filters.category) {
      filtered = filtered.filter(event => event.category?.id === filters.category);
    }

    if (filters.dateRange) {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= filters.dateRange!.start && eventDate <= filters.dateRange!.end;
      });
    }

    if (showOnlyMyEvents) {
      filtered = filtered.filter(event => event.isUserRsvped);
    }

    // Tab filtering
    const now = new Date();
    if (activeTab === 'upcoming') {
      filtered = filtered.filter(event => new Date(event.date) >= now);
    } else if (activeTab === 'past') {
      filtered = filtered.filter(event => new Date(event.date) < now);
    }

    // Sort by date
    filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return filtered;
  }, [events, selectedDate, filters, showOnlyMyEvents, activeTab]);

  // Get suggested events (simple algorithm based on categories of RSVPed events)
  const suggestedEvents = useMemo(() => {
    if (!user) return [];
    
    const userCategories = events
      .filter(e => e.isUserRsvped)
      .map(e => e.category?.id)
      .filter(Boolean);
    
    if (userCategories.length === 0) return [];
    
    return events
      .filter(e => !e.isUserRsvped && userCategories.includes(e.category?.id))
      .slice(0, 3);
  }, [events, user]);

  if (!isMounted) {
    return <div className="text-center py-10">Loading events...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-lora font-bold text-primary-foreground">Church Events</h1>
          <p className="text-muted-foreground mt-2">
            Discover upcoming events and join our vibrant church community
          </p>
        </div>
        
        {user && (
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

      {/* Tabs for event organization */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="my-events" disabled={!user}>My Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          {/* Filters */}
          <EventFilters
            filters={filters}
            categories={eventCategories}
            onFiltersChange={setFilters}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            showOnlyMyEvents={showOnlyMyEvents}
            onToggleMyEvents={setShowOnlyMyEvents}
            totalEvents={events.filter(e => new Date(e.date) >= new Date()).length}
            filteredEvents={filteredEvents.length}
          />

          {/* Main Layout */}
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Calendar Widget */}
            <div className="lg:col-span-1 space-y-4">
              <EventsCalendar 
                events={events}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
              />

              {/* Quick Stats */}
              <div className="bg-card border rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-sm">Quick Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Events</span>
                    <span className="font-medium">{events.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">My RSVPs</span>
                    <span className="font-medium">{events.filter(e => e.isUserRsvped).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">This Month</span>
                    <span className="font-medium">
                      {events.filter(e => {
                        const eventDate = new Date(e.date);
                        const now = new Date();
                        return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
                      }).length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Category Quick Filters */}
              <div className="bg-card border rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-sm">Categories</h3>
                <div className="space-y-2">
                  {eventCategories.map((category) => {
                    const categoryCount = events.filter(e => e.category?.id === category.id).length;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setFilters({ ...filters, category: filters.category === category.id ? undefined : category.id })}
                        className={`w-full text-left px-2 py-1 rounded text-xs hover:bg-accent/10 transition-colors ${
                          filters.category === category.id ? 'bg-accent/20' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <span>{category.icon}</span>
                            <span>{category.name}</span>
                          </span>
                          <span className="text-muted-foreground">{categoryCount}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Events Section */}
            <div className="lg:col-span-3 space-y-4">
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

              {/* Events Grid/List */}
              {filteredEvents.length === 0 ? (
                <div className="text-center py-16 bg-card border rounded-lg">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No events found</h3>
                  <p className="text-muted-foreground mb-4">
                    {selectedDate 
                      ? "No events scheduled for this date." 
                      : "No events match your current filters."
                    }
                  </p>
                  <Button variant="outline" onClick={() => { clearDateFilter(); setFilters({}); setShowOnlyMyEvents(false); }}>
                    Clear all filters
                  </Button>
                </div>
              ) : (
                <div className={
                  viewMode === 'grid' 
                    ? "grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
                    : "space-y-4"
                }>
                  {filteredEvents.map(event => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      onRsvp={handleRsvp} 
                      variant={viewMode === 'list' ? 'compact' : 'default'}
                      showAttendees={true}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="my-events" className="space-y-6">
          <div className="text-center py-16">
            <h3 className="text-lg font-semibold mb-2">My Events</h3>
            <p className="text-muted-foreground mb-4">
              Events you've RSVPed for will appear here
            </p>
            {user && (
              <div className="space-y-4">
                {events.filter(e => e.isUserRsvped).length === 0 ? (
                  <p className="text-sm text-muted-foreground">You haven't RSVPed for any events yet.</p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {events.filter(e => e.isUserRsvped).map(event => (
                      <EventCard key={event.id} event={event} onRsvp={handleRsvp} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="past" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events
              .filter(e => new Date(e.date) < new Date())
              .map(event => (
                <EventCard key={event.id} event={event} onRsvp={handleRsvp} />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Suggested Events */}
      {user && suggestedEvents.length > 0 && (
        <div className="bg-gradient-to-r from-accent/10 to-primary/10 border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">✨</span>
            <h3 className="text-lg font-semibold">Suggested for You</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Based on your interests and past RSVPs
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {suggestedEvents.map(event => (
              <EventCard key={event.id} event={event} onRsvp={handleRsvp} variant="compact" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
