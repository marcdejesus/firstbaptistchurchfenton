"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';

export default function ProfilePage() {
  return (
    <PageLayout title="My Profile" variant="narrow">
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={`https://placehold.co/100x100.png`} alt="User Name" data-ai-hint="user portrait" />
              <AvatarFallback>UN</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-3xl font-heading">User Name</CardTitle>
              <CardDescription>user.email@example.com</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                defaultValue="User Name"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                defaultValue="user.email@example.com" 
                disabled
              />
            </div>
            <Button type="submit" className="w-full" disabled>
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
