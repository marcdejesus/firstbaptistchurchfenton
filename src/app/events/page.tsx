"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Calendar, 
  Search, 
  Plus, 
  ExternalLink, 
  Info,
  RefreshCw,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { EventCard } from '@/components/events/EventCard';
import { CalendarSync } from '@/components/events/CalendarSync';
import type { Event, EventFilter } from '@/types';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Event categories for filtering
const eventCategories = [
  { id: 'all', name: 'All Events', color: '#6B7280' },
  { id: 'worship', name: 'Worship', color: '#8B5CF6' },
  { id: 'fellowship', name: 'Fellowship', color: '#3B82F6' },
  { id: 'outreach', name: 'Outreach', color: '#10B981' },
  { id: 'education', name: 'Education', color: '#F59E0B' },
  { id: 'youth', name: 'Youth', color: '#EF4444' },
  { id: 'family', name: 'Family', color: '#8B5CF6' },
  { id: 'special', name: 'Special Events', color: '#EC4899' },
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showCalendarSync, setShowCalendarSync] = useState(false);
  const { toast } = useToast();

  // Fetch events from the church calendar API
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/church-events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const data = await response.json();
      if (data.success) {
        setEvents(data.events);
        
        // Show a toast if using fallback data
        if (data.source === 'fallback') {
          toast({
            title: "Using Sample Events",
            description: "Google Calendar integration is available but showing sample events.",
            variant: "default"
          });
        }
      } else {
        throw new Error(data.error || 'Failed to load events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setError(error instanceof Error ? error.message : 'Failed to load events');
      toast({
        title: "Error Loading Events",
        description: "Unable to load events. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and search events
  const filteredEvents = useMemo(() => {
    let filtered = events;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => 
        event.category?.id === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort by date (upcoming first)
    return filtered.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [events, selectedCategory, searchQuery]);



  // Generate calendar subscription URL
  const getCalendarSubscriptionUrl = () => {
    const calendarId = process.env.NEXT_PUBLIC_CHURCH_CALENDAR_ID;
    if (calendarId) {
      return `https://calendar.google.com/calendar/u/0?cid=${encodeURIComponent(calendarId)}`;
    }
    return null;
  };

  const subscriptionUrl = getCalendarSubscriptionUrl();

  if (isLoading) {
    return (
      <PageLayout
        title="Church Events"
        subtitle="Join us for fellowship, growth, and service."
      >
        <div className="space-y-6">
          {/* Loading header */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
            <Skeleton className="h-10 w-72" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          
          {/* Loading filters */}
          <div className="flex gap-4">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          
          {/* Loading events */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="h-64">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout
        title="Church Events"
        subtitle="Join us for fellowship, growth, and service."
      >
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Events</AlertTitle>
          <AlertDescription>
            {error} Please try refreshing the page or contact us if the problem persists.
          </AlertDescription>
        </Alert>
        <div className="text-center py-12">
          <Button onClick={fetchEvents} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Church Events"
      subtitle="Join us for fellowship, growth, and service."
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            {subscriptionUrl && (
              <Button variant="outline" asChild>
                <a href={subscriptionUrl} target="_blank" rel="noopener noreferrer">
                  <Plus className="h-4 w-4 mr-2" />
                  Subscribe to Calendar
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            )}
            
            <Dialog open={showCalendarSync} onOpenChange={setShowCalendarSync}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Sync Events
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Calendar Sync</DialogTitle>
                  <DialogDescription>
                    Sync church events with your personal Google Calendar
                  </DialogDescription>
                </DialogHeader>
                <CalendarSync events={events} />
              </DialogContent>
            </Dialog>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filter Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {eventCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="h-3 w-3 rounded-full" 
                              style={{ backgroundColor: category.color }}
                            />
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}



        {/* Calendar Subscription Info */}
        {subscriptionUrl && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Stay Updated!</AlertTitle>
            <AlertDescription>
              Subscribe to our church calendar to automatically receive event updates in your personal calendar app.
              Works with Google Calendar, Apple Calendar, Outlook, and more.
            </AlertDescription>
          </Alert>
        )}

        {/* Events List */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {searchQuery || selectedCategory !== 'all' 
                ? 'No events match your criteria' 
                : 'No upcoming events'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedCategory !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Check back soon for new events!'}
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onRsvp={() => {}} // No RSVP functionality
                variant="default"
                showAttendees={false}
              />
            ))}
          </div>
        )}

        {/* Load More Button (for future pagination) */}
        {filteredEvents.length > 0 && (
          <div className="text-center pt-8">
            <Button variant="outline" onClick={fetchEvents}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Events
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
