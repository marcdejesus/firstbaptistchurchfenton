"use client";

import { InlineWidget } from "react-calendly";
import { PageLayout } from "@/components/layout/PageLayout";

export default function BookAppointmentPage() {
  const calendlyUrl = "https://calendly.com/pastorjbell206/45min";

  return (
    <PageLayout
        title="Book an Appointment"
        subtitle="Schedule a confidential session with Pastor James Bell. Please select a date and time that works for you."
        variant="wide"
    >
        <div className="w-full">
          <InlineWidget
            url={calendlyUrl}
            styles={{
              width: "100%",
              height: "1000px",
            }}
            pageSettings={{
              hideEventTypeDetails: false,
              hideLandingPageDetails: false,
              primaryColor: 'fb7c25',
            }}
          />
        </div>
    </PageLayout>
  );
} 