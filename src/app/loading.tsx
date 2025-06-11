import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="p-8 text-center">
          {/* Loading Animation */}
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <Loader2 className="h-8 w-8 text-accent animate-spin" />
            </div>
            <div className="w-24 h-1 bg-accent mx-auto rounded-full animate-pulse"></div>
          </div>

          {/* Loading Text */}
          <h2 className="text-2xl font-lora font-semibold text-card-foreground mb-2">
            Loading...
          </h2>
          <p className="text-muted-foreground">
            Please wait while we prepare your content
          </p>

          {/* Loading Indicators */}
          <div className="mt-6 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 