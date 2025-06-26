import { google } from 'googleapis';
import type { Event } from '@/types';
import { getServiceAccountAuth } from './config';
import { convertGoogleEventToEvent } from './event-utils';

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
    
    // Convert Google Calendar events to our Event format
    return events.map(convertGoogleEventToEvent);
  } catch (error) {
    console.error('Error fetching church calendar events:', error);
    throw new Error('Failed to fetch calendar events');
  }
};

// Fetch next upcoming event
export const fetchNextEvent = async (
  calendarId: string = process.env.CHURCH_CALENDAR_ID || 'primary'
): Promise<Event | null> => {
  try {
    const events = await fetchChurchCalendarEvents(calendarId, 1);
    return events.length > 0 ? events[0] : null;
  } catch (error) {
    console.error('Error fetching next event:', error);
    return null;
  }
}; 