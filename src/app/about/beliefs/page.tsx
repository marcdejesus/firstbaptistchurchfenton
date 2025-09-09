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

export default function BeliefsPage() {
  return (
    <main>
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
            <h2 className="text-4xl font-heading font-bold text-center mb-8">Statement of Faith</h2>
            <Accordion type="multiple" className="w-full" defaultValue={['core-beliefs']}>
              {beliefsData.map((belief) => (
                <AccordionItem key={belief.id} value={belief.id}>
                  <AccordionTrigger className="text-2xl font-semibold hover:no-underline">
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
    </main>
  );
} 