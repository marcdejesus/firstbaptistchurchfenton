"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface SlideshowItem {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  imageKey: string;
  linkUrl: string;
  linkText: string;
  order: number;
}

export type HeroSlideshowBackgroundProps = {
  slideshowItems: SlideshowItem[];
  intervalMs?: number;
  className?: string;
  overlayClassName?: string;
};

export function HeroSlideshowBackground({
  slideshowItems,
  intervalMs = 7000,
  className,
  overlayClassName,
}: HeroSlideshowBackgroundProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect((): (() => void) => {
    if (!slideshowItems || slideshowItems.length === 0) return () => {};
    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideshowItems.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [slideshowItems, intervalMs]);

  if (!slideshowItems || slideshowItems.length === 0) {
    // Fallback to church.png placeholder
    return (
      <div className={cn("absolute inset-0 -z-10", className)} aria-hidden>
        <Image
          src="/church.png"
          alt="First Baptist Church Fenton"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className={cn("absolute inset-0 bg-black/55", overlayClassName)} />
      </div>
    );
  }

  return (
    <div className={cn("absolute inset-0 -z-10", className)} aria-hidden>
      {slideshowItems.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            index === currentIndex ? "opacity-100" : "opacity-0"
          )}
        >
          <Image
            src={item.imageUrl}
            alt={item.title || "Slideshow image"}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}
      <div className={cn("absolute inset-0 bg-black/55", overlayClassName)} />
    </div>
  );
}


