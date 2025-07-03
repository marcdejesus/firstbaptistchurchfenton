"use client";

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { PageLayout } from '@/components/layout/PageLayout';

const faqs = [
  {
    question: "1. What time are Sunday services?",
    answer: "Sundays at 10:30 AM. Bible classes for all ages begin at 9:00 AM."
  },
  {
    question: "2. What should I wear?",
    answer: "Come as you are! Most people dress casual or business casual."
  },
  {
    question: "3. Is there something for my kids?",
    answer: "Yes! We offer nursery for infants and toddlers, and a full Kids Church for PreK–5th grade during the 10:30 AM service."
  },
  {
    question: "4. How do I get involved in a small group?",
    answer: "Visit our Next Steps page or stop by the Welcome Center. We'll help you find a group that fits your schedule and stage of life."
  },
  {
    question: "5. How do I become a member?",
    answer: "We offer a membership class quarterly. It's a great chance to learn about our beliefs, leadership, and mission. Sign up through our Next Steps page or email discipleship@fbfenton.org."
  },
  {
    question: "6. Do you offer counseling?",
    answer: "Yes, we provide biblical counseling for individuals, couples, and families. Visit our counseling page or email counseling@fbfenton.org."
  },
  {
    question: "7. How can I serve?",
    answer: "There are many opportunities to serve—from kids and youth to worship, tech, and missions. Fill out the Volunteer Interest Form on our Volunteer page."
  },
  {
    question: "8. What denomination are you?",
    answer: "We are an independent Baptist church committed to the authority of Scripture and the centrality of the gospel."
  },
  {
    question: "9. Do you livestream your services?",
    answer: "Yes! You can watch live on our YouTube channel or find past messages in our sermon archive."
  },
  {
    question: "10. How can I talk to a pastor?",
    answer: "Reach out anytime by emailing info@fbfenton.org or calling the church office. A pastor will be glad to connect with you."
  }
];

export default function FAQPage() {
  return (
    <PageLayout
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about our church, services, and how to get involved."
    >
        <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
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