import { useState, useEffect } from 'react';

export interface StaffMember {
  id: number;
  name: string;
  position: string;
  description?: string;
  email?: string;
  photoUrl?: string;
  order: number;
}

export function useStaff() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStaff() {
      try {
        setLoading(true);
        const response = await fetch('/api/staff');
        
        if (!response.ok) {
          throw new Error('Failed to fetch staff members');
        }
        
        const data = await response.json();
        setStaffMembers(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching staff members:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStaff();
  }, []);

  return { staffMembers, loading, error };
}
