"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Users, Heart, Coffee, BookOpen } from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="bg-background text-foreground">
      <header className="bg-primary text-primary-foreground py-20 text-center">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold font-lora">Welcome to First Baptist Church</h1>
          <p className="mt-4 text-xl text-primary-foreground/80">We're so glad you're here.</p>
        </div>
      </header>

      <main className="container mx-auto py-16 px-4 space-y-20">
        <section className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-lora font-bold text-primary-foreground mb-4">Your First Visit</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Joining us for the first time? We know it can be a little daunting. Here's what you can expect on a typical Sunday morning. We can't wait to meet you!
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-lora font-semibold text-primary-foreground mb-4">What to Expect</h3>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-start">
                <Coffee className="h-6 w-6 text-accent mr-4 mt-1" />
                <span><strong>Casual Atmosphere:</strong> Come as you are! You'll see everything from jeans to suits. We care about you, not what you wear.</span>
              </li>
              <li className="flex items-start">
                <BookOpen className="h-6 w-6 text-accent mr-4 mt-1" />
                <span><strong>Biblical Teaching:</strong> Our services feature messages that are relevant to your life, rooted in the truth of the Bible.</span>
              </li>
              <li className="flex items-start">
                <Heart className="h-6 w-6 text-accent mr-4 mt-1" />
                <span><strong>Worship Music:</strong> We have a blend of contemporary songs and traditional hymns, all focused on glorifying God.</span>
              </li>
            </ul>
          </div>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-lora">Service Times</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span><strong>Sunday Worship</strong></span>
                <span className="font-semibold text-accent">10:30 AM</span>
              </div>
              <p className="text-sm text-muted-foreground pt-2">
                We recommend arriving 10-15 minutes early to grab a coffee and find a seat. Childcare is available.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="text-center bg-primary/10 p-12 rounded-lg">
          <h2 className="text-3xl font-lora font-bold text-primary-foreground mb-4">Ready to Get Connected?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            The best way to feel at home is to get involved. Whether it's joining a small group, serving on a team, or attending an event, we have a place for you.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/ministries">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Users className="mr-2 h-5 w-5" />
                Explore Ministries
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Ask a Question
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
} 