"use client";

import React, { useState, useEffect } from 'react';
import type { Event } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CalendarDays, 
  MapPin, 
  Clock, 
  Users, 
  CheckCircle, 
  PlusCircle,
  Share2,
  MessageSquare,
  ExternalLink,
  Timer,
  Cloud,
  Navigation,
  Download,
  Heart,
  Eye,
  Calendar,
  Loader2,
  MoreHorizontal,
  UserPlus,
  X
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Link from 'next/link';

interface EventCardProps {
  event: Event;
  onRsvp: (eventId: string, attendeeName?: string, action?: 'add' | 'remove') => void;
  variant?: 'default' | 'compact' | 'detailed';
  showAttendees?: boolean;
}

export function EventCard({ 
  event, 
  onRsvp, 
  variant = 'default',
  showAttendees = false 
}: EventCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [timeUntilEvent, setTimeUntilEvent] = useState<string>('');
  const [isAddingToCalendar, setIsAddingToCalendar] = useState(false);
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);
  const [isRsvpDialogOpen, setIsRsvpDialogOpen] = useState(false);
  const [isAttendeesDialogOpen, setIsAttendeesDialogOpen] = useState(false);
  const [rsvpName, setRsvpName] = useState('');
  const [userRsvpName, setUserRsvpName] = useState<string | null>(null);

  // Check if current user has RSVPed (stored in localStorage)
  useEffect(() => {
    const storedRsvps = localStorage.getItem('event_rsvps');
    if (storedRsvps) {
      const rsvps = JSON.parse(storedRsvps);
      const userRsvp = rsvps[event.id];
      setUserRsvpName(userRsvp || null);
    }
  }, [event.id]);

  // Check calendar connection status on component mount
  useEffect(() => {
    // Check if Google Calendar is connected by looking for the user email cookie
    const googleUserEmail = document.cookie
      .split('; ')
      .find(row => row.startsWith('google_user_email='))
      ?.split('=')[1];
    
    setIsCalendarConnected(!!googleUserEmail);
  }, []);

  // Calculate time until event
  useEffect(() => {
    const updateCountdown = () => {
      const eventDateTime = new Date(`${event.date}T${convertTo24Hour(event.time)}`);
      const now = new Date();
      const timeDiff = eventDateTime.getTime() - now.getTime();
      
      if (timeDiff > 0) {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        if (days > 0) {
          setTimeUntilEvent(`in ${days} day${days !== 1 ? 's' : ''}`);
        } else if (hours > 0) {
          setTimeUntilEvent(`in ${hours} hour${hours !== 1 ? 's' : ''}`);
        } else {
          setTimeUntilEvent('starting soon');
        }
      } else {
        setTimeUntilEvent('');
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [event.date, event.time]);

  // Helper function to convert 12-hour to 24-hour format
  const convertTo24Hour = (time12h: string) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = String(parseInt(hours, 10) + 12);
    }
    return `${hours}:${minutes}:00`;
  };

  const handleRsvpClick = () => {
    if (userRsvpName) {
      // User has already RSVPed, allow them to cancel
      handleCancelRsvp();
    } else {
      // User hasn't RSVPed, open name dialog
      setIsRsvpDialogOpen(true);
    }
  };

  const handleSubmitRsvp = () => {
    if (!rsvpName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name and last initial to RSVP.",
        variant: "destructive",
      });
      return;
    }

    // Store RSVP in localStorage
    const storedRsvps = localStorage.getItem('event_rsvps') || '{}';
    const rsvps = JSON.parse(storedRsvps);
    rsvps[event.id] = rsvpName.trim();
    localStorage.setItem('event_rsvps', JSON.stringify(rsvps));

    setUserRsvpName(rsvpName.trim());
    onRsvp(event.id, rsvpName.trim(), 'add');
    
    toast({
      title: "RSVP Successful!",
      description: `Thank you ${rsvpName.trim()}, you've RSVPed for "${event.title}".`,
    });

    setRsvpName('');
    setIsRsvpDialogOpen(false);
  };

  const handleCancelRsvp = () => {
    if (!userRsvpName) return;

    // Remove RSVP from localStorage
    const storedRsvps = localStorage.getItem('event_rsvps') || '{}';
    const rsvps = JSON.parse(storedRsvps);
    delete rsvps[event.id];
    localStorage.setItem('event_rsvps', JSON.stringify(rsvps));

    onRsvp(event.id, userRsvpName, 'remove');
    setUserRsvpName(null);
    
    toast({
      title: "RSVP Cancelled",
      description: `Your RSVP for "${event.title}" has been cancelled.`,
    });
  };

  const handleViewAttendees = () => {
    setIsAttendeesDialogOpen(true);
  };

  const handleShare = async () => {
    const eventUrl = `${window.location.origin}/events/${event.id}`;
    const shareData = {
      title: event.title,
      text: `Join me at ${event.title} on ${new Date(event.date).toLocaleDateString()}`,
      url: eventUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(eventUrl);
        toast({ title: "Link copied!", description: "Event link copied to clipboard." });
      }
    } else {
      navigator.clipboard.writeText(eventUrl);
      toast({ title: "Link copied!", description: "Event link copied to clipboard." });
    }
  };

  // Enhanced Google Calendar integration
  const handleAddToCalendar = async () => {
    setIsAddingToCalendar(true);
    
    try {
      if (isCalendarConnected) {
        // Use Google Calendar API to add event directly
        const response = await fetch('/api/calendar/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event,
            duration: 120, // 2 hours default duration
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          toast({
            title: "Event Added!",
            description: `Event has been ${data.action} in your Google Calendar.`,
          });
          return;
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to add to calendar');
        }
      } else {
        // Fallback to Google Calendar URL (existing implementation)
        const startDate = new Date(`${event.date}T${convertTo24Hour(event.time)}`);
        const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
        
        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate.toISOString().replace(/[:-]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[:-]/g, '').split('.')[0]}Z&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
        
        window.open(googleCalendarUrl, '_blank');
        
        toast({
          title: "Calendar Opened",
          description: "Google Calendar opened in a new tab. Connect your calendar for direct sync!",
        });
      }
    } catch (error) {
      console.error('Failed to add to calendar:', error);
      toast({
        title: "Failed to Add Event",
        description: error instanceof Error ? error.message : "Please try again or use the fallback URL method.",
        variant: "destructive",
      });
      
      // Fallback to URL method on error
      const startDate = new Date(`${event.date}T${convertTo24Hour(event.time)}`);
      const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
      
      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate.toISOString().replace(/[:-]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[:-]/g, '').split('.')[0]}Z&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
      
      window.open(googleCalendarUrl, '_blank');
    } finally {
      setIsAddingToCalendar(false);
    }
  };

  // Connect Google Calendar
  const handleConnectCalendar = async () => {
    try {
      const response = await fetch('/api/calendar/auth');
      const { authUrl } = await response.json();
      
      // Open Google OAuth in current window
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to connect calendar:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Google Calendar. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDirections = () => {
    const mapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(event.location)}`;
    window.open(mapsUrl, '_blank');
  };

  const getCapacityColor = () => {
    if (!event.capacity) return 'text-muted-foreground';
    const percentage = event.rsvps / event.capacity;
    if (percentage >= 0.9) return 'text-red-600';
    if (percentage >= 0.7) return 'text-orange-600';
    return 'text-green-600';
  };

  if (variant === 'compact') {
    return (
      <Card className="group hover:shadow-md transition-all duration-200 border-l-4" 
            style={{ borderLeftColor: event.category?.color || '#6366F1' }}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {event.category && (
                  <Badge variant="secondary" className="text-xs">
                    {event.category.icon} {event.category.name}
                  </Badge>
                )}
                {timeUntilEvent && (
                  <Badge variant="outline" className="text-xs">
                    <Timer className="w-3 h-3 mr-1" />
                    {timeUntilEvent}
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-sm mb-1">{event.title}</h3>
              <div className="flex items-center text-xs text-muted-foreground gap-3">
                <span className="flex items-center">
                  <CalendarDays className="w-3 h-3 mr-1" />
                  {new Date(event.date).toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {event.time}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {event.rsvps}{event.capacity ? `/${event.capacity}` : ''}
              </span>
              <Button size="sm" variant={userRsvpName ? "outline" : "default"} onClick={handleRsvpClick}>
                {userRsvpName ? 'RSVPed' : 'RSVP'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
      {/* Header with Category Badge and Actions */}
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2">
            {event.category && (
              <Badge 
                variant="secondary" 
                className="w-fit text-xs px-2 py-1"
                style={{ 
                  backgroundColor: `${event.category.color}20`,
                  color: event.category.color,
                  borderColor: `${event.category.color}40`
                }}
              >
                <span className="mr-1">{event.category.icon}</span>
                {event.category.name}
              </Badge>
            )}
            
            <h3 className="text-xl font-bold leading-tight text-card-foreground">
              {event.title}
            </h3>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <span className="text-lg">⋯</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share Event
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleAddToCalendar} disabled={isAddingToCalendar}>
                {isAddingToCalendar ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding to Calendar...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    {isCalendarConnected ? 'Add to Calendar' : 'Open in Calendar'}
                  </>
                )}
              </DropdownMenuItem>
              {!isCalendarConnected && (
                <DropdownMenuItem onClick={handleConnectCalendar}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Connect Google Calendar
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDirections}>
                <Navigation className="w-4 h-4 mr-2" />
                Get Directions
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Event Details */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarDays className="w-4 h-4 mr-2 text-accent" />
            <span className="font-medium">
              {new Date(event.date).toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
            {timeUntilEvent && (
              <Badge variant="outline" className="ml-2 text-xs">
                <Timer className="w-3 h-3 mr-1" />
                {timeUntilEvent}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mr-2 text-accent" />
            <span>{event.time}</span>
          </div>
          
          <div className="flex items-start text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2 mt-0.5 text-accent flex-shrink-0" />
            <span className="flex-1">{event.location}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs ml-2"
              onClick={handleDirections}
            >
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Weather Alert */}
        {event.isOutdoor && event.hasWeatherAlert && (
          <div className="flex items-center gap-2 p-2 bg-orange-50 border border-orange-200 rounded-md mt-2">
            <Cloud className="w-4 h-4 text-orange-600" />
            <span className="text-xs text-orange-800">
              Weather alert: {event.weatherInfo || 'Check forecast'}
            </span>
          </div>
        )}
      </CardHeader>

      {/* Main Content */}
      <CardContent className="flex-1 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {event.description}
        </p>
      </CardContent>



    
    </Card>
  );
}
