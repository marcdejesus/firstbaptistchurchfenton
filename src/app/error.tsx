'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, Phone, Mail } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-destructive/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Error Visual */}
        <div className="mb-8">
          <div className="mx-auto w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
          <div className="w-24 h-1 bg-destructive mx-auto rounded-full"></div>
        </div>

        {/* Content */}
        <Card className="mb-8 shadow-xl">
          <CardContent className="p-8">
            <h1 className="text-3xl font-lora font-bold text-card-foreground mb-4">
              Something went wrong
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              We're sorry, but something unexpected happened. Our team has been 
              notified and we're working to fix the issue.
            </p>
            
            {/* Development Error Details */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-6 p-4 bg-destructive/10 rounded-lg text-left">
                <h3 className="font-semibold text-destructive mb-2">Error Details (Development Only):</h3>
                <code className="text-sm text-destructive/80 break-all">
                  {error.message}
                </code>
                {error.digest && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            )}
            
            {/* Recovery Actions */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={reset}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Go Home
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Options */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-card-foreground">
              Need assistance?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link 
                href="/contact" 
                className="flex items-center justify-center p-4 rounded-lg hover:bg-secondary/50 transition-colors group border border-border"
              >
                <Phone className="h-5 w-5 text-accent mr-3 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="font-medium text-sm">Contact Us</div>
                  <div className="text-xs text-muted-foreground">Get help from our team</div>
                </div>
              </Link>
              <a 
                href="mailto:info@firstbaptistfenton.org" 
                className="flex items-center justify-center p-4 rounded-lg hover:bg-secondary/50 transition-colors group border border-border"
              >
                <Mail className="h-5 w-5 text-accent mr-3 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="font-medium text-sm">Email Support</div>
                  <div className="text-xs text-muted-foreground">Send us your issue</div>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Additional Help */}
        <div className="mt-8 text-sm text-muted-foreground">
          <p>
            If this problem persists, please include the error ID 
            {error.digest && <span className="font-mono ml-1">({error.digest})</span>} 
            when contacting support.
          </p>
        </div>
      </div>
    </div>
  );
} 