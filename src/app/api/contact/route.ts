import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

// Helper function to send contact form email
async function sendContactEmail(formData: ContactFormData) {
  try {
    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.log('RESEND_API_KEY not configured, logging contact form submission');
      console.log('=== CONTACT FORM SUBMISSION (LOG ONLY) ===');
      console.log(`From: ${formData.firstName} ${formData.lastName} <${formData.email}>`);
      console.log(`Message: ${formData.message}`);
      console.log('==========================================');
      return { success: true, message: 'Form submission logged (API key not configured)' };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send notification email to church
    const emailResponse = await resend.emails.send({
      from: 'First Baptist Church Fenton <noreply@firstbaptistchurch.org>',
      to: ['Pastorjbell206@gmail.com'], // Send to pastor's email
      subject: `New Contact Form Message from ${formData.firstName} ${formData.lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">New Contact Form Submission</h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Contact Information:</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</li>
              <li><strong>Email:</strong> ${formData.email}</li>
            </ul>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Message:</h3>
            <p style="white-space: pre-wrap; margin: 0;">${formData.message}</p>
          </div>
          
          <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
            This message was sent through the First Baptist Church of Fenton website contact form.
          </p>
        </div>
      `,
      replyTo: formData.email // Allow replying directly to the sender
    });

    console.log('Contact form email sent successfully:', emailResponse);
    return { success: true, message: 'Contact form submitted successfully', emailId: emailResponse.data?.id };

  } catch (error) {
    console.error('Error sending contact form email:', error);
    return { success: false, message: 'Failed to send contact form', error };
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData: ContactFormData = await request.json();
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'message'];
    for (const field of requiredFields) {
      if (!formData[field as keyof ContactFormData]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Send the contact form email
    const result = await sendContactEmail(formData);
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Your message has been sent successfully. We\'ll get back to you soon!'
      });
    } else {
      throw new Error(result.message);
    }

  } catch (error) {
    console.error('Error processing contact form:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to send your message. Please try again or contact us directly.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 