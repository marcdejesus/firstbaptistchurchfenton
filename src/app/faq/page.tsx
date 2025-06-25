"use client";

import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// Mock data simulating Firestore structure.
// Replace this with actual data fetching from Firestore.
const mockFaqs: FAQ[] = [
  {
    id: '1',
    question: "What time is your Sunday service?",
    answer: "Our Sunday worship service begins at 10:30 AM. We also have small groups that meet at 9:30 AM.",
    category: "About Our Services"
  },
  {
    id: '2',
    question: "What should I wear?",
    answer: "Come as you are! You'll see everything from jeans to suits. We care more about you than what you're wearing.",
    category: "About Our Services"
  },
  {
    id: '3',
    question: "Is there something for my kids?",
    answer: "Yes! We have a vibrant Kids Ministry for children from birth through 5th grade during our 10:30 AM service. We also have a Student Ministry for older kids.",
    category: "For Your Family"
  },
  {
    id: '4',
    question: "How can I get involved?",
    answer: "A great first step is to join a Small Group or attend one of our upcoming events. You can also explore our volunteer opportunities to serve with us.",
    category: "Getting Involved"
  },
  {
    id: '5',
    question: "What are your beliefs?",
    answer: "We are a Baptist church and our beliefs are rooted in the Bible. You can read our full statement of faith on our 'Our Beliefs' page.",
    category: "Our Beliefs"
  },
];

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>(mockFaqs);
  const [loading, setLoading] = useState(false);

  // NOTE: This is an example of how you would fetch from firestore
  // useEffect(() => {
  //   const fetchFaqs = async () => {
  //     setLoading(true);
  //     try {
  //       const q = query(collection(db, "faqs"), orderBy("category"));
  //       const querySnapshot = await getDocs(q);
  //       const faqsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FAQ[];
  //       setFaqs(faqsData);
  //     } catch (error) {
  //       console.error("Error fetching FAQs: ", error);
  //     }
  //     setLoading(false);
  //   };
  //   fetchFaqs();
  // }, []);

  const groupedFaqs = faqs.reduce((acc, faq) => {
    (acc[faq.category] = acc[faq.category] || []).push(faq);
    return acc;
  }, {} as Record<string, FAQ[]>);


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
      {loading ? (
        <p>Loading FAQs...</p>
      ) : (
        <div className="max-w-3xl mx-auto">
          {Object.keys(groupedFaqs).map((category) => (
            <div key={category} className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{category}</h2>
              <Accordion type="single" collapsible className="w-full">
                {groupedFaqs[category].map(faq => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 