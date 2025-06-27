"use client";

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Event as EventType, GenerateEventSummaryInput } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { generateEventSummaryAction } from '@/app/events/actions'; // Server Action
import { Loader2 } from 'lucide-react';

const eventFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  time: z.string().min(1, 'Time is required'),
  location: z.string().min(3, 'Location must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

interface CreateEventFormProps {
  onEventCreated: (event: EventType) => void;
}

export function CreateEventForm({ onEventCreated }: CreateEventFormProps) {
  const [generatedSummary, setGeneratedSummary] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
  });

  const eventDetailsForSummary = watch(['title', 'date', 'time', 'location', 'description']);

  const handleGenerateSummary = async () => {
    const [title, date, time, location, description] = eventDetailsForSummary;
    if (!title || !date || !time || !location || !description) {
      toast({ title: "Missing Details", description: "Please fill all event fields before generating summary.", variant: "destructive" });
      return;
    }

    setIsGeneratingSummary(true);
    setGeneratedSummary(null);
    try {
      const input: GenerateEventSummaryInput = { title, date, time, location, description };
      const result = await generateEventSummaryAction(input);
      if ('summary' in result) {
        setGeneratedSummary(result.summary);
        toast({ title: "Summary Generated!", description: "AI summary created successfully." });
      } else {
        toast({ title: "Error Generating Summary", description: result.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to connect to AI service.", variant: "destructive" });
      console.error("Summary generation error:", error);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const onSubmit: SubmitHandler<EventFormValues> = async (data) => {
    setIsSubmitting(true);
    const newEvent: EventType = {
      id: new Date().toISOString(), // Simple ID generation
      ...data,
      summary: generatedSummary || undefined,
      rsvps: 0,
      isUserRsvped: false,
    };
    onEventCreated(newEvent);
    toast({ title: "Event Created!", description: `"${data.title}" has been added.` });
    setIsSubmitting(false);
    // Optionally reset form here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Event Title</Label>
          <Input id="title" {...register('title')} className="mt-1 bg-input" />
          {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <Label htmlFor="date">Date (YYYY-MM-DD)</Label>
          <Input id="date" type="date" {...register('date')} className="mt-1 bg-input" />
          {errors.date && <p className="text-sm text-destructive mt-1">{errors.date.message}</p>}
        </div>
        <div>
          <Label htmlFor="time">Time</Label>
          <Input id="time" type="time" {...register('time')} className="mt-1 bg-input" />
          {errors.time && <p className="text-sm text-destructive mt-1">{errors.time.message}</p>}
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" {...register('location')} className="mt-1 bg-input" />
          {errors.location && <p className="text-sm text-destructive mt-1">{errors.location.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register('description')} rows={4} className="mt-1 bg-input" />
        {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <Button type="button" onClick={handleGenerateSummary} disabled={isGeneratingSummary || isSubmitting} variant="outline" className="w-full">
          {isGeneratingSummary ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Generate AI Summary
        </Button>
        {generatedSummary && (
          <div className="p-3 bg-primary/10 rounded-md border border-primary/20">
            <h4 className="text-xs font-semibold mb-1">Generated Summary:</h4>
            <p className="text-xs text-muted-foreground">{generatedSummary}</p>
          </div>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting || isGeneratingSummary} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
         {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Create Event
      </Button>
    </form>
  );
}
