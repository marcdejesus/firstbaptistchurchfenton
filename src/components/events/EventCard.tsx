"use client";

import React, { useState, useEffect } from 'react';
import type { Event } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  ChevronDown,
  ChevronUp,
  Timer,
  Cloud,
  Navigation,
  Download,
  Heart,
  Eye
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

interface EventCardProps {
  event: Event;
  onRsvp: (eventId: string) => void;
  variant?: 'default' | 'compact' | 'detailed';
  showAttendees?: boolean;
}

export function EventCard({ 
  event, 
  onRsvp, 
  variant = 'default',
  showAttendees = false 
}: EventCardProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [timeUntilEvent, setTimeUntilEvent] = useState<string>('');

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
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to RSVP for events.",
        variant: "destructive",
      });
      return;
    }
    
    onRsvp(event.id);
    
    toast({
      title: "RSVP Updated!",
      description: `You have ${event.isUserRsvped ? "cancelled your RSVP for" : "RSVPed for"} "${event.title}".`,
    });
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

  const handleAddToCalendar = () => {
    const startDate = new Date(`${event.date}T${convertTo24Hour(event.time)}`);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Assume 2 hours duration
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate.toISOString().replace(/[:-]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[:-]/g, '').split('.')[0]}Z&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    
    window.open(googleCalendarUrl, '_blank');
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
              <Button size="sm" variant={event.isUserRsvped ? "outline" : "default"} onClick={handleRsvpClick}>
                {event.isUserRsvped ? 'RSVPed' : 'RSVP'}
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
              <DropdownMenuItem onClick={handleAddToCalendar}>
                <Download className="w-4 h-4 mr-2" />
                Add to Calendar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDirections}>
                <Navigation className="w-4 h-4 mr-2" />
                Get Directions
              </DropdownMenuItem>
              {event.forumDiscussionId && (
                <DropdownMenuItem asChild>
                  <Link href={`/community/posts/${event.forumDiscussionId}`}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Discuss in Forum
                  </Link>
                </DropdownMenuItem>
              )}
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

        {/* Expandable AI Summary */}
        {event.summary && (
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-auto p-2 w-full justify-between"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <span className="text-xs font-medium">AI Summary</span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
            
            {isExpanded && (
              <div className="p-3 bg-primary/5 rounded-md border">
                <p className="text-xs text-muted-foreground">{event.summary}</p>
              </div>
            )}
          </div>
        )}

        {/* Attendees Preview */}
        {showAttendees && event.attendees && event.attendees.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground">Who's Coming</h4>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {event.attendees.slice(0, 3).map((attendee, index) => (
                  <Avatar key={attendee.id} className="w-6 h-6 border-2 border-background">
                    <AvatarImage src={attendee.avatarUrl} />
                    <AvatarFallback className="text-xs">
                      {attendee.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              {event.attendees.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{event.attendees.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>

      {/* Footer */}
      <CardFooter className="pt-4 border-t">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1 text-accent" />
              <span className={getCapacityColor()}>
                {event.rsvps}{event.capacity ? `/${event.capacity}` : ''} 
                {event.capacity ? ' spots' : ' RSVPs'}
              </span>
            </div>
            
            {event.forumDiscussionId && (
              <Link 
                href={`/community/posts/${event.forumDiscussionId}`}
                className="flex items-center hover:text-accent transition-colors"
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                <span>Discuss</span>
              </Link>
            )}
          </div>
          
          <Button 
            onClick={handleRsvpClick} 
            variant={event.isUserRsvped ? "outline" : "default"}
            size="default"
            className={`${
              event.isUserRsvped 
                ? "border-accent text-accent hover:bg-accent/10" 
                : "bg-accent text-accent-foreground hover:bg-accent/90"
            } font-semibold px-6`}
            disabled={!user || Boolean(event.capacity && event.rsvps >= event.capacity && !event.isUserRsvped)}
          >
            {event.isUserRsvped ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                RSVPed
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4 mr-2" />
                {event.capacity && event.rsvps >= event.capacity ? 'Full' : 'RSVP'}
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
