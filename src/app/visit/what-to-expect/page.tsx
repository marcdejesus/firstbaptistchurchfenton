import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  Users, Music, Shirt, Baby, Gift, ArrowRight 
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'What to Expect | First Baptist Church Fenton',
  description: 'Learn what to expect during your visit to First Baptist Church Fenton. Get details on our worship style, dress code, and children\'s programs.',
};

const sections = [
  {
    icon: Users,
    title: "A Warm, Welcoming Atmosphere",
    content: "From the parking lot to the pew, our team is ready to greet you with a smile and help you feel at home."
  },
  {
    icon: Music,
    title: "Worship Style",
    content: "Our services are passionate, gospel-centered, and grounded in God's Word. We blend modern worship songs with timeless hymns, and each service includes prayer, Scripture, and expository preaching. Services usually last about 75 minutes."
  },
  {
    icon: Shirt,
    title: "Dress Code",
    content: "Come as you are! Most people wear casual or business casual attire. Whether you're in jeans or dress shoes, you'll fit right in."
  },
  {
    icon: Baby,
    title: "Children & Nursery",
    content: (
      <>
        <p className="mb-2"><strong>Nursery (Ages 0–2):</strong> Clean, safe, and staffed by loving volunteers.</p>
        <p className="mb-2"><strong>Kids Church (PreK–5th Grade):</strong> Age-appropriate Bible teaching and worship during the 10:30 AM service.</p>
        <p>All children's workers are background-checked and trained.</p>
      </>
    )
  },
  {
    icon: Gift,
    title: "First-Time Guests",
    content: "Be sure to stop by the Welcome Center in the main lobby. We'd love to meet you, answer your questions, and give you a free welcome gift just for visiting."
  },
];

export default function WhatToExpectPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-heading font-bold">
          What to Expect
        </h1>
        <p className="text-xl max-w-3xl mx-auto leading-relaxed text-muted-foreground">
          Walking into a new church can feel intimidating—here's what you can expect when you visit First Baptist Church of Fenton.
        </p>
      </section>

      {/* Content Section */}
      <section>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {sections.map((section, index) => (
             <Card key={index} className="h-full shadow-md hover:shadow-lg transition-shadow">
               <CardHeader className="flex flex-row items-center space-x-4 pb-4">
                  <div className="p-3 bg-accent/10 rounded-full">
                    <section.icon className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="text-2xl font-bold">{section.title}</CardTitle>
               </CardHeader>
              <CardContent>
                <div className="text-muted-foreground leading-relaxed">{section.content}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="text-center space-y-6 bg-accent/5 rounded-2xl p-8 md:p-12">
        <h2 className="text-3xl md:text-4xl font-heading font-bold">
          We're Excited to Meet You!
        </h2>
        <p className="text-lg max-w-2xl mx-auto text-muted-foreground">
          If you have any other questions, please don't hesitate to reach out. We look forward to welcoming you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/contact">
              Contact Us
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/about/staff">
              Meet Our Team
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
} 