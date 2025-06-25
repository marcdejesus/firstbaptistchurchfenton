"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { Send, Heart, AlertCircle } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import Link from 'next/link';

interface PrayerRequest {
  id: string;
  request: string;
  userName: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export default function PrayerPage() {
  const { user, isLoading: userLoading } = useUser();
  const [request, setRequest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      setLoadingRequests(false);
      return;
    };

    const q = query(collection(db, "prayer-requests"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const requestsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PrayerRequest[];
      setPrayerRequests(requestsData);
      setLoadingRequests(false);
    }, (error) => {
      console.error("Error fetching prayer requests: ", error);
      toast({
        title: "Error",
        description: "Could not load prayer requests.",
        variant: "destructive",
      });
      setLoadingRequests(false);
    });

    return () => unsubscribe();
  }, [user, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.isApprovedMember) return;
    setIsSubmitting(true);

    if (!request) {
      toast({
        title: "Error",
        description: "Please enter your prayer request.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/prayer-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ request }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong. Please try again.');
      }

      toast({
        title: "Request Submitted",
        description: "Thank you. Your prayer request has been shared.",
      });

      setRequest('');
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    if (userLoading) {
      return <p>Loading...</p>;
    }

    if (!user) {
      return (
        <Card className="text-center">
          <CardHeader>
            <CardTitle>Join Our Prayer Community</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Please log in or create an account to view prayer requests and share your own.</p>
            <Link href="/login">
              <Button>Login or Register</Button>
            </Link>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-8">
        {user.isApprovedMember ? (
          <Card>
            <CardHeader>
              <CardTitle>Submit a Prayer Request</CardTitle>
              <CardDescription>Share your request with the church community.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="request" className="block text-sm font-medium text-muted-foreground mb-1">Your Prayer Request</label>
                  <Textarea
                    id="request"
                    value={request}
                    onChange={(e) => setRequest(e.target.value)}
                    placeholder="Share your prayer request here..."
                    required
                    rows={4}
                  />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-amber-50 border-amber-200">
             <CardHeader className="flex flex-row items-center space-x-4">
               <AlertCircle className="h-8 w-8 text-amber-600" />
               <div>
                <CardTitle className="text-amber-800">Posting requires member approval</CardTitle>
                <CardDescription className="text-amber-700">
                  To post a prayer request, your account needs to be approved by an admin. Please contact the church office for approval.
                </CardDescription>
               </div>
            </CardHeader>
          </Card>
        )}

        <div>
          <h2 className="text-3xl font-bold text-center mb-6">Community Prayer Wall</h2>
          {loadingRequests ? (
            <p>Loading prayer requests...</p>
          ) : prayerRequests.length === 0 ? (
             <p className="text-center text-muted-foreground">No prayer requests yet. Be the first to share!</p>
          ) : (
            <div className="space-y-4">
              {prayerRequests.map((req) => (
                <Card key={req.id}>
                  <CardContent className="pt-6">
                    <p className="whitespace-pre-wrap">{req.request}</p>
                  </CardContent>
                  <CardFooter className="text-sm text-muted-foreground">
                    <p>Praying for: {req.userName}</p>
                    <p className="ml-auto">{new Date(req.createdAt.seconds * 1000).toLocaleDateString()}</p>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Heart className="mx-auto h-12 w-12 text-accent mb-4" />
          <h1 className="text-4xl font-bold">Prayer Requests</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            "Carry each other's burdens, and in this way you will fulfill the law of Christ." - Galatians 6:2
          </p>
        </div>
        {renderContent()}
      </div>
    </div>
  );
} 