import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CommunityPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 text-center">
      <Card className="shadow-xl bg-card">
        <CardHeader>
          <Users className="mx-auto h-16 w-16 text-accent mb-4" />
          <CardTitle className="text-3xl font-lora text-card-foreground">Community Hub</CardTitle>
          <CardDescription className="text-card-foreground/80 pt-2">
            Connect with fellow members, join discussions, and stay updated.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-2xl font-semibold text-primary-foreground">
            Coming Soon!
          </p>
          <p className="text-card-foreground/90">
            We are working hard to bring you an interactive community discussion board and member portal. 
            This space will allow for fellowship, event coordination, and sharing of prayer requests and praises.
          </p>
          <p className="text-card-foreground/90">
            Stay tuned for updates!
          </p>
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/">Return to Homepage</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
