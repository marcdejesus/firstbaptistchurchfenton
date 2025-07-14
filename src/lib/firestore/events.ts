import { BaseFirestoreService } from './base';
import { Timestamp } from 'firebase/firestore';
import type { Event, EventCategory, User } from '@/types';

export interface EventRSVP {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: 'attending' | 'not_attending' | 'maybe';
  guestCount: number;
  dietaryRestrictions?: string;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventAttendance {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  checkedInAt: Date;
  checkedInBy: string;
  guestCount: number;
  notes?: string;
}

export class EventsService extends BaseFirestoreService {
  constructor() {
    super('events');
  }

  async createEvent(eventData: Omit<Event, 'id' | 'rsvps'>): Promise<string> {
    const data = {
      ...eventData,
      rsvps: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    return await this.create(data);
  }

  async getEventById(eventId: string): Promise<Event | null> {
    const event = await this.getById(eventId);
    if (!event) return null;

    return this.formatEventData(event);
  }

  async updateEvent(eventId: string, updates: Partial<Event>): Promise<void> {
    const { id, rsvps, ...updateData } = updates;
    await this.update(eventId, updateData);
  }

  async deleteEvent(eventId: string): Promise<void> {
    await this.delete(eventId);
  }

  async getAllEvents(): Promise<Event[]> {
    const events = await this.getAll({
      orderBy: [['date', 'asc']],
    });

    return events.map(event => this.formatEventData(event));
  }

  async getUpcomingEvents(limit?: number): Promise<Event[]> {
    const today = new Date().toISOString().split('T')[0];
    
    const events = await this.getAll({
      where: [['date', '>=', today]],
      orderBy: [['date', 'asc']],
      limit,
    });

    return events.map(event => this.formatEventData(event));
  }

  async getPastEvents(limit?: number): Promise<Event[]> {
    const today = new Date().toISOString().split('T')[0];
    
    const events = await this.getAll({
      where: [['date', '<', today]],
      orderBy: [['date', 'desc']],
      limit,
    });

    return events.map(event => this.formatEventData(event));
  }

  async getEventsByCategory(categoryId: string): Promise<Event[]> {
    const events = await this.getAll({
      where: [['category.id', '==', categoryId]],
      orderBy: [['date', 'asc']],
    });

    return events.map(event => this.formatEventData(event));
  }

  async getEventsByDateRange(startDate: string, endDate: string): Promise<Event[]> {
    const events = await this.getAll({
      where: [
        ['date', '>=', startDate],
        ['date', '<=', endDate]
      ],
      orderBy: [['date', 'asc']],
    });

    return events.map(event => this.formatEventData(event));
  }

  async searchEvents(searchTerm: string): Promise<Event[]> {
    const [titleResults, descriptionResults] = await Promise.all([
      this.getAll({
        where: [
          ['title', '>=', searchTerm],
          ['title', '<=', searchTerm + '\uf8ff']
        ],
        orderBy: [['title', 'asc']],
        limit: 10,
      }),
      this.getAll({
        where: [['tags', 'array-contains-any', [searchTerm]]],
        limit: 10,
      }),
    ]);

    const allResults = [...titleResults, ...descriptionResults];
    const uniqueResults = allResults.filter((event, index, array) => 
      array.findIndex(e => e.id === event.id) === index
    );

    return uniqueResults.map(event => this.formatEventData(event));
  }

  async getFeaturedEvents(limit = 3): Promise<Event[]> {
    const today = new Date().toISOString().split('T')[0];
    
    const events = await this.getAll({
      where: [['date', '>=', today]],
      orderBy: [['date', 'asc']],
      limit,
    });

    return events.map(event => this.formatEventData(event));
  }

  async updateRSVPCount(eventId: string): Promise<void> {
    const rsvpService = new EventRSVPService();
    const rsvps = await rsvpService.getEventRSVPs(eventId);
    const attendingCount = rsvps.filter(rsvp => rsvp.status === 'attending').length;
    
    await this.update(eventId, {
      rsvps: attendingCount,
    });
  }

  async getEventStats(): Promise<{
    totalEvents: number;
    upcomingEvents: number;
    pastEvents: number;
    totalRSVPs: number;
  }> {
    const allEvents = await this.getAll();
    const today = new Date().toISOString().split('T')[0];
    
    const stats = allEvents.reduce((acc, event) => {
      acc.totalEvents++;
      if (event.date >= today) {
        acc.upcomingEvents++;
      } else {
        acc.pastEvents++;
      }
      acc.totalRSVPs += event.rsvps || 0;
      return acc;
    }, {
      totalEvents: 0,
      upcomingEvents: 0,
      pastEvents: 0,
      totalRSVPs: 0,
    });

    return stats;
  }

  private formatEventData(eventData: any): Event {
    return {
      id: eventData.id,
      title: eventData.title || '',
      date: eventData.date || '',
      time: eventData.time || '',
      location: eventData.location || '',
      description: eventData.description || '',
      summary: eventData.summary,
      rsvps: eventData.rsvps || 0,
      isUserRsvped: eventData.isUserRsvped || false,
      category: eventData.category,
      capacity: eventData.capacity,
      attendees: eventData.attendees || [],
      tags: eventData.tags || [],
      isOutdoor: eventData.isOutdoor || false,
      hasWeatherAlert: eventData.hasWeatherAlert || false,
      weatherInfo: eventData.weatherInfo,
      directions: eventData.directions,
      contactInfo: eventData.contactInfo,
      relatedEvents: eventData.relatedEvents || [],
    };
  }
}

export class EventRSVPService extends BaseFirestoreService {
  constructor() {
    super('event_rsvps');
  }

