import { NextRequest, NextResponse } from 'next/server';
import { generateAuthUrl } from '@/lib/calendar';

// Generate Google OAuth URL for calendar access
export async function GET() {
  try {
    // Generate auth URL with required scopes
    const authUrl = generateAuthUrl([
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ]);
    
    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Calendar auth error:', error);
    return NextResponse.json(
      { error: 'Failed to generate auth URL' },
      { status: 500 }
    );
  }
} 