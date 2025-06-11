# Customization Guide

This guide helps you customize the First Baptist Church of Fenton website for your own church or organization.

## 🎨 Branding and Styling

### Church Information

Update basic church information throughout the application:

1. **Site Title and Metadata**
   
   Edit `src/app/layout.tsx`:
   ```typescript
   export const metadata: Metadata = {
     title: 'Your Church Name',
     description: 'Welcome to Your Church Name - A community of faith...',
   }
   ```

2. **Church Name References**
   
   Search and replace "First Baptist Church of Fenton" in:
   - `src/app/page.tsx` - Homepage content
   - `src/components/ui/navigation.tsx` - Navigation branding
   - `README.md` - Documentation
   - Package.json name field

3. **Contact Information**
   
   Update contact details in:
   - `src/app/contact/page.tsx` - Contact form
   - `src/app/page.tsx` - Homepage contact section
   - Footer components

### Colors and Theme

The application uses Tailwind CSS with a custom color scheme:

1. **Primary Colors**
   
   Edit `tailwind.config.ts`:
   ```typescript
   theme: {
     extend: {
       colors: {
         primary: {
           50: '#f0f9ff',
           500: '#3b82f6', // Your primary color
           600: '#2563eb',
           700: '#1d4ed8',
         },
         accent: '#10b981', // Your accent color
       }
     }
   }
   ```

2. **CSS Variables**
   
   Edit `src/app/globals.css` for shadcn/ui colors:
   ```css
   :root {
     --primary: 214.3 31.8% 91.4%;
     --primary-foreground: 222.2 84% 4.9%;
     --accent: 210 40% 98%;
   }
   ```

### Logo and Images

1. **Favicon**
   - Replace `src/app/favicon.ico` with your church logo
   - Ensure it's 32x32 or 64x64 pixels

2. **Hero Images**
   - Add church photos to `public/images/`
   - Update image references in homepage components

3. **Counselor Photos**
   - Add counselor photos to `public/images/counselors/`
   - Update references in `src/app/api/counselors/route.ts`

## 🗓️ Events Configuration

### Event Categories

Customize event categories to match your ministry structure:

Edit `src/lib/calendar.ts`:
```typescript
const eventCategories = [
  { 
    id: 'worship', 
    name: 'Worship Services', 
    icon: '🙏', 
    color: '#8B5CF6',
    description: 'Sunday services and special worship events'
  },
  {
    id: 'bible-study',
    name: 'Bible Study',
    icon: '📖',
    color: '#F59E0B',
    description: 'Weekly Bible study groups'
  },
  // Add your own categories
];
```

### Google Calendar Color Mapping

Update color mapping for your calendar system:

```typescript
const mapColorToCategory = (colorId?: string) => {
  const colorCategoryMap: Record<string, string> = {
    '9': 'worship',     // Blue events = Worship
    '6': 'bible-study', // Orange events = Bible Study
    '10': 'outreach',   // Green events = Outreach
    // Map your Google Calendar colors to categories
  };
  // ...
};
```

## 🎥 Sermon Integration

### YouTube Channel

Update sermon configuration in `src/app/sermons/page.tsx`:

```typescript
export default function SermonsPage() {
  // Update with your church's YouTube channel
  const youtubeChannelUrl = 'https://www.youtube.com/channel/YOUR_CHANNEL_ID';

  // Update with your sermon video IDs
  const sermonVideoIds = [
    'your-video-id-1',
    'your-video-id-2',
    'your-video-id-3',
    // Add more video IDs
  ];
```

### Alternative Video Platforms

To use Vimeo or other platforms:

