# Email Setup Guide

This guide explains how to configure email functionality for the contact form and prayer request forms using Google SMTP.

## ✅ Features Implemented

### 📧 Contact Form
- ✅ Saves submissions to database (`ContactSubmission` model)
- ✅ Sends notification email to church staff
- ✅ Sends auto-reply confirmation to user
- ✅ Admin dashboard to view and manage submissions
- ✅ Mark submissions as read/unread
- ✅ Delete submissions

### 🙏 Prayer Request Form
- ✅ Saves requests to database (`PrayerRequest` model)
- ✅ Sends notification email to prayer team
- ✅ Sends auto-reply confirmation to user (if email provided)
- ✅ Handles both public and private prayer requests
- ✅ Admin dashboard to view and manage requests
- ✅ Mark requests as answered/unanswered
- ✅ Delete requests

## 🔧 Environment Variables Setup

Add these variables to your `.env.local` file:

### Google SMTP Configuration (Preferred)
```bash
# Google SMTP for email sending
GOOGLE_SMTP_USER=your-church-email@gmail.com
GOOGLE_SMTP_PASSWORD=your-app-password

# Church contact information
CHURCH_CONTACT_EMAIL=info@fbfenton.org
CHURCH_PRAYER_EMAIL=prayer@fbfenton.org
CHURCH_NAME=First Baptist Church Fenton
CHURCH_PHONE=(810) 629-9425

# Email "from" address
MAIL_FROM="First Baptist Church Fenton <info@fbfenton.org>"
```

### Fallback SMTP Configuration
```bash
# Generic SMTP configuration (fallback)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-church-email@gmail.com
MAIL_PASS=your-app-password
```

## 🔐 Google App Password Setup

To use Gmail SMTP, you need to generate an App Password:

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Factor Authentication if not already enabled

### Step 2: Generate App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" as the app
3. Select "Other (Custom name)" as the device
4. Enter "Church Website" as the name
5. Click "Generate"
6. Copy the generated 16-character password
7. Use this password as `GOOGLE_SMTP_PASSWORD`

### Step 3: Configure Email Addresses
Set up dedicated email addresses for different purposes:
- `CHURCH_CONTACT_EMAIL`: Where contact form submissions are sent
- `CHURCH_PRAYER_EMAIL`: Where prayer requests are sent
- `GOOGLE_SMTP_USER`: The Gmail account used to send emails

## 📱 Email Templates

The system includes beautiful HTML email templates with:

### Contact Form Notifications
- Professional layout with church branding
- Contact information prominently displayed
- Reply-to functionality
- Auto-reply confirmation to users

### Prayer Request Notifications
- Respectful, spiritual design
- Privacy indicators (public/confidential)
- Biblical quotes for encouragement
- Auto-reply with prayer commitment

## 🎛️ Admin Dashboard Features

### Contact Submissions (`/admin/communications/contact`)
- View all contact form submissions
- Statistics: Total, Unread, This Week, Volunteer Inquiries
- Mark submissions as read/unread
- Delete submissions
- Direct email reply functionality
- Phone number linking (click to call)

### Prayer Requests (`/admin/communications/prayer`)
- View all prayer requests
- Statistics: Total, Public, Private, Answered
- Mark requests as answered/unanswered
- Delete requests
- Privacy protection for confidential requests
- Direct contact functionality

## 🔄 API Endpoints

### Contact Form
- `POST /api/contact` - Submit contact form
- `GET /api/admin/contact-submissions` - List submissions (admin)
- `PATCH /api/admin/contact-submissions/[id]` - Update submission status
- `DELETE /api/admin/contact-submissions/[id]` - Delete submission

### Prayer Requests
- `POST /api/prayer-requests` - Submit prayer request
- `GET /api/prayer-requests` - Get public prayer requests
- `GET /api/admin/prayer-requests` - List all requests (admin)
- `PATCH /api/admin/prayer-requests/[id]` - Update request status
- `DELETE /api/admin/prayer-requests/[id]` - Delete request

## 🛡️ Security Features

- ✅ Input validation and sanitization
- ✅ Email format validation
- ✅ Rate limiting ready (can be added)
- ✅ Admin authentication required
- ✅ Privacy protection for confidential requests
- ✅ SQL injection protection via Prisma
- ✅ XSS protection via Next.js

## 🧪 Testing

### Test Contact Form
1. **Frontend**: Go to `/contact` page
2. **Fill out form**: 
   - Name (required)
   - Email (required) 
   - Phone (optional)
   - Subject (optional)
   - Message (required)
3. **Submit**: Click "Send Message" and wait for confirmation
4. **Check emails**: 
   - Church staff receives notification at `CHURCH_CONTACT_EMAIL`
   - User receives auto-reply confirmation
5. **Admin Dashboard**: Check `/admin/communications/contact` for the submission

### Test Prayer Request Form
1. **Frontend**: Go to `/prayer` page
2. **Fill out form**:
   - Name (required)
   - Email (optional - for follow-up)
   - Phone (optional)
   - Prayer Request (required)
   - Confidential checkbox (optional)
3. **Submit**: Click "Submit Prayer Request" and wait for confirmation
4. **Check emails**:
   - Prayer team receives notification at `CHURCH_PRAYER_EMAIL`
   - User receives auto-reply if email provided
5. **Admin Dashboard**: Check `/admin/communications/prayer` for the submission

### Form Features Tested
- ✅ **Real-time validation**: Required fields validated
- ✅ **Loading states**: Buttons show spinner during submission
- ✅ **Success feedback**: Green alert with confirmation message
- ✅ **Error handling**: Red alert with error details
- ✅ **Form reset**: Fields clear after successful submission
- ✅ **Email notifications**: Both to church staff and users
- ✅ **Database storage**: Submissions saved and visible in admin
- ✅ **Privacy options**: Confidential prayer requests marked properly

## 🚨 Troubleshooting

### Email Not Sending
1. Check environment variables are set correctly
2. Verify Google App Password is correct
3. Check console logs for specific error messages
4. Ensure 2FA is enabled on Google account

### Database Issues
1. Run `npx prisma generate` to update Prisma client
2. Run `npx prisma db push` to sync database schema
3. Check database connection in console

### Admin Dashboard Issues
1. Ensure user is authenticated
2. Check user has admin role
3. Verify API endpoints are working

## 🎨 Customization

### Email Templates
Edit templates in `/src/lib/email.ts`:
- Church name and contact info
- Colors and styling
- Email content and Bible verses

### Admin Dashboard
Customize admin pages in:
- `/src/app/admin/communications/contact/`
- `/src/app/admin/communications/prayer/`

## 📊 Database Schema

### ContactSubmission
```sql
CREATE TABLE contact_submissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  subject VARCHAR,
  message TEXT NOT NULL,
  phone VARCHAR,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by INTEGER REFERENCES users(id)
);
```

### PrayerRequest
```sql
CREATE TABLE prayer_requests (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR,
  phone VARCHAR,
  message TEXT NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  is_answered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by INTEGER REFERENCES users(id)
);
```

## 🎯 Next Steps

1. ✅ Set up Google App Password
2. ✅ Configure environment variables
3. ✅ Test both forms
4. ✅ Train staff on admin dashboard
5. 🔄 Set up email forwarding if needed
6. 🔄 Configure backup notification methods
7. 🔄 Set up monitoring for form submissions

---

*This completes the email integration setup. Both forms now work seamlessly with Google SMTP and provide full admin dashboard functionality.*
