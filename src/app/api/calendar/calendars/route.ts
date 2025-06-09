import { NextRequest, NextResponse } from 'next/server';
import { CalendarService } from '@/lib/calendar';
import { cookies } from 'next/headers';

// Get user's Google calendars
export async function GET() {
  try {
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
    
    // Get user's calendars
    const calendars = await calendarService.getCalendars();
    
    return NextResponse.json({ 
      success: true,
      calendars 
    });
  } catch (error) {
    console.error('Error fetching calendars:', error);
    return NextResponse.json(
      { error: 'Failed to fetch calendars' },
      { status: 500 }
    );
  }
} 