# Component Migration Guide
## First Baptist Church - St. Isidore Design System Implementation

This guide details how your existing components will be enhanced or transformed to implement the new design system while maintaining all current functionality.

## Navigation System Migration

### Current Navigation Structure
```typescript
// Current Header.tsx structure
const aboutItems = [
  { href: '/about/beliefs', title: 'Our Beliefs' },
  { href: '/about/history', title: 'Our History' },
  { href: '/about/staff', title: 'Pastors & Staff' },
  { href: '/faq', title: 'FAQ' },
]

const connectItems = [
  { href: '/community', title: 'Community' },
  { href: '/ministries', title: 'Ministries' },
  { href: '/events', title: 'Events' },
  { href: '/volunteer', title: 'Volunteer' },
  { href: '/prayer', title: 'Prayer' },
  { href: '/contact', title: 'Contact' },
  { href: '/missions', title: 'Missions' },
]

const resourcesItems = [
  { href: '/blog', title: 'Blog' },
  { href: '/gallery', title: 'Gallery' },
  { href: '/sermons', title: 'Sermons' },
]

const navItems = [
  { href: '/donate', label: 'Give' },
  { href: '/next-steps', label: 'Next Steps' },
  { href: '/visit', label: 'Visit' }
];
```

### New Navigation Structure (Visitor-Centric)
```typescript
// Enhanced Header.tsx structure
const navigationCategories = [
  {
    id: "im-new",
    label: "I'm New",
    description: "For first-time visitors and newcomers to FBC",
    items: [
      { title: "Plan Your Visit", href: "/visit" },
      { title: "What to Expect", href: "/visit/what-to-expect" }, // NEW PAGE
      { title: "Next Steps", href: "/next-steps" },
      { title: "Watch Online", href: "/sermons/live" }, // NEW LIVE PAGE
    ]
  },
  {
    id: "about",
    label: "About Us",
    items: [
      ...aboutItems, // EXISTING
      { title: "Contact Us", href: "/contact" } // MOVED FROM CONNECT
    ]
  },
  {
    id: "connect", 
    label: "Connect",
    items: connectItems.filter(item => item.href !== '/contact') // REMOVE CONTACT
  },
  {
    id: "resources",
    label: "Resources", 
    items: [
      ...resourcesItems, // EXISTING
      { title: "Book Appointment", href: "/book-appointment" } // MOVED HERE
    ]
  },
  {
    id: "give",
    label: "Give",
    href: "/donate", // DIRECT LINK
    featured: true
  }
];
```

## Component Enhancement Roadmap

### 1. Header Component Migration
**File**: `src/components/layout/Header.tsx`

#### Current State
- Basic dropdown navigation
- User authentication menu
- Mobile hamburger menu

#### Enhanced State
- Mega-menu with descriptions and icons
- Search integration
- Improved mobile navigation with slide-out panel
- Better visual hierarchy

#### Migration Steps
```typescript
// Add mega-menu support
const MegaMenuDropdown = ({ category }) => {
  return (
    <div className="absolute top-full left-0 w-screen bg-white shadow-lg border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.items.map(item => (
            <Link href={item.href} className="group flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
              <item.icon className="h-6 w-6 text-accent mt-1" />
              <div>
                <h3 className="font-semibold group-hover:text-accent">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
```

### 2. Homepage Component Enhancements

#### WelcomeCard Enhancement
**File**: `src/components/WelcomeCard.tsx`

**Current Features**:
- Service information display
- Office hours
- Next event preview

**Enhanced Features**:
- Better visual hierarchy
- Improved call-to-action buttons
- Mobile-optimized layout
- Quick action buttons

```typescript
// Enhanced WelcomeCard
export function EnhancedWelcomeCard({ todaysHours, nextEvent }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-8 md:p-12">
      {/* Enhanced content with better CTAs */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-lora font-bold text-primary-foreground mb-4">
            Welcome to FBC Fenton
          </h1>
          <p className="text-xl text-primary-foreground/80 mb-6">
            Growing in Faith, Sharing God's Love
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-accent hover:bg-accent-600">
              Plan Your Visit
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg">
              Watch Online
              <Play className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
        <div>
          {/* Service info and next event */}
        </div>
      </div>
    </section>
  );
}
```

