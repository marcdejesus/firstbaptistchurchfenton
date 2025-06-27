"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Facebook, Youtube, ArrowRight, Play, MapPin } from "lucide-react";
import { Event } from "../types";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React from "react";

interface WelcomeCardProps {
  todaysHours: string;
  nextEvent: Event | null;
}

export function WelcomeCard({ todaysHours, nextEvent }: WelcomeCardProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-8 md:p-12 my-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>
      
      <div className="relative">
        {/* Header Section */}
        <div className="text-center mb-8">
          <Badge variant="secondary" className="text-accent-foreground bg-accent/10 mb-4">
            Welcome Home
          </Badge>
          <h1 className="text-4xl md:text-5xl font-lora font-bold text-gray-900 mb-4" style={{ color: '#111827' }}>
            Welcome to FBC Fenton
          </h1>
          <p className="text-xl text-gray-700 mb-6 max-w-2xl mx-auto" style={{ color: '#374151' }}>
            Growing in Faith, Sharing God's Love
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Column - Content & Actions */}
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed" style={{ color: '#374151' }}>
              We're a community dedicated to growing in faith and sharing God's love. 
              Whether you're exploring faith for the first time or looking for a church home, 
              you're welcome here.
            </p>
            
            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-accent hover:bg-accent-600 text-accent-foreground" asChild>
                <Link href="/visit">
                  Plan Your Visit
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-primary/20 hover:bg-primary/10" asChild>
                <Link href="/sermons/live">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Online
                </Link>
              </Button>
            </div>

            {/* Info Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Next Event Card */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-4 text-center">
                  <Calendar className="w-8 h-8 mb-2 mx-auto text-accent" />
                  <h3 className="font-semibold mb-1">Next Event</h3>
                  {nextEvent ? (
                    <>
                      <p className="text-sm font-medium text-gray-900" style={{ color: '#111827' }}>{nextEvent.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(nextEvent.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">Check back soon</p>
                  )}
                </CardContent>
              </Card>

              {/* Service Times Card */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-4 text-center">
                  <Clock className="w-8 h-8 mb-2 mx-auto text-accent" />
                  <h3 className="font-semibold mb-1">Service Times</h3>
                  <p className="text-sm">Sunday: 10:30 AM</p>
                  <p className="text-sm">Wednesday: 7:00 PM</p>
                </CardContent>
              </Card>
            </div>

            {/* Social Media & Contact */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-2">
                  <a
                    href="https://www.facebook.com/FBCFentonMO"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                  >
                    <Facebook className="w-5 h-5 text-blue-600" />
                  </a>
                  <a
                    href="https://www.youtube.com/@fbcfentonmo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                  >
                    <Youtube className="w-5 h-5 text-red-600" />
                  </a>
                </div>
                <div className="text-sm text-gray-600" style={{ color: '#4b5563' }}>
                  <p>Follow us for updates</p>
                </div>
              </div>
              
              <div className="text-right text-sm text-gray-600" style={{ color: '#4b5563' }}>
                <p className="font-medium">Office Hours</p>
                <p>{todaysHours}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Image Carousel */}
          <div className="relative">
            <Carousel plugins={[plugin.current]} setApi={setApi} className="w-full">
              <CarouselContent>
                <CarouselItem>
                  <div className="relative h-80 md:h-96 rounded-xl overflow-hidden shadow-2xl">
                    <Image
                      src="/front-art.png"
                      alt="Front of First Baptist Church of Fenton"
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="relative h-80 md:h-96 rounded-xl overflow-hidden shadow-2xl">
                    <Image
                      src="/outside-art.png"
                      alt="Outside of First Baptist Church of Fenton"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                </CarouselItem>
              </CarouselContent>
            </Carousel>
            
            {/* Carousel Indicators */}
            <div className="flex justify-center mt-4 space-x-2">
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={`h-2 w-2 rounded-full transition-all duration-200 ${
                    index === current - 1 
                      ? "bg-accent w-6" 
                      : "bg-white/60 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
            
            {/* Location Badge */}
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-accent" />
                <div>
                  <p className="font-medium">860 N Leroy St</p>
                  <p className="text-muted-foreground">Fenton, MI 48430</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 pt-8 border-t border-gray-900/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-accent">50+</p>
              <p className="text-sm text-gray-600" style={{ color: '#4b5563' }}>Years Serving</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">200+</p>
              <p className="text-sm text-gray-600" style={{ color: '#4b5563' }}>Church Family</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">15+</p>
              <p className="text-sm text-gray-600" style={{ color: '#4b5563' }}>Ministries</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">100%</p>
              <p className="text-sm text-gray-600" style={{ color: '#4b5563' }}>Welcome</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 