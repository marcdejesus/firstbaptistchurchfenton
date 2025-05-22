"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, isLoading, login } = useUser(); // Using login to simulate update
  const router = useRouter();
  const [name, setName] = React.useState(user?.name || '');
  const [email, setEmail] = React.useState(user?.email || '');
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
    if (user) {
        setName(user.name);
        setEmail(user.email);
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>;
  }
  
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    login({ ...user, name, email }); // Update user context (mock)
    setIsSaving(false);
    // In a real app, show a toast message
    alert("Profile updated successfully!");
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card className="shadow-xl bg-card">
        <CardHeader>
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatarUrl || `https://placehold.co/100x100.png`} alt={user.name} data-ai-hint="user portrait" />
              <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-3xl font-lora text-card-foreground">{user.name}</CardTitle>
              <CardDescription className="text-card-foreground/80">{user.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveChanges} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="bg-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="bg-input"
              />
            </div>
             {/* Add more profile fields here as needed */}
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
