import { NextResponse } from 'next/server';

// This would typically come from a database or CMS
// For now, we'll hardcode the counselor information
const counselors = [
  {
    id: "sarah-halsey",
    name: "Sarah Halsey",
    title: "Counseling Ministry Leader",
    experience: "20+ Years Experience",
    calendarId: "sarah.halsey@firstbaptistchurch.org", // This would be her actual Google Calendar ID
    workingHours: {
      monday: { start: "09:00", end: "17:00" },
      tuesday: { start: "09:00", end: "17:00" },
      wednesday: { start: "09:00", end: "17:00" },
      thursday: { start: "09:00", end: "17:00" },
      friday: { start: "09:00", end: "17:00" },
      saturday: null, // Not available
      sunday: null    // Not available
    },
    appointmentDuration: 60 // minutes
  }
  // Add more counselors here as needed
];

export async function GET() {
  try {
    return NextResponse.json(counselors);
  } catch (error) {
    console.error('Error fetching counselors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch counselors' },
      { status: 500 }
    );
  }
} 