#### New: This Week at FBC Component
**File**: `src/components/home/ThisWeekAtFBC.tsx`

```typescript
interface ThisWeekAtFBCProps {
  title: string;
  excerpt: string;
  imageUrl?: string;
  readMoreLink: string;
  publishDate: Date;
  author?: string;
}

export function ThisWeekAtFBC(props: ThisWeekAtFBCProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-lora font-bold text-primary-foreground mb-3">
            This Week at FBC
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay connected with what's happening in our church community
          </p>
        </div>
        
        <Card className="max-w-4xl mx-auto overflow-hidden">
          <div className="md:flex">
            {props.imageUrl && (
              <div className="md:w-1/3">
                <Image 
                  src={props.imageUrl}
                  alt={props.title}
                  width={400}
                  height={300}
                  className="h-64 md:h-full w-full object-cover"
                />
              </div>
            )}
            <CardContent className="md:w-2/3 p-8">
              <div className="flex items-center mb-4 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                {format(props.publishDate, 'MMMM d, yyyy')}
                {props.author && (
                  <>
                    <span className="mx-2">•</span>
                    <User className="h-4 w-4 mr-1" />
                    {props.author}
                  </>
                )}
              </div>
              <h3 className="text-2xl font-lora font-bold mb-4">{props.title}</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">{props.excerpt}</p>
              <Button variant="outline" asChild>
                <Link href={props.readMoreLink}>
                  Read More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </div>
        </Card>
      </div>
    </section>
  );
}
```

### 3. Event System Enhancement

#### Enhanced Event Card
**File**: `src/components/events/EnhancedEventCard.tsx`

```typescript
interface EnhancedEventCardProps {
  event: {
    id: string;
    title: string;
    date: Date;
    time: string;
    category: 'worship' | 'fellowship' | 'outreach' | 'youth' | 'education';
    location: string;
    rsvpCount: number;
    capacity?: number;
    imageUrl?: string;
  };
  onRSVP?: (eventId: string) => void;
}

const categoryColors = {
  worship: 'blue',
  fellowship: 'green', 
  outreach: 'purple',
  youth: 'orange',
  education: 'teal'
};

export function EnhancedEventCard({ event, onRSVP }: EnhancedEventCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      {event.imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <Image 
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge 
            variant="secondary" 
            className={`absolute top-3 left-3 bg-${categoryColors[event.category]}-500 text-white`}
          >
            {event.category}
          </Badge>
        </div>
      )}
      
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="text-sm text-muted-foreground">
            {format(event.date, 'MMM d')} • {event.time}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Calendar className="h-4 w-4 mr-2" />
                Add to Calendar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share className="h-4 w-4 mr-2" />
                Share Event
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <h3 className="font-semibold text-lg mb-2 group-hover:text-accent transition-colors">
          {event.title}
        </h3>
        
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          {event.location}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            {event.rsvpCount} attending
            {event.capacity && ` of ${event.capacity}`}
          </span>
          
          {onRSVP && (
            <Button size="sm" onClick={() => onRSVP(event.id)}>
              RSVP
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

### 4. Newsletter Integration

#### New Newsletter Signup Component
**File**: `src/components/newsletter/NewsletterSignup.tsx`

```typescript
export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Integration with your email service
      await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Newsletter signup failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="text-center p-8 bg-accent-50">
        <CheckCircle className="h-12 w-12 text-accent mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
        <p className="text-muted-foreground">
          Please check your email to confirm your subscription.
        </p>
      </Card>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-r from-primary-50 to-accent-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-lora font-bold mb-4">
          Stay Connected
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Get weekly spiritual insights and church updates delivered to your inbox
        </p>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex gap-3">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Subscribe'
              )}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </form>
      </div>
    </section>
  );
}
```

## Data Model Updates

### Enhanced Event Interface
```typescript
// src/types/events.ts
export interface EnhancedEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  endTime?: string;
  category: 'worship' | 'fellowship' | 'outreach' | 'youth' | 'education';
  location: string;
  address?: string;
  capacity?: number;
  rsvpCount: number;
  waitlistCount?: number;
  featured: boolean;
  imageUrl?: string;
  
  // New fields for enhanced functionality
  recurringPattern?: {
    type: 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: Date;
  };
  
  // RSVP and calendar features
  allowRSVP: boolean;
  requiresApproval: boolean;
  calendarLink?: string;
  
  // SEO and sharing
  slug: string;
  metaDescription?: string;
  
  // Content management
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published' | 'cancelled';
}
```

### Newsletter Content Model
```typescript
// src/types/newsletter.ts
export interface NewsletterContent {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  publishDate: Date;
  category: 'weekly-update' | 'special-announcement' | 'seasonal';
  featured: boolean;
  imageUrl?: string;
  author: {
    name: string;
    title: string;
    imageUrl?: string;
  };
  
