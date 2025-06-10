import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

// Helper function to generate time slots for a day
function generateTimeSlots(startHour: number, endHour: number, duration: number = 60): string[] {
  const slots = [];
  
  for (let hour = startHour; hour < endHour; hour++) {
    // Generate slots on the hour (e.g., 9:00 AM, 10:00 AM, etc.)
    const timeString = hour < 12 
      ? `${hour}:00 AM`
      : hour === 12 
        ? '12:00 PM'
        : `${hour - 12}:00 PM`;
    slots.push(timeString);
  }
  
  return slots;
}

// Helper function to check if a time slot conflicts with existing events
function isTimeSlotAvailable(
  slot: string, 
  events: any[], 
  date: string,
  duration: number = 60
): boolean {
  // Convert slot time to Date object
  const [time, period] = slot.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  let hour24 = hours;
  
  if (period === 'PM' && hours !== 12) {
    hour24 += 12;
  } else if (period === 'AM' && hours === 12) {
    hour24 = 0;
  }
  
  const slotStart = new Date(`${date}T${hour24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`);
  const slotEnd = new Date(slotStart.getTime() + duration * 60000); // duration in milliseconds
  
  // Check if this slot conflicts with any existing events
  for (const event of events) {
    if (!event.start || !event.end) continue;
    
    const eventStart = new Date(event.start.dateTime || event.start.date);
    const eventEnd = new Date(event.end.dateTime || event.end.date);
    
    // Check for overlap
    if (slotStart < eventEnd && slotEnd > eventStart) {
      return false; // Conflict found
    }
  }
  
  return true; // No conflict
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const counselorId = searchParams.get('counselorId');
    const date = searchParams.get('date');
    
    if (!counselorId || !date) {
      return NextResponse.json(
        { error: 'Missing counselorId or date parameter' },
        { status: 400 }
      );
    }

    // Get counselor information (in a real app, this would come from a database)
    const counselors = [
      {
        id: "sarah-halsey",
        name: "Sarah Halsey",
        calendarId: process.env.CHURCH_CALENDAR_ID, // Using the existing church calendar for now
        workingHours: { start: 9, end: 17 }, // 9 AM to 5 PM
        appointmentDuration: 60
      }
    ];

    const counselor = counselors.find(c => c.id === counselorId);
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
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // Get events for the specific date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const response = await calendar.events.list({
      calendarId: counselor.calendarId,
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];
    
    // Generate potential time slots
    const allSlots = generateTimeSlots(
      counselor.workingHours.start, 
      counselor.workingHours.end, 
      counselor.appointmentDuration
    );
    
    // Check availability for each slot
    const timeSlots = allSlots.map(slot => ({
      time: slot,
      available: isTimeSlotAvailable(slot, events, date, counselor.appointmentDuration)
    }));

    return NextResponse.json({ timeSlots });

  } catch (error) {
    console.error('Error checking availability:', error);
    
    // Fallback: return some default time slots for development
    const defaultSlots = [
      { time: "9:00 AM", available: true },
      { time: "10:00 AM", available: true },
      { time: "11:00 AM", available: false },
      { time: "1:00 PM", available: true },
      { time: "2:00 PM", available: true },
      { time: "3:00 PM", available: false },
      { time: "4:00 PM", available: true }
    ];
    
    return NextResponse.json({ 
      timeSlots: defaultSlots,
      note: "Using fallback data due to calendar API error"
    });
  }
} 