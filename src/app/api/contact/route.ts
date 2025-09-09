import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message, subject: submittedSubject, phone } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields: name, email, and message are required.' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    // Prepare cleaned data (no database storage)
    const cleanedData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: submittedSubject?.trim() || 'General Inquiry',
      message: message.trim(),
      phone: phone?.trim() || null,
    };

    console.log(`Processing contact form submission from: ${cleanedData.email}`);

    // Check if email service is configured
    if (!emailService.isConfigured()) {
      console.error("Email service not configured. Check GOOGLE_SMTP_USER/MAIL_USER and GOOGLE_SMTP_PASSWORD/MAIL_PASS environment variables.");
      return NextResponse.json({ 
        message: 'Email notifications are not configured. Please contact the church directly.',
        warning: 'Email not sent - service not configured'
      }, { status: 202 });
    }

    // Send notification email to church
    const notificationResult = await emailService.sendContactFormNotification({
      name: cleanedData.name,
      email: cleanedData.email,
      subject: cleanedData.subject,
      message: cleanedData.message,
      phone: cleanedData.phone,
      submissionId: Date.now(), // Generate timestamp-based ID for email tracking
    });

    // Send auto-reply to user
    const autoReplyResult = await emailService.sendAutoReply('contact', cleanedData.email, cleanedData.name);

    if (!notificationResult.success) {
      console.error('Failed to send notification email:', notificationResult.error);
      return NextResponse.json({ 
        message: 'There was an issue sending the notification email. Please try contacting the church directly.',
        warning: 'Notification email failed'
      }, { status: 500 });
    }

    if (!autoReplyResult.success) {
      console.warn('Failed to send auto-reply email:', autoReplyResult.error);
    }

    console.log(`Contact form emails sent successfully. Notification: ${notificationResult.messageId}, Auto-reply: ${autoReplyResult.messageId}`);

    return NextResponse.json({ 
      message: 'Thank you for your message! We have received it and will get back to you within 24-48 hours.',
      emailSent: true
    });

  } catch (error) {
    console.error("Error processing contact form:", error);
    
    // Return a generic error message to avoid exposing internal details
    return NextResponse.json({ 
      error: 'We encountered an issue while processing your message. Please try again or contact us directly.' 
    }, { status: 500 });
  }
}