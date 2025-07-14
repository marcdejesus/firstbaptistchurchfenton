# API Reference

This document provides a complete reference for all API endpoints in the First Baptist Church of Fenton website.

## 📋 Base URL

- **Development**: `http://localhost:9002/api`
- **Production**: `https://your-domain.com/api`

## 🗓️ Events API

### Get Church Events

Fetches events from the church's Google Calendar.

**Endpoint**: `GET /api/church-events`

**Response**:
```json
{
  "success": true,
  "events": [
    {
      "id": "event-id",
      "title": "Sunday Worship Service",
      "date": "2025-01-12",
      "time": "10:30 AM",
      "location": "Main Sanctuary",
      "description": "Join us for our weekly worship service...",
      "summary": "Weekly worship service with music, prayer...",
      "rsvps": 120,
      "isUserRsvped": false,
      "category": {
        "id": "worship",
        "name": "Worship",
        "icon": "🙏",
        "color": "#8B5CF6"
      },
      "capacity": 200,
      "tags": ["worship", "music", "prayer"],
      "contactInfo": "Contact info@church.org"
    }
  ],
  "source": "google_calendar",
  "count": 15
}
```

**Error Response**:
```json
{
  "error": "Failed to fetch church events",
  "details": "Service account credentials not configured"
}
```

## 📅 Calendar Integration API

### Get Google OAuth URL

Generates authentication URL for Google Calendar integration.

**Endpoint**: `GET /api/calendar/auth`

**Response**:
```json
{
  "authUrl": "https://accounts.google.com/oauth/authorize?..."
}
```

### OAuth Callback

Handles Google OAuth callback and stores tokens.

**Endpoint**: `GET /api/calendar/callback?code=auth_code`

**Parameters**:
- `code` (string): Authorization code from Google
- `error` (string, optional): Error from OAuth flow

**Response**: Redirects to `/events` with query parameters

### Get User Calendars

Gets the authenticated user's Google calendars.

**Endpoint**: `GET /api/calendar/calendars`

**Headers**: Requires Google authentication cookies

**Response**:
```json
{
  "success": true,
  "calendars": [
    {
      "id": "primary",
      "summary": "John Doe",
      "primary": true
    },
    {
      "id": "calendar-id@group.calendar.google.com",
      "summary": "My Other Calendar"
    }
  ]
}
```

### Create/Update Calendar Event

Creates or updates an event in user's Google Calendar.

**Endpoint**: `POST /api/calendar/events`

**Headers**: Requires Google authentication cookies

**Request Body**:
```json
{
  "event": {
    "id": "church-event-id",
    "title": "Event Title",
    "date": "2025-01-15",
    "time": "10:00 AM",
    "location": "Church Location",
    "description": "Event description"
  },
  "calendarId": "primary",
  "duration": 120
}
```

**Response**:
```json
{
  "success": true,
  "googleEvent": {
    "id": "google-event-id",
    "summary": "Event Title"
  },
  "action": "created"
}
```

### Sync Multiple Events

Syncs multiple church events to user's calendar.

**Endpoint**: `PUT /api/calendar/events`

**Request Body**:
```json
{
  "events": [/* array of events */],
  "calendarId": "primary",
  "duration": 120
}
```

### Delete Calendar Event

Removes an event from user's calendar.

**Endpoint**: `DELETE /api/calendar/events`

**Request Body**:
```json
{
  "eventId": "church-event-id",
  "calendarId": "primary"
}
```

## 👨‍⚕️ Counseling API

### Get Counselors

Retrieves list of available counselors.

**Endpoint**: `GET /api/counselors`

**Response**:
```json
{
  "counselors": [
    {
      "id": "sarah-halsey",
      "name": "Sarah Halsey",
      "title": "Counseling Ministry Leader",
      "experience": "20+ Years Experience",
      "specialties": ["Marriage Counseling", "Family Therapy"],
      "bio": "Sarah has been...",
      "image": "/images/counselors/sarah.jpg",
      "calendarId": "sarah.calendar@church.org",
      "workingHours": {
        "start": 9,
        "end": 17,
        "appointmentDuration": 60
      }
    }
  ]
}
```

### Get Availability

Checks available appointment slots for a counselor.

**Endpoint**: `GET /api/availability?counselorId={id}&date={YYYY-MM-DD}`

**Parameters**:
- `counselorId` (string): ID of the counselor
- `date` (string): Date in YYYY-MM-DD format

