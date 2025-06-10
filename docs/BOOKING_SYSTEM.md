# Counseling Booking System

This project includes a complete booking system for counseling appointments with the following features:

## Features

- ✅ **Date Selection**: Users can pick appointment dates (weekdays only)
- ✅ **Counselor Selection**: Choose from available counselors
- ✅ **Real-time Availability**: Shows available time slots based on Google Calendar
- ✅ **Contact Form**: Collects client information and appointment reason
- ✅ **Google Calendar Integration**: Automatically creates calendar events
- ✅ **Email Confirmations**: Sends confirmation emails to clients
- ✅ **Responsive Design**: Works on desktop and mobile devices

## How It Works

### 1. User Flow
1. User visits `/book-appointment` 
2. Selects a date from the calendar (weekdays only)
3. Chooses a counselor from the dropdown
4. Views available time slots for the selected date/counselor
5. Fills out contact information form
6. Reviews appointment summary and books the appointment
7. Receives confirmation with appointment details

### 2. Backend Process
1. **Availability Check**: Queries Google Calendar API for existing events
2. **Time Slot Generation**: Creates available 1-hour slots from 9 AM - 5 PM
3. **Conflict Detection**: Removes slots that conflict with existing events
4. **Appointment Creation**: Creates new calendar event when appointment is booked
5. **Email Notification**: Sends confirmation email to the client

## API Endpoints

### `GET /api/counselors`
Returns list of available counselors with their information.

### `GET /api/availability?counselorId={id}&date={YYYY-MM-DD}`
Returns available time slots for a specific counselor and date.

### `POST /api/book-appointment`
Creates a new appointment booking.

**Request Body:**
```json
{
  "counselorId": "sarah-halsey",
  "date": "2025-01-20",
  "time": "10:00 AM",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "555-123-4567",
  "reason": "Marriage counseling"
}
```

## Configuration

### Environment Variables

Add these to your `.env.local` file:

```env
# Google Calendar API
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
CHURCH_CALENDAR_ID=your-calendar-id@group.calendar.google.com

# Email Service (optional)
RESEND_API_KEY=re_your_api_key_here
```

### Google Calendar Setup

1. Create a Google Cloud Project
2. Enable the Google Calendar API
3. Create a Service Account
4. Download the service account key JSON file
5. Share your calendar with the service account email
6. Copy the service account email and private key to environment variables

### Email Setup (Optional)

1. Sign up for a [Resend](https://resend.com) account
2. Get your API key
3. Add it to your environment variables
4. Emails will be sent automatically on booking confirmation

If no `RESEND_API_KEY` is configured, appointment details will be logged to the console instead.

## Customization

### Adding More Counselors

Edit `src/app/api/counselors/route.ts` to add more counselors:

```typescript
const counselors = [
  {
    id: "sarah-halsey",
    name: "Sarah Halsey",
    title: "Counseling Ministry Leader",
    experience: "20+ Years Experience",
    calendarId: "sarah.calendar@church.org",
    // ... other properties
  },
  {
    id: "new-counselor",
    name: "New Counselor",
    title: "Licensed Counselor",
    experience: "10+ Years Experience", 
    calendarId: "new.counselor@church.org",
    // ... other properties
  }
];
```

### Changing Working Hours

Modify the `workingHours` object in the counselor data:

```typescript
workingHours: {
  start: 9,  // 9 AM
  end: 17,   // 5 PM
  appointmentDuration: 60 // 60 minutes
}
```

### Customizing Time Slots

Edit the `generateTimeSlots` function in `src/app/api/availability/route.ts` to change:
- Time slot intervals (currently hourly)
- Business hours
- Appointment duration

## Testing

The system includes fallback data for development when Google Calendar API isn't available:

```bash
# Test counselors endpoint
curl http://localhost:9002/api/counselors

# Test availability endpoint  
curl "http://localhost:9002/api/availability?counselorId=sarah-halsey&date=2025-01-20"

# Test booking endpoint
curl -X POST http://localhost:9002/api/book-appointment \
  -H "Content-Type: application/json" \
  -d '{"counselorId":"sarah-halsey","date":"2025-01-20","time":"10:00 AM","firstName":"Test","lastName":"User","email":"test@example.com"}'
```

## UI Components

The booking interface uses:
- **shadcn/ui** components for consistent styling
- **react-day-picker** for date selection
- **Tailwind CSS** for responsive design
- **Lucide React** for icons

## Future Enhancements

Potential improvements:
- SMS notifications
- Appointment cancellation/rescheduling
- Multiple calendar support
- Recurring appointments
- Waiting list functionality
- Online payment integration
- Admin dashboard for managing bookings 