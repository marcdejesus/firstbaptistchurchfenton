"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { HandHelping, Users, Calendar, Clock } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface VolunteerOpportunity {
  id: string;
  title: string;
  description: string;
  ministry: string;
  commitment: string;
  requirements: string[];
}

const mockOpportunities: VolunteerOpportunity[] = [
  {
    id: '1',
    title: 'Greeting Team Member',
    description: 'Be the first smiling face people see on Sunday mornings. Welcome attendees, hand out bulletins, and help visitors find their way.',
    ministry: 'Hospitality',
    commitment: 'Once a month, Sunday mornings',
    requirements: ['Friendly and welcoming attitude', 'Arrive 30 minutes before service'],
  },
  {
    id: '2',
    title: 'Kids Ministry Teacher',
    description: 'Invest in the next generation by teaching and caring for children during the Sunday service. Curriculum is provided.',
    ministry: 'Kids Ministry',
    commitment: 'Twice a month, Sunday mornings',
    requirements: ['Passion for working with children', 'Background check required'],
  },
  {
    id: '3',
    title: 'Audio/Visual Technician',
    description: 'Help create a seamless worship experience by running sound, slides, or the livestream during our services.',
    ministry: 'Worship Arts',
    commitment: 'Once or twice a month, including rehearsal',
    requirements: ['Tech-savvy and willing to learn', 'Training will be provided'],
  },
];

export default function VolunteerPage() {
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>(mockOpportunities);
  const [loading, setLoading] = useState(false);

  // NOTE: This is an example of how you would fetch from firestore
  // useEffect(() => {
  //   const fetchOpportunities = async () => {
  //     setLoading(true);
  //     try {
  //       const querySnapshot = await getDocs(collection(db, "volunteer-opportunities"));
  //       const opportunitiesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as VolunteerOpportunity[];
  //       setOpportunities(opportunitiesData);
  //     } catch (error) {
  //       console.error("Error fetching opportunities: ", error);
  //     }
  //     setLoading(false);
  //   };
  //   fetchOpportunities();
  // }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <HandHelping className="mx-auto h-12 w-12 text-accent mb-4" />
        <h1 className="text-4xl font-bold">Volunteer Opportunities</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Use your gifts to make a difference. Serving is a great way to connect with others and grow in your faith.
        </p>
      </div>

      {loading ? (
        <p>Loading opportunities...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {opportunities.map((opp) => (
            <VolunteerCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      )}
    </div>
  );
}

function VolunteerCard({ opportunity }: { opportunity: VolunteerOpportunity }) {
  const { user } = useUser();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        toast({ title: "Please log in", description: "You must be logged in to sign up.", variant: "destructive" });
        return;
    }
    setIsSubmitting(true);
    
    try {
        const response = await fetch('/api/volunteer-signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ opportunityId: opportunity.id, message })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to sign up.");
        }
        
        toast({ title: "Thank You!", description: `We've received your interest for the ${opportunity.title} role. We will be in touch soon!` });
        setIsOpen(false);
        setMessage('');
    } catch (error) {
        toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{opportunity.title}</CardTitle>
        <CardDescription>{opportunity.ministry}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground mb-4">{opportunity.description}</p>
        <div>
          <h4 className="font-semibold mb-2">Requirements:</h4>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            {opportunity.requirements.map((req, i) => <li key={i}>{req}</li>)}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-4">
         <div className="text-sm text-muted-foreground font-medium border-t pt-4 w-full">
            <Clock className="inline-block mr-2 h-4 w-4" />
            Commitment: {opportunity.commitment}
         </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
                <HandHelping className="mr-2 h-4 w-4"/>
                I'm Interested
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sign Up for: {opportunity.title}</DialogTitle>
            </DialogHeader>
            {user ? (
                 <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="message">Message (Optional)</label>
                        <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Let us know if you have any questions!"/>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="ghost">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Submit Interest"}
                        </Button>
                    </DialogFooter>
                 </form>
            ) : (
                <div className="text-center py-4">
                    <p className="mb-4">Please log in or create an account to express interest.</p>
                    <Link href="/login">
                        <Button>Login or Register</Button>
                    </Link>
                </div>
            )}
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
} 