  async createRSVP(rsvpData: Omit<EventRSVP, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const data = {
      ...rsvpData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const rsvpId = await this.create(data);
    
    const eventsService = new EventsService();
    await eventsService.updateRSVPCount(rsvpData.eventId);

    return rsvpId;
  }

  async updateRSVP(rsvpId: string, updates: Partial<EventRSVP>): Promise<void> {
    const { id, createdAt, ...updateData } = updates;
    await this.update(rsvpId, updateData);

    const rsvp = await this.getById(rsvpId);
    if (rsvp) {
      const eventsService = new EventsService();
      await eventsService.updateRSVPCount(rsvp.eventId);
    }
  }

  async deleteRSVP(rsvpId: string): Promise<void> {
    const rsvp = await this.getById(rsvpId);
    await this.delete(rsvpId);

    if (rsvp) {
      const eventsService = new EventsService();
      await eventsService.updateRSVPCount(rsvp.eventId);
    }
  }

  async getUserRSVP(eventId: string, userId: string): Promise<EventRSVP | null> {
    const rsvps = await this.getAll({
      where: [
        ['eventId', '==', eventId],
        ['userId', '==', userId]
      ],
      limit: 1,
    });

    if (rsvps.length === 0) return null;
    return this.formatRSVPData(rsvps[0]);
  }

  async getEventRSVPs(eventId: string): Promise<EventRSVP[]> {
    const rsvps = await this.getAll({
      where: [['eventId', '==', eventId]],
      orderBy: [['createdAt', 'desc']],
    });

    return rsvps.map(rsvp => this.formatRSVPData(rsvp));
  }

  async getUserRSVPs(userId: string): Promise<EventRSVP[]> {
    const rsvps = await this.getAll({
      where: [['userId', '==', userId]],
      orderBy: [['createdAt', 'desc']],
    });

    return rsvps.map(rsvp => this.formatRSVPData(rsvp));
  }

  async getAttendingRSVPs(eventId: string): Promise<EventRSVP[]> {
    const rsvps = await this.getAll({
      where: [
        ['eventId', '==', eventId],
        ['status', '==', 'attending']
      ],
      orderBy: [['createdAt', 'desc']],
    });

    return rsvps.map(rsvp => this.formatRSVPData(rsvp));
  }

  private formatRSVPData(rsvpData: any): EventRSVP {
    return {
      id: rsvpData.id,
      eventId: rsvpData.eventId || '',
      userId: rsvpData.userId || '',
      userName: rsvpData.userName || '',
      userEmail: rsvpData.userEmail || '',
      status: rsvpData.status || 'attending',
      guestCount: rsvpData.guestCount || 0,
      dietaryRestrictions: rsvpData.dietaryRestrictions,
      specialRequests: rsvpData.specialRequests,
      createdAt: this.timestampToDate(rsvpData.createdAt) || new Date(),
      updatedAt: this.timestampToDate(rsvpData.updatedAt) || new Date(),
    };
  }
}

export class EventAttendanceService extends BaseFirestoreService {
  constructor() {
    super('event_attendance');
  }

