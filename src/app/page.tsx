"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from 'next/link';
import Image from "next/image";
import { ArrowRight, Star, Mail, Phone, MapPin, BookOpen, Users, Church } from "lucide-react";
import { WelcomeCard } from "@/components/WelcomeCard";

export default function Home() {
  const nextEvent = {
    id: '1',
    title: 'Community Cookout',
    date: '2024-08-15T17:00:00.000Z',
    time: '5:00 PM',
    description: 'Join us for a fun evening of food, games, and fellowship.',
    location: 'Church Lawn',
    category: 'Community',
    isFeatured: true
  };

  return (
    <div className="flex flex-col">
      
      {/* Hero Section */}
      <section className="w-full px-4 sm:px-8 md:px-16 py-12 md:py-20 bg-scheme-1-background">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-20">
          <div className="flex-1 flex flex-col items-start gap-8 text-center md:text-left">
            <div className="w-full flex flex-col items-start gap-6">
              <h1 className="w-full text-scheme-1-text text-4xl sm:text-5xl font-heading font-bold leading-tight">
                Welcome to First Baptist Church of Fenton, Michigan
              </h1>
              <p className="w-full text-scheme-1-text text-lg font-body leading-relaxed">
                Join us for uplifting worship and community. We gather every Sunday at 10 AM at 860 N Leroy St, Fenton, MI.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 w-full">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto" asChild>
                <Link href="/visit">Learn More</Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                <Link href="/events">Sign Up</Link>
              </Button>
            </div>
          </div>
          <div className="flex-1 mt-8 md:mt-0">
            <Image 
              src="/bible.png" 
              alt="Holy Bible"
              width={600} 
              height={600} 
              className="rounded-lg object-cover mx-auto animate-slide-in-rotate"
            />
          </div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="w-full px-4 sm:px-8 md:px-16 py-16 md:py-28 bg-scheme-1-background">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-12 md:gap-20">
          <h2 className="max-w-4xl text-center text-scheme-1-text text-3xl sm:text-4xl font-heading font-bold leading-snug">
            Experience uplifting worship services every week at First Baptist Church of Fenton.
          </h2>
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-12">
            
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-scheme-1-text text-2xl font-heading font-bold leading-tight">
                  Join our vibrant community events and connect with fellow believers.
                </h3>
                <p className="text-scheme-1-text text-base font-body leading-relaxed">
                  Discover various ministry opportunities to grow in faith and serve others.
                </p>
              </div>
              <Link href="/community" className="flex items-center gap-2 group">
                <span className="text-primary font-medium leading-6 group-hover:underline">Learn More</span>
                <ArrowRight className="w-5 h-5 text-primary" />
              </Link>
            </div>

            <div className="flex flex-col items-center gap-6 text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10">
                <Church className="w-8 h-8 text-primary" />
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-scheme-1-text text-2xl font-heading font-bold leading-tight">
                  Engage in enriching programs designed for all ages and backgrounds.
                </h3>
                <p className="text-scheme-1-text text-base font-body leading-relaxed">
                  Participate in our church activities that foster fellowship and spiritual growth.
                </p>
              </div>
              <Link href="/ministries" className="flex items-center gap-2 group">
                <span className="text-primary font-medium leading-6 group-hover:underline">Sign Up</span>
                <ArrowRight className="w-5 h-5 text-primary" />
              </Link>
            </div>

            <div className="flex flex-col items-center gap-6 text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-scheme-1-text text-2xl font-heading font-bold leading-tight">
                  Explore our resources for spiritual development and community support.
                </h3>
                <p className="text-scheme-1-text text-base font-body leading-relaxed">
                  Access sermons, blogs, and prayer resources to deepen your faith journey.
                </p>
              </div>
              <Link href="/sermons" className="flex items-center gap-2 group">
                <span className="text-primary font-medium leading-6 group-hover:underline">Get Involved</span>
                <ArrowRight className="w-5 h-5 text-primary" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Worship Services Section */}
      <section className="w-full px-4 sm:px-8 md:px-16 py-16 md:py-28 bg-scheme-1-background relative">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{backgroundImage: "url('/sermon.png')"}}></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-20 relative z-10">
          <div className="flex-1 flex flex-col items-start gap-8">
            <div className="w-full flex flex-col items-start gap-4">
              <span className="text-primary text-base font-semibold leading-6">Worship</span>
              <h2 className="w-full text-scheme-1-text text-4xl sm:text-5xl font-heading font-bold leading-tight">
                Join Us for Inspiring Worship Services
              </h2>
              <p className="w-full text-scheme-1-text text-lg font-body leading-relaxed">
                Experience uplifting worship and powerful sermons every Sunday. Connect with our community and grow in faith together.
              </p>
            </div>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex-1 flex flex-col gap-2">
                <h3 className="text-scheme-1-text text-xl font-heading font-bold">
                  Upcoming Services
                </h3>
                <p className="text-scheme-1-text text-base font-body leading-relaxed">
                  Sundays at 10 AM - All are welcome to join us.
                </p>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <h3 className="text-scheme-1-text text-xl font-heading font-bold">
                  Sermon Series
                </h3>
                <p className="text-scheme-1-text text-base font-body leading-relaxed">
                  Dive deeper into faith with our current sermon series every week.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Button size="lg" variant="outline" asChild>
                <Link href="/sermons">Learn More</Link>
              </Button>
              <Link href="/events" className="flex items-center gap-2 group">
                <span className="text-primary font-medium leading-6 group-hover:underline">Sign Up</span>
                <ArrowRight className="w-5 h-5 text-primary" />
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full mt-8 md:mt-0">
            <Image 
              src="/sermon.png" 
              alt="Worship service"
              width={600} 
              height={640} 
              className="rounded-lg object-cover w-full h-auto max-h-[560px]"
            />
          </div>
        </div>
      </section>

      {/* Ministries Section */}
      <section className="w-full px-4 sm:px-8 md:px-16 py-16 md:py-28 bg-scheme-1-background">
        <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12 md:gap-20">
          <div className="flex-1 w-full mt-8 md:mt-0">
            <Image 
              src="/volunteer.png" 
              alt="Community volunteer serving food"
              width={600} 
              height={640} 
              className="rounded-lg object-cover w-full h-auto max-h-[560px]"
            />
          </div>
          <div className="flex-1 flex flex-col items-start gap-8">
            <div className="w-full flex flex-col items-start gap-6">
              <h2 className="w-full text-scheme-1-text text-3xl sm:text-4xl font-heading font-bold leading-snug">
                Join Our Ministries and Make a Difference in Our Community
              </h2>
              <p className="w-full text-scheme-1-text text-lg font-body leading-relaxed">
                At First Baptist Church of Fenton, we believe in the power of community. Get involved with our various ministries and volunteer opportunities to serve others and grow in faith.
              </p>
            </div>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex-1 flex flex-col gap-2">
                <h3 className="text-scheme-1-text text-4xl sm:text-5xl font-heading font-bold">
                  Volunteer
                </h3>
                <p className="text-scheme-1-text text-base font-body leading-relaxed">
                  Discover ways to serve and connect today.
                </p>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <h3 className="text-scheme-1-text text-4xl sm:text-5xl font-heading font-bold">
                  Ministries
                </h3>
                <p className="text-scheme-1-text text-base font-body leading-relaxed">
                  Explore our diverse ministries and join us.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full px-4 sm:px-8 md:px-16 py-16 md:py-28 bg-scheme-1-background">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-12 md:gap-16">
          <div className="max-w-4xl flex flex-col items-center gap-6 text-center">
            <h2 className="w-full text-scheme-1-text text-4xl sm:text-5xl font-heading font-bold leading-tight">
              Community Testimonials
            </h2>
            <p className="w-full text-scheme-1-text text-lg font-body leading-relaxed">
              Hear from our church family about their experiences and faith journey.
            </p>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 bg-scheme-1-foreground rounded-lg border-2 border-scheme-1-border flex flex-col gap-6">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                </div>
                <p className="text-scheme-1-text text-base font-body leading-relaxed">
                  "This church has been a blessing to our family. The sense of community and the powerful sermons have truly deepened our faith."
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-scheme-1-text font-semibold">The Johnson Family</p>
                <p className="text-muted-foreground text-sm">Members since 2021</p>
              </div>
            </Card>
            <Card className="p-8 bg-scheme-1-foreground rounded-lg border-2 border-scheme-1-border flex flex-col gap-6">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                </div>
                <p className="text-scheme-1-text text-base font-body leading-relaxed">
                  "The youth ministry is fantastic! My kids love coming here and have grown so much in their spiritual walk."
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-scheme-1-text font-semibold">Sarah L.</p>
                <p className="text-muted-foreground text-sm">Parent</p>
              </div>
            </Card>
            <Card className="p-8 bg-scheme-1-foreground rounded-lg border-2 border-scheme-1-border flex flex-col gap-6">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                </div>
                <p className="text-scheme-1-text text-base font-body leading-relaxed">
                  "A welcoming and authentic community. From the moment I first visited, I felt right at home."
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-scheme-1-text font-semibold">Mark D.</p>
                <p className="text-muted-foreground text-sm">New Visitor</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Welcome Card Section */}
      <section className="w-full px-4 sm:px-8 md:px-16 py-16 md:py-20 bg-scheme-1-background">
        <div className="max-w-5xl mx-auto">
          <WelcomeCard todaysHours="9 AM - 4 PM" nextEvent={nextEvent} />
        </div>
      </section>

      {/* Contact Section */}
      <section className="w-full px-4 sm:px-8 md:px-16 py-16 md:py-20 bg-primary/5">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-8">
          <h2 className="text-scheme-1-text text-3xl sm:text-4xl font-heading font-bold leading-snug">
            We're Here for You
          </h2>
          <p className="max-w-3xl text-scheme-1-text text-lg font-body leading-relaxed">
            Whether you have questions, need prayer, or want to get connected, we're just a message or a call away.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-4">
            <div className="flex flex-col items-center gap-3">
              <Mail className="w-8 h-8 text-primary" />
              <h3 className="text-xl font-bold">Email Us</h3>
              <p className="text-muted-foreground">info@fbcfenton.com</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Phone className="w-8 h-8 text-primary" />
              <h3 className="text-xl font-bold">Call Us</h3>
              <p className="text-muted-foreground">(810) 629-1234</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <MapPin className="w-8 h-8 text-primary" />
              <h3 className="text-xl font-bold">Visit Us</h3>
              <p className="text-muted-foreground">860 N Leroy St, Fenton, MI</p>
            </div>
          </div>
          <Button size="lg" className="mt-8" asChild>
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

// Missing icon components - let's add them
function Users({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

function Church({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m18 7 4 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9l4-2"/>
      <path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4"/>
      <path d="M18 22V5l-6-3-6 3v17"/>
      <path d="M12 7v5"/>
      <path d="M10 9h4"/>
    </svg>
  );
}
