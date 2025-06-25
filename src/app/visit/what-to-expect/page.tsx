import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  Clock, MapPin, Users, Coffee, BookOpen, Heart, 
  ParkingCircle, Baby, Shirt, Music, ArrowRight 
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'What to Expect | First Baptist Church Fenton',
  description: 'Learn what to expect during your first visit to First Baptist Church Fenton. Service times, dress code, and what happens during worship.',
};

export default function WhatToExpectPage() {
  const serviceSchedule = [
    {
      name: "Sunday Morning Worship",
      time: "10:30 AM",
      duration: "60-75 minutes",
      description: "Our main worship service with contemporary music, biblical teaching, and community fellowship."
    },
    {
      name: "Wednesday Bible Study",
      time: "7:00 PM", 
      duration: "45-60 minutes",
      description: "Mid-week study focused on growing deeper in God's Word together."
    }
  ];

  const whatToExpect = [
    {
      icon: Music,
      title: "Worship Through Music",
      description: "We sing contemporary Christian songs led by our worship team. Don't worry if you don't know the words - lyrics are displayed on screens."
    },
    {
      icon: BookOpen,
      title: "Biblical Teaching",
      description: "Our pastor shares practical, biblical messages that apply to everyday life. Messages typically last 25-30 minutes."
    },
    {
      icon: Users,
      title: "Warm Welcome",
      description: "Our greeting team will welcome you at the door and help you find your way. Feel free to ask questions!"
    },
    {
      icon: Coffee,
      title: "Fellowship Time",
      description: "Before and after service, enjoy coffee and light refreshments while connecting with others."
    },
    {
      icon: Heart,
      title: "Prayer & Communion",
      description: "We regularly have times of prayer and monthly communion. Participation is always voluntary."
    },
    {
      icon: Baby,
      title: "Family Friendly",
      description: "Children are welcome in service. We also have nursery care and children's programs available."
    }
  ];

  const practicalInfo = [
    {
      icon: ParkingCircle,
      title: "Parking",
      description: "Free parking is available in our lot behind the church building."
    },
    {
      icon: Shirt,
      title: "Dress Code",
      description: "Come as you are! We have people in everything from jeans to suits. Comfort is key."
    },
    {
      icon: MapPin,
      title: "Finding Us",
      description: "We're located at 860 N Leroy St. Look for our sign and welcoming team at the main entrance."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <Badge variant="secondary" className="text-accent-foreground bg-accent/10">
          First Time Visitor
        </Badge>
        <h1 className="text-4xl md:text-5xl font-lora font-bold text-primary-foreground">
          What to Expect
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          We're excited you're considering visiting First Baptist Church Fenton! 
          Here's everything you need to know to feel comfortable and prepared for your first visit.
        </p>
      </section>

      {/* Service Schedule */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-lora font-bold text-primary-foreground mb-4">
            Service Times
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the service time that works best for you and your family.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {serviceSchedule.map((service, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <CardTitle className="flex items-center justify-center space-x-2">
                  <Clock className="h-5 w-5 text-accent" />
                  <span>{service.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-3xl font-bold text-accent">{service.time}</div>
                  <div className="text-sm text-muted-foreground">{service.duration}</div>
                </div>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* What Happens During Service */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-lora font-bold text-primary-foreground mb-4">
            What Happens During Service
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Here's a typical flow of our Sunday morning worship service.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whatToExpect.map((item, index) => (
            <Card key={index} className="h-full">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <item.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Practical Information */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-lora font-bold text-primary-foreground mb-4">
            Practical Information
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know for a smooth visit.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {practicalInfo.map((item, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6 space-y-4">
                <div className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <item.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-lora font-bold text-primary-foreground mb-4">
            Common Questions
          </h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">Will someone greet me when I arrive?</h3>
              <p className="text-muted-foreground">
                Absolutely! Our greeting team will be at the main entrance to welcome you, 
                answer any questions, and help you find your way around the building.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">What about my children?</h3>
              <p className="text-muted-foreground">
                Children are always welcome in our main service. We also offer nursery care for 
                infants and toddlers, and special children's programming during service time.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">Will I be asked to give money?</h3>
              <p className="text-muted-foreground">
                We do take an offering during service, but giving is completely voluntary. 
                As a first-time visitor, you're our guest - please don't feel any pressure to contribute.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">How long is the service?</h3>
              <p className="text-muted-foreground">
                Our Sunday morning service typically lasts 60-75 minutes, including worship music, 
                biblical teaching, prayer, and community announcements.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center space-y-6 bg-accent/5 rounded-2xl p-8 md:p-12">
        <h2 className="text-3xl md:text-4xl font-lora font-bold text-primary-foreground">
          Ready for Your Visit?
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We can't wait to meet you! If you have any other questions, don't hesitate to reach out.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/visit">
              Plan Your Visit
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </div>
  );
} 