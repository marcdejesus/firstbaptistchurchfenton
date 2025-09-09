"use client";

import { useHomepageData } from '@/hooks/useHomepageData';
import { AnnouncementBanner } from './AnnouncementBanner';

export function HomepageDataProvider() {
  const { data, isLoading, error } = useHomepageData();

  // Don't render anything if loading, error, or no announcement banner
  if (isLoading || error || !data.announcementBanner) {
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
