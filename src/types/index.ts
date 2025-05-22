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
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
};

// For AI event summary generation
export type GenerateEventSummaryInput = {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
};
