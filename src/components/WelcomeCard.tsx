import Image from "next/image";
import { Lora } from "next/font/google";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Facebook, Youtube } from "lucide-react";
import { Event } from "../types/event";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React from "react";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "600"],
});

interface WelcomeCardProps {
  todaysHours: string;
  nextEvent: Event | null;
}

export function WelcomeCard({ todaysHours, nextEvent }: WelcomeCardProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const carouselComponent = (
    <div>
      <Carousel plugins={[plugin.current]} setApi={setApi}>
        <CarouselContent>
          <CarouselItem>
            <Image
              src="/front-art.png"
              alt="Front of First Baptist Church of Fenton"
              width={700}
              height={300}
              className="rounded-lg object-cover w-full h-auto"
            />
          </CarouselItem>
          <CarouselItem>
            <Image
              src="/outside-art.png"
              alt="Outside of First Baptist Church of Fenton"
              width={700}
              height={300}
              className="rounded-lg object-cover w-full h-auto"
            />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
      <div className="flex justify-center mt-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`h-2 w-2 rounded-full mx-1 ${
              index === current - 1 ? "bg-gray-800" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );

  const socialAndLogo = (
    <div className="flex items-center space-x-2 sm:space-x-3 self-center sm:self-auto">
      <div className="flex space-x-1 sm:space-x-2">
        <a
          href="https://www.facebook.com/FBCFentonMO"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600 hover:text-blue-600 w-8 h-8 sm:w-9 sm:h-9"
          >
            <Facebook className="w-7 h-7" />
          </Button>
        </a>
        <a
          href="https://www.youtube.com/@fbcfentonmo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600 hover:text-red-600 w-8 h-8 sm:w-9 sm:h-9"
          >
            <Youtube className="w-7 h-7" />
          </Button>
        </a>
      </div>
      <Image
        src="/logo.svg"
        alt="First Baptist Church of Fenton Logo"
        width={50}
        height={50}
        className="w-12 h-12 sm:w-[60px] sm:h-[57px]"
      />
      <div className={`text-right ${lora.className} hidden sm:block`}>
        <p className="text-xl sm:text-2xl">First Baptist</p>
        <p className="text-sm sm:text-base">Church of Fenton</p>
      </div>
    </div>
  );

  const infoBoxes = (
    <div className="flex md:flex-col overflow-x-auto md:overflow-visible gap-3 py-2 md:py-0">
      <div className="bg-gray-200/50 p-4 rounded-lg flex-shrink-0 w-4/5 sm:w-1/2 md:w-full flex flex-col justify-center items-center text-center">
        <Calendar className="w-8 h-8 mb-2" />
        <p className="font-medium">Next Event</p>
        {nextEvent ? (
          <>
            <p className="text-sm font-semibold">{nextEvent.title}</p>
            <p className="text-xs text-gray-600">
              {new Date(nextEvent.date).toLocaleDateString()}
            </p>
          </>
        ) : (
          <p className="text-sm">No upcoming events</p>
        )}
      </div>
      <div className="bg-gray-200/50 p-4 rounded-lg flex-shrink-0 w-4/5 sm:w-1/2 md:w-full flex flex-col justify-center items-center text-center">
        <Clock className="w-8 h-8 mb-2" />
        <p className="font-medium">Service Times</p>
        <p className="text-sm">Sunday Worship: 11:00 AM</p>
        <p className="text-sm">Sunday School: 9:45 AM</p>
        <p className="text-sm">Wednesday: 6:00 PM</p>
      </div>
      <div className="bg-gray-200/50 p-4 rounded-lg flex-shrink-0 w-4/5 sm:w-1/2 md:w-full flex flex-col justify-center items-center text-center">
        <Clock className="w-8 h-8 mb-2" />
        <p className="font-medium">Today's Hours</p>
        <p className="text-sm">{todaysHours}</p>
      </div>
    </div>
  );

  const announcementBox = (
    <div className="mt-4 p-4 bg-blue-100 text-blue-800 rounded-lg text-center">
      <p className="text-sm">
        This area will be used for announcements, if there are no
        announcements, it will display a random bible quote.
      </p>
    </div>
  );

  return (
    <Card className="w-full rounded-xl shadow-lg mx-auto my-16">
      <CardContent className="p-4 sm:p-6">
        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="flex justify-between items-center mb-4">
            <Link href="/welcome">
              <Image
                src="/welcome.png"
                alt="Welcome!"
                width={200}
                height={50}
              />
            </Link>
            {socialAndLogo}
          </div>

          {carouselComponent}
          <div className="space-y-4 mt-4">
            <p className="text-sm text-gray-600">
              Welcome to First Baptist Church of Fenton! We're a community
              dedicated to growing in faith and sharing God's love. We're so
              glad you're here.
            </p>
            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                className="w-full bg-[#788993] text-white hover:bg-[#667680]"
              >
                <Link href="/welcome">New Here?</Link>
              </Button>
              <Button
                size="lg"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                asChild
              >
                <Link href="/visit">Visit Us</Link>
              </Button>
            </div>
            {infoBoxes}
            {announcementBox}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="flex justify-between items-start mb-4">
            <Link href="/welcome">
              <Image
                src="/welcome.png"
                alt="Welcome!"
                width={200}
                height={50}
              />
            </Link>
            {socialAndLogo}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="md:col-span-1 space-y-4">
              <p className="text-sm text-gray-600 mb-4 px-2 sm:px-0">
                Welcome to First Baptist Church of Fenton! We're a community
                dedicated to growing in faith and sharing God's love. We're so
                glad you're here.
              </p>
              <div className="flex flex-col sm:flex-row md:flex-col gap-3 px-2 sm:px-0">
                <Button
                  size="lg"
                  className="w-full bg-[#788993] text-white hover:bg-[#667680]"
                >
                  <Link href="/welcome">New Here?</Link>
                </Button>
                <Button
                  size="lg"
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  asChild
                >
                  <Link href="/visit">Visit Us</Link>
                </Button>
              </div>
              {infoBoxes}
            </div>
            <div className="md:col-span-2">
              {carouselComponent}
              {announcementBox}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 