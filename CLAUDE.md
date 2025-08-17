# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Next.js 15** church website for First Baptist Church Fenton built with:
- **Framework**: Next.js 15 with App Router and Turbopack
- **Styling**: Tailwind CSS with custom design system 
- **UI Components**: Radix UI primitives with shadcn/ui
- **Backend**: Firebase (Firestore, Auth, Storage)
- **External APIs**: Google Calendar API, Google Gemini AI (Genkit)
- **Email**: Resend API and NodeMailer
- **Deployment**: Runs on port 9002 in development

## Development Commands

```bash
# Development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Linting and type checking
npm run lint
npm run typecheck

# AI development (Genkit)
npm run genkit:dev
npm run genkit:watch
```

## Environment Setup

1. Copy environment file: `cp env.example .env.local`
2. Configure required variables in `.env.local`:
   - Google Calendar API credentials (service account + OAuth)
   - Church calendar ID
   - Optional: Resend API key, Google Gemini API key

## Code Architecture

### App Router Structure
- **Pages**: `/src/app/` - Next.js 15 App Router with route groups
- **API Routes**: `/src/app/api/` - Server-side endpoints for external integrations
- **Components**: `/src/components/` - Organized by domain (ui/, layout/, church/, etc.)
- **Library Code**: `/src/lib/` - Utilities, Firebase config, calendar service
- **Contexts**: `/src/contexts/` - React context providers (UserContext)
- **Hooks**: `/src/hooks/` - Custom React hooks
- **Types**: `/src/types/` - TypeScript type definitions

### Key Integrations

#### Google Calendar (`/src/lib/calendar/`)
- **Service**: Fetches church events via Google Calendar API
- **Auth**: OAuth flow for user calendar integration  
- **Categories**: Event categorization system with icons/colors
- **API Routes**: `/api/calendar/*` for OAuth and event management

#### Firebase (`/src/lib/firebase.ts`)
- **Firestore**: Database for user data, blog posts, admin content
- **Auth**: User authentication (currently mock, needs implementation)
- **Storage**: File uploads for admin features

#### Email Systems
- **Contact Forms**: NodeMailer configuration in `/api/contact/`
- **Appointment Booking**: Resend API integration
- **Prayer Requests**: Form submission with email delivery

### Design System

The project uses a comprehensive design system:
- **Typography**: Cardo (headings) + Proza Libre (body)
- **Colors**: Orange Peel (#fb7c25) + White (#FFFFFF) brand palette
- **Components**: Custom design system in `/design-system/` and shadcn/ui components
- **CSS Architecture**: CSS custom properties with Tailwind utility classes

### Current Implementation Status

**✅ Completed**:
- Basic church website with all static pages
- Google Calendar integration (read-only)
- Contact forms with email delivery
- Complete UI component library
- SEO optimization and accessibility features
- Error handling and performance monitoring setup

**🔄 Partially Implemented** (uses mocks/localStorage):
- User authentication (`/src/hooks/useAuth.ts`)
- Admin panel UI (`/src/app/admin/`)
- Blog system placeholder
- RSVP functionality

**❌ Needs Implementation**:
- Real Firebase Authentication
- Firestore database operations
- Blog CMS functionality  
- User management and role-based access
- Email campaign system

## Development Notes

### Configuration
- TypeScript and ESLint errors are ignored during builds (`next.config.ts`)
- Turbopack enabled for faster development
- Image optimization configured for multiple external domains

### Performance
- Mobile-first responsive design
- Font optimization with `display: swap`
- Performance monitoring infrastructure ready (`/src/lib/performance/`)

### Authentication Pattern
Currently uses mock authentication. When implementing real auth:
1. Replace `useAuth.ts` with Firebase Auth integration
2. Update `UserContext.tsx` to use Firebase Auth state
3. Implement protected route logic in layout components

### API Integration Pattern
External API calls follow this pattern:
- Service functions in `/src/lib/`
- Next.js API routes in `/src/app/api/`
- Error handling with try/catch and proper HTTP status codes
- Environment variable configuration

See `/docs/IMPLEMENTATION_PLAN.md` for detailed next steps and `/docs/API_REFERENCE.md` for complete API documentation.