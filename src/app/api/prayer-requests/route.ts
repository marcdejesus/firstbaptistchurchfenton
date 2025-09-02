import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { emailService } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, request: prayerRequest, isConfidential } = await request.json();

    if (!name || !prayerRequest) {
      return NextResponse.json({ error: 'Missing required fields: name and prayer request are required.' }, { status: 400 });
    }

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
      }
    }

    // Save prayer request to database
    const savedRequest = await prisma.prayerRequest.create({
      data: {
        name: name.trim(),
        email: email?.trim().toLowerCase() || null,
        phone: phone?.trim() || null,
        message: prayerRequest.trim(),
        isPublic: !isConfidential, // Convert isConfidential to isPublic
      },
    });

    console.log(`Prayer request saved to database with ID: ${savedRequest.id}`);

    // Check if email service is configured
    if (!emailService.isConfigured()) {
      console.error("Email service not configured. Check GOOGLE_SMTP_USER/MAIL_USER and GOOGLE_SMTP_PASSWORD/MAIL_PASS environment variables.");
      return NextResponse.json({ 
        message: 'Your prayer request has been saved, but email notifications are not configured.',
        id: savedRequest.id,
        warning: 'Email not sent - service not configured'
      }, { status: 202 });
    }

    // Send notification email to church prayer team
    const notificationResult = await emailService.sendPrayerRequestNotification({
      name: savedRequest.name,
      email: savedRequest.email,
      phone: savedRequest.phone,
      message: savedRequest.message,
      isPublic: savedRequest.isPublic,
      submissionId: savedRequest.id,
    });

    // Send auto-reply to user if email provided
    let autoReplyResult = { success: true };
    if (savedRequest.email) {
      autoReplyResult = await emailService.sendAutoReply('prayer', savedRequest.email, savedRequest.name);
    }

    if (!notificationResult.success) {
      console.error('Failed to send prayer request notification email:', notificationResult.error);
      // Still return success since the request was saved to database
      return NextResponse.json({ 
        message: 'Your prayer request has been received and saved. However, there was an issue sending the notification email.',
        id: savedRequest.id,
        warning: 'Notification email failed'
      }, { status: 202 });
    }

    if (savedRequest.email && !autoReplyResult.success) {
      console.warn('Failed to send prayer request auto-reply email:', autoReplyResult.error);
    }

    console.log(`Prayer request emails sent successfully. Notification: ${notificationResult.messageId}, Auto-reply: ${autoReplyResult.success ? 'sent' : 'not applicable'}`);

    return NextResponse.json({ 
      message: 'Thank you for sharing your prayer request. Our prayer team will be lifting you up in prayer.',
      id: savedRequest.id,
      emailSent: true
    });

  } catch (error) {
    console.error("Error processing prayer request:", error);
    
    // Return a generic error message to avoid exposing internal details
    return NextResponse.json({ 
      error: 'We encountered an issue while processing your prayer request. Please try again or contact us directly.' 
    }, { status: 500 });
  }
}

// GET endpoint to retrieve prayer requests (for admin dashboard)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includePrivate = searchParams.get('includePrivate') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // For public API calls, only return public prayer requests
    // For admin calls (with includePrivate=true), return all
    const whereClause = includePrivate ? {} : { isPublic: true };

    const prayerRequests = await prisma.prayerRequest.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      select: {
        id: true,
        name: true,
        message: true,
        isPublic: true,
        isAnswered: true,
        createdAt: true,
        // Only include contact info for admin requests
        ...(includePrivate && {
          email: true,
          phone: true,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      requests: prayerRequests,
      count: prayerRequests.length,
    });

  } catch (error) {
    console.error("Error fetching prayer requests:", error);
    return NextResponse.json({ 
      error: 'Failed to fetch prayer requests' 
    }, { status: 500 });
  }
}