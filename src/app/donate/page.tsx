import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DollarSign, ExternalLink } from "lucide-react";

export default function DonatePage() {
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
          <p className="text-card-foreground/90">
            We partner with a secure third-party payment processor to handle online donations. 
            Click the button below to proceed to our secure donation portal.
          </p>
          {/* In a real application, this button would link to the actual payment processor page */}
          <Button 
            size="lg" 
            className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md w-full sm:w-auto"
            onClick={() => alert("Redirecting to secure donation platform (placeholder)...")}
          >
            <ExternalLink className="mr-2 h-5 w-5" />
            Donate Securely Online
          </Button>
          <p className="text-sm text-muted-foreground">
            If you prefer to give by mail or in person, please visit our <Link href="/#contact-us-section-id" className="text-accent hover:underline">contact section</Link> for more details.
          </p>
          <p className="text-xs text-muted-foreground pt-4">
            All donations are tax-deductible as allowed by law. Thank you for your faithfulness!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
