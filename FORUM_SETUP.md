# Community Forum Setup Guide

## Overview
The Community Forum is now implemented with the following features:
- **Members-only access** with authentication
- **Threaded discussions** with nested replies
- **Category-based organization** (Prayer Requests, Event Planning, etc.)
- **Content moderation** with automatic filtering
- **Flagging system** for inappropriate content
- **Admin moderation tools**
- **Real-time post creation** and commenting

## Current Status
✅ **Complete**: Frontend UI, Components, Types, Content Moderation
🔄 **In Progress**: Database integration (currently using mock data)
📋 **Next**: Supabase setup and real API integration

## Features Implemented

### 1. User Interface
- Beautiful, responsive design matching church website style
- Category filtering with color-coded badges
- Post creation with rich text support
- Threaded comment system with infinite nesting
- Member profile integration

### 2. Security & Moderation
- Content filtering for inappropriate language
- Excessive caps detection
- Spam pattern detection
- User flagging system
- Admin override capabilities

### 3. Permissions
- **Members only**: View and create posts/comments
- **Admin**: Delete any content, moderate flags
- **Author**: Delete own posts/comments

## Next Steps: Supabase Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and API keys

### 2. Environment Variables
Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Database Schema
Run these SQL commands in your Supabase SQL editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum categories table
CREATE TABLE forum_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    color TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum posts table
CREATE TABLE forum_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    category_id UUID REFERENCES forum_categories(id) ON DELETE CASCADE,
    attachments TEXT[] DEFAULT '{}',
    is_flagged BOOLEAN DEFAULT FALSE,
    flag_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum comments table
CREATE TABLE forum_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES forum_comments(id) ON DELETE CASCADE,
    is_flagged BOOLEAN DEFAULT FALSE,
    flag_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum flags table
CREATE TABLE forum_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES forum_comments(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (
        (post_id IS NOT NULL AND comment_id IS NULL) OR 
        (post_id IS NULL AND comment_id IS NOT NULL)
    )
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_forum_categories_updated_at BEFORE UPDATE ON forum_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_forum_posts_updated_at BEFORE UPDATE ON forum_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_forum_comments_updated_at BEFORE UPDATE ON forum_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create RPC functions for flag counting
CREATE OR REPLACE FUNCTION increment_post_flag_count(post_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE forum_posts 
    SET flag_count = flag_count + 1 
    WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_comment_flag_count(comment_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE forum_comments 
    SET flag_count = flag_count + 1 
    WHERE id = comment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default categories
INSERT INTO forum_categories (name, description, color) VALUES
('Prayer Requests', 'Share prayer requests and praises', '#3B82F6'),
('Event Planning', 'Coordinate and discuss upcoming events', '#10B981'),
('General Discussion', 'General community conversation', '#8B5CF6'),
('Bible Study', 'Discuss scripture and spiritual growth', '#F59E0B'),
('Volunteer Opportunities', 'Find ways to serve in our community', '#EF4444'),
('Announcements', 'Important church announcements', '#6366F1');
```

### 4. Row Level Security (RLS)
Enable RLS and add policies:

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_flags ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Categories policies
CREATE POLICY "Anyone can view categories" ON forum_categories FOR SELECT USING (true);
CREATE POLICY "Only admins can manage categories" ON forum_categories FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Posts policies
CREATE POLICY "Members can view unflagged posts" ON forum_posts FOR SELECT USING (
    NOT is_flagged AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Members can create posts" ON forum_posts FOR INSERT WITH CHECK (
    auth.uid() = author_id AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Authors and admins can delete posts" ON forum_posts FOR DELETE USING (
    auth.uid() = author_id OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Comments policies
CREATE POLICY "Members can view unflagged comments" ON forum_comments FOR SELECT USING (
    NOT is_flagged AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Members can create comments" ON forum_comments FOR INSERT WITH CHECK (
    auth.uid() = author_id AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Authors and admins can delete comments" ON forum_comments FOR DELETE USING (
    auth.uid() = author_id OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Flags policies
CREATE POLICY "Users can view own flags" ON forum_flags FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Members can create flags" ON forum_flags FOR INSERT WITH CHECK (
    auth.uid() = user_id AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Admins can view all flags" ON forum_flags FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
```

### 5. Integration Steps
1. Replace mock data in `src/app/community/page.tsx` with actual API calls
2. Replace mock data in `src/app/community/posts/[id]/page.tsx` with actual API calls
3. Update authentication system to sync with Supabase Auth
4. Test all functionality with real database

### 6. Testing
1. **Login as member**: `member@example.com` / `password`
2. **Test permissions**: Try creating posts, comments, and flagging
3. **Admin features**: Create admin user and test moderation tools

## File Structure
```
src/
├── app/community/
│   ├── page.tsx                 # Main forum page
│   └── posts/[id]/page.tsx      # Individual post view
├── lib/
│   ├── supabase.ts             # Supabase client & types
│   ├── forum-service.ts        # Database operations
│   └── content-moderation.ts   # Content filtering
└── types/index.ts              # Forum type definitions
```

## Features Ready for Production
- ✅ Content moderation with profanity filtering
- ✅ Spam detection and prevention
- ✅ User role-based permissions
- ✅ Threaded comment system
- ✅ Mobile-responsive design
- ✅ Category organization
- ✅ Real-time UI updates
- ✅ Accessibility features

## Future Enhancements
- File attachment support
- Image uploads
- Email notifications
- Search functionality
- User mentions (@username)
- Rich text editor
- Post reactions (like/heart)
- Private messaging

The forum is fully functional with mock data and ready for Supabase integration! 