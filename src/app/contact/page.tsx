"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, CheckCircle, Send } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { PageLayout } from "@/components/layout/PageLayout";

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Contact" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          message: ""
        });
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null); // Clear error when user starts typing
  };

  const mapUrl = "https://www.google.com/maps/search/?api=1&query=860%20N%20Leroy%20St%2C%20Fenton%2C%20MI%2048430";

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <Card className="shadow-lg border-0 bg-scheme-2-background">
          <CardContent className="p-12 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
            <h1 className="text-desktop-heading2 font-heading font-bold text-scheme-2-text mb-4">
              Message Sent Successfully!
            </h1>
            <p className="text-desktop-textLarge text-scheme-2-text opacity-80 mb-6 font-body">
              Thank you for reaching out. We'll get back to you as soon as possible.
            </p>
            <Button 
              onClick={() => setSubmitted(false)}
              className="bg-primary-orange text-white hover:bg-primary-orange-dark"
            >
              Send Another Message
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Header breadcrumbs={breadcrumbs} />
      <PageLayout>
        <div className="space-y-12">
          {/* Header - Design System Enhanced */}
          <section className="text-center space-y-6 max-w-4xl mx-auto bg-scheme-1-background p-8 rounded-lg">
            <h1 className="text-desktop-heading1 font-heading font-bold text-scheme-1-text leading-tight">
              Let's Chat
            </h1>
            <p className="text-desktop-textLarge text-scheme-1-text opacity-90 max-w-3xl mx-auto leading-relaxed font-body">
              We'd love to hear from you. Whether you have questions, prayer requests, or just want to connect, 
              don't hesitate to reach out to our church family.
            </p>
          </section>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              {/* Church Info Card */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <Mail className="mr-3 h-6 w-6 text-accent" />
                    Get In Touch
                  </CardTitle>
                  <CardDescription>
                    We're here to help and would love to hear from you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <Mail className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Email</p>
                        <a 
                          href="mailto:Pastorjbell206@gmail.com" 
                          className="text-accent hover:text-accent/80 transition-colors"
                        >
                          Pastorjbell206@gmail.com
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <Phone className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Phone</p>
                        <a 
                          href="tel:8106299427" 
                          className="text-accent hover:text-accent/80 transition-colors"
                        >
                          (810) 629-9427
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <MapPin className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Address</p>
                        <a 
                          href={mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:text-accent/80 transition-colors"
                        >
                          860 N Leroy St.<br />
                          Fenton, MI 48430
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Service Times Card */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <Clock className="mr-3 h-6 w-6 text-accent" />
                    Service Times
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-muted">
                      <span><strong>Sunday Morning Worship</strong></span>
                      <span className="font-semibold text-accent">10:30 AM</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-muted">
                      <span><strong>Wednesday Bible Study</strong></span>
                      <span className="font-semibold text-accent">7:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span><strong>Special Services</strong></span>
                      <span className="text-muted-foreground">As announced</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Map Card */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <MapPin className="mr-3 h-6 w-6 text-accent" />
                    Visit Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full overflow-hidden rounded-lg">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2927.2205508499014!2d-83.70634412386768!3d42.80482517115491!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8823645ed2255039%3A0xe107428aa8c41294!2sFirst%20Baptist%20Church%20of%20Fenton!5e0!3m2!1sen!2sus!4v1750685540049!5m2!1sen!2sus" 
                      width="100%" 
                      height="300" 
                      style={{ border: 0 }} 
                      allowFullScreen
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                  <div className="text-center mt-4">
                    <p className="font-semibold text-lg">First Baptist Church of Fenton</p>
                    <p className="text-muted-foreground">860 N Leroy St, Fenton, MI 48430</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => window.open(mapUrl, '_blank')}
                    >
                      Get Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="space-y-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <Send className="mr-3 h-6 w-6 text-accent" />
                    Send Us a Message
                  </CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you soon
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          placeholder="First name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          placeholder="Last name"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="How can we help you? Share your questions, prayer requests, or just say hello..."
                        rows={6}
                        required
                      />
                    </div>

                    {error && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-700 text-sm">{error}</p>
                      </div>
                    )}
                    
                    <Button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                      size="lg"
                    >
                      {loading ? (
                        <>Sending...</>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Additional Info Card */}
              <Card className="shadow-lg border-accent/20">
                <CardContent className="p-6">
                  <div className="text-center">
                    <h3 className="font-semibold text-lg mb-3">What to Expect</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      When you contact us, you can expect a warm, personal response from our church family. 
                      We typically respond within 24 hours and look forward to connecting with you.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </PageLayout>
    </>
  );
} 