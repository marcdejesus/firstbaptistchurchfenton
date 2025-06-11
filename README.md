# First Baptist Church of Fenton Website

A modern, full-featured church management website built with Next.js, featuring event management, sermon streaming, counseling appointments, and Google Calendar integration.

![Next.js](https://img.shields.io/badge/Next.js-15.2.3-black)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.1-blue)

## ✨ Features

### 🗓️ Event Management
- **Google Calendar Integration**: Automatically sync events from church Google Calendar
- **Event Categories**: Worship, Fellowship, Outreach, Education, Youth, Family, Special Events
- **RSVP System**: Allow members to RSVP for events with local storage
- **Calendar Subscription**: Members can subscribe to church calendar in their personal apps
- **Event Filtering**: Filter by category, date, and personal RSVPs
- **Real-time Updates**: Events automatically update from Google Calendar

### 🎥 Sermon Management
- **YouTube Integration**: Embed sermon videos directly from YouTube channel
- **Popular Sermons**: Showcase most important sermon videos
- **Direct Channel Access**: Link to full YouTube channel

### 📅 Counseling Appointments
- **Online Booking**: Schedule counseling appointments through the website
- **Counselor Selection**: Choose from available counselors
- **Real-time Availability**: Check available time slots via Google Calendar API
- **Email Confirmations**: Automatic email notifications for appointments
- **Calendar Integration**: Appointments automatically added to counselor calendars

### 🔐 User Management
- **User Context**: Persistent user state across the application
- **Profile Management**: User profile and preference management
- **Authentication**: Secure login and registration system

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first responsive design
- **shadcn/ui Components**: Beautiful, accessible UI components
- **Dark/Light Mode**: Theme support with Tailwind CSS
- **Loading States**: Smooth loading indicators and error handling
- **Toast Notifications**: User feedback for actions

### 🤖 AI Integration
- **Google Genkit**: AI-powered features and automation
- **Event Summaries**: AI-generated event summaries and descriptions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Cloud Project (for Calendar API)
- Google Calendar for your church
- (Optional) Resend account for email notifications

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd firstbaptistchurchfenton
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your environment variables (see [Environment Variables](#environment-variables) section)

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:9002](http://localhost:9002)

## 📋 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Required Variables

```bash
# Google Calendar API (Service Account)
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
CHURCH_CALENDAR_ID=your-church-calendar@group.calendar.google.com

# Google Calendar OAuth (User Calendar Integration)
GOOGLE_CLIENT_ID=your-oauth-client-id.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-oauth-client-secret
GOOGLE_REDIRECT_URI=http://localhost:9002/api/calendar/callback

# Public Calendar Subscription
NEXT_PUBLIC_CHURCH_CALENDAR_ID=your-church-calendar@group.calendar.google.com
```

### Optional Variables

```bash
# Email Notifications (Resend)
RESEND_API_KEY=your-resend-api-key

# BookingJS Configuration (for embedded calendar)
BOOKING_JS_TOKEN=your-booking-js-token

# Authentication Secret
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# AI Features (Google Genkit)
GOOGLE_API_KEY=your-gemini-api-key

# Application URL (for production)
NEXTAUTH_URL=https://your-domain.com
```

## ⚙️ Configuration

### Google Calendar Setup

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing one

2. **Enable Google Calendar API**
   - Navigate to APIs & Services > Library
   - Search for "Google Calendar API" and enable it

3. **Create Service Account** (for reading church calendar)
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > "Service Account"
   - Download the JSON key file
   - Copy email and private key to environment variables

4. **Set up OAuth 2.0** (for user calendar integration)
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Set application type to "Web application"
   - Add authorized redirect URI: `http://localhost:9002/api/calendar/callback`

5. **Share Church Calendar**
   - Open your church Google Calendar
   - Share it with the service account email
   - Give "Make changes and manage sharing" permission

For detailed setup instructions, see [docs/CALENDAR_INTEGRATION_SETUP.md](docs/CALENDAR_INTEGRATION_SETUP.md)

### Email Setup (Optional)

1. **Sign up for Resend**: [https://resend.com](https://resend.com)
2. **Get API Key**: Copy from your Resend dashboard
3. **Add to Environment**: Set `RESEND_API_KEY` in `.env.local`

If not configured, appointment confirmations will be logged to console instead.

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── api/
│   │   ├── auth/
│   │   ├── calendar/
│   │   ├── church-events/
│   │   ├── contact/
│   │   └── counselors/
│   ├── book-appointment/
│   ├── contact/
│   ├── counseling/
│   ├── donate/
│   ├── events/
│   ├── ministries/
│   ├── profile/
│   ├── sermons/
│   └── globals.css
├── components/
│   ├── auth/
│   ├── events/
│   ├── home/
│   ├── layout/
│   └── ui/
├── contexts/
│   └── UserContext.tsx
├── data/
│   ├── counselors.ts
│   ├── sermons.ts
│   └── testimonials.ts
├── hooks/
│   └── use-toast.ts
├── lib/
│   ├── auth.ts           # Authentication utilities
│   ├── calendar.ts       # Google Calendar integration
│   ├── email.ts          # Email service (Resend)
│   ├── logger.ts         # Logging utilities
│   └── utils.ts          # Utility functions
└── types/
    └── index.ts          # TypeScript type definitions
```

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start development server (port 9002)
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run typecheck       # Run TypeScript type checking

# AI Development (Genkit)
npm run genkit:dev      # Start Genkit development server
npm run genkit:watch    # Start Genkit with file watching
```

## 📚 Features Guide

### Event Management

Events are automatically synchronized from your church's Google Calendar. To add events:

1. **Add to Google Calendar**: Create events in your church's Google Calendar
2. **Set Categories**: Use color coding to categorize events
3. **Add Details**: Include location, description, and contact info
4. **Automatic Sync**: Events appear on website within minutes

For more details, see [docs/CALENDAR_INTEGRATION_SETUP.md](docs/CALENDAR_INTEGRATION_SETUP.md)

### Counseling Appointments

The booking system allows church members to schedule counseling appointments:

1. **Select Date**: Choose from available weekdays
2. **Pick Counselor**: Select from available counselors  
3. **Choose Time**: View real-time availability
4. **Book Appointment**: Fill out contact form and confirm

For setup instructions, see [docs/BOOKING_SYSTEM.md](docs/BOOKING_SYSTEM.md)

### Sermon Integration

Sermons are embedded from YouTube:

1. **Update Video IDs**: Modify `sermonVideoIds` array in `src/app/sermons/page.tsx`
2. **Channel Link**: Update `youtubeChannelUrl` to your church's YouTube channel
3. **Automatic Embedding**: Videos are automatically embedded with proper aspect ratios

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📖 Documentation

For detailed guides and references:

- 🚀 [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment instructions
- 🎨 [Customization Guide](docs/CUSTOMIZATION.md) - Adapt the site for your church
- 📚 [API Reference](docs/API_REFERENCE.md) - Complete API endpoint documentation
- 🚨 [Error Handling](docs/ERROR_HANDLING.md) - Comprehensive error page system
- 📋 [Environment Variables](env.example) - Configuration reference

## 🆘 Support

- **Documentation**: Check the `docs/` directory for detailed guides
- **Issues**: Report bugs or request features via GitHub Issues
- **Community**: Join our discussions for help and support

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful and accessible UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Google Calendar API](https://developers.google.com/calendar) - Calendar integration
- [Resend](https://resend.com/) - Email delivery service

---

**Built with ❤️ for First Baptist Church of Fenton**
