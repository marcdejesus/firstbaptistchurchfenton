import Image from "next/image";
import { Lora } from "next/font/google";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export function WelcomeCard() {
  return (
    <Card className="w-full rounded-xl shadow-lg mx-auto my-16">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className={`text-4xl font-semibold ${lora.className}`}>
            Welcome!
          </h1>
          <div className="flex items-center space-x-3">
            <Image src="/logo.svg" alt="First Baptist Church of Fenton Logo" width={60} height={57} />
            <div className={`text-right ${lora.className}`}>
              <p className="text-2xl">First Baptist</p>
              <p className="text-base">Church of Fenton</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <Image
            src="/outside-art.png"
            alt="Outside of First Baptist Church of Fenton"
            width={800}
            height={350}
            className="rounded-lg object-cover w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1 space-y-4">
            <Button  size="lg" className="w-full bg-[#788993] text-white hover:bg-[#667680]">
              New Here?
            </Button>
            <Button size="lg" className="w-full">
              Visit Us
            </Button>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-200/50 p-4 rounded-lg flex flex-col justify-center items-center text-center">
              <Calendar className="w-8 h-8 mb-2" />
              <p className="font-medium">Next Event</p>
            </div>
            <div className="bg-gray-200/50 p-4 rounded-lg flex flex-col justify-center items-center text-center">
              <Clock className="w-8 h-8 mb-2" />
              <p className="font-medium">Office Hours</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 