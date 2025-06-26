import type { Event } from '@/types';
import { mapColorToCategory } from './categories';

// Extract capacity from event description
export const extractCapacity = (description?: string): number | undefined => {
  if (!description) return undefined;
  
  const capacityMatch = description.match(/capacity:\s*(\d+)/i) || 
                       description.match(/max:\s*(\d+)/i) ||
                       description.match(/limit:\s*(\d+)/i);
  
  return capacityMatch ? parseInt(capacityMatch[1]) : undefined;
};

// Extract contact info from event description
export const extractContactInfo = (description?: string): string | undefined => {
  if (!description) return undefined;
  
  const contactMatch = description.match(/contact:\s*([^\n]+)/i) ||
                      description.match(/info:\s*([^\n]+)/i) ||
                      description.match(/questions:\s*([^\n]+)/i);
  
  return contactMatch ? contactMatch[1].trim() : undefined;
};

// Extract tags from title and description
export const extractTags = (title: string, description?: string): string[] => {
  const tags: string[] = [];
  const text = `${title} ${description || ''}`.toLowerCase();
  
  // Common tag keywords
  const tagMap = {
    'food': ['food', 'meal', 'lunch', 'dinner', 'breakfast', 'potluck', 'bbq'],
    'outdoor': ['outdoor', 'park', 'picnic', 'garden'],
    'music': ['music', 'worship', 'song', 'choir', 'band'],
    'kids': ['kids', 'children', 'family'],
    'youth': ['youth', 'teen', 'young adult'],
    'prayer': ['prayer', 'pray', 'devotion'],
    'study': ['study', 'bible', 'scripture', 'lesson'],
    'service': ['service', 'volunteer', 'outreach', 'community'],
    'celebration': ['celebrate', 'party', 'anniversary', 'birthday']
  };
  
  Object.entries(tagMap).forEach(([tag, keywords]) => {
    if (keywords.some(keyword => text.includes(keyword))) {
      tags.push(tag);
    }
  });
  
  return tags;
};

// Convert 12-hour time format to 24-hour format
export const convertTo24Hour = (time12h: string): string => {
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  
  if (hours === '12') {
    hours = '00';
  }
  
  if (modifier === 'PM') {
    hours = String(parseInt(hours, 10) + 12);
  }
  
  return `${hours}:${minutes}`;
};

// Convert Google Calendar event to our Event type
export const convertGoogleEventToEvent = (googleEvent: any): Event => {
  const startDateTime = googleEvent.start?.dateTime || googleEvent.start?.date;
  const endDateTime = googleEvent.end?.dateTime || googleEvent.end?.date;
  
  // Parse date and time
  const isAllDay = !googleEvent.start?.dateTime;
  
  let localDateString: string;
  let eventDate: Date;
  
  if (isAllDay) {
    // For all-day events, parse the date string directly to avoid timezone conversion
    // startDateTime will be in format "YYYY-MM-DD"
    localDateString = startDateTime; // Use the date string directly
    // Create date object for time formatting, but add time to avoid UTC conversion issues
    eventDate = new Date(startDateTime + 'T12:00:00'); // Add noon time to avoid timezone edge cases
  } else {
    // For timed events, create date object and format locally
    eventDate = new Date(startDateTime);
    const localYear = eventDate.getFullYear();
    const localMonth = String(eventDate.getMonth() + 1).padStart(2, '0');
    const localDay = String(eventDate.getDate()).padStart(2, '0');
    localDateString = `${localYear}-${localMonth}-${localDay}`;
  }
  
  const category = mapColorToCategory(googleEvent.colorId);
  const capacity = extractCapacity(googleEvent.description);
  const contactInfo = extractContactInfo(googleEvent.description);
  const tags = extractTags(googleEvent.summary || '', googleEvent.description);
  
  // Clean description by removing our extracted metadata
  let cleanDescription = googleEvent.description || '';
  cleanDescription = cleanDescription.replace(/capacity:\s*\d+/gi, '');
  cleanDescription = cleanDescription.replace(/contact:\s*[^\n]+/gi, '');
  cleanDescription = cleanDescription.replace(/info:\s*[^\n]+/gi, '');
  cleanDescription = cleanDescription.replace(/questions:\s*[^\n]+/gi, '');
  cleanDescription = cleanDescription.trim();
  
  return {
    id: googleEvent.id || Math.random().toString(36).substr(2, 9),
    title: googleEvent.summary || 'Untitled Event',
    date: localDateString, // Use the properly formatted date string
    time: isAllDay ? 'All Day' : eventDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    }),
    location: googleEvent.location || 'TBD',
    description: cleanDescription || 'No description available.',
    summary: cleanDescription.length > 150 ? 
      cleanDescription.substring(0, 150) + '...' : 
      cleanDescription,
    rsvps: googleEvent.attendees?.length || 0,
    isUserRsvped: false, // This would need to be checked separately
    category,
    capacity,
    isOutdoor: tags.includes('outdoor'),
    hasWeatherAlert: false, // This would need weather API integration
    tags,
    contactInfo,
  };
};

// Convert our Event type to Google Calendar event format
export const convertToGoogleEvent = (event: Event, duration: number = 120) => {
  const startDateTime = new Date(`${event.date}T${event.time !== 'All Day' ? convertTo24Hour(event.time) : '00:00'}:00`);
  const endDateTime = new Date(startDateTime.getTime() + duration * 60000); // Add duration in minutes
  
  return {
    summary: event.title,
    description: event.description + (event.contactInfo ? `\n\nContact: ${event.contactInfo}` : '') + (event.capacity ? `\n\nCapacity: ${event.capacity}` : ''),
    location: event.location,
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    colorId: event.category?.id ? String(['worship', 'fellowship', 'outreach', 'education', 'youth', 'family', 'special'].indexOf(event.category.id) + 1) : '1',
  };
}; 