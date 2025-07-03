"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PageLayout } from '@/components/layout/PageLayout';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  return (
    <PageLayout title="Create an Account" subtitle="Join our community to connect and engage." variant="narrow">
      <Card className="w-full shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-heading">Create an Account</CardTitle>
          <CardDescription>
            Join our community to connect and engage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" disabled/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" disabled/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" disabled/>
            </div>
            <Button type="submit" className="w-full" disabled>
              Register
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
              <Button variant="link" asChild className="p-0 h-auto">
              <Link href="/login">Log in here</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </PageLayout>
  );
}
