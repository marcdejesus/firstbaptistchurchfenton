"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DollarSign, ExternalLink, Heart } from "lucide-react";

export default function DonatePage() {
  // PayPal donation URL
  const paypalDonationUrl = "https://www.paypal.com/donate?token=7ZK2msRFAeEPABp5v30NBZ2nLeUL1qzDW-tI8eJjHrylgMrNJxGCmNY9OBY7tObacJXlVgkDhaJZWtWk";

  return (
    <div className="max-w-2xl mx-auto py-12">
      <Card className="shadow-xl bg-card">
        <CardHeader className="text-center">
          <DollarSign className="mx-auto h-16 w-16 text-accent mb-4" />
          <CardTitle className="text-3xl font-lora text-card-foreground">Support Our Ministry</CardTitle>
          <CardDescription className="text-card-foreground/80 pt-2">
            Your generous contributions help us spread the Word, support our community, and maintain our church.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          {/* Scripture-based message about giving */}
          <div className="bg-primary/10 rounded-lg p-6 border border-primary/20">
            <div className="flex items-center justify-center mb-3">
              <Heart className="h-6 w-6 text-accent mr-2" />
              <h3 className="text-lg font-lora font-semibold text-card-foreground">Don't Give Under Compulsion</h3>
            </div>
            <p className="text-card-foreground/90 leading-relaxed mb-4">
              At First Baptist Church, we believe that giving should never be done out of compulsion or pressure. 
              Instead, we encourage giving from the heart, as it says in 2 Corinthians 9:6-8:
            </p>
            <blockquote className="italic text-card-foreground/80 border-l-4 border-accent pl-4 mb-4">
              "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, 
              for God loves a cheerful giver."
            </blockquote>
            <p className="text-card-foreground/90 leading-relaxed">
              If you feel led to make a donation to support our church and its mission, we offer a convenient and 
              secure online donation system. Simply click on the donate button and follow the prompts to make your 
              contribution. Thank you for your generosity and support.
            </p>
          </div>

          {/* PayPal donation button */}
          <Button 
            size="lg" 
            className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md w-full sm:w-auto"
            asChild
          >
            <Link 
              href={paypalDonationUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Donate securely through PayPal (opens in new tab)"
            >
              <ExternalLink className="mr-2 h-5 w-5" />
              Donate Securely Online
            </Link>
          </Button>

          {/* Additional giving options */}
          <p className="text-sm text-muted-foreground">
            If you prefer to give by mail or in person, please visit our{" "}
            <Link href="/#contact-us-section-id" className="text-accent hover:underline">
              contact section
            </Link>{" "}
            for more details.
          </p>

          {/* Tax deductible notice */}
          <p className="text-xs text-muted-foreground pt-4">
            All donations are tax-deductible as allowed by law. Thank you for your faithfulness!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
