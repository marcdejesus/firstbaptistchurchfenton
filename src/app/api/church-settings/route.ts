import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch church settings (public endpoint)
export async function GET() {
  try {
    // Get or create the single church settings record
    let settings = await prisma.churchSettings.findFirst();
    
    if (!settings) {
      // Create default settings if none exist
      settings = await prisma.churchSettings.create({
        data: {
          contactEmail: process.env.CHURCH_CONTACT_EMAIL || 'info@fbfenton.org',
          prayerEmail: process.env.CHURCH_PRAYER_EMAIL || 'prayer@fbfenton.org',
        }
      });
    }

    // Return only the email addresses (no sensitive data)
    return NextResponse.json({
      contactEmail: settings.contactEmail,
      prayerEmail: settings.prayerEmail,
    });
  } catch (error) {
    console.error('Error fetching church settings:', error);
    // Return fallback values
    return NextResponse.json({
      contactEmail: process.env.CHURCH_CONTACT_EMAIL || 'info@fbfenton.org',
      prayerEmail: process.env.CHURCH_PRAYER_EMAIL || 'prayer@fbfenton.org',
    });
  }
}
