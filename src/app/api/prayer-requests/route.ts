import { NextRequest, NextResponse } from 'next/server';
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

    // Prepare cleaned data (no database storage)
    const cleanedData = {
      name: name.trim(),
      email: email?.trim().toLowerCase() || null,
      phone: phone?.trim() || null,
      message: prayerRequest.trim(),
      isPublic: !isConfidential, // Convert isConfidential to isPublic
    };

    console.log(`Processing prayer request from: ${cleanedData.email || cleanedData.name}`);

    // Check if email service is configured
    if (!emailService.isConfigured()) {
      console.error("Email service not configured. Check GOOGLE_SMTP_USER/MAIL_USER and GOOGLE_SMTP_PASSWORD/MAIL_PASS environment variables.");
      return NextResponse.json({ 
        message: 'Email notifications are not configured.',
        warning: 'Email not sent - service not configured'
      }, { status: 202 });
    }

    // Send notification email to church prayer team
    const notificationResult = await emailService.sendPrayerRequestNotification({
      name: cleanedData.name,
      email: cleanedData.email,
      phone: cleanedData.phone,
      message: cleanedData.message,
      isPublic: cleanedData.isPublic,
      submissionId: Date.now(), // Generate timestamp-based ID for email tracking
    });

    // Send auto-reply to user if email provided
    let autoReplyResult = { success: true };
    if (cleanedData.email) {
      autoReplyResult = await emailService.sendAutoReply('prayer', cleanedData.email, cleanedData.name);
    }

    if (!notificationResult.success) {
      console.error('Failed to send prayer request notification email:', notificationResult.error);
      return NextResponse.json({ 
        message: 'There was an issue sending the notification email. Please try contacting the church directly.',
        warning: 'Notification email failed'
      }, { status: 500 });
    }

    if (cleanedData.email && !autoReplyResult.success) {
      console.warn('Failed to send prayer request auto-reply email:', autoReplyResult.error);
    }

    console.log(`Prayer request emails sent successfully. Notification: ${notificationResult.messageId}, Auto-reply: ${autoReplyResult.success ? 'sent' : 'not applicable'}`);

    return NextResponse.json({ 
      message: 'Thank you for sharing your prayer request. Our prayer team will be lifting you up in prayer.',
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
