"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, Mail, Users, Calendar, Car } from "lucide-react";
import Link from "next/link";
import { PageLayout } from '@/components/layout/PageLayout';

export default function VisitPage() {
  return (
    <PageLayout
      title="Plan Your Visit"
      subtitle="We'd love to meet you! Whether you're new to church or just new to the area, we want your first visit to be easy, meaningful, and welcoming."
    >
      <div className="grid md:grid-cols-2 gap-16 items-start">
        {/* Left Column: Info */}
        <div className="space-y-12">
          <div>
            <h2 className="text-3xl font-heading font-bold mb-6">Our Location</h2>
            <div className="flex items-start space-x-4">
              <MapPin className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-xl">First Baptist Church of Fenton</p>
                <p className="text-muted-foreground text-lg">860 N. Leroy Street, Fenton, MI 48430</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-heading font-bold mb-6">Service Times</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Clock className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-xl">Sundays</p>
                  <ul className="list-disc pl-5 text-muted-foreground text-lg mt-2 space-y-1">
                    <li>10:30 AM – Worship Service</li>
                    <li>9:00 AM – Adult Bible Study, Student & Kids Classes</li>
                  </ul>
                </div>
              </div>
                <div className="flex items-start space-x-4">
                <Clock className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-xl">Wednesdays</p>
                  <ul className="list-disc pl-5 text-muted-foreground text-lg mt-2 space-y-1">
                    <li>6:30 PM – Awana (PreK–5th), Youth Group (6th–12th), & Adult Prayer Gathering</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

            <div>
            <h2 className="text-3xl font-heading font-bold mb-6">Parking & Entrance</h2>
            <div className="flex items-start space-x-4">
              <Car className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="text-muted-foreground text-lg">We have plenty of on-site parking, with guest spots reserved near the main entrance. Look for the entrance under the large covered portico on the south side of the building. Greeters will be ready to welcome you and point you in the right direction.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column: Map */}
        <div className="w-full h-full min-h-[450px]">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2927.2205508499014!2d-83.70634412386768!3d42.80482517115491!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8823645ed2255039%3A0xe107428aa8c41294!2sFirst%20Baptist%20Church%20of%20Fenton!5e0!3m2!1sen!2sus!4v1750685540049!5m2!1sen!2sus" 
            width="100%" 
            height="100%" 
            className="rounded-lg shadow-lg"
            style={{ border: 0 }} 
            allowFullScreen
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid md:grid-cols-3 gap-8 mt-24 border-t pt-16">
        <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <Link href="/visit/what-to-expect" className="block p-6 text-center h-full">
            <Users className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-heading font-bold mb-2">What to Expect</h3>
            <p className="text-muted-foreground">
              First time? Learn about our services, dress code, and what we have for kids.
            </p>
          </Link>
        </Card>
        <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <Link href="/contact" className="block p-6 text-center h-full">
            <Mail className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-heading font-bold mb-2">Have Questions?</h3>
            <p className="text-muted-foreground">
              We'd love to answer them. Get in touch with our team.
            </p>
          </Link>
        </Card>
        <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <Link href="/events" className="block p-6 text-center h-full">
            <Calendar className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-heading font-bold mb-2">Upcoming Events</h3>
            <p className="text-muted-foreground">
              Check out what's happening at First Baptist Church.
            </p>
          </Link>
        </Card>
      </div>
    </PageLayout>
  );
} 