1. **Vimeo Integration**
   ```typescript
   const getEmbedUrl = (videoId: string) => 
     `https://player.vimeo.com/video/${videoId}`;
   ```

2. **Self-hosted Videos**
   ```typescript
   const getEmbedUrl = (videoPath: string) => 
     `/videos/${videoPath}`;
   ```

## 👨‍⚕️ Counseling System

### Counselor Information

Update counselor data in `src/app/api/counselors/route.ts`:

```typescript
const counselors = [
  {
    id: "john-smith",
    name: "John Smith",
    title: "Senior Pastor",
    experience: "15+ Years Experience",
    specialties: [
      "Pastoral Counseling",
      "Grief Support",
      "Spiritual Guidance"
    ],
    bio: "Pastor John has been serving our community...",
    image: "/images/counselors/john-smith.jpg",
    email: "john@yourchurch.org",
    phone: "(555) 123-4567",
    calendarId: process.env.CHURCH_CALENDAR_ID,
    workingHours: {
      start: 9,    // 9 AM
      end: 17,     // 5 PM
      appointmentDuration: 60, // 60 minutes
      daysAvailable: [1, 2, 3, 4, 5], // Monday-Friday
    }
  },
  // Add more counselors
];
```

### Appointment Time Slots

Customize available appointment times:

```typescript
// In src/app/api/availability/route.ts
const generateTimeSlots = (start: number, end: number, duration: number) => {
  const slots = [];
  for (let hour = start; hour < end; hour++) {
    // Customize time slot generation
    if (hour !== 12) { // Skip lunch hour
      slots.push(formatTime(hour, 0));
      if (duration === 30) {
        slots.push(formatTime(hour, 30)); // 30-minute slots
      }
    }
  }
  return slots;
};
```

## 📧 Email Configuration

### Email Templates

Customize email templates in `src/app/api/book-appointment/route.ts`:

```typescript
const emailHtml = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h1 style="color: #3b82f6;">Your Church Name</h1>
    <h2>Appointment Confirmation</h2>
    
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
      <h3>Appointment Details</h3>
      <p><strong>Counselor:</strong> ${counselor.name}</p>
      <p><strong>Date:</strong> ${new Date(bookingData.date).toLocaleDateString()}</p>
      <p><strong>Time:</strong> ${bookingData.time}</p>
      <p><strong>Duration:</strong> 1 hour</p>
    </div>

    <div style="margin-top: 20px;">
      <h3>What to Expect</h3>
      <p>Your custom instructions here...</p>
    </div>

    <div style="margin-top: 20px; text-align: center;">
      <p>Questions? Contact us at info@yourchurch.org</p>
    </div>
  </div>
`;
```

### Contact Form

Update contact form destination in `src/app/api/contact/route.ts`:

```typescript
await resend.emails.send({
  from: 'website@yourchurch.org',
  to: ['info@yourchurch.org', 'pastor@yourchurch.org'],
  subject: `Contact Form: ${subject}`,
  // ... rest of email configuration
});
```

## 🏗️ Page Structure

### Homepage Sections

Customize homepage sections in `src/app/page.tsx`:

1. **Hero Section**
   ```typescript
   <section className="hero">
     <h1>Welcome to Your Church Name</h1>
     <p>Your church's mission statement here</p>
   </section>
   ```

2. **Services Section**
   ```typescript
   const services = [
     {
       title: "Sunday Service",
       time: "10:00 AM",
       description: "Join us for worship and fellowship"
     },
     {
       title: "Wednesday Bible Study",
       time: "7:00 PM", 
       description: "Dive deeper into God's Word"
     }
   ];
   ```

### Navigation Menu

Update navigation in your layout components:

```typescript
const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/sermons', label: 'Sermons' },
  { href: '/events', label: 'Events' },
  { href: '/ministries', label: 'Ministries' },
  { href: '/contact', label: 'Contact' },
  { href: '/give', label: 'Give' }, // Add donation page
];
```

## 🎯 Ministry-Specific Features

### Youth Ministry

Add youth-specific features:

1. **Youth Events Filter**
   ```typescript
   const youthEvents = events.filter(event => 
     event.category?.id === 'youth'
   );
   ```

2. **Youth Registration Forms**
   Create `src/app/youth/register/page.tsx` for youth event registration

