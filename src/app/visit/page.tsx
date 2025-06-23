"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, Phone, Mail } from "lucide-react";

export default function VisitPage() {
  return (
    <div className="bg-background text-foreground">
      <header className="bg-primary text-primary-foreground py-20 text-center">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold font-lora">Plan Your Visit</h1>
          <p className="mt-4 text-xl text-primary-foreground/80">We look forward to welcoming you!</p>
        </div>
      </header>

      <main className="container mx-auto py-16 px-4 space-y-16">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Map */}
          <div className="w-full">
            <h2 className="text-3xl font-lora font-bold text-primary-foreground mb-4">Our Location</h2>
            <Card className="shadow-lg overflow-hidden">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2927.2205508499014!2d-83.70634412386768!3d42.80482517115491!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8823645ed2255039%3A0xe107428aa8c41294!2sFirst%20Baptist%20Church%20of%20Fenton!5e0!3m2!1sen!2sus!4v1750685540049!5m2!1sen!2sus" 
                  width="100%" 
                  height="450" 
                  style={{ border: 0 }} 
                  allowFullScreen
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </Card>
             <div className="mt-4 text-center text-muted-foreground">
              <p className="font-semibold text-lg text-primary-foreground">First Baptist Church of Fenton</p>
              <p>860 N Leroy St, Fenton, MI 48430</p>
            </div>
          </div>

          {/* Right Column: Information */}
          <div className="space-y-8">
             <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center font-lora text-2xl">
                  <Clock className="mr-3 h-7 w-7 text-accent" />
                  Service Times
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span><strong>Sunday Morning Worship</strong></span>
                  <span className="font-semibold text-accent">10:30 AM</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span><strong>Wednesday Bible Study</strong></span>
                  <span className="font-semibold text-accent">7:00 PM</span>
                </div>
                 <p className="text-sm text-muted-foreground pt-2">
                  We have programs available for children and youth during our Sunday service.
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center font-lora text-2xl">
                   <Phone className="mr-3 h-7 w-7 text-accent" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <p className="flex items-center">
                    <Mail className="mr-3 h-5 w-5 text-accent" /> 
                    <span>Pastorjbell206@gmail.com</span>
                  </p>
                  <p className="flex items-center">
                    <Phone className="mr-3 h-5 w-5 text-accent" /> 
                    <span>(810) 629-9427</span>
                  </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
} 