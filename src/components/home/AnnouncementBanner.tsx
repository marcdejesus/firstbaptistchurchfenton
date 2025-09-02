"use client";

import { X } from 'lucide-react';
import { useState } from 'react';

interface AnnouncementBannerProps {
  message: string;
  backgroundColor?: string | null;
  textColor?: string | null;
}

export function AnnouncementBanner({ 
  message, 
  backgroundColor = '#1f2937', 
  textColor = '#ffffff' 
}: AnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div 
      className="relative z-30 py-3 px-4 text-center"
      style={{ 
        backgroundColor: backgroundColor || '#1f2937',
        color: textColor || '#ffffff'
      }}
    >
      <div className="container mx-auto flex items-center justify-center">
        <p className="text-sm font-medium">
          {message}
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 p-1 hover:opacity-70 transition-opacity"
          aria-label="Close announcement"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