  // Analytics
  viewCount: number;
  shareCount: number;
  
  // Content management
  status: 'draft' | 'published';
  scheduledFor?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## File Structure Updates

### New Component Organization
```
src/components/
├── layout/
│   ├── Header.tsx (ENHANCED)
│   ├── Footer.tsx (ENHANCED)
│   ├── MegaMenu.tsx (NEW)
│   └── SearchBar.tsx (NEW)
├── home/
│   ├── WelcomeCard.tsx (ENHANCED)
│   ├── ThisWeekAtFBC.tsx (NEW)
│   ├── NewsletterSignup.tsx (NEW)
│   └── TestimoniesCarousel.tsx (EXISTING)
├── events/
│   ├── EventCard.tsx (ENHANCED)
│   ├── EventFilters.tsx (NEW)
│   ├── EventCalendar.tsx (NEW)
│   └── RSVPButton.tsx (NEW)
├── newsletter/
│   ├── NewsletterSignup.tsx (NEW)
│   ├── NewsletterPreview.tsx (NEW)
│   └── SubscriptionManager.tsx (NEW)
└── search/
    ├── GlobalSearch.tsx (NEW)
    ├── SearchResults.tsx (NEW)
    └── SearchFilters.tsx (NEW)
```

## Migration Checklist

### Phase 1: Navigation (Week 1) - ✅ COMPLETED
- [✅] Update Header.tsx with mega-menu structure
- [✅] Create MegaMenu component
- [✅] Add search integration
- [✅] Update mobile navigation
- [✅] Test all existing links
- [✅] Create "What to Expect" page
- [✅] Implement visitor-centric navigation structure
- [✅] Enhance mobile responsive design
- [✅] Preserve all existing functionality

### Phase 2: Homepage (Week 2) - ✅ COMPLETED
- [✅] Enhance WelcomeCard component
- [✅] Create ThisWeekAtFBC component  
- [✅] Add NewsletterSignup component
- [✅] Update homepage layout
- [✅] Test responsive design
- [✅] Implement design system styling
- [✅] Add content strategy elements
- [✅] Preserve all existing functionality

### Phase 3: Events (Week 3) - ✅ COMPLETED
- [✅] Enhance EventCard component with design system styling
- [✅] Newsletter API endpoint created and functional
- [✅] Enhanced events page with gradient hero section
- [✅] Homepage events section redesigned with CardFooter structure
- [✅] Design system integration applied throughout
- [✅] All existing RSVP functionality preserved
- [✅] Event filtering and calendar export maintained
- [✅] Comprehensive error handling and validation

### Phase 4: Content (Week 4)
- [ ] Enhance blog system
- [ ] Add newsletter content management
- [ ] Improve search functionality
- [ ] Add social sharing
- [ ] Update admin interface

### Phase 5: Polish (Week 5)
- [ ] Performance optimization
- [ ] Accessibility testing
- [ ] SEO improvements
- [ ] Mobile testing
- [ ] User training

This migration guide ensures that all existing functionality is preserved while implementing the enhanced design patterns inspired by St. Isidore Church. 