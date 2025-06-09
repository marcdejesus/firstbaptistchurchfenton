# Calendar Integration Setup

This document explains how the church calendar integration works and how to set it up.

## Features

### 1. **Subscribe to Church Calendar**
Users can subscribe to the church's Google Calendar directly from the events page. This allows them to:
- View church events in their personal calendar apps
- Get notifications for upcoming events
- Automatically sync with any updates to church events

### 2. **Automatic Event Display**
The website automatically pulls events from the church's Google Calendar and displays them on the events page.

## Setup Instructions

### Environment Variables

Add these variables to your `.env.local` file:

```bash
# Google Calendar API (for fetching church events)
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key-here\n-----END PRIVATE KEY-----"
CHURCH_CALENDAR_ID=your-church-calendar@gmail.com

# Public calendar subscription (for users to subscribe)
NEXT_PUBLIC_CHURCH_CALENDAR_ID=your-church-calendar@gmail.com
```

### Setting Up Calendar Subscription

1. **Make Your Google Calendar Public**
   - Go to your church's Google Calendar
   - Click Settings (gear icon) → Settings
   - Select your church calendar from the left sidebar
   - Scroll to "Access permissions for events"
   - Check "Make available to public"
   - Choose "See all event details"

2. **Get Calendar ID**
   - In the same settings page
   - Scroll to "Integrate calendar"
   - Copy the "Calendar ID" (usually looks like: `abcd1234@group.calendar.google.com`)
   - Use this for both `CHURCH_CALENDAR_ID` and `NEXT_PUBLIC_CHURCH_CALENDAR_ID`

3. **Test Subscription URLs**
   - Google Calendar URL: `https://calendar.google.com/calendar/u/0?cid=YOUR_CALENDAR_ID`
   - ICS Feed URL: `https://calendar.google.com/calendar/ical/YOUR_CALENDAR_ID/public/basic.ics`

## How It Works

### For Church Staff (Adding Events)
1. Add events to your church's Google Calendar normally
2. Events automatically appear on the website within minutes
3. No additional steps needed

### For Church Members (Subscribing)
1. Visit the events page on your website
2. Use the "Subscribe to Church Calendar" section in the sidebar
3. Click "Subscribe in Google Calendar" for Google Calendar users
4. Or copy the ICS URL for other calendar apps (Apple Calendar, Outlook, etc.)

## Supported Calendar Apps

- **Google Calendar** - Direct subscription button
- **Apple Calendar** - Use ICS URL
- **Microsoft Outlook** - Use ICS URL  
- **Phone Calendars** - Most support ICS URLs
- **Other Calendar Apps** - Any app that supports ICS/webcal feeds

## Benefits

- **Always Up-to-Date**: Changes to church events automatically sync to subscribers
- **Cross-Platform**: Works with any calendar application
- **No App Required**: Uses standard calendar protocols
- **Automatic Reminders**: Users get reminders based on their calendar app settings
- **Offline Access**: Events sync to local calendar apps for offline viewing

## Troubleshooting

If subscription doesn't work:
1. Ensure the calendar is public
2. Verify the Calendar ID is correct
3. Try the ICS URL directly in a browser - it should download a .ics file
4. Check that the environment variables are set correctly

## Privacy & Security

- Only public event information is shared
- No personal data from subscribers is collected
- Standard Google Calendar privacy controls apply 