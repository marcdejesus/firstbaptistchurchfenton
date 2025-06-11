'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Calendar, Users, Phone, ArrowLeft, Search } from 'lucide-react';

function BackButton() {
  return (
    <Button variant="outline" onClick={() => window.history.back()}>
      <ArrowLeft className="mr-2 h-4 w-4" />
      Go Back
    </Button>
  );
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Visual */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary/20 mb-4">404</div>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
        </div>

        {/* Content */}
        <Card className="mb-8 shadow-xl">
          <CardContent className="p-8">
            <h1 className="text-3xl font-lora font-bold text-card-foreground mb-4">
              Page Not Found
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              We couldn't find the page you're looking for. It may have been moved, 
              deleted, or you may have typed the URL incorrectly.
            </p>
            
            {/* Quick Actions */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Go Home
                  </Link>
                </Button>
                <BackButton />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Helpful Links */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-card-foreground">
              Looking for something specific?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link 
                href="/events" 
                className="flex flex-col items-center p-4 rounded-lg hover:bg-secondary/50 transition-colors group"
              >
                <Calendar className="h-8 w-8 text-accent mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Events</span>
              </Link>
              <Link 
                href="/sermons" 
                className="flex flex-col items-center p-4 rounded-lg hover:bg-secondary/50 transition-colors group"
              >
                <Users className="h-8 w-8 text-accent mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Sermons</span>
              </Link>
              <Link 
                href="/ministries" 
                className="flex flex-col items-center p-4 rounded-lg hover:bg-secondary/50 transition-colors group"
              >
                <Search className="h-8 w-8 text-accent mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Ministries</span>
              </Link>
              <Link 
                href="/contact" 
                className="flex flex-col items-center p-4 rounded-lg hover:bg-secondary/50 transition-colors group"
              >
                <Phone className="h-8 w-8 text-accent mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Contact</span>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Support Message */}
        <div className="mt-8 text-sm text-muted-foreground">
          <p>
            Need help? <Link href="/contact" className="text-accent hover:underline">Contact us</Link> and 
            we'll be happy to assist you.
          </p>
        </div>
      </div>
    </div>
  );
} 