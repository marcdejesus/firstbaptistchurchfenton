# CMS Implementation Plan - First Baptist Church Fenton

## Overview

This document outlines the implementation plan for a user-friendly Content Management System (CMS) designed specifically for First Baptist Church Fenton. The system prioritizes simplicity and ease of use for non-technical administrators.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Core Features](#core-features)
3. [Database Schema](#database-schema)
4. [Implementation Phases](#implementation-phases)
5. [User Interface Design](#user-interface-design)
6. [Security & Authentication](#security--authentication)
7. [Training & Documentation](#training--documentation)
8. [Maintenance & Support](#maintenance--support)

## System Architecture

### Technology Stack
- **Frontend**: Next.js 14 with TypeScript (existing)
- **Database**: PostgreSQL or Supabase (recommended)
- **File Storage**: Vercel Blob or AWS S3
- **Image Processing**: Next.js Image API with sharp
- **Authentication**: NextAuth.js or Supabase Auth
- **Forms**: React Hook Form with Zod validation
- **Rich Text Editor**: Tiptap or React Quill

### File Structure
```
src/
├── app/
│   ├── admin/
│   │   ├── dashboard/
│   │   ├── content/
│   │   ├── media/
│   │   ├── blog/
│   │   ├── calendar/
│   │   └── settings/
├── components/
│   ├── admin/
│   │   ├── ContentEditor/
│   │   ├── MediaManager/
│   │   ├── BlogEditor/
│   │   └── CalendarManager/
├── lib/
│   ├── cms/
│   └── auth/
└── types/
    └── cms.ts
```

## Core Features

### 1. Dashboard Overview
- **Simple Metrics Display**
  - Recent blog posts
  - Upcoming events
  - Recent image uploads
  - Quick action buttons

### 2. Content Management
- **Page Content Editor**
  - Visual WYSIWYG editor
  - Section-based editing (Hero, About, etc.)
  - Preview functionality
  - Undo/Redo capabilities

### 3. Media Management
- **Image Upload & Management**
  - Drag & drop upload
  - Automatic image optimization
  - Alt tag editor with guidance
  - Image replacement for existing content
  - Organized folders (Events, Staff, Ministries, etc.)

### 4. Blog Management
- **Post Creation & Editing**
  - Rich text editor
  - Featured image upload
  - Category management
  - Draft/Published status
  - Scheduled publishing

### 5. Calendar Integration
- **Google Calendar Management**
  - Setup wizard for Google Calendar API
  - Event display customization
  - Sync status monitoring
  - Troubleshooting guides

### 6. User Management
- **Admin Roles**
  - Super Admin (full access)
  - Content Editor (content & media only)
  - Viewer (read-only dashboard)

## Database Schema

### Content Tables
```sql
-- Page Content
CREATE TABLE page_content (
  id SERIAL PRIMARY KEY,
  page_slug VARCHAR(255) NOT NULL,
  section_key VARCHAR(255) NOT NULL,
  content_type VARCHAR(50) NOT NULL, -- 'text', 'html', 'image', 'url'
  content_value TEXT,
  alt_text VARCHAR(255), -- for images
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  updated_by INTEGER REFERENCES users(id)
);

-- Media Library
CREATE TABLE media_library (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  alt_text VARCHAR(255),
  caption TEXT,
  folder VARCHAR(255) DEFAULT 'general',
  uploaded_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Blog Posts
CREATE TABLE blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image_id INTEGER REFERENCES media_library(id),
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'published', 'scheduled'
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  author_id INTEGER REFERENCES users(id)
);

-- Content Editable Areas
CREATE TABLE editable_areas (
  id SERIAL PRIMARY KEY,
  page_slug VARCHAR(255) NOT NULL,
  area_key VARCHAR(255) NOT NULL,
  area_label VARCHAR(255) NOT NULL,
  content_type VARCHAR(50) NOT NULL,
  default_value TEXT,
  help_text TEXT,
  is_required BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0
);

-- Users & Permissions
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'editor', -- 'admin', 'editor', 'viewer'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Implementation Phases

### Phase 1: Foundation (Week 1-2)
1. **Database Setup**
   - Create tables and relationships
   - Seed initial data for editable areas
   - Set up user authentication

2. **Basic Admin Layout**
   - Admin dashboard layout
   - Navigation structure
   - Basic styling with existing design system

### Phase 2: Content Management (Week 3-4)
1. **Page Content Editor**
   - WYSIWYG editor integration
   - Section-based editing interface
   - Save/preview functionality

2. **Media Manager**
   - File upload interface
   - Image preview and management
   - Alt tag editing

### Phase 3: Blog System (Week 5-6)
1. **Blog Post Editor**
   - Rich text editor
   - Image integration
   - Draft/publish workflow

2. **Blog Management**
   - Post listing and filtering
   - Category management
   - SEO metadata

### Phase 4: Calendar Integration (Week 7-8)
1. **Google Calendar Setup**
   - API integration wizard
   - Connection testing
   - Error handling and troubleshooting

2. **Calendar Management**
   - Display customization
   - Sync monitoring
   - Manual event override

### Phase 5: Polish & Training (Week 9-10)
1. **User Experience Refinement**
   - Usability testing with actual users
   - Interface improvements
   - Help documentation

2. **Training Materials**
   - Video tutorials
   - Step-by-step guides
   - Quick reference cards

## User Interface Design

### Design Principles
1. **Simplicity First**: Large buttons, clear labels, minimal options per screen
2. **Visual Feedback**: Clear success/error messages, loading states
3. **Familiar Patterns**: Use common web patterns and icons
4. **Guided Workflows**: Step-by-step processes with help text
5. **Forgiving Interface**: Undo options, confirmation dialogs for destructive actions

### Key Interface Elements

#### Dashboard Layout
```typescript
interface DashboardLayout {
  sidebar: {
    width: 'large'; // More space for readable text
    sections: [
      'Dashboard',
      'Website Content',
      'Photos & Media',
      'Blog Posts',
      'Calendar Setup',
      'Help & Support'
    ];
  };
  mainContent: {
    welcomeMessage: string;
    quickActions: QuickAction[];
    recentActivity: ActivityItem[];
  };
}
```

#### Content Editor Interface
- **Large Text Areas**: Easy to read and edit
- **Visual Preview**: Side-by-side or toggle view
- **Section Labels**: Clear identification of what each field controls
- **Help Tooltips**: Context-sensitive help for each field

#### Image Upload Interface
- **Drag & Drop Zone**: Large, obvious target area
- **Progress Indicators**: Clear upload progress
- **Thumbnail Previews**: Immediate visual feedback
- **Alt Text Helper**: Guidance on writing good alt text

## Security & Authentication

### User Authentication
- **Simple Login**: Email/password with "Remember Me" option
- **Password Reset**: User-friendly reset flow
- **Session Management**: Automatic logout after inactivity

### Role-Based Access Control
```typescript
interface UserRole {
  admin: {
    permissions: ['all'];
  };
  editor: {
    permissions: [
      'read_dashboard',
      'edit_content',
      'manage_media',
      'manage_blog',
      'view_calendar'
    ];
  };
  viewer: {
    permissions: ['read_dashboard'];
  };
}
```

### Data Protection
- **Input Validation**: All user inputs validated and sanitized
- **File Upload Security**: File type restrictions, size limits
- **CSRF Protection**: Built-in Next.js protection
- **SQL Injection Prevention**: Parameterized queries only

## Training & Documentation

### Video Tutorials (5-10 minutes each)
1. **Getting Started**: Logging in and dashboard overview
2. **Updating Website Text**: How to edit page content
3. **Adding Photos**: Uploading and managing images
4. **Writing Blog Posts**: Creating and publishing posts
5. **Calendar Setup**: Connecting Google Calendar
6. **Troubleshooting**: Common issues and solutions

### Quick Reference Guides
- **One-page cheat sheets** for common tasks
- **Printable guides** with screenshots
- **Emergency contact information** for technical support

### Progressive Learning Approach
1. **Week 1**: Basic navigation and simple text editing
2. **Week 2**: Image uploading and management
3. **Week 3**: Blog post creation
4. **Week 4**: Advanced features and calendar setup

## Content Migration Strategy

### Phase 1: Identify Editable Areas
Map all current static content that should become editable:

```typescript
const editableAreas = {
  homePage: {
    heroTitle: 'No matter where you\'ve been, you\'re welcome here.',
    heroDescription: 'Come as you are and discover...',
    aboutSection: 'We focus on three things...',
    serviceInfo: 'Sunday Service: 10:30 AM'
  },
  aboutPage: {
    churchHistory: '...',
    missionStatement: '...',
    beliefs: '...'
  },
  ministries: {
    adultMinistry: '...',
    youthMinistry: '...',
    childrenMinistry: '...'
  }
};
```

### Phase 2: Create Migration Scripts
- Extract current content into database
- Set up initial editable areas
- Preserve all existing content and formatting

## Maintenance & Support

### Regular Maintenance Tasks
1. **Weekly Backups**: Automated database and media backups
2. **Monthly Updates**: Security patches and feature updates
3. **Quarterly Reviews**: Usage analytics and user feedback

### Support Structure
1. **Primary Contact**: Designated tech-savvy volunteer
2. **Secondary Support**: Development team contact
3. **Documentation Hub**: Centralized help resources
4. **Remote Assistance**: Screen sharing capability for urgent issues

## Technical Implementation Details

### File Upload Handler
```typescript
// app/api/admin/upload/route.ts
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const altText = formData.get('altText') as string;
    const folder = formData.get('folder') as string || 'general';
    
    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type');
    }
    
    // Upload to storage
    const fileUrl = await uploadToStorage(file, folder);
    
    // Save to database
    const mediaRecord = await db.mediaLibrary.create({
      filename: file.name,
      filePath: fileUrl,
      altText,
      folder,
      // ... other fields
    });
    
    return NextResponse.json({ success: true, media: mediaRecord });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### Content Editor Component
```typescript
// components/admin/ContentEditor/ContentEditor.tsx
interface ContentEditorProps {
  pageSlug: string;
  sectionKey: string;
  currentValue: string;
  contentType: 'text' | 'html' | 'image';
  label: string;
  helpText?: string;
}

export function ContentEditor({ 
  pageSlug, 
  sectionKey, 
  currentValue, 
  contentType, 
  label, 
  helpText 
}: ContentEditorProps) {
  const [value, setValue] = useState(currentValue);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageSlug,
          sectionKey,
          value,
          contentType
        })
      });
      
      setIsEditing(false);
      // Show success message
    } catch (error) {
      // Show error message
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="content-editor">
      <label className="text-lg font-semibold">{label}</label>
      {helpText && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}
      
      {contentType === 'text' ? (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full p-4 border rounded-lg"
          rows={4}
        />
      ) : contentType === 'html' ? (
        <RichTextEditor
          value={value}
          onChange={setValue}
        />
      ) : (
        <ImageUploadField
          currentValue={value}
          onChange={setValue}
        />
      )}
      
      <div className="flex gap-2 mt-4">
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          size="lg"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setValue(currentValue)}
          size="lg"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
```

## Success Metrics

### User Adoption Metrics
- **Login Frequency**: Weekly active admin users
- **Feature Usage**: Most/least used CMS features
- **Task Completion**: Success rate for common tasks
- **Support Requests**: Volume and type of help requests

### Content Metrics
- **Content Updates**: Frequency of page updates
- **Blog Publishing**: Posts published per month
- **Image Management**: Photos uploaded and organized
- **User Satisfaction**: Quarterly feedback surveys

## Risk Mitigation

### Technical Risks
1. **Data Loss**: Automated backups and version control
2. **Security Breaches**: Regular security audits and updates
3. **Performance Issues**: Monitoring and optimization
4. **User Errors**: Confirmation dialogs and undo functionality

### Operational Risks
1. **User Confusion**: Comprehensive training and documentation
2. **Staff Turnover**: Multiple trained administrators
3. **Technical Support**: Clear escalation procedures
4. **System Downtime**: Hosting reliability and status page

## Timeline Summary

- **Weeks 1-2**: Foundation and authentication
- **Weeks 3-4**: Core content management
- **Weeks 5-6**: Blog system
- **Weeks 7-8**: Calendar integration
- **Weeks 9-10**: Polish and training
- **Week 11**: Launch and initial support
- **Ongoing**: Maintenance and enhancements

## Budget Considerations

### Development Costs
- **Database hosting**: $20-50/month (Supabase/PostgreSQL)
- **File storage**: $10-30/month (Vercel Blob/AWS S3)
- **Development time**: 80-100 hours
- **Training time**: 10-15 hours

### Ongoing Costs
- **Hosting**: Already covered by current Vercel plan
- **Maintenance**: 2-4 hours/month
- **Support**: As needed basis

This implementation plan provides a roadmap for creating a user-friendly CMS that will empower your church staff to manage the website effectively without requiring technical expertise.
