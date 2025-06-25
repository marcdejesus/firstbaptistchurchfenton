export type Event = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM AM/PM
  location: string;
  description: string;
  summary?: string; // AI generated
  rsvps: number;
  isUserRsvped?: boolean; // To track if the current logged-in user has RSVPed
  // New enhanced fields
  category?: EventCategory;
  capacity?: number;
  attendees?: User[]; // List of people attending (if sharing enabled)
  tags?: string[];
  isOutdoor?: boolean;
  hasWeatherAlert?: boolean;
  weatherInfo?: string;
  directions?: string;
  contactInfo?: string;
  relatedEvents?: string[]; // IDs of related events
};

export type EventCategory = {
  id: string;
  name: string;
  color: string;
  icon: string;
  description?: string;
};

export type EventFilter = {
  category?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchQuery?: string;
  showOnlyUserRsvped?: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: 'member' | 'admin';
  isApprovedMember?: boolean;
};

// For AI event summary generation
export type GenerateEventSummaryInput = {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
};

export type Testimonial = {
  id: string;
  name: string;
  avatarUrl: string;
  rating: number; // 1-5
  date: string; // e.g., "July 20, 2024"
  content: string;
  aiHint?: string; // For avatar placeholder
};
