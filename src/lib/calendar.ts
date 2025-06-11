import { google } from 'googleapis';
import type { Event } from '@/types';

// Initialize Google Calendar API client
const calendar = google.calendar('v3');

// OAuth2 configuration for user authentication
export const getOAuth2Client = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXTAUTH_URL || 'http://localhost:9002'}/api/calendar/callback`
  );
};

// Service Account configuration for church calendar access
export const getServiceAccountAuth = () => {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) {
    throw new Error('Service account credentials not configured');
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
  });

  return auth;
};

// Event categories for mapping Google Calendar events
const eventCategories = [
  { id: 'worship', name: 'Worship', icon: '🙏', color: '#8B5CF6', description: 'Worship services and spiritual gatherings' },
  { id: 'fellowship', name: 'Fellowship', icon: '🤝', color: '#06B6D4', description: 'Community and social events' },
  { id: 'outreach', name: 'Outreach', icon: '💝', color: '#10B981', description: 'Service and community outreach' },
  { id: 'education', name: 'Education', icon: '📚', color: '#F59E0B', description: 'Learning and Bible study' },
  { id: 'youth', name: 'Youth', icon: '🎯', color: '#EF4444', description: 'Youth and teen activities' },
  { id: 'family', name: 'Family', icon: '👨‍👩‍👧‍👦', color: '#EC4899', description: 'Family-oriented events' },
  { id: 'special', name: 'Special Events', icon: '⭐', color: '#6366F1', description: 'Special occasions and holidays' }
];

// Map Google Calendar color IDs to our event categories
const mapColorToCategory = (colorId?: string) => {
  const colorCategoryMap: Record<string, string> = {
    '9': 'worship',    // Blue
    '6': 'fellowship', // Orange  
    '10': 'outreach',  // Green
    '5': 'education',  // Yellow
    '11': 'youth',     // Red
    '4': 'family',     // Pink
    '8': 'special',    // Purple
  };
  
  const categoryId = colorCategoryMap[colorId || ''] || 'fellowship';
  return eventCategories.find(c => c.id === categoryId);
};

// Extract capacity from event description
const extractCapacity = (description?: string): number | undefined => {
  if (!description) return undefined;
  
  const capacityMatch = description.match(/capacity:\s*(\d+)/i) || 
                       description.match(/max:\s*(\d+)/i) ||
                       description.match(/limit:\s*(\d+)/i);
  
  return capacityMatch ? parseInt(capacityMatch[1]) : undefined;
};

// Extract contact info from event description
const extractContactInfo = (description?: string): string | undefined => {
  if (!description) return undefined;
  
  const contactMatch = description.match(/contact:\s*([^\n]+)/i) ||
                      description.match(/info:\s*([^\n]+)/i) ||
                      description.match(/questions:\s*([^\n]+)/i);
  
  return contactMatch ? contactMatch[1].trim() : undefined;
};

// Extract tags from title and description
const extractTags = (title: string, description?: string): string[] => {
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
    // Additional fields that might be in extended properties

  };
};

// Fetch events from church Google Calendar using service account
export const fetchChurchCalendarEvents = async (
  calendarId: string = process.env.CHURCH_CALENDAR_ID || 'primary',
  maxResults: number = 50
): Promise<Event[]> => {
  try {
    // Get service account authentication
    const auth = getServiceAccountAuth();
    
    // Get events from now until 6 months in the future
    const timeMin = new Date().toISOString();
    const timeMax = new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString(); // 6 months
    
    // Use the calendar API with proper authentication
    const calendarAPI = google.calendar({ version: 'v3', auth });
    
    const response = await calendarAPI.events.list({
      calendarId,
      timeMin,
      timeMax,
      maxResults,
      singleEvents: true,
      orderBy: 'startTime',
    });
    
    const events = response.data.items || [];
    
    // Convert Google Calendar events to our Event type
    const convertedEvents = events
      .filter(event => event.summary) // Only include events with titles
      .map(convertGoogleEventToEvent);
    
    console.log(`Fetched ${convertedEvents.length} events from Google Calendar`);
    return convertedEvents;
  } catch (error) {
    console.error('Error fetching church calendar events:', error);
    throw new Error(`Failed to fetch church calendar events: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Helper function to convert 12-hour to 24-hour format
const convertTo24Hour = (time12h: string): string => {
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  
  if (hours === '12') {
    hours = '00';
  }
  if (modifier === 'PM') {
    hours = String(parseInt(hours, 10) + 12);
  }
  
  return `${hours.padStart(2, '0')}:${minutes}:00`;
};

// Convert our Event type to Google Calendar event format
export const convertToGoogleEvent = (event: Event, duration: number = 120) => {
  // Parse date and time to create proper ISO strings
  const startDateTime = new Date(`${event.date}T${convertTo24Hour(event.time)}`);
  const endDateTime = new Date(startDateTime.getTime() + duration * 60 * 1000);

  return {
    summary: event.title,
    description: `${event.description}\n\n📍 Location: ${event.location}\n👥 RSVPs: ${event.rsvps}${event.capacity ? `/${event.capacity}` : ''}\n\n${event.contactInfo ? `📞 Contact: ${event.contactInfo}\n\n` : ''}🏛️ First Baptist Church of Fenton Event`,
    location: event.location,
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: 'America/Detroit', // Adjust for your timezone
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: 'America/Detroit',
    },
    // Add attendees if available
    attendees: event.attendees?.map(attendee => ({
      email: attendee.email,
      displayName: attendee.name,
    })) || [],
    // Set reminders
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 }, // 1 day before
        { method: 'popup', minutes: 60 }, // 1 hour before
      ],
    },
    // Add event metadata
    extendedProperties: {
      private: {
        churchEventId: event.id,
        eventCategory: event.category?.id || '',
        isChurchEvent: 'true',
        churchEventVersion: '1.0',
      },
    },
    // Add color coding based on category
    colorId: getColorIdByCategory(event.category?.id),
  };
};

