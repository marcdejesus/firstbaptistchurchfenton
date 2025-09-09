import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Fetch church settings
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching church settings:', error);
    return NextResponse.json({ error: 'Failed to fetch church settings' }, { status: 500 });
  }
}

// PUT - Update church settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { contactEmail, prayerEmail } = await request.json();

    if (!contactEmail || !prayerEmail) {
      return NextResponse.json({ error: 'Contact email and prayer email are required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail) || !emailRegex.test(prayerEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Get or create the single church settings record
    let settings = await prisma.churchSettings.findFirst();
    
    if (settings) {
      // Update existing settings
      settings = await prisma.churchSettings.update({
        where: { id: settings.id },
        data: {
          contactEmail: contactEmail.trim(),
          prayerEmail: prayerEmail.trim(),
        }
      });
    } else {
      // Create new settings
      settings = await prisma.churchSettings.create({
        data: {
          contactEmail: contactEmail.trim(),
          prayerEmail: prayerEmail.trim(),
        }
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating church settings:', error);
    return NextResponse.json({ error: 'Failed to update church settings' }, { status: 500 });
  }
}
