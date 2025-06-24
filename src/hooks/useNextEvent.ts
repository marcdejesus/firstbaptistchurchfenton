"use client";

import { useState, useEffect } from 'react';
import type { Event } from '@/types';

export function useNextEvent() {
  const [nextEvent, setNextEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNextEvent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/church-events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const data = await response.json();
        if (data.success && data.events.length > 0) {
          // Filter for upcoming events and get the closest one
          const now = new Date();
          const upcomingEvents = data.events
            .filter((event: Event) => new Date(event.date) >= now)
            .sort((a: Event, b: Event) => new Date(a.date).getTime() - new Date(b.date).getTime());
          
          setNextEvent(upcomingEvents[0] || null);
        } else {
          setNextEvent(null);
        }
      } catch (error) {
        console.error('Error fetching next event:', error);
        setError(error instanceof Error ? error.message : 'Failed to load event');
        setNextEvent(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNextEvent();
  }, []);

  return { nextEvent, isLoading, error };
} 