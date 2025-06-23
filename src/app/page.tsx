"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import Image from "next/image";
import { MapPin, Phone, Mail, Clock, Calendar, Users, Heart, ArrowRight, Play, Coffee, BookOpen } from "lucide-react";
import { TestimoniesCarousel } from "@/components/home/TestimoniesCarousel";
import React from "react";
import { HeroCarousel } from "@/components/home/HeroCarousel";

export default function Home() {
  const mapUrl = "https://www.google.com/maps/search/?api=1&query=860%20N%20Leroy%20St%2C%20Fenton%2C%20MI%2048430";

  // This would typically come from your API
  const upcomingEvents = [
    {
      id: '1',
      title: 'Sunday Worship Service',
      date: '2025-01-12',
      time: '10:30 AM',
      category: 'Worship',
      rsvps: 45
    },
    {
      id: '2',
      title: 'Youth Group Lock-In',
      date: '2025-01-15',
      time: '8:00 PM',
      category: 'Youth',
      rsvps: 22
    },
    {
      id: '3',
      title: 'Community Service Day',
      date: '2025-01-18',
      time: '9:00 AM',
      category: 'Outreach',
      rsvps: 18
    }
  ];

  const quickLinks = [
    { href: '/sermons', label: 'Sermons' },
    { href: '/events', label: 'Events' },
    { href: '/ministries', label: 'Ministries' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/donate', label: 'Donate' },
  ];

  return (
    <div className="space-y-16">
      {/* --- New Hero Section --- */}
      <section className="bg-primary/20">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[600px]">
            {/* Left Content Box */}
            <div className="bg-background p-8 md:p-12 shadow-xl relative z-10">
              <div className="relative">
                <h1 className="text-4xl md:text-5xl font-bold font-lora text-primary-foreground mb-4 leading-tight">
                  WELCOME TO <br/> FIRST BAPTIST
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  Your journey of faith is important. We provide a community to grow and belong.
                </p>
                <Link href="/contact#new-here">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 px-8">
                    PLAN YOUR VISIT
                  </Button>
                </Link>
              </div>
            </div>
            {/* Right Carousel */}
            <div className="relative h-full w-full">
              <HeroCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement - Enhanced */}
      <section className="text-center p-8 md:p-12 bg-primary/10 rounded-2xl shadow-md">
        <h2 className="text-3xl md:text-4xl font-lora font-bold text-primary-foreground mb-6">Our Mission</h2>
        <p className="text-xl text-primary-foreground/80 max-w-4xl mx-auto leading-relaxed">
          To lead people into a growing relationship with Jesus Christ by creating environments where people are encouraged and equipped to pursue intimacy with God, community with insiders, and influence with outsiders.
        </p>
      </section>

      {/* What's Happening Section - NEW */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-lora font-bold text-primary-foreground mb-3">
            What's Happening
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay connected with upcoming events and activities in our church community
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <Card key={event.id} className="shadow-md hover:shadow-lg transition-shadow duration-300 group">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {event.category}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-accent transition-colors">
                  {event.title}
                </h3>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{event.time}</span>
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {event.rsvps}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Link href="/events">
            <Button variant="outline" size="lg" className="px-8">
              View All Events
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonies Section */}
      <TestimoniesCarousel />

      {/* Core Information Grid - Enhanced */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
          <CardHeader>
            <CardTitle className="flex items-center font-lora text-2xl text-card-foreground">
              <Clock className="mr-3 h-7 w-7 text-accent" />
              Service Times
            </CardTitle>
          </CardHeader>
          <CardContent className="text-card-foreground/80 space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-muted">
              <span><strong>Sunday Morning Worship</strong></span>
              <span className="font-semibold text-accent">10:30 AM</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-muted">
              <span><strong>Wednesday Bible Study</strong></span>
              <span className="font-semibold text-accent">7:00 PM</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span><strong>Special Services</strong></span>
              <span className="text-muted-foreground">As announced</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
          <CardHeader>
            <CardTitle className="flex items-center font-lora text-2xl text-card-foreground">
              <MapPin className="mr-3 h-7 w-7 text-accent" />
              Our Location
            </CardTitle>
          </CardHeader>
          <CardContent className="text-card-foreground/80 space-y-4">
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View map of First Baptist Church Fenton (opens in new tab)"
              className="group block"
            >
              <div className="h-48 w-full rounded-md overflow-hidden group-hover:opacity-80 transition-opacity">
                <Image 
                  src="/mappin.png"
                  alt="Map showing location of First Baptist Church Fenton"
                  width={600}
                  height={300}
                  className="object-cover w-full h-full"
                />
              </div>
            </a>
            <div className="text-center">
              <p className="font-semibold">First Baptist Church Fenton</p>
              <p className="text-muted-foreground">860 N Leroy St.</p>
              <p className="text-muted-foreground">Fenton, MI 48430</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3"
                onClick={() => window.open(mapUrl, '_blank')}
              >
                Get Directions
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center font-lora text-2xl text-card-foreground">
              <Phone className="mr-3 h-7 w-7 text-accent" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent className="text-card-foreground/80 space-y-4" id="contact-us-section-id">
            <div className="space-y-3">
              <p className="flex items-center">
                <Mail className="mr-3 h-5 w-5 text-accent" /> 
                <span>Pastorjbell206@gmail.com</span>
              </p>
              <p className="flex items-center">
                <Phone className="mr-3 h-5 w-5 text-accent" /> 
                <span>(810) 629-9427</span>
              </p>
            </div>
            <CardDescription className="text-sm">
              We'd love to hear from you. Reach out with any questions or prayer requests.
            </CardDescription>
            <Link href="/contact">
              <Button className="w-full mt-4">
                <Mail className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* New Here Section - NEW */}
      <section id="new-here" className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-2xl p-8 md:p-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-lora font-bold text-primary-foreground mb-6">
            New Here? We'd Love to Meet You!
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Whether you're exploring faith for the first time or looking for a new church home, 
            you're welcome here. Come as you are - we're excited to meet you!
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coffee className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Sunday Welcome</h3>
              <p className="text-sm text-muted-foreground">
                Grab coffee and donuts before service. We'll help you find a seat and answer any questions.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Connect Groups</h3>
              <p className="text-sm text-muted-foreground">
                Small groups that meet throughout the week for fellowship, study, and friendship.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Get Involved</h3>
              <p className="text-sm text-muted-foreground">
                Discover ways to serve and use your gifts to make a difference in our community.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 px-8">
                Contact Us
              </Button>
            </Link>
            <Link href="/ministries">
              <Button variant="outline" size="lg" className="px-8">
                Learn About Ministries
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
