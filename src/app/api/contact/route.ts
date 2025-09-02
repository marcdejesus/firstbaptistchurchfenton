import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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

    // Save contact submission to database
    const savedSubmission = await prisma.contactSubmission.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: submittedSubject?.trim() || 'General Inquiry',
        message: message.trim(),
        phone: phone?.trim() || null,
      },
    });

    console.log(`Contact form submission saved to database with ID: ${savedSubmission.id}`);

    // Check if email service is configured
    if (!emailService.isConfigured()) {
      console.error("Email service not configured. Check GOOGLE_SMTP_USER/MAIL_USER and GOOGLE_SMTP_PASSWORD/MAIL_PASS environment variables.");
      return NextResponse.json({ 
        message: 'Your message has been saved, but email notifications are not configured. Please contact the church directly.',
        id: savedSubmission.id,
        warning: 'Email not sent - service not configured'
      }, { status: 202 });
    }

    // Send notification email to church
    const notificationResult = await emailService.sendContactFormNotification({
      name: savedSubmission.name,
      email: savedSubmission.email,
      subject: savedSubmission.subject,
      message: savedSubmission.message,
      phone: savedSubmission.phone,
      submissionId: savedSubmission.id,
    });

    // Send auto-reply to user
    const autoReplyResult = await emailService.sendAutoReply('contact', savedSubmission.email, savedSubmission.name);

    if (!notificationResult.success) {
      console.error('Failed to send notification email:', notificationResult.error);
      // Still return success since the form was saved to database
      return NextResponse.json({ 
        message: 'Your message has been received and saved. However, there was an issue sending the notification email.',
        id: savedSubmission.id,
        warning: 'Notification email failed'
      }, { status: 202 });
    }

    if (!autoReplyResult.success) {
      console.warn('Failed to send auto-reply email:', autoReplyResult.error);
    }

    console.log(`Contact form emails sent successfully. Notification: ${notificationResult.messageId}, Auto-reply: ${autoReplyResult.messageId}`);

    return NextResponse.json({ 
      message: 'Thank you for your message! We have received it and will get back to you within 24-48 hours.',
      id: savedSubmission.id,
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