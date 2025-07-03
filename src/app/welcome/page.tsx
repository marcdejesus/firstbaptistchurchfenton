"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Users, Heart, Coffee, BookOpen, UserCheck, HeartHandshake } from "lucide-react";
import Image from 'next/image';
import { PageLayout } from "@/components/layout/PageLayout";

export default function WelcomePage() {
  return (
    <PageLayout
      title="Welcome to First Baptist"
      subtitle="We're so glad you're here. Let's get you connected."
    >
      {/* Section 1: What to Expect */}
      <section>
        <h2 className="text-3xl font-heading font-bold text-center mb-8">Your First Visit</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h3 className="text-2xl font-heading font-semibold mb-4">What to Expect</h3>
            <p className="text-muted-foreground">
              Visiting a new church can be intimidating. We get it. At First Baptist, you can expect a warm, friendly atmosphere. Our services feature contemporary worship music and a relevant message from the Bible. Don't worry about what to wear—come as you are!
            </p>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">
                Ask a Question
              </Link>
            </Button>
          </div>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-heading">Service Times</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span><strong>Sunday Worship</strong></span>
                <span className="font-semibold text-primary">10:30 AM</span>
              </div>
              <p className="text-sm text-muted-foreground pt-2">
                We recommend arriving 10-15 minutes early to grab a coffee and find a seat. Childcare is available.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 2: Get Connected */}
      <section className="mt-16">
        <h2 className="text-3xl font-heading font-bold text-center mb-8">Ready to Get Connected?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Link href="/ministries">
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Users className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-heading font-bold mb-2">Find a Ministry</h3>
                <p className="text-muted-foreground">
                  From kids to adults, there's a place for you to connect and grow.
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/next-steps">
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <UserCheck className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-heading font-bold mb-2">Join a Small Group</h3>
                <p className="text-muted-foreground">
                  Life is better together. Find a small group that fits your life stage and schedule.
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/volunteer">
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <HeartHandshake className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-heading font-bold mb-2">Serve With Us</h3>
                <p className="text-muted-foreground">
                  Use your gifts to make a difference in our church and community.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </PageLayout>
  );
} 