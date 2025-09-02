import { useState, useEffect } from 'react';

export interface MissionPartner {
  id: number;
  name: string;
  description: string;
  location?: string;
  website?: string;
  imageUrl?: string;
  imageKey?: string;
  type: 'LOCAL' | 'INTERNATIONAL';
}

export function useMissionPartners() {
  const [missionPartners, setMissionPartners] = useState<MissionPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMissionPartners() {
      try {
        setLoading(true);
        const response = await fetch('/api/mission-partners');
        
        if (!response.ok) {
          throw new Error('Failed to fetch mission partners');
        }
        
        const data = await response.json();
        setMissionPartners(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching mission partners:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMissionPartners();
  }, []);

  return { missionPartners, loading, error };
}