### Small Groups

Add small group management:

1. **Small Groups API**
   Create `src/app/api/small-groups/route.ts`

2. **Group Finder**
   Create `src/app/small-groups/page.tsx` with map integration

## 🔌 Third-Party Integrations

### Donation Platform

Integrate with giving platforms:

1. **Tithe.ly Integration**
   ```typescript
   const donationUrl = "https://tithe.ly/give?c=your-church-id";
   ```

2. **PayPal Donations**
   ```typescript
   const paypalButton = `
     <form action="https://www.paypal.com/donate" method="post">
       <input type="hidden" name="hosted_button_id" value="YOUR_BUTTON_ID" />
       <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" />
     </form>
   `;
   ```

### Live Streaming

Add live stream integration:

```typescript
// YouTube Live
const liveStreamUrl = "https://www.youtube.com/embed/live_stream?channel=YOUR_CHANNEL_ID";

// Facebook Live
const facebookLiveUrl = "https://www.facebook.com/plugins/video.php?href=YOUR_PAGE_URL";
```

## 📱 Mobile App Integration

### Push Notifications

Add push notification setup:

1. **Service Worker**
   Create `public/sw.js` for push notifications

2. **Notification API**
   Create `src/app/api/notifications/route.ts`

### App Store Links

Add mobile app promotion:

```typescript
const appLinks = {
  ios: "https://apps.apple.com/app/your-church-app",
  android: "https://play.google.com/store/apps/details?id=your.church.app"
};
```

## 🔧 Advanced Customization

### Custom Components

Create church-specific components:

1. **Tithing Calculator**
   ```typescript
   // src/components/TithingCalculator.tsx
   export function TithingCalculator() {
     // Component for calculating tithes and offerings
   }
   ```

2. **Prayer Request Form**
   ```typescript
   // src/components/PrayerRequestForm.tsx
   export function PrayerRequestForm() {
     // Component for submitting prayer requests
   }
   ```

### Database Integration

Upgrade from localStorage to proper database:

1. **Database Setup**
   ```bash
   # Choose your preferred database solution
   npm install prisma @prisma/client  # For Prisma ORM
   # or
   npm install drizzle-orm            # For Drizzle ORM
   ```

2. **Database Schema Example**
   ```sql
   -- Users table
   CREATE TABLE users (
     id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
     email text UNIQUE NOT NULL,
     name text NOT NULL,
     created_at timestamp DEFAULT now()
   );

   -- RSVPs table
   CREATE TABLE event_rsvps (
     id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id uuid REFERENCES users(id),
     event_id text NOT NULL,
     created_at timestamp DEFAULT now()
   );
   ```

## 🚀 Performance Optimization

### Image Optimization

Set up Next.js Image optimization:

```typescript
// next.config.ts
module.exports = {
  images: {
    domains: ['your-church-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },
};
```

### Caching Strategy

Implement caching for better performance:

```typescript
// Cache calendar events for 5 minutes
export const revalidate = 300;
```

## 🔍 SEO Optimization

### Metadata

Add church-specific SEO:

```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  title: 'Your Church Name - Faith, Community, Service',
  description: 'Join us at Your Church Name for inspiring worship, strong community, and meaningful service opportunities.',
  keywords: 'church, faith, worship, community, your city',
  openGraph: {
    title: 'Your Church Name',
    description: 'A welcoming community of faith',
    images: ['/images/church-exterior.jpg'],
  },
};
```

### Structured Data

Add church schema markup:

```typescript
const churchSchema = {
  "@context": "https://schema.org",
  "@type": "Church",
  "name": "Your Church Name",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Church Street",
    "addressLocality": "Your City",
    "addressRegion": "State",
    "postalCode": "12345"
  },
  "telephone": "(555) 123-4567",
  "url": "https://yourchurch.org"
};
```

---

**Need help customizing?** Check the implementation files and create an issue if you need guidance on specific customizations. 