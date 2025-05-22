
"use client";

import React, { useState, useEffect } from 'react';
import { testimonialsData } from '@/data/testimonials';
import { TestimonialCard } from './TestimonialCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CYCLE_INTERVAL = 7000; // 7 seconds

export function TestimoniesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, CYCLE_INTERVAL);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonialsData.length);
      setIsTransitioning(false);
    }, 300); // Corresponds to transition duration
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonialsData.length) % testimonialsData.length);
      setIsTransitioning(false);
    }, 300);
  };

  if (!testimonialsData || testimonialsData.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-primary/5">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-lora font-semibold text-primary-foreground text-center mb-8">
          Voices of Our Community
        </h2>
        <div className="relative flex items-center justify-center">
           <Button 
            variant="outline" 
            size="icon" 
            className="absolute left-0 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 bg-card hover:bg-card/80 text-accent hover:text-accent/90 hidden md:flex"
            onClick={handlePrev}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div className="w-full max-w-md h-[280px] relative overflow-hidden"> {/* Fixed height for consistent layout */}
            <div
              className={`transition-opacity duration-300 ease-in-out ${
                isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <TestimonialCard testimonial={testimonialsData[currentIndex]} />
            </div>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute right-0 translate-x-1/2 top-1/2 -translate-y-1/2 z-10 bg-card hover:bg-card/80 text-accent hover:text-accent/90 hidden md:flex"
            onClick={handleNext}
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
        <div className="flex justify-center mt-6 space-x-1 md:hidden">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-card hover:bg-card/80 text-accent hover:text-accent/90"
              onClick={handlePrev}
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Prev
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-card hover:bg-card/80 text-accent hover:text-accent/90"
              onClick={handleNext}
            >
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
        </div>
      </div>
    </section>
  );
}
