"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from 'next/link';
import Image from "next/image";
import { ArrowRight, Star, Church, Users, HeartHandshake } from "lucide-react";

// A more focused feature card
const Feature = ({ icon: Icon, title, description, href, cta }: {
  icon: React.ComponentType<{className?: string}>,
  title: string,
  description: string,
  href: string,
  cta: string
}) => (
  <div className="flex flex-col items-center gap-6 text-center">
    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10">
      <Icon className="w-8 h-8 text-primary" />
    </div>
    <div className="flex flex-col gap-4">
      <h3 className="text-2xl font-heading font-bold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
    <Link href={href} className="flex items-center gap-2 group text-primary font-medium hover:underline">
      <span>{cta}</span>
      <ArrowRight className="w-5 h-5" />
    </Link>
  </div>
);

export default function Home() {
  return (
    <main className="flex flex-col">
      
      {/* Hero Section */}
      <section className="bg-background-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-start gap-8 text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl font-heading font-bold leading-tight">
                No matter where you've been, you're welcome here.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Come as you are and discover the hope, truth, and grace of Jesus Christ. We are a community of real people, with real struggles, following a real Savior.
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <Button size="lg" asChild>
                  <Link href="/visit">Plan Your Visit</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/sermons">Watch a Sermon</Link>
                </Button>
              </div>
            </div>
            <div className="mt-8 md:mt-0">
              <Image 
                src="https://t4.ftcdn.net/jpg/02/14/74/17/360_F_214741783_rc2gf6sEFtvsN8tYK76kDEG9BzfjSN09.jpg"
                alt="Welcoming church community"
                width={600} 
                height={600} 
                className="rounded-lg object-cover mx-auto shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Us / What to Expect Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-16">
          <div className="text-center max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold">A Place to Belong, A Space to Grow</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We focus on three things: loving God, growing together in community, and serving our world.
            </p>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-12">
            <Feature 
              icon={Church}
              title="Gospel-Centered Worship"
              description="Join us on Sundays for passionate worship and practical, Bible-based teaching that applies to your life."
              href="/visit/what-to-expect"
              cta="What to Expect"
            />
            <Feature 
              icon={Users}
              title="Authentic Community"
              description="Life is better together. We have small groups for all ages and stages of life to help you connect."
              href="/next-steps"
              cta="Find a Group"
            />
            <Feature 
              icon={HeartHandshake}
              title="Meaningful Service"
              description="Use your gifts to make a difference in our church, our city, and around the world."
              href="/volunteer"
              cta="Serve With Us"
            />
          </div>
        </div>
      </section>
      
      {/* Latest Sermon Section */}
      <section className="bg-background-secondary py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="flex flex-col items-start gap-6">
                    <span className="text-primary font-semibold">CURRENT SERIES</span>
                    <h2 className="text-3xl sm:text-4xl font-heading font-bold">Dive Deeper into God's Word</h2>
                    <p className="text-lg text-muted-foreground">
                        Our messages are designed to be practical, engaging, and faithful to Scripture. Watch the latest one now or browse our archive to find a series that speaks to you.
                    </p>
                    <Button size="lg" asChild>
                        <Link href="/sermons">Watch Now</Link>
                    </Button>
                </div>
                <div className="mt-8 md:mt-0">
                  <Link href="/sermons" className="block group">
                    <Image 
                      src="/sermon.png" 
                      alt="Latest sermon series"
                      width={600} 
                      height={338} 
                      className="rounded-lg object-cover w-full h-auto shadow-lg group-hover:shadow-xl transition-shadow"
                    />
                  </Link>
                </div>
            </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-12">
          <div className="text-center max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold">What Our Family Says</h2>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 flex flex-col gap-6 text-center items-center bg-background-secondary border-border-light">
                <Image src="https://t3.ftcdn.net/jpg/06/18/83/87/360_F_618838733_4urG25K25uXYj40p6o3HfYQd55nI0Rl0.jpg" alt="Testimonial author" width={80} height={80} className="rounded-full" />
                <p className="text-muted-foreground italic">"This church has been a blessing to our family. The sense of community and the powerful sermons have truly deepened our faith."</p>
                <div>
                  <p className="font-semibold">The Johnson Family</p>
                  <p className="text-sm text-muted-foreground">Members since 2021</p>
                </div>
            </Card>
            <Card className="p-8 flex flex-col gap-6 text-center items-center bg-background-secondary border-border-light">
                <Image src="https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg" alt="Testimonial author" width={80} height={80} className="rounded-full" />
                <p className="text-muted-foreground italic">"The youth ministry is fantastic! My kids love coming here and have grown so much in their spiritual walk."</p>
                <div>
                  <p className="font-semibold">Sarah L.</p>
                  <p className="text-sm text-muted-foreground">Parent</p>
                </div>
            </Card>
            <Card className="p-8 flex flex-col gap-6 text-center items-center bg-background-secondary border-border-light">
                <Image src="https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWspNNceUavTxoK6.jpg" alt="Testimonial author" width={80} height={80} className="rounded-full" />
                <p className="text-muted-foreground italic">"A welcoming and authentic community. From the moment I first visited, I felt right at home."</p>
                <div>
                  <p className="font-semibold">Mark D.</p>
                  <p className="text-sm text-muted-foreground">New Visitor</p>
                </div>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Final CTA Section */}
      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h2 className="text-3xl font-heading font-bold">Ready to Take the Next Step?</h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto text-primary-foreground/80">
                The best way to get to know us is to join us. We can't wait to meet you.
            </p>
            <div className="mt-8 flex justify-center gap-4">
                <Button size="lg" variant="secondary" asChild>
                    <Link href="/visit">Plan Your Visit</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-primary-foreground/50 text-primary-foreground hover:bg-white/10" asChild>
                    <Link href="/about">More About Us</Link>
                </Button>
            </div>
        </div>
      </section>
    </main>
  );
}
