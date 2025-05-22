"use client";

import type { Event } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, Clock, Users, CheckCircle, PlusCircle } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';

interface EventCardProps {
  event: Event;
  onRsvp: (eventId: string) => void;
}

export function EventCard({ event, onRsvp }: EventCardProps) {
  const { user } = useUser();
  const { toast } = useToast();

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

  return (
    <Card className="flex flex-col h-full bg-card shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="font-lora text-2xl text-card-foreground">{event.title}</CardTitle>
        <CardDescription className="text-sm text-accent flex items-center pt-1">
          <CalendarDays className="mr-2 h-4 w-4" /> {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          <Clock className="ml-3 mr-2 h-4 w-4" /> {event.time}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex items-start text-card-foreground/80">
          <MapPin className="mr-2 h-5 w-5 mt-1 shrink-0 text-accent/80" />
          <span>{event.location}</span>
        </div>
        <p className="text-card-foreground/90 text-sm line-clamp-3">{event.description}</p>
        {event.summary && (
          <div className="mt-2 p-3 bg-primary/10 rounded-md border border-primary/20">
            <h4 className="text-xs font-semibold text-primary-foreground mb-1">AI Summary:</h4>
            <p className="text-xs text-primary-foreground/80">{event.summary}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4 border-t border-border">
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="mr-2 h-5 w-5 text-accent" />
          {event.rsvps} RSVP{event.rsvps !== 1 ? 's' : ''}
        </div>
        <Button 
          onClick={handleRsvpClick} 
          variant={event.isUserRsvped ? "outline" : "default"}
          size="sm"
          className={event.isUserRsvped ? "border-accent text-accent hover:bg-accent/10" : "bg-accent text-accent-foreground hover:bg-accent/90"}
          disabled={!user}
          aria-label={event.isUserRsvped ? `Cancel RSVP for ${event.title}` : `RSVP for ${event.title}`}
        >
          {event.isUserRsvped ? <CheckCircle className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
          {event.isUserRsvped ? 'RSVPed' : 'RSVP'}
        </Button>
      </CardFooter>
    </Card>
  );
}
