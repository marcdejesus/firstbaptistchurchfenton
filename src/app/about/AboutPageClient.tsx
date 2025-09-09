"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BookOpen, Landmark, Users, ArrowRight } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';

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

export default function AboutPageClient() {
  return (
    <PageLayout
      title="About Us"
      subtitle="At First Baptist Church of Fenton, our mission is simple: to glorify God by making disciples who love deeply, live authentically, and lead others to Jesus. We are a gospel-centered church committed to Scripture, to each other, and to our calling—both locally and globally."
    >
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
        {aboutSections.map((section) => (
          <Card key={section.title} className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
            <CardHeader className="items-center">
              <div className="p-4 bg-primary/10 rounded-full inline-block">
                  <section.icon className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="mt-4 font-heading">{section.title}</CardTitle>
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

      <div className="mt-24 text-center bg-background-secondary p-12 rounded-lg">
        <h3 className="text-3xl font-heading font-bold">Have Questions?</h3>
        <p className="mt-3 max-w-2xl mx-auto text-muted-foreground">
          We would love to answer any questions you have about our church, our faith, or how you can get connected.
        </p>
        <div className="mt-6">
          <Button size="lg" asChild>
              <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
