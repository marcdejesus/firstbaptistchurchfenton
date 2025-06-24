export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  category: string;
  rsvps?: number;
  description?: string;
  location?: string;
  isFeatured?: boolean;
} 