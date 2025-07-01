"use client";

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageLayout } from '@/components/layout/PageLayout';
import { beliefsData, introduction, statementOfFaithNote } from './content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';

export default function BeliefsPage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Our Beliefs" },
  ];

  return (
    <>
      <Header breadcrumbs={breadcrumbs} />
      <PageLayout
        title="Our Beliefs"
        subtitle="The theological foundations that guide our church"
        variant="narrow"
      >
        <div className="space-y-12">
          <Card>
            <CardHeader>
              <CardTitle>{introduction.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{introduction.content}</p>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-3xl font-bold text-center mb-8">Statement of Faith</h2>
            <Accordion type="single" collapsible className="w-full" defaultValue='core-beliefs'>
              {beliefsData.map((belief) => (
                <AccordionItem key={belief.id} value={belief.id}>
                  <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                    {belief.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground leading-relaxed pt-4">
                    {belief.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <p className="text-center text-sm text-muted-foreground mt-8">
              {statementOfFaithNote.content}
            </p>
          </div>
        </div>
      </PageLayout>
    </>
  );
} 