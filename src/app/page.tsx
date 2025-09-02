"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from 'next/link';
import Image from "next/image";
import { ArrowRight, Star, Church, Users, HeartHandshake, Clock, MapPin, Calendar } from "lucide-react";
import { useNextEvent } from "@/hooks/useNextEvent";
import { HeroSlideshowBackground } from "@/components/home/HeroSlideshowBackground";
import { useHomepageData } from "@/hooks/useHomepageData";

// A more focused feature card
const Feature = ({ icon: Icon, title, description, href, cta }: {
  icon: React.ComponentType<{className?: string}>,
  title: string,
  description: string,
  href: string,
  cta: string
}) => (
  <div className="flex flex-col items-center gap-6 text-center">
    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10">
      <Icon className="w-8 h-8 text-primary" />
    </div>
    <div className="flex flex-col gap-4">
      <h3 className="text-2xl font-heading font-bold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
    <Link href={href} className="flex items-center gap-2 group text-primary font-medium hover:underline">
      <span>{cta}</span>
      <ArrowRight className="w-5 h-5" />
    </Link>
  </div>
);

export default function Home() {
  const { nextEvent, isLoading } = useNextEvent();
  const { data: homepageData, isLoading: homepageLoading } = useHomepageData();
  
  return (
    <main className="flex flex-col">
      
      {/* Hero Section - Centered with background slideshow */}
      <section className="relative">
        {homepageLoading ? (
          // Loading state for slideshow
          <div className="absolute inset-0 -z-10 bg-gray-800">
            <div className="absolute inset-0 bg-black/55" />
          </div>
        ) : (
          <HeroSlideshowBackground 
            slideshowItems={homepageData.slideshow} 
          />
        )}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl sm:text-5xl font-heading font-bold leading-tight text-white">
              No matter where you've been, you're welcome here.
            </h1>
            <p className="mt-6 text-lg text-white/90 leading-relaxed">
              Come as you are and discover the hope, truth, and grace of Jesus Christ. We are a community of real people, with real struggles, following a real Savior.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/visit">Plan Your Visit</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild>
                <Link href="/sermons">Watch a Sermon</Link>
              </Button>
            </div>
          </div>
        </div>
        {/* Slim info bar */}
        <div className="relative border-t border-white/15 bg-black/40 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-white/90 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>Sunday Service: 10:30 AM</span>
              </div>
              <span className="hidden sm:block text-white/30">|</span>
              <Link href="https://maps.google.com/?q=860+N.+Leroy+St.,+Fenton,+MI+48430" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white">
                <MapPin className="h-4 w-4 text-primary" />
                <span>860 N. Leroy St., Fenton, MI</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Us / What to Expect Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-16">
          <div className="text-center max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold">A Place to Belong, A Space to Grow</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We focus on three things: loving God, growing together in community, and serving our world.
            </p>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-12">
            <Feature 
              icon={Church}
              title="Gospel-Centered Worship"
              description="Join us on Sundays for passionate worship and practical, Bible-based teaching that applies to your life."
              href="/visit/what-to-expect"
              cta="What to Expect"
            />
            <Feature 
              icon={Users}
              title="Authentic Community"
              description="Life is better together. We have small groups for all ages and stages of life to help you connect."
              href="/next-steps"
              cta="Find a Group"
            />
            <Feature 
              icon={HeartHandshake}
              title="Meaningful Service"
              description="Use your gifts to make a difference in our church, our city, and around the world."
              href="/volunteer"
              cta="Serve With Us"
            />
          </div>
        </div>
      </section>
      
      {/* Latest Sermon Section */}
      {homepageData.currentSeries && (
        <section className="bg-background-secondary py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col items-start gap-6">
                <span className="text-primary font-semibold">CURRENT SERIES</span>
                <h2 className="text-3xl sm:text-4xl font-heading font-bold">
                  {homepageData.currentSeries.title}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {homepageData.currentSeries.description}
                </p>
                <Button size="lg" asChild>
                  <Link href="/sermons">Watch Now</Link>
                </Button>
              </div>
              <div className="mt-8 md:mt-0">
                <Link href="/sermons" className="block group">
                  <Image 
                    src={homepageData.currentSeries.imageUrl || "/sermon.png"} 
                    alt={homepageData.currentSeries.title}
                    width={600} 
                    height={338} 
                    className="rounded-lg object-cover w-full h-auto shadow-lg group-hover:shadow-xl transition-shadow"
                  />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Final CTA Section */}
      <section className="bg-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h2 className="text-3xl font-heading font-bold text-white">Ready to Take the Next Step?</h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto text-white/80">
                The best way to get to know us is to join us. We can't wait to meet you.
            </p>
            <div className="mt-8 flex justify-center gap-4">
                <Button size="lg" variant="secondary" asChild>
                    <Link href="/visit">Plan Your Visit</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10" asChild>
                    <Link href="/about">More About Us</Link>
                </Button>
            </div>
        </div>
      </section>
    </main>
  );
}
