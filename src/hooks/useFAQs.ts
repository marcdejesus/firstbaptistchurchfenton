import { useState, useEffect } from 'react';

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  order: number;
}

export function useFAQs() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFAQs() {
      try {
        setLoading(true);
        const response = await fetch('/api/faq');
        
        if (!response.ok) {
          throw new Error('Failed to fetch FAQs');
        }
        
        const data = await response.json();
        setFaqs(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching FAQs:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchFAQs();
  }, []);

  return { faqs, loading, error };
}
