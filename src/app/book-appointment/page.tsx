"use client";

import { InlineWidget } from "react-calendly";
import { PageLayout } from "@/components/layout/PageLayout";

export default function BookAppointmentPage() {
  // TODO: Replace with Pastor Bell's actual Calendly link
  const calendlyUrl = "https://calendly.com/fbc-fenton-james/30min";
  
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Contact", href: "/contact" },
    { label: "Book an Appointment" },
  ];

  return (
    <PageLayout
        title="Book an Appointment"
        subtitle="Schedule a confidential session with Pastor James Bell. Please select a date and time that works for you."
        breadcrumbs={breadcrumbs}
        variant="narrow"
    >
        <div className="rounded-lg overflow-hidden shadow-lg border">
            <InlineWidget
                url={calendlyUrl}
                styles={{
                    height: "800px",
                }}
                pageSettings={{
                    backgroundColor: 'FFFFFF',
                    hideEventTypeDetails: false,
                    hideLandingPageDetails: false,
                    primaryColor: 'FF9A00',
                    textColor: '070404'
                }}
            />
        </div>
    </PageLayout>
  );
} 