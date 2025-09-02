"use client";

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { PageLayout } from '@/components/layout/PageLayout';
import { useFAQs } from '@/hooks/useFAQs';

export default function FAQPage() {
  const { faqs, loading, error } = useFAQs();

  if (loading) {
    return (
      <PageLayout
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about our church, services, and how to get involved."
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading FAQs...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about our church, services, and how to get involved."
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center py-8">
            <p className="text-destructive">Error loading FAQs: {error}</p>
            <p className="mt-2 text-muted-foreground">Please try refreshing the page.</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!faqs || faqs.length === 0) {
    return (
      <PageLayout
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about our church, services, and how to get involved."
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center py-8">
            <p className="text-muted-foreground">No FAQs available at the moment.</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about our church, services, and how to get involved."
    >
        <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
                <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                <AccordionTrigger className="text-left font-heading">{faq.question}</AccordionTrigger>
                <AccordionContent>
                    {faq.answer}
                </AccordionContent>
                </AccordionItem>
            ))}
            </Accordion>
        </div>
    </PageLayout>
  );
} 