import { NextRequest, NextResponse } from 'next/server';
import { CalendarService } from '@/lib/calendar';
import { cookies } from 'next/headers';

// Create or sync calendar event
export async function POST(request: NextRequest) {
  try {
    const { event, calendarId = 'primary', duration = 120 } = await request.json();
    
    // Get tokens from cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('google_access_token')?.value;
    const refreshToken = cookieStore.get('google_refresh_token')?.value;
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Calendar not connected. Please connect your Google Calendar first.' },
        { status: 401 }
      );
    }
    
    const calendarService = new CalendarService(accessToken, refreshToken);
    
    // Check if event already exists
    const existingEvent = await calendarService.findEventByChurchId(event.id, calendarId);
    
    let googleEvent;
    if (existingEvent) {
      // Update existing event
      googleEvent = await calendarService.updateEvent(existingEvent.id!, event, calendarId, duration);
    } else {
      // Create new event
      googleEvent = await calendarService.createEvent(event, calendarId, duration);
    }
    
    return NextResponse.json({ 
      success: true,
      googleEvent,
      action: existingEvent ? 'updated' : 'created'
    });
  } catch (error) {
    console.error('Calendar event operation error:', error);
    return NextResponse.json(
      { error: 'Failed to sync calendar event' },
      { status: 500 }
    );
  }
}

// Sync multiple events
export async function PUT(request: NextRequest) {
  try {
    const { events, calendarId = 'primary', duration = 120 } = await request.json();
    
    // Get tokens from cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('google_access_token')?.value;
    const refreshToken = cookieStore.get('google_refresh_token')?.value;
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Calendar not connected. Please connect your Google Calendar first.' },
        { status: 401 }
      );
    }
    
    const calendarService = new CalendarService(accessToken, refreshToken);
    
    // Sync all events
    const results = await calendarService.syncEvents(events, calendarId, duration);
    
    return NextResponse.json({ 
      success: true,
      results 
    });
  } catch (error) {
    console.error('Calendar events sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync calendar events' },
      { status: 500 }
    );
  }
}

// Delete calendar event
export async function DELETE(request: NextRequest) {
  try {
    const { eventId, calendarId = 'primary' } = await request.json();
    
    // Get tokens from cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('google_access_token')?.value;
    const refreshToken = cookieStore.get('google_refresh_token')?.value;
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Calendar not connected. Please connect your Google Calendar first.' },
        { status: 401 }
      );
    }
    
    const calendarService = new CalendarService(accessToken, refreshToken);
    
    // Find the Google Calendar event by church event ID
    const existingEvent = await calendarService.findEventByChurchId(eventId, calendarId);
    
    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found in calendar' },
        { status: 404 }
      );
    }
    
    // Delete the event
    await calendarService.deleteEvent(existingEvent.id!, calendarId);
    
    return NextResponse.json({ 
      success: true,
      message: 'Event deleted from calendar'
    });
  } catch (error) {
    console.error('Calendar event deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete calendar event' },
      { status: 500 }
    );
  }
} 