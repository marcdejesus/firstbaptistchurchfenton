import { useState, useEffect } from 'react';

export interface DonateSettings {
  donateUrl: string;
  description: string;
}

export function useDonateSettings() {
  const [donateSettings, setDonateSettings] = useState<DonateSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDonateSettings() {
      try {
        setLoading(true);
        const response = await fetch('/api/donate-settings');
        
        if (!response.ok) {
          throw new Error('Failed to fetch donate settings');
        }
        
        const data = await response.json();
        setDonateSettings(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching donate settings:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDonateSettings();
  }, []);

  return { donateSettings, loading, error };
}
