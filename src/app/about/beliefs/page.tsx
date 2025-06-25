"use client";

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from 'next/link';

// Mock data for beliefs
// TODO: Replace with your church's actual statement of faith
const beliefs = [
  {
    id: 'scriptures',
    title: 'The Scriptures',
    content: 'We believe the Holy Bible is the inspired, infallible, and authoritative Word of God. It is the final authority for faith and life, revealing God\'s plan of salvation and His principles for holy living.',
  },
  {
    id: 'god',
    title: 'The Godhead',
    content: 'We believe in one God, eternally existing in three persons: the Father, the Son (Jesus Christ), and the Holy Spirit. These three are co-equal in power and glory, and they work in perfect unity.',
  },
  {
    id: 'jesus',
    title: 'The Person and Work of Christ',
    content: 'We believe in the deity of our Lord Jesus Christ, in His virgin birth, in His sinless life, in His miracles, in His vicarious and atoning death through His shed blood, in His bodily resurrection, in His ascension to the right hand of the Father, and in His personal return in power and glory.',
  },
  {
    id: 'salvation',
    title: 'Salvation',
    content: 'We believe that salvation is a gift from God, received by grace through faith in the Lord Jesus Christ. It is not earned by works but is freely given to all who repent of their sins and trust in Christ alone for eternal life.',
  },
  {
    id: 'church',
    title: 'The Church',
    content: 'We believe that the Church is the body of Christ, a spiritual organism made up of all born-again believers. We are called to worship God, edify one another, and proclaim the Gospel to the ends of the earth.',
  },
];

export default function BeliefsPage() {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Our Beliefs</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              This is the foundation of our faith and the core of our church. These are the truths that unite us.
            </p>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {beliefs.map((belief) => (
              <AccordionItem key={belief.id} value={belief.id}>
                <AccordionTrigger className="text-xl font-semibold">
                  {belief.title}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                  {belief.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center border-t pt-8">
            <p className="text-muted-foreground">
              Our full statement of faith is available upon request. If you have any questions, please don't hesitate to{' '}
              <Link href="/contact" className="text-primary hover:underline">
                contact us
              </Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 