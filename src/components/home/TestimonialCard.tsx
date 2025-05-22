
"use client";

import Image from 'next/image';
import type { Testimonial } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto bg-card shadow-lg h-full flex flex-col">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <Avatar className="h-12 w-12">
          <AvatarImage src={testimonial.avatarUrl} alt={testimonial.name} data-ai-hint={testimonial.aiHint || "person"} />
          <AvatarFallback>{testimonial.name.substring(0, 1)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-card-foreground">{testimonial.name}</p>
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{testimonial.date}</p>
        </div>
      </CardHeader>
      <CardContent className="pt-2 flex-grow">
        <p className="text-sm text-card-foreground/90 leading-relaxed">
          {testimonial.content}
        </p>
      </CardContent>
    </Card>
  );
}
