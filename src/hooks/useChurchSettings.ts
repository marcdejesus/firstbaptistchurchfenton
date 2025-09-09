"use client";

import { useState, useEffect } from 'react';

interface ChurchSettings {
  contactEmail: string;
  prayerEmail: string;
}

export function useChurchSettings() {
  const [settings, setSettings] = useState<ChurchSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/church-settings');
        
        if (!response.ok) {
          throw new Error('Failed to fetch church settings');
        }
        
        const data = await response.json();
        setSettings(data);
      } catch (err) {
        console.error('Error fetching church settings:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Set fallback values
        setSettings({
          contactEmail: 'info@fbfenton.org',
          prayerEmail: 'prayer@fbfenton.org',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
}
