"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react';
import Link from 'next/link';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorFallbackProps {
  error: Error | null;
  resetError: () => void;
  errorInfo?: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error);
      console.error('Error info:', errorInfo);
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you might want to send error to logging service
    if (process.env.NODE_ENV === 'production') {
      // Example: logErrorToService(error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

// Default error fallback component
function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50/30 to-accent-50/30 p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-16 w-16 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-lora">
            Oops! Something went wrong
          </CardTitle>
          <CardDescription className="text-lg">
            We apologize for the inconvenience. Our team has been notified and is working to fix this issue.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {isDevelopment && error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <h4 className="font-semibold text-destructive mb-2">Development Error Details:</h4>
              <pre className="text-sm text-destructive overflow-auto max-h-40">
                {error.message}
                {'\n'}
                {error.stack}
              </pre>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={resetError} className="bg-accent hover:bg-accent-600">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            
            <Button variant="outline" asChild>
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>
            
            <Button variant="outline" asChild>
              <Link href="/contact">
                <Mail className="h-4 w-4 mr-2" />
                Contact Us
              </Link>
            </Button>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>If this problem persists, please contact our support team.</p>
            <p className="mt-2">
              <strong>Email:</strong> info@fbcfenton.org <br />
              <strong>Phone:</strong> (810) 629-2241
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Specialized error fallbacks for different components
export function BlogErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <CardTitle>Unable to Load Blog Posts</CardTitle>
        <CardDescription>
          We're having trouble loading the blog content right now.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="flex justify-center gap-4">
          <Button onClick={resetError} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
          <Button asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function EventsErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <CardTitle>Unable to Load Events</CardTitle>
        <CardDescription>
          We're having trouble loading the events right now.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-muted-foreground">
          You can still view our regular service times:
        </p>
        <div className="bg-muted p-4 rounded-lg">
          <p><strong>Sunday Morning:</strong> 10:00 AM</p>
          <p><strong>Sunday Evening:</strong> 6:00 PM</p>
          <p><strong>Wednesday:</strong> 7:00 PM</p>
        </div>
        <div className="flex justify-center gap-4">
          <Button onClick={resetError} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
          <Button asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function SearchErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="text-center py-8">
      <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">Search Unavailable</h3>
      <p className="text-muted-foreground mb-4">
        We're having trouble with the search function right now.
      </p>
      <div className="flex justify-center gap-4">
        <Button onClick={resetError} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
        <Button asChild size="sm">
          <Link href="/blog">Browse Blog</Link>
        </Button>
      </div>
    </div>
  );
}

// Higher-order component for easy error boundary wrapping
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<ErrorFallbackProps>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

export default ErrorBoundary; 