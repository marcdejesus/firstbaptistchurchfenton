import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import Image from "next/image";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/30 to-primary/10 p-8 md:p-16 rounded-lg shadow-lg overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="https://images.squarespace-cdn.com/content/v1/5e74e817283f5b7394775296/1584722138113-K93VCHDP0DUDSXLLY6XC/image-asset.jpeg"
            alt="Church sanctuary interior"
            layout="fill"
            objectFit="cover"
            className="opacity-30" // Adjusted opacity for better text readability
            data-ai-hint="church interior"
            priority // Good to add for LCP images
          />
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-lora font-bold text-white mb-4">
            Welcome to First Baptist of Fenton
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            A community of faith, hope, and love in the heart of Fenton. Join us as we grow together.
          </p>
          <div className="space-x-4">
            <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md">
              <Link href="/events">Upcoming Events</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-gray-300/70 text-gray-100 hover:bg-white/20 hover:text-white hover:border-white shadow-md">
              <Link href="/community">Join Our Community</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Core Information Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
          <CardHeader>
            <CardTitle className="flex items-center font-lora text-2xl text-card-foreground">
              <Clock className="mr-3 h-7 w-7 text-accent" />
              Service Times
            </CardTitle>
          </CardHeader>
          <CardContent className="text-card-foreground/80 space-y-2">
            <p><strong>Sunday Morning Worship:</strong> 10:00 AM</p>
            <p><strong>Wednesday Evening Bible Study:</strong> 7:00 PM</p>
            <p><strong>Special Services:</strong> As announced</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
          <CardHeader>
            <CardTitle className="flex items-center font-lora text-2xl text-card-foreground">
              <MapPin className="mr-3 h-7 w-7 text-accent" />
              Our Location
            </CardTitle>
          </CardHeader>
          <CardContent className="text-card-foreground/80 space-y-2">
            <p>First Baptist Church Fenton</p>
            <p>123 Church Street, Fenton, Michigan, 48430</p>
            <div className="mt-4 h-48 w-full rounded-md overflow-hidden">
              <Image 
                src="https://placehold.co/600x300.png" // Placeholder for a map
                alt="Map to First Baptist of Fenton"
                width={600}
                height={300}
                className="object-cover"
                data-ai-hint="map location"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center font-lora text-2xl text-card-foreground">
              <Phone className="mr-3 h-7 w-7 text-accent" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent className="text-card-foreground/80 space-y-2" id="contact-us-section-id">
            <p className="flex items-center"><Mail className="mr-2 h-5 w-5 text-accent/80" /> Email: info@fbcfenton.org</p>
            <p className="flex items-center"><Phone className="mr-2 h-5 w-5 text-accent/80" /> Phone: (810) 555-1234</p>
            <CardDescription className="mt-2 text-sm">
              We&apos;d love to hear from you. Reach out with any questions or prayer requests.
            </CardDescription>
          </CardContent>
        </Card>
      </section>

      {/* Call to Action / Mission */}
      <section className="text-center p-8 bg-primary/10 rounded-lg shadow-md">
        <h2 className="text-3xl font-lora font-semibold text-primary-foreground mb-4">Our Mission</h2>
        <p className="text-lg text-primary-foreground/80 max-w-3xl mx-auto">
          To lead people into a growing relationship with Jesus Christ by creating environments where people are encouraged and equipped to pursue intimacy with God, community with insiders, and influence with outsiders.
        </p>
      </section>
    </div>
  );
}
