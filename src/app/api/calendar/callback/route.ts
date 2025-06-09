import { NextRequest, NextResponse } from 'next/server';
import { handleOAuthCallback, CalendarService } from '@/lib/calendar';

// Handle Google OAuth callback
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    
    // Handle OAuth errors
    if (error) {
      console.error('OAuth error:', error);
      const redirectUrl = new URL('/events', request.nextUrl.origin);
      redirectUrl.searchParams.set('calendar_error', error);
      return NextResponse.redirect(redirectUrl);
    }
    
    if (!code) {
      throw new Error('No authorization code received');
    }
    
    // Exchange code for tokens
    const tokens = await handleOAuthCallback(code);
    
    if (!tokens.access_token) {
      throw new Error('Failed to get access token');
    }
    
    // Get user info to verify the connection
    const calendarService = new CalendarService(tokens.access_token, tokens.refresh_token || undefined);
    const userInfo = await calendarService.getUserInfo();
    
    // Create response with tokens stored in httpOnly cookies for security
    const redirectUrl = new URL('/events', request.nextUrl.origin);
    redirectUrl.searchParams.set('calendar_connected', 'true');
    redirectUrl.searchParams.set('user_email', userInfo.email || '');
    
    const response = NextResponse.redirect(redirectUrl);
    
    // Store tokens in httpOnly cookies (more secure than localStorage)
    response.cookies.set('google_access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600, // 1 hour
    });
    
    if (tokens.refresh_token) {
      response.cookies.set('google_refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });
    }
    
    // Store user email in regular cookie for UI purposes
    response.cookies.set('google_user_email', userInfo.email || '', {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });
    
    return response;
  } catch (error) {
    console.error('Calendar callback error:', error);
    const redirectUrl = new URL('/events', request.nextUrl.origin);
    redirectUrl.searchParams.set('calendar_error', 'callback_failed');
    return NextResponse.redirect(redirectUrl);
  }
} 