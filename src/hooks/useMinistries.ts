import { useState, useEffect } from 'react';

export interface Ministry {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  targetAudience?: string;
  meetingTime?: string;
  contactEmail?: string;
  order: number;
}

export function useMinistries() {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMinistries() {
      try {
        setLoading(true);
        const response = await fetch('/api/ministries');
        
        if (!response.ok) {
          throw new Error('Failed to fetch ministries');
        }
        
        const data = await response.json();
        setMinistries(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching ministries:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMinistries();
  }, []);

  return { ministries, loading, error };
}
