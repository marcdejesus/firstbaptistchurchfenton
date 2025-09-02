"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { CreditCard, Mail } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { useDonateSettings } from "@/hooks/useDonateSettings";

export default function DonatePage() {
  const { donateSettings, loading, error } = useDonateSettings();

  // Fallback values if data is still loading or there's an error
  const donateUrl = donateSettings?.donateUrl || "https://www.paypal.com/donate?token=6-wnb_Sj_MupmasvWZnxJSDO899HjDQcX5bp4X63zwZrAL0QI_VKxgXHkGaWENDHRxbNG4Yw5txQpqKA";
  const description = donateSettings?.description || "We want giving to be simple, secure, and impactful. Your generosity helps us continue our mission of making disciples and serving our community.";

  return (
    <PageLayout
      title="Give to First Baptist Church"
      subtitle={description}
    >
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        
        <Card className="flex flex-col text-center hover:shadow-xl transition-shadow">
          <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                  <CreditCard className="h-8 w-8 text-primary" />
              </div>
            <CardTitle className="font-heading">Give Online</CardTitle>
            <CardDescription>
              Click the button below to give securely through our PayPal page.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-center">
            <Button asChild size="lg">
              <Link href={donateUrl}>
                Donate
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col text-center hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                  <Mail className="h-8 w-8 text-primary" />
              </div>
            <CardTitle className="font-heading">Give by Mail</CardTitle>
            <CardDescription>
              If you prefer to give by mail, checks can be made out to:
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-center text-lg">
              <p className="font-semibold">First Baptist Church of Fenton</p>
              <p className="text-muted-foreground">860 N. Leroy Street</p>
              <p className="text-muted-foreground">Fenton, MI 48430</p>
          </CardContent>
        </Card>

      </div>
    </PageLayout>
  );
}
