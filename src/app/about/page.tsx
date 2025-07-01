"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BookOpen, Landmark, Users, ArrowRight } from 'lucide-react';

const aboutSections = [
  {
    icon: BookOpen,
    title: 'Our Beliefs',
    description: 'Explore the core doctrines and theological foundations that guide our church and our faith.',
    link: '/about/beliefs',
  },
  {
    icon: Landmark,
    title: 'Our History',
    description: 'Discover the story of how our church began, how it has grown, and the vision that carries us forward.',
    link: '/about/history',
  },
  {
    icon: Users,
    title: 'Our Staff',
    description: 'Meet the pastors, elders, and staff who lead our ministries and serve our church family.',
    link: '/about/staff',
  },
];

export default function AboutUsPage() {
  return (
    <div className="bg-scheme-3-background">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-desktop-heading1 font-heading font-bold tracking-tight text-scheme-3-text">About Us</h1>
          <p className="mt-4 text-desktop-textLarge text-scheme-3-text opacity-80 max-w-3xl mx-auto font-body">
            At First Baptist Church of Fenton, our mission is simple: to glorify God by making disciples who love deeply, live authentically, and lead others to Jesus. We are a gospel-centered church committed to Scripture, to each other, and to our calling—both locally and globally.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          {aboutSections.map((section) => (
            <Card key={section.title} className="text-center hover:shadow-xl transition-shadow flex flex-col">
              <CardHeader className="items-center">
                <div className="p-4 bg-accent/10 rounded-full inline-block">
                    <section.icon className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="mt-4">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                <CardDescription className="mb-6">{section.description}</CardDescription>
                <Button asChild variant="secondary">
                  <Link href={section.link}>
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center bg-scheme-1-background p-8 rounded-lg shadow-inner border border-scheme-1-border">
          <h3 className="text-desktop-heading3 font-heading font-bold text-scheme-1-text">Have Questions?</h3>
          <p className="mt-3 max-w-2xl mx-auto text-desktop-textMedium text-scheme-1-text opacity-80 font-body">
            We would love to answer any questions you have about our church, our faith, or how you can get connected.
          </p>
          <div className="mt-6">
            <Button size="lg" asChild className="bg-primary-orange text-white hover:bg-primary-orange-dark">
                <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 