import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { Resend } from 'resend';

interface BookingData {
  counselorId: string;
  date: string;
  time: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  reason: string;
}

// Helper function to convert 12-hour time to 24-hour format
function convertTo24Hour(time12h: string): string {
  const [time, period] = time12h.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  let hour24 = hours;
  
  if (period === 'PM' && hours !== 12) {
    hour24 += 12;
  } else if (period === 'AM' && hours === 12) {
    hour24 = 0;
  }
  
  return `${hour24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Helper function to send confirmation email using Resend
async function sendConfirmationEmail(bookingData: BookingData, counselorName: string) {
  try {
    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.log('RESEND_API_KEY not configured, skipping email send');
      console.log('=== APPOINTMENT CONFIRMATION EMAIL (LOG ONLY) ===');
      console.log(`To: ${bookingData.email}`);
      console.log(`Subject: Counseling Appointment Confirmation - ${bookingData.date} at ${bookingData.time}`);
      console.log(`
Dear ${bookingData.firstName} ${bookingData.lastName},

Your counseling appointment has been confirmed!

Appointment Details:
- Counselor: ${counselorName}
- Date: ${bookingData.date}
- Time: ${bookingData.time}
- Duration: 60 minutes
- Location: First Baptist Church of Fenton

If you need to reschedule or cancel, please contact us at (810) 555-1234 or hello@firstbaptistchurch.org.

We look forward to meeting with you.

Blessings,
First Baptist Church of Fenton Counseling Ministry
      `);
      console.log('==================================================');
      return { success: true, message: 'Email logged (API key not configured)' };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const emailResponse = await resend.emails.send({
      from: 'First Baptist Church Fenton <noreply@firstbaptistchurch.org>',
      to: [bookingData.email],
      subject: `Counseling Appointment Confirmation - ${bookingData.date} at ${bookingData.time}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Appointment Confirmation</h2>
          
          <p>Dear ${bookingData.firstName} ${bookingData.lastName},</p>
          
          <p>Your counseling appointment has been confirmed!</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Appointment Details:</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Counselor:</strong> ${counselorName}</li>
              <li><strong>Date:</strong> ${bookingData.date}</li>
              <li><strong>Time:</strong> ${bookingData.time}</li>
              <li><strong>Duration:</strong> 60 minutes</li>
              <li><strong>Location:</strong> First Baptist Church of Fenton</li>
            </ul>
          </div>
          
          <p>If you need to reschedule or cancel, please contact us at:</p>
          <ul>
            <li>Phone: (810) 555-1234</li>
            <li>Email: hello@firstbaptistchurch.org</li>
          </ul>
          
          <p>We look forward to meeting with you.</p>
          
          <p style="margin-top: 30px;">
            Blessings,<br>
            <strong>First Baptist Church of Fenton Counseling Ministry</strong>
          </p>
        </div>
      `
    });

    console.log('Email sent successfully:', emailResponse);
    return { success: true, message: 'Email sent successfully', emailId: emailResponse.data?.id };

  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Failed to send email', error };
  }
}

export async function POST(request: NextRequest) {
  try {
    const bookingData: BookingData = await request.json();
    
    // Validate required fields
    const requiredFields = ['counselorId', 'date', 'time', 'firstName', 'lastName', 'email'];
    for (const field of requiredFields) {
      if (!bookingData[field as keyof BookingData]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Get counselor information
    const counselors = [
      {
        id: "sarah-halsey",
        name: "Sarah Halsey",
        calendarId: process.env.CHURCH_CALENDAR_ID, // Using the existing church calendar for now
        email: "sarah.halsey@firstbaptistchurch.org"
      }
    ];

    const counselor = counselors.find(c => c.id === bookingData.counselorId);
    if (!counselor) {
      return NextResponse.json(
        { error: 'Counselor not found' },
        { status: 404 }
      );
    }

    // Set up Google Calendar API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // Create the appointment time
    const time24h = convertTo24Hour(bookingData.time);
    const startDateTime = new Date(`${bookingData.date}T${time24h}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60000); // Add 1 hour

    // Create calendar event
    const event = {
      summary: `Counseling Appointment - ${bookingData.firstName} ${bookingData.lastName}`,
      description: `
Counseling appointment with ${counselor.name}

Client Information:
- Name: ${bookingData.firstName} ${bookingData.lastName}
- Email: ${bookingData.email}
- Phone: ${bookingData.phone || 'Not provided'}

${bookingData.reason ? `Reason for appointment: ${bookingData.reason}` : ''}

This appointment was booked through the church website.
      `.trim(),
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'America/Detroit', // Adjust based on church location
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'America/Detroit',
      },
      location: 'First Baptist Church of Fenton, 123 Church Street, Fenton, Michigan 48430',
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'email', minutes: 60 },      // 1 hour before
        ],
      },
    };

    console.log('Creating calendar event:', event);

    const calendarResponse = await calendar.events.insert({
      calendarId: counselor.calendarId,
      requestBody: event,
    });

    console.log('Calendar event created:', calendarResponse.data.id);

    // Send confirmation email
    await sendConfirmationEmail(bookingData, counselor.name);

    return NextResponse.json({ 
      success: true, 
      message: 'Appointment booked successfully',
      eventId: calendarResponse.data.id,
      eventLink: calendarResponse.data.htmlLink
    });

  } catch (error) {
    console.error('Error booking appointment:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to book appointment',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 