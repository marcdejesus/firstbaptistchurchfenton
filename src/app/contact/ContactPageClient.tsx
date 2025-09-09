"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Phone, Mail, Clock, Send, Facebook, Instagram, Youtube, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import Link from "next/link";
import { useChurchSettings } from '@/hooks/useChurchSettings';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactPageClient() {
  const mapUrl = "https://www.google.com/maps/search/?api=1&query=860%20N%20Leroy%20St%2C%20Fenton%2C%20MI%2048430";
  const { settings } = useChurchSettings();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
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
                        <InfoItem icon={Mail} label="Email" value={settings?.contactEmail || "info@fbfenton.org"} href={`mailto:${settings?.contactEmail || "info@fbfenton.org"}`} />
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
                        {submitStatus === 'success' && (
                            <Alert className="mb-6 border-green-200 bg-green-50">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-800">
                                    Thank you for your message! We've received it and will get back to you within 24-48 hours.
                                </AlertDescription>
                            </Alert>
                        )}
                        
                        {submitStatus === 'error' && (
                            <Alert className="mb-6 border-red-200 bg-red-50">
                                <AlertCircle className="h-4 w-4 text-red-600" />
                                <AlertDescription className="text-red-800">
                                    {errorMessage}
                                </AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name *</Label>
                                <Input 
                                    id="name" 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required 
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address *</Label>
                                <Input 
                                    id="email" 
                                    name="email"
                                    type="email" 
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required 
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input 
                                    id="phone" 
                                    name="phone"
                                    type="tel" 
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input 
                                    id="subject" 
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    placeholder="General Inquiry"
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Message *</Label>
                                <Textarea 
                                    id="message" 
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required 
                                    rows={5} 
                                    disabled={isSubmitting}
                                    placeholder="How can we help you?"
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending Message...
                                    </>
                                ) : (
                                    <>
                                        Send Message
                                        <Send className="ml-2 h-4 w-4"/>
                                    </>
                                )}
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
