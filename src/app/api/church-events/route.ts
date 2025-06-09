import { NextResponse } from 'next/server';
import type { Event } from '@/types';
import { fetchChurchCalendarEvents } from '@/lib/calendar';

// Fallback events data (used when Google Calendar API fails)
const fallbackEvents: Event[] = [
  {
    id: '1',
    title: 'Sunday Worship Service',
    date: '2025-01-12',
    time: '10:30 AM',
    location: 'Main Sanctuary',
    description: 'Join us for our weekly worship service with music, prayer, and message from Pastor Johnson.',
    summary: 'Weekly worship service with music, prayer, and message.',
    rsvps: 120,
    isUserRsvped: false,
    category: { id: 'worship', name: 'Worship', icon: '🙏', color: '#8B5CF6', description: 'Worship services and spiritual gatherings' },
    capacity: 200,
    tags: ['worship', 'music', 'prayer']
  },
  {
    id: '2',
    title: 'Community Outreach Day',
    date: '2025-01-18',
    time: '9:00 AM',
    location: 'Downtown Food Bank',
    description: 'Join us as we serve our community at the local food bank. We will be sorting donations and preparing meal packages.',
    summary: 'Community service at the downtown food bank.',
    rsvps: 25,
    isUserRsvped: false,
    category: { id: 'outreach', name: 'Outreach', icon: '💝', color: '#10B981', description: 'Service and community outreach' },
    capacity: 40,
    isOutdoor: false,
    tags: ['service', 'community', 'volunteering'],
    contactInfo: 'Contact Sarah at outreach@fbcfenton.org'
  }
];

// Fetch church calendar events
export async function GET() {
  try {
    console.log('=== Church Events API Debug ===');
    console.log('GOOGLE_SERVICE_ACCOUNT_EMAIL exists:', !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
    console.log('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY exists:', !!process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY);
    console.log('CHURCH_CALENDAR_ID:', process.env.CHURCH_CALENDAR_ID || 'primary');
    
    // Check if Google Calendar credentials are configured
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) {
      console.warn('Google Calendar credentials not configured, using fallback events');
      return NextResponse.json({ 
        success: true, 
        events: fallbackEvents,
        source: 'fallback',
        message: 'Google Calendar credentials not configured'
      });
    }

    // Try to fetch from Google Calendar
    try {
      console.log('Attempting to fetch from Google Calendar API...');
      const events = await fetchChurchCalendarEvents();
      
      console.log(`Successfully fetched ${events.length} events from Google Calendar`);
      
      return NextResponse.json({ 
        success: true, 
        events,
        source: 'google_calendar',
        count: events.length
      });
    } catch (calendarError) {
      console.error('Google Calendar fetch failed:', calendarError);
      
      // Fall back to static events if calendar fails
      return NextResponse.json({ 
        success: true, 
        events: fallbackEvents,
        source: 'fallback',
        error: calendarError instanceof Error ? calendarError.message : 'Calendar fetch failed'
      });
    }
  } catch (error) {
    console.error('Error in church events API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch church events',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 