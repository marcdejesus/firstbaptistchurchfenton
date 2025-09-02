"use client";

import React from 'react';
import Image from 'next/image';
import { Users, BookOpen, Heart, GraduationCap } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useMinistries } from '@/hooks/useMinistries';

// Icon mapping for different ministry types
const getIconForMinistry = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('kids') || lowerName.includes('children')) return Heart;
  if (lowerName.includes('student') || lowerName.includes('youth')) return GraduationCap;
  if (lowerName.includes('equip') || lowerName.includes('class')) return BookOpen;
  if (lowerName.includes('group') || lowerName.includes('community')) return Users;
  return Users; // Default icon
};

// Generate highlights based on ministry data
const generateHighlights = (ministry: any) => {
  const highlights = [];
  
  if (ministry.targetAudience) {
    highlights.push(`Serves: ${ministry.targetAudience}`);
  }
  
  if (ministry.meetingTime) {
    highlights.push(`Meeting Time: ${ministry.meetingTime}`);
  }
  
  if (ministry.contactEmail) {
    highlights.push(`Contact: ${ministry.contactEmail}`);
  }
  
  // Add some generic highlights based on ministry type
  const lowerName = ministry.name.toLowerCase();
  if (lowerName.includes('kids') || lowerName.includes('children')) {
    highlights.push("Age-appropriate activities and learning");
    highlights.push("Safe and nurturing environment");
  } else if (lowerName.includes('student') || lowerName.includes('youth')) {
    highlights.push("Peer mentorship and discipleship");
    highlights.push("Fun and engaging activities");
  } else if (lowerName.includes('equip') || lowerName.includes('class')) {
    highlights.push("Structured learning programs");
    highlights.push("Biblical and practical topics");
  } else if (lowerName.includes('group') || lowerName.includes('community')) {
    highlights.push("Close-knit community");
    highlights.push("Mutual support and accountability");
  }
  
  return highlights;
};

const MinistriesPage: React.FC = () => {
  const { ministries, loading, error } = useMinistries();

  if (loading) {
    return (
      <PageLayout
        title="Our Ministries"
        subtitle="At First Baptist Church, we're committed to helping you grow in your faith journey through meaningful connections and purposeful community involvement."
      >
        <div className="space-y-20">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading ministries...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout
        title="Our Ministries"
        subtitle="At First Baptist Church, we're committed to helping you grow in your faith journey through meaningful connections and purposeful community involvement."
      >
        <div className="space-y-20">
          <div className="text-center py-20">
            <p className="text-destructive text-lg">Error loading ministries: {error}</p>
            <p className="mt-2 text-muted-foreground">Please try refreshing the page.</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!ministries || ministries.length === 0) {
    return (
      <PageLayout
        title="Our Ministries"
        subtitle="At First Baptist Church, we're committed to helping you grow in your faith journey through meaningful connections and purposeful community involvement."
      >
        <div className="space-y-20">
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No ministries available at the moment.</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Our Ministries"
      subtitle="At First Baptist Church, we're committed to helping you grow in your faith journey through meaningful connections and purposeful community involvement."
    >
      <div className="space-y-20">
        {ministries.map((ministry, index) => {
          const IconComponent = getIconForMinistry(ministry.name);
          const isEven = index % 2 === 0;
          const highlights = generateHighlights(ministry);

          return (
            <div key={ministry.id} className="relative">
              <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}>

                {/* Image Section */}
                {ministry.imageUrl ? (
                  <div className="w-full lg:w-1/2">
                    <div className="relative h-[560px] w-full rounded-lg overflow-hidden">
                      <Image
                        src={ministry.imageUrl}
                        alt={ministry.name}
                        fill
                        className="object-cover"
                        priority={index === 0}
                      />
                    </div>
                  </div>
                ) : (
                  // Icon placeholder for ministries without images
                  <div className="w-full lg:w-1/2 flex justify-center">
                    <div className="bg-primary/10 border-2 border-primary/20 rounded-full p-16">
                      <IconComponent className="h-32 w-32 text-primary" />
                    </div>
                  </div>
                )}

                {/* Content Section */}
                <div className="w-full lg:w-1/2 space-y-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <IconComponent className="h-8 w-8 text-primary" />
                    <h2 className="text-3xl font-heading font-bold">
                      {ministry.name}
                    </h2>
                  </div>

                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {ministry.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold">
                      What We Offer:
                    </h3>
                    <ul className="space-y-2">
                      {highlights.map((highlight, highlightIndex) => (
                        <li key={highlightIndex} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Divider between sections (except last one) */}
              {index < ministries.length - 1 && (
                <div className="mt-20 border-t border-primary/20"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Call to Action - Design System Enhanced */}
      <div className="mt-20 text-center py-16 bg-background-secondary rounded-lg border border-border-light">
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-text-primary mb-4">
          Ready to Get Involved?
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          We'd love to help you find the perfect ministry to connect, grow, and serve.
          Contact us today to learn more about how you can get involved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
                <Link href="/contact">Contact Us</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
                <Link href="/events">View Upcoming Events</Link>
            </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default MinistriesPage;