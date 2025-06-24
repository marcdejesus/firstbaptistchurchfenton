"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"

const carouselItems = [
  {
    id: 1,
    image: "/outside-art.png",
    title: "WELCOME TO FIRST BAPTIST",
    subtitle: "Your journey of faith is important. We provide a community to grow and belong.",
    buttonText: "PLAN YOUR VISIT",
    buttonLink: "/contact#new-here"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop",
    title: "DISCOVER OUR MINISTRIES",
    subtitle: "From youth groups to community outreach, there's a place for you.",
    buttonText: "EXPLORE MINISTRIES",
    buttonLink: "/ministries"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1426024120108-99cc76989c71?q=80&w=2070&auto=format&fit=crop",
    title: "JOIN US FOR WORSHIP",
    subtitle: "Experience uplifting music, inspiring messages, and a welcoming atmosphere.",
    buttonText: "VIEW SERVICE TIMES",
    buttonLink: "#contact-us-section-id"
  }
];

export function HeroCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const plugin = React.useRef(
    Autoplay({ delay: 10000, stopOnInteraction: true })
  )

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="relative w-full h-full">
      <Carousel
        setApi={setApi}
        className="w-full h-full"
        plugins={[plugin.current]}
        opts={{
          align: "start",
          loop: true,
        }}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {carouselItems.map((item) => (
            <CarouselItem key={item.id} className="relative w-full h-[600px]">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                priority={item.id === 1}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
          {carouselItems.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`h-3 w-3 rounded-full ${current === index ? 'bg-accent' : 'bg-white/50'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
} 