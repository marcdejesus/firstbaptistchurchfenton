"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, Mail, Users, Calendar } from "lucide-react";
import Link from "next/link";

export default function VisitPage() {
  return (
    <div className="bg-background">
      <header className="bg-primary text-primary-foreground py-20 text-center">
        <div className="container mx-auto">
          <h1 className="text-5xl font-lora font-bold">Visit Us</h1>
          <p className="mt-4 text-xl text-primary-foreground/80">We look forward to welcoming you!</p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-16 items-center mb-16">
          {/* Location & Service Times */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-lora font-bold mb-4">Our Location</h2>
              <div className="flex items-start space-x-4">
                <MapPin className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-lg">First Baptist Church of Fenton</p>
                  <p className="text-muted-foreground">860 N Leroy St, Fenton, MI 48430</p>
                  <Button variant="link" className="px-0" asChild>
                    <a href="https://www.google.com/maps/dir/?api=1&destination=First+Baptist+Church+of+Fenton" target="_blank" rel="noopener noreferrer">
                      View on Google Maps
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-lora font-bold mb-4">Service Times</h2>
              <div className="flex items-start space-x-4">
                <Clock className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-lg">Sunday Worship</p>
                  <p className="text-muted-foreground">10:30 AM</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Map */}
          <div className="w-full">
            <Card className="shadow-lg overflow-hidden rounded-lg">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2927.2205508499014!2d-83.70634412386768!3d42.80482517115491!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8823645ed2255039%3A0xe107428aa8c41294!2sFirst%20Baptist%20Church%20of%20Fenton!5e0!3m2!1sen!2sus!4v1750685540049!5m2!1sen!2sus" 
                  width="100%" 
                  height="450" 
                  style={{ border: 0 }} 
                  allowFullScreen
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </Card>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          <Link href="/visit/what-to-expect">
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Users className="h-10 w-10 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-lora font-bold mb-2">What to Expect</h3>
                <p className="text-muted-foreground">
                  First time? Learn about our services, dress code, and what we have for kids.
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/contact">
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Mail className="h-10 w-10 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-lora font-bold mb-2">Have Questions?</h3>
                <p className="text-muted-foreground">
                  We'd love to answer them. Get in touch with our team.
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/events">
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Calendar className="h-10 w-10 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-lora font-bold mb-2">Upcoming Events</h3>
                <p className="text-muted-foreground">
                  Check out what's happening at First Baptist Church.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
} 