**Response**:
```json
{
  "availableSlots": [
    "9:00 AM",
    "10:00 AM",
    "2:00 PM",
    "3:00 PM"
  ],
  "counselor": {
    "id": "sarah-halsey",
    "name": "Sarah Halsey"
  },
  "date": "2025-01-20"
}
```

**Error Response**:
```json
{
  "error": "Missing counselorId or date parameter"
}
```

### Book Appointment

Schedules a counseling appointment.

**Endpoint**: `POST /api/book-appointment`

**Request Body**:
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

**Response**:
```json
{
  "success": true,
  "appointment": {
    "id": "appointment-id",
    "counselor": "Sarah Halsey",
    "date": "2025-01-20",
    "time": "10:00 AM",
    "status": "confirmed"
  },
  "calendarEvent": {
    "id": "google-calendar-event-id"
  },
  "emailSent": true
}
```

## 📞 Contact API

### Send Contact Message

Sends a contact form message via email.

**Endpoint**: `POST /api/contact`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "General Inquiry",
  "message": "I would like to know more about..."
}
```

**Response**:
```json
{
  "success": true,
  "message": "Message sent successfully"
}
```

**Error Response**:
```json
{
  "success": false,
  "error": "Failed to send message"
}
```

## 📝 Blog API (Planned)

### Get Blog Posts

**Endpoint**: `GET /api/blog/posts`

**Query Parameters**:
- `status` (optional): Filter by `published`, `draft`, or `scheduled`
- `category` (optional): Filter by category slug
- `limit` (optional): Number of posts to return (default: 10)
- `offset` (optional): Number of posts to skip (default: 0)

**Response**:
```json
{
  "success": true,
  "posts": [
    {
      "id": "post-id",
      "title": "Blog Post Title",
      "slug": "blog-post-title",
      "excerpt": "Brief excerpt...",
      "content": "Full post content...",
      "featuredImage": "/uploads/image.jpg",
      "author": {
        "uid": "author-id",
        "name": "Author Name"
      },
      "status": "published",
      "publishDate": "2025-01-15T10:00:00Z",
      "categories": ["announcements"],
      "tags": ["community", "events"],
      "seo": {
        "metaTitle": "SEO Title",
        "metaDescription": "SEO Description"
      }
    }
  ],
  "total": 25,
  "hasMore": true
}
```

### Create/Update Blog Post

**Endpoint**: `POST /api/blog/posts` (Create) | `PUT /api/blog/posts/[id]` (Update)

**Authentication**: Required (Admin role)

**Request Body**:
```json
{
  "title": "Post Title",
  "content": "Full post content in markdown/HTML",
  "excerpt": "Brief excerpt",
  "featuredImage": "/uploads/image.jpg",
  "status": "published",
  "publishDate": "2025-01-15T10:00:00Z",
  "categories": ["announcements"],
  "tags": ["community", "events"],
  "seo": {
    "metaTitle": "SEO Title",
    "metaDescription": "SEO Description"
  }
}
```

### Delete Blog Post

**Endpoint**: `DELETE /api/blog/posts/[id]`

**Authentication**: Required (Admin role)

### Blog Categories

**Endpoint**: `GET /api/blog/categories`

**Response**:
```json
{
  "categories": [
    {
      "id": "announcements",
      "name": "Announcements",
      "slug": "announcements",
      "description": "Church announcements and updates"
    }
  ]
}
```

## 👥 User Management API (Planned)

### Get Users

**Endpoint**: `GET /api/users`

**Authentication**: Required (Admin role)

**Query Parameters**:
- `role` (optional): Filter by user role
- `limit` (optional): Number of users to return
- `search` (optional): Search by name or email

**Response**:
```json
{
  "users": [
    {
      "uid": "user-id",
      "email": "user@example.com",
      "displayName": "John Doe",
      "role": "member",
      "profile": {
        "firstName": "John",
        "lastName": "Doe",
        "phone": "555-123-4567",
        "ministry": ["worship", "youth"],
        "joinDate": "2025-01-01T00:00:00Z"
      },
      "lastLoginAt": "2025-01-15T10:00:00Z",
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 150
}
```

### Update User Role

**Endpoint**: `PUT /api/users/[uid]/role`

**Authentication**: Required (Admin role)

**Request Body**:
```json
{
  "role": "admin" | "member" | "visitor"
}
```

## 📧 Newsletter API (Planned)

### Create Newsletter Campaign

**Endpoint**: `POST /api/newsletter/campaigns`

**Authentication**: Required (Admin role)

**Request Body**:
```json
{
  "subject": "Newsletter Subject",
  "content": "Newsletter HTML content",
  "recipients": "all" | "members" | "subscribers",
  "scheduleDate": "2025-01-20T10:00:00Z"
}
```

### Get Campaign Statistics

**Endpoint**: `GET /api/newsletter/campaigns/[id]/stats`

**Response**:
```json
{
  "sent": 150,
  "delivered": 148,
  "opened": 75,
  "clicked": 25,
  "bounced": 2,
  "openRate": "50.7%",
  "clickRate": "16.9%"
}
```

## 📊 Analytics API (Planned)

### Get Site Analytics

**Endpoint**: `GET /api/analytics/overview`

**Authentication**: Required (Admin role)

**Query Parameters**:
- `period`: `7d`, `30d`, `90d`, or `1y`

**Response**:
```json
{
  "pageViews": 1250,
  "uniqueVisitors": 890,
  "eventRSVPs": 45,
  "blogViews": 320,
  "topPages": [
    { "path": "/", "views": 450 },
    { "path": "/events", "views": 280 }
  ],
  "deviceBreakdown": {
    "mobile": 60,
    "desktop": 35,
    "tablet": 5
  }
}
```

## 🔐 Authentication

### Cookie-based Authentication (Current)

The calendar integration uses HTTP-only cookies for security:

**Cookies Set**:
- `google_access_token`: OAuth access token (1 hour expiry)
- `google_refresh_token`: OAuth refresh token (30 days expiry)
- `google_user_email`: User email for UI display (30 days expiry)

**Security Features**:
- HTTP-only cookies prevent XSS attacks
- Secure flag in production
- SameSite protection

### Firebase Authentication (Planned)

Future authentication will use Firebase Auth with JWT tokens:

**Headers Required**:
- `Authorization: Bearer <firebase_jwt_token>`

**User Roles**:
- `admin`: Full access to all admin endpoints
- `member`: Access to member features (RSVPs, profile)
- `visitor`: Limited access (public content only)

## 📊 Response Formats

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details"
}
```

### Pagination (Future)
```json
{
  "success": true,
  "data": [ /* items */ ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

## 🚨 Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Missing or invalid authentication |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

## 🔄 Rate Limiting

The application uses Google Calendar API quotas:
- **Calendar API**: 1,000,000 requests/day
- **Per-user limit**: 10,000 requests/100 seconds

No additional rate limiting is implemented in the application.

## 🧪 Testing

### Test Endpoints

```bash
# Get church events
curl http://localhost:9002/api/church-events

# Get counselors
curl http://localhost:9002/api/counselors

# Check availability
curl "http://localhost:9002/api/availability?counselorId=sarah-halsey&date=2025-01-20"

# Book appointment
curl -X POST http://localhost:9002/api/book-appointment \
  -H "Content-Type: application/json" \
  -d '{
    "counselorId": "sarah-halsey",
    "date": "2025-01-20",
    "time": "10:00 AM",
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "reason": "Test appointment"
  }'
```

### Development Tools

Use these tools for API testing:
- **Postman**: Full-featured API testing
- **Insomnia**: Lightweight REST client
- **curl**: Command-line testing
- **Browser DevTools**: Network tab inspection

## 📈 Monitoring

### Logs

All API endpoints log:
- Request details (method, path, parameters)
- Response status and timing
- Error details with stack traces
- Google API quota usage

### Metrics

Track these metrics in production:
- Response times per endpoint
- Error rates by endpoint
- Google API quota usage
- Calendar sync success rates

## 🔧 Configuration

### Environment Variables

The following environment variables are required for API functionality:

#### Required
```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Calendar Integration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_SERVICE_ACCOUNT_EMAIL=service_account@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
CHURCH_CALENDAR_ID=calendar_id@group.calendar.google.com
NEXT_PUBLIC_CHURCH_CALENDAR_ID=calendar_id@group.calendar.google.com

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
MAIL_FROM="Church Name <no-reply@church.org>"
```

#### Optional
```bash
# Development URLs
NEXTAUTH_URL=http://localhost:9002
GOOGLE_REDIRECT_URI=http://localhost:9002/api/calendar/callback

# Email Marketing Service (for newsletters)
RESEND_API_KEY=your_resend_api_key

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Admin Configuration
ADMIN_EMAIL=admin@yourchurch.org
```

See `env.example` for all required environment variables with detailed setup instructions.

### Google API Limits

Monitor these limits:
- Calendar API daily quota: 1,000,000 requests/day
- Events per calendar: 25,000 events
- Requests per minute per user: 600

---

**Need help?** Check the implementation in the `src/app/api/` directory for detailed examples. 