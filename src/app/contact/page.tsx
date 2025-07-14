"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send, Facebook, Youtube, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const mapUrl = "https://www.google.com/maps/search/?api=1&query=860%20N%20Leroy%20St%2C%20Fenton%2C%20MI%2048430";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate form
    if (!formData.name.trim()) {
      setError('Please provide your name.');
      setIsLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError('Please provide your email address.');
      setIsLoading(false);
      return;
    }

    if (!formData.message.trim()) {
      setError('Please provide a message.');
      setIsLoading(false);
      return;
    }

    try {
      // Send contact form data to API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSuccess(true);

      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          message: '',
        });
        setSuccess(false);
      }, 5000);

    } catch (error) {
      setError('Failed to send message. Please try again or contact us directly.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <PageLayout
      title="Contact Us"
      subtitle="We'd love to hear from you. Whether you have questions, prayer requests, or just want to connect, don't hesitate to reach out."
    >
        <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information Column */}
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-heading">Get In Touch</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <InfoItem icon={Phone} label="Phone" value="(810) 629-6641" href="tel:810-629-6641" />
                        <InfoItem icon={Mail} label="Email" value="info@fbfenton.org" href="mailto:info@fbfenton.org" />
                        <InfoItem icon={MapPin} label="Address" value="860 N. Leroy Street, Fenton, MI 48430" href={mapUrl} />
                        <div className="flex space-x-2 pt-2">
                            <SocialLink href="https://www.facebook.com/pg/FBCfenton" icon={Facebook} label="Facebook" />
                            <SocialLink href="https://www.youtube.com/channel/UCo8E0MoXuz_E5BvaROleSDQ" icon={Youtube} label="YouTube" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="font-heading">Office Hours</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p><strong>Monday–Thursday:</strong> 9:00 AM – 4:00 PM</p>
                        <p><strong>Friday:</strong> Closed</p>
                        <p><strong>Sunday:</strong> Open during service hours</p>
                    </CardContent>
                </Card>
            </div>

            {/* Contact Form Column */}
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-heading">Send us a Message</CardTitle>
                        <CardDescription>
                            We'll get back to you as soon as possible.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {success && (
                            <Alert className="mb-6">
                                <CheckCircle className="h-4 w-4" />
                                <AlertTitle>Message Sent!</AlertTitle>
                                <AlertDescription>
                                    Thank you for contacting us. We'll get back to you soon.
                                </AlertDescription>
                            </Alert>
                        )}

                        {error && (
                            <Alert variant="destructive" className="mb-6">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input 
                                    id="name" 
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    required 
                                    disabled={isLoading || success}
                                    placeholder="Enter your full name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input 
                                    id="email" 
                                    type="email" 
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    required 
                                    disabled={isLoading || success}
                                    placeholder="Enter your email address"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea 
                                    id="message" 
                                    value={formData.message}
                                    onChange={(e) => handleInputChange('message', e.target.value)}
                                    required 
                                    rows={5} 
                                    disabled={isLoading || success}
                                    placeholder="Share your question, request, or message..."
                                />
                            </div>
                            <Button 
                                type="submit" 
                                className="w-full" 
                                disabled={isLoading || success}
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {success ? 'Message Sent!' : 'Send Message'}
                                <Send className="ml-2 h-4 w-4"/>
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    </PageLayout>
  );
}

const InfoItem = ({ icon: Icon, label, value, href }: { icon: React.ElementType, label: string, value: string, href: string }) => (
    <div className="flex items-start space-x-4">
        <Icon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
        <div>
            <p className="font-semibold">{label}</p>
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                {value}
            </a>
        </div>
    </div>
);

const SocialLink = ({ href, icon: Icon, label }: { href: string, icon: React.ElementType, label: string }) => (
    <Button variant="outline" size="icon" asChild>
        <Link href={href} target="_blank" aria-label={label}>
            <Icon className="h-5 w-5" />
        </Link>
    </Button>
); 