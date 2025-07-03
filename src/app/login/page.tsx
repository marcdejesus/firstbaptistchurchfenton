"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Info } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <main>
      <PageLayout
        title="Member Login"
        subtitle="Access member features and church event registration."
        variant="narrow"
      >
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="font-heading text-3xl">Welcome Back!</CardTitle>
            <CardDescription>
              Log in to your account below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle className="font-heading">Under Development</AlertTitle>
              <AlertDescription>
                The login functionality is currently being built. Please check back soon.
              </AlertDescription>
            </Alert>
            <fieldset disabled className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" />
              </div>
              <Button type="submit" className="w-full" disabled>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Log In
              </Button>
            </fieldset>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Button variant="link" asChild className="p-0 h-auto">
                <Link href="/register">Register here</Link>
              </Button>
            </p>
          </CardFooter>
        </Card>
      </PageLayout>
    </main>
  );
}
