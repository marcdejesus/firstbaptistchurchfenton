"use client";

import { InlineWidget } from "react-calendly";
import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";

export default function BookAppointmentPage() {
  // TODO: Replace with Pastor Bell's actual Calendly link
  const calendlyUrl = "https://calendly.com/pastorjbell206/45min";

  return (
    <div className="max-w-4xl mx-auto space-y-8 my-12">
      {/* Header */}
      <div className="text-center">
        {/* <Link href="/ministries/adults" className="inline-flex items-center text-accent hover:text-accent/80 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Adult Ministries
        </Link> */}
        <div className="flex items-center justify-center mb-4">
            <Calendar className="h-10 w-10 text-accent mr-4" />
            <h1 className="text-4xl md:text-5xl font-lora font-bold text-gray-800">
              Book an Appointment with Pastor Bell
            </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Schedule a confidential session with Pastor John Bell.
          Please select a date and time that works for you.
        </p>
      </div>

      {/* Calendly Embed */}
      <div className="rounded-lg overflow-hidden shadow-2xl border border-border">
          <InlineWidget
            url={calendlyUrl}
            styles={{
              height: "1000px",
            }}
            pageSettings={{
              backgroundColor: 'ffffff',
              hideEventTypeDetails: false,
              hideLandingPageDetails: false,
              primaryColor: 'f9a826',
              textColor: '262626'
            }}
          />
      </div>
    </div>
  );
} 