// Get Google Calendar color ID based on event category
const getColorIdByCategory = (categoryId?: string): string => {
  const colorMap: Record<string, string> = {
    'worship': '9', // Blue
    'fellowship': '6', // Orange
    'outreach': '10', // Green
    'education': '5', // Yellow
    'youth': '11', // Red
    'family': '4', // Pink
    'special': '8', // Purple
  };
  
  return colorMap[categoryId || ''] || '1'; // Default to light blue
};

// Calendar service class for managing calendar operations
export class CalendarService {
  private auth: any;

  constructor(accessToken: string, refreshToken?: string) {
    const oauth2Client = getOAuth2Client();
    oauth2Client.setCredentials({ 
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    this.auth = oauth2Client;
  }

  // Create a new event in user's calendar
  async createEvent(event: Event, calendarId: string = 'primary', duration: number = 120) {
    try {
      const googleEvent = convertToGoogleEvent(event, duration);
      
      const response = await calendar.events.insert({
        auth: this.auth,
        calendarId,
        requestBody: googleEvent,
        sendUpdates: 'all', // Send email notifications to attendees
      });

      return response.data;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw new Error('Failed to create calendar event');
    }
  }

  // Update an existing calendar event
  async updateEvent(googleEventId: string, event: Event, calendarId: string = 'primary', duration: number = 120) {
    try {
      const googleEvent = convertToGoogleEvent(event, duration);
      
      const response = await calendar.events.update({
        auth: this.auth,
        calendarId,
        eventId: googleEventId,
        requestBody: googleEvent,
        sendUpdates: 'all',
      });

      return response.data;
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw new Error('Failed to update calendar event');
    }
  }

  // Delete an event from calendar
  async deleteEvent(googleEventId: string, calendarId: string = 'primary') {
    try {
      await calendar.events.delete({
        auth: this.auth,
        calendarId,
        eventId: googleEventId,
        sendUpdates: 'all',
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw new Error('Failed to delete calendar event');
    }
  }

  // Get user's calendars
  async getCalendars() {
    try {
      const response = await calendar.calendarList.list({
        auth: this.auth,
      });

      return response.data.items?.map(cal => ({
        id: cal.id,
        name: cal.summary,
        description: cal.description,
        primary: cal.primary,
        accessRole: cal.accessRole,
        backgroundColor: cal.backgroundColor,
      })) || [];
    } catch (error) {
      console.error('Error fetching calendars:', error);
      throw new Error('Failed to fetch calendars');
    }
  }

  // Check if event already exists in calendar
  async findEventByChurchId(churchEventId: string, calendarId: string = 'primary') {
    try {
      // Get recent events and search for matching church event ID in extended properties
      const response = await calendar.events.list({
        auth: this.auth,
        calendarId,
        maxResults: 100, // Search in recent events
        singleEvents: true,
        orderBy: 'updated',
      });

      // Find event with matching church event ID in extended properties
      const events = response.data.items || [];
      const matchingEvent = events.find(event => 
        event.extendedProperties?.private?.churchEventId === churchEventId
      );

      return matchingEvent || null;
    } catch (error) {
      console.error('Error finding event:', error);
      return null;
    }
  }

  // Sync multiple events at once
  async syncEvents(events: Event[], calendarId: string = 'primary', duration: number = 120) {
    const results = {
      created: 0,
      updated: 0,
      errors: 0,
      details: [] as Array<{ eventId: string; status: 'created' | 'updated' | 'error'; error?: string }>
    };

    for (const event of events) {
      try {
        // Check if event already exists
        const existingEvent = await this.findEventByChurchId(event.id, calendarId);
        
        if (existingEvent) {
          // Update existing event
          await this.updateEvent(existingEvent.id!, event, calendarId, duration);
          results.updated++;
          results.details.push({ eventId: event.id, status: 'updated' });
        } else {
          // Create new event
          await this.createEvent(event, calendarId, duration);
          results.created++;
          results.details.push({ eventId: event.id, status: 'created' });
        }
      } catch (error) {
        results.errors++;
        results.details.push({ 
          eventId: event.id, 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }

    return results;
  }

  // Get user profile information
  async getUserInfo() {
    try {
      const oauth2 = google.oauth2({ version: 'v2', auth: this.auth });
      const response = await oauth2.userinfo.get();
      return response.data;
    } catch (error) {
      console.error('Error getting user info:', error);
      throw new Error('Failed to get user information');
    }
  }
}

// Utility function to generate OAuth URL
export const generateAuthUrl = (scopes: string[] = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
]) => {
  const oauth2Client = getOAuth2Client();
  
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent', // Force consent screen to get refresh token
    include_granted_scopes: true,
  });
};

// Handle OAuth callback and get tokens
export const handleOAuthCallback = async (code: string) => {
  const oauth2Client = getOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}; 