  async checkInAttendee(attendanceData: Omit<EventAttendance, 'id' | 'checkedInAt'>): Promise<string> {
    const data = {
      ...attendanceData,
      checkedInAt: Timestamp.now(),
    };

    return await this.create(data);
  }

  async getEventAttendance(eventId: string): Promise<EventAttendance[]> {
    const attendance = await this.getAll({
      where: [['eventId', '==', eventId]],
      orderBy: [['checkedInAt', 'asc']],
    });

    return attendance.map(record => this.formatAttendanceData(record));
  }

  async getUserAttendance(userId: string): Promise<EventAttendance[]> {
    const attendance = await this.getAll({
      where: [['userId', '==', userId]],
      orderBy: [['checkedInAt', 'desc']],
    });

    return attendance.map(record => this.formatAttendanceData(record));
  }

  async isUserCheckedIn(eventId: string, userId: string): Promise<boolean> {
    const attendance = await this.getAll({
      where: [
        ['eventId', '==', eventId],
        ['userId', '==', userId]
      ],
      limit: 1,
    });

    return attendance.length > 0;
  }

  private formatAttendanceData(attendanceData: any): EventAttendance {
    return {
      id: attendanceData.id,
      eventId: attendanceData.eventId || '',
      userId: attendanceData.userId || '',
      userName: attendanceData.userName || '',
      checkedInBy: attendanceData.checkedInBy || '',
      guestCount: attendanceData.guestCount || 0,
      notes: attendanceData.notes,
      checkedInAt: this.timestampToDate(attendanceData.checkedInAt) || new Date(),
    };
  }
}

export class EventCategoriesService extends BaseFirestoreService {
  constructor() {
    super('event_categories');
  }

  async createCategory(categoryData: Omit<EventCategory, 'id'>): Promise<string> {
    return await this.create(categoryData);
  }

  async getAllCategories(): Promise<EventCategory[]> {
    const categories = await this.getAll({
      orderBy: [['name', 'asc']],
    });

    return categories.map(cat => this.formatCategoryData(cat));
  }

  async getCategoryById(categoryId: string): Promise<EventCategory | null> {
    const category = await this.getById(categoryId);
    if (!category) return null;

    return this.formatCategoryData(category);
  }

  async updateCategory(categoryId: string, updates: Partial<EventCategory>): Promise<void> {
    const { id, ...updateData } = updates;
    await this.update(categoryId, updateData);
  }

  async deleteCategory(categoryId: string): Promise<void> {
    await this.delete(categoryId);
  }

  private formatCategoryData(categoryData: any): EventCategory {
    return {
      id: categoryData.id,
      name: categoryData.name || '',
      color: categoryData.color || '',
      icon: categoryData.icon || '',
      description: categoryData.description,
    };
  }
}

export const eventsService = new EventsService();
export const eventRSVPService = new EventRSVPService();
export const eventAttendanceService = new EventAttendanceService();
export const eventCategoriesService = new EventCategoriesService();