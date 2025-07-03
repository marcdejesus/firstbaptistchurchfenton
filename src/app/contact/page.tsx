"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send, Facebook, Instagram, Youtube } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import Link from "next/link";

export default function ContactPage() {
  const mapUrl = "https://www.google.com/maps/search/?api=1&query=860%20N%20Leroy%20St%2C%20Fenton%2C%20MI%2048430";

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

                <Card>
                    <CardHeader>
                        <CardTitle className="font-heading">Connect With Us</CardTitle>
                    </CardHeader>
                    <CardContent className="flex space-x-4">
                        <SocialLink href="#" icon={Facebook} label="Facebook" />
                        <SocialLink href="#" icon={Instagram} label="Instagram" />
                        <SocialLink href="#" icon={Youtube} label="YouTube" />
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
                        <form className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" required disabled />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" required disabled />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea id="message" required rows={5} disabled />
                            </div>
                            <Button type="submit" className="w-full" disabled>
                                Send Message <Send className="ml-2 h-4 w-4"/>
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