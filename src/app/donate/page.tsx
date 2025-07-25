"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { CreditCard, Mail } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";

export default function DonatePage() {
  return (
    <PageLayout
      title="Give to First Baptist Church"
      subtitle="We want giving to be simple, secure, and impactful. Your generosity helps us continue our mission of making disciples and serving our community."
    >
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        
        <Card className="flex flex-col text-center hover:shadow-xl transition-shadow">
          <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                  <CreditCard className="h-8 w-8 text-primary" />
              </div>
            <CardTitle className="font-heading">Give Online</CardTitle>
            <CardDescription>
              Click the button below to give securely through our online giving platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-center">
            <Button asChild size="lg">
              <Link href="#"> 
                {/* Placeholder link as requested */}
                Go to Giving Platform
              </Link>
            </Button>
              <p className="text-xs text-muted-foreground mt-2">Platform link coming soon</p>
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
