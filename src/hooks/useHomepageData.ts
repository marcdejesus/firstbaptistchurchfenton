import { useState, useEffect } from 'react';

interface SlideshowItem {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  imageKey: string;
  linkUrl: string;
  linkText: string;
  order: number;
}

interface CurrentSeries {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  imageKey: string;
  startDate: string;
  endDate: string | null;
}

interface AnnouncementBanner {
  id: number;
  message: string;
  backgroundColor: string | null;
  textColor: string | null;
}

interface HomepageData {
  slideshow: SlideshowItem[];
  currentSeries: CurrentSeries | null;
  announcementBanner: AnnouncementBanner | null;
}

export function useHomepageData() {
  const [data, setData] = useState<HomepageData>({
    slideshow: [],
    currentSeries: null,
    announcementBanner: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/homepage');
        if (!response.ok) {
          throw new Error('Failed to fetch homepage data');
        }
        
        const homepageData = await response.json();
        setData(homepageData);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load homepage data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomepageData();
  }, []);

  return { data, isLoading, error };
}
