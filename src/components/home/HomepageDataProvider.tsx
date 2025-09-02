"use client";

import { useEffect } from 'react';
import { useHomepageData } from '@/hooks/useHomepageData';
import { AnnouncementBanner } from './AnnouncementBanner';

export function HomepageDataProvider() {
  const { data, isLoading, error } = useHomepageData();

  // Don't render anything if there's no announcement banner
  if (!data.announcementBanner) {
    return null;
  }

  return (
    <AnnouncementBanner
      message={data.announcementBanner.message}
      backgroundColor={data.announcementBanner.backgroundColor}
      textColor={data.announcementBanner.textColor}
    />
  );
}
