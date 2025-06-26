import { google } from 'googleapis';
import type { Event } from '@/types';
import { getOAuth2Client } from './config';
import { convertToGoogleEvent, convertGoogleEventToEvent } from './event-utils';
import { getColorIdByCategory } from './categories';

export class CalendarService {
  private auth: any;

  constructor(accessToken: string, refreshToken?: string) {
    this.auth = getOAuth2Client();
    this.auth.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }

  async createEvent(event: Event, calendarId: string = 'primary', duration: number = 120) {
    try {
      const calendar = google.calendar({ version: 'v3', auth: this.auth });
      const googleEvent = convertToGoogleEvent(event, duration);
      
      const response = await calendar.events.insert({
        calendarId,
        requestBody: googleEvent,
      });
      
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  async updateEvent(googleEventId: string, event: Event, calendarId: string = 'primary', duration: number = 120) {
    try {
      const calendar = google.calendar({ version: 'v3', auth: this.auth });
      const googleEvent = convertToGoogleEvent(event, duration);
      
      const response = await calendar.events.update({
        calendarId,
        eventId: googleEventId,
        requestBody: googleEvent,
      });
      
      return response.data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  async deleteEvent(googleEventId: string, calendarId: string = 'primary') {
    try {
      const calendar = google.calendar({ version: 'v3', auth: this.auth });
      
      await calendar.events.delete({
        calendarId,
        eventId: googleEventId,
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }

  async getCalendars() {
    try {
      const calendar = google.calendar({ version: 'v3', auth: this.auth });
      
      const response = await calendar.calendarList.list();
      
      return response.data.items?.map(cal => ({
        id: cal.id,
        summary: cal.summary,
        description: cal.description,
        primary: cal.primary,
        accessRole: cal.accessRole,
      })) || [];
    } catch (error) {
      console.error('Error fetching calendars:', error);
      throw error;
    }
  }

  async findEventByChurchId(churchEventId: string, calendarId: string = 'primary') {
    try {
      const calendar = google.calendar({ version: 'v3', auth: this.auth });
      
      // Search for events with the church event ID in the description or extended properties
      const response = await calendar.events.list({
        calendarId,
        q: churchEventId,
        maxResults: 10,
      });
      
      // Find the exact match
      const matchingEvent = response.data.items?.find(event => {
        return event.extendedProperties?.private?.churchEventId === churchEventId ||
               event.description?.includes(`Church Event ID: ${churchEventId}`);
      });
      
      return matchingEvent;
    } catch (error) {
      console.error('Error finding event by church ID:', error);
      throw error;
    }
  }

  async syncEvents(events: Event[], calendarId: string = 'primary', duration: number = 120) {
    const results = {
      created: 0,
      updated: 0,
      errors: [] as string[],
    };

    for (const event of events) {
      try {
        // Check if event already exists
        const existingEvent = await this.findEventByChurchId(event.id, calendarId);
        
        if (existingEvent) {
          // Update existing event
          await this.updateEvent(existingEvent.id!, event, calendarId, duration);
          results.updated++;
        } else {
          // Create new event
          await this.createEvent(event, calendarId, duration);
          results.created++;
        }
      } catch (error) {
        results.errors.push(`Failed to sync event ${event.title}: ${error}`);
      }
    }

    return results;
  }

  async getUserInfo() {
    try {
      const oauth2 = google.oauth2({ version: 'v2', auth: this.auth });
      const response = await oauth2.userinfo.get();
      
      return response.data;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  }
} 