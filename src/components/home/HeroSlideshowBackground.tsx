"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type HeroSlideshowBackgroundProps = {
  images: string[];
  intervalMs?: number;
  className?: string;
  overlayClassName?: string;
};

export function HeroSlideshowBackground({
  images,
  intervalMs = 7000,
  className,
  overlayClassName,
}: HeroSlideshowBackgroundProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect((): (() => void) => {
    if (!images || images.length === 0) return () => {};
    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [images, intervalMs]);

  if (!images || images.length === 0) return null;

  return (
    <div className={cn("absolute inset-0 -z-10", className)} aria-hidden>
      {images.map((src, index) => (
        <div
          key={src + index}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            index === currentIndex ? "opacity-100" : "opacity-0"
          )}
        >
          <Image
            src={src}
            alt=""
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


