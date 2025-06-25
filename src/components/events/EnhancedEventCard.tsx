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
  ExternalLink,
  Timer,
  Cloud,
  Navigation,
  Download,
  Heart,
  Calendar,
  Loader2,
  MoreHorizontal,
  UserPlus,
  X,
  ArrowRight
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
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
import { format } from 'date-fns';

interface EnhancedEventCardProps {
  event: Event;
  onRsvp: (eventId: string, attendeeName?: string, action?: 'add' | 'remove') => void;
  variant?: 'default' | 'compact' | 'featured';
  showAttendees?: boolean;
}

// Enhanced category colors matching design system
const categoryColors = {
  worship: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700' },
  fellowship: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700' },
  outreach: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-700' },
  education: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700' },
  youth: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-700' },
  family: { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700', badge: 'bg-pink-100 text-pink-700' },
  special: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', badge: 'bg-indigo-100 text-indigo-700' }
};

export function EnhancedEventCard({ 
  event, 
  onRsvp, 
  variant = 'default',
  showAttendees = false 
}: EnhancedEventCardProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const [timeUntilEvent, setTimeUntilEvent] = useState<string>('');
  const [isRsvpDialogOpen, setIsRsvpDialogOpen] = useState(false);
  const [isAttendeesDialogOpen, setIsAttendeesDialogOpen] = useState(false);
  const [rsvpName, setRsvpName] = useState('');
  const [userRsvpName, setUserRsvpName] = useState<string | null>(null);
  const [isAddingToCalendar, setIsAddingToCalendar] = useState(false);

  // Check if current user has RSVPed
  useEffect(() => {
    const storedRsvps = localStorage.getItem('event_rsvps');
    if (storedRsvps) {
      const rsvps = JSON.parse(storedRsvps);
      const userRsvp = rsvps[event.id];
      setUserRsvpName(userRsvp || null);
    }
  }, [event.id]);

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
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [event.date, event.time]);

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
      handleCancelRsvp();
    } else {
      setIsRsvpDialogOpen(true);
    }
  };

  const handleSubmitRsvp = () => {
    if (!rsvpName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name to RSVP.",
        variant: "destructive",
      });
      return;
    }

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

  const handleAddToCalendar = async () => {
    setIsAddingToCalendar(true);
    try {
      const startDate = new Date(`${event.date}T${convertTo24Hour(event.time)}`);
      const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Default 2 hours

      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}/${endDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
      
      window.open(googleCalendarUrl, '_blank');
      
      toast({
        title: "Calendar Event Created",
        description: "Event has been added to your Google Calendar.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add event to calendar.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCalendar(false);
    }
  };

  const handleShare = async () => {
    const eventUrl = `${window.location.origin}/events/${event.id}`;
    const shareData = {
      title: event.title,
      text: `Join me at ${event.title} on ${format(new Date(event.date), 'MMMM d, yyyy')} at ${event.time}`,
      url: eventUrl,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${shareData.text} - ${eventUrl}`);
        toast({
          title: "Link Copied",
          description: "Event link copied to clipboard.",
        });
      }
    } else {
      await navigator.clipboard.writeText(`${shareData.text} - ${eventUrl}`);
      toast({
        title: "Link Copied",
        description: "Event link copied to clipboard.",
      });
    }
  };

  const categoryStyle = event.category ? categoryColors[event.category.id as keyof typeof categoryColors] : categoryColors.worship;
  const eventDate = new Date(event.date);
  const isUpcoming = eventDate >= new Date();
  const capacityPercentage = event.capacity ? (event.rsvps / event.capacity) * 100 : 0;
  const isNearCapacity = capacityPercentage > 80;

  // Compact variant for smaller spaces
  if (variant === 'compact') {
    return (
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <Badge className={categoryStyle.badge}>
              <span className="mr-1">{event.category?.icon}</span>
              {event.category?.name}
            </Badge>
            <span className="text-sm text-muted-foreground font-medium">
              {format(eventDate, 'MMM d')}
            </span>
          </div>
          
          <h3 className="font-semibold text-lg mb-2 group-hover:text-accent transition-colors leading-tight">
            {event.title}
          </h3>
          
          <div className="space-y-2 text-sm text-muted-foreground mb-4">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>{event.time}</span>
              {timeUntilEvent && (
                <Badge variant="outline" className="ml-2 text-xs">
                  {timeUntilEvent}
                </Badge>
              )}
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-1" />
              <span>{event.rsvps} attending</span>
              {event.capacity && (
                <span className="text-muted-foreground">
                  {' '}of {event.capacity}
                </span>
              )}
            </div>
            
            <Button 
              size="sm" 
              onClick={handleRsvpClick}
              className={userRsvpName ? "bg-emerald-500 hover:bg-emerald-600" : "bg-accent hover:bg-accent-600"}
            >
              {userRsvpName ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  RSVPed
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-1" />
                  RSVP
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Featured variant for homepage or special placement
  if (variant === 'featured') {
    return (
      <Card className={`group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 ${categoryStyle.border} ${categoryStyle.bg}`}>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <Badge className={`${categoryStyle.badge} text-sm`}>
              <span className="mr-2">{event.category?.icon}</span>
              {event.category?.name}
            </Badge>
            {timeUntilEvent && (
              <Badge variant="secondary" className="bg-accent/10 text-accent-foreground">
                <Timer className="h-3 w-3 mr-1" />
                {timeUntilEvent}
              </Badge>
            )}
          </div>
          
          <h3 className="text-2xl font-lora font-bold text-primary-foreground group-hover:text-accent transition-colors leading-tight">
            {event.title}
          </h3>
        </CardHeader>
        
        <CardContent className="pb-6">
          <p className="text-muted-foreground mb-6 leading-relaxed">
            {event.summary || event.description}
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-sm">
              <CalendarDays className="h-5 w-5 mr-3 text-accent" />
              <div>
                <p className="font-medium">{format(eventDate, 'EEEE, MMMM d')}</p>
                <p className="text-muted-foreground">{event.time}</p>
              </div>
            </div>
            
            <div className="flex items-center text-sm">
              <MapPin className="h-5 w-5 mr-3 text-accent" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-muted-foreground">{event.location}</p>
              </div>
            </div>
          </div>
          
          {/* Capacity indicator */}
          {event.capacity && (
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Attendance</span>
                <span className={`font-medium ${isNearCapacity ? 'text-orange-600' : 'text-emerald-600'}`}>
                  {event.rsvps} / {event.capacity}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isNearCapacity ? 'bg-orange-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleRsvpClick}
            className={`flex-1 ${userRsvpName ? "bg-emerald-500 hover:bg-emerald-600" : "bg-accent hover:bg-accent-600"}`}
          >
            {userRsvpName ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                You're Going!
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                RSVP Now
              </>
            )}
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleAddToCalendar} disabled={isAddingToCalendar}>
              {isAddingToCalendar ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Calendar className="h-4 w-4" />
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-3">
          <Badge className={categoryStyle.badge}>
            <span className="mr-1">{event.category?.icon}</span>
            {event.category?.name}
          </Badge>
          <div className="flex items-center gap-2">
            {timeUntilEvent && (
              <Badge variant="outline" className="text-xs">
                {timeUntilEvent}
              </Badge>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleAddToCalendar}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Add to Calendar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Event
                </DropdownMenuItem>
                {event.attendees && event.attendees.length > 0 && (
                  <DropdownMenuItem onClick={() => setIsAttendeesDialogOpen(true)}>
                    <Users className="h-4 w-4 mr-2" />
                    View Attendees ({event.attendees.length})
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <h3 className="text-xl font-lora font-semibold text-primary-foreground group-hover:text-accent transition-colors leading-tight">
          {event.title}
        </h3>
      </CardHeader>
      
      <CardContent className="pb-6">
        <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3">
          {event.description}
        </p>
        
        <div className="space-y-3 text-sm">
          <div className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-3 text-accent" />
            <span className="font-medium">{format(eventDate, 'EEEE, MMMM d, yyyy')}</span>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-3 text-accent" />
            <span>{event.time}</span>
          </div>
          
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-3 text-accent" />
            <span>{event.location}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-3 text-accent" />
              <span>{event.rsvps} attending</span>
              {event.capacity && (
                <span className="text-muted-foreground ml-1">
                  of {event.capacity}
                </span>
              )}
            </div>
            
            {event.capacity && isNearCapacity && (
              <Badge variant="outline" className="text-orange-600 border-orange-200">
                Nearly Full
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-3">
        <Button 
          onClick={handleRsvpClick}
          className={`flex-1 ${userRsvpName ? "bg-emerald-500 hover:bg-emerald-600" : "bg-accent hover:bg-accent-600"}`}
        >
          {userRsvpName ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              RSVPed
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4 mr-2" />
              RSVP
            </>
          )}
        </Button>
        
        <Button variant="outline" onClick={handleAddToCalendar} disabled={isAddingToCalendar}>
          {isAddingToCalendar ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Calendar className="h-4 w-4" />
          )}
        </Button>
      </CardFooter>

      {/* RSVP Dialog */}
      <Dialog open={isRsvpDialogOpen} onOpenChange={setIsRsvpDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>RSVP for {event.title}</DialogTitle>
            <DialogDescription>
              Please enter your name to reserve your spot for this event.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="rsvp-name">Your Name</Label>
              <Input
                id="rsvp-name"
                value={rsvpName}
                onChange={(e) => setRsvpName(e.target.value)}
                placeholder="Enter your full name"
                onKeyPress={(e) => e.key === 'Enter' && handleSubmitRsvp()}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRsvpDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitRsvp} className="bg-accent hover:bg-accent-600">
              Confirm RSVP
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Attendees Dialog */}
      <Dialog open={isAttendeesDialogOpen} onOpenChange={setIsAttendeesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Event Attendees</DialogTitle>
            <DialogDescription>
              People who have RSVPed for {event.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {event.attendees && event.attendees.length > 0 ? (
              event.attendees.map((attendee) => (
                <div key={attendee.id} className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={attendee.avatarUrl} />
                    <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{attendee.name}</span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No attendees yet. Be the first to RSVP!</p>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAttendeesDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
} 