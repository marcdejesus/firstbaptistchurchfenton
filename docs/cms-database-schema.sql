-- First Baptist Church Fenton CMS Database Schema
-- This file contains the complete database schema for the CMS system

-- Enable UUID extension for PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for admin authentication and role management
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'editor' CHECK (role IN ('admin', 'editor', 'viewer')),
    password_hash VARCHAR(255), -- For custom auth, or NULL if using OAuth
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Media library for managing uploaded files
CREATE TABLE media_library (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    width INTEGER, -- For images
    height INTEGER, -- For images
    alt_text VARCHAR(500),
    caption TEXT,
    folder VARCHAR(255) DEFAULT 'general',
    tags TEXT[], -- PostgreSQL array for searchable tags
    is_optimized BOOLEAN DEFAULT false,
    uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster searching
CREATE INDEX idx_media_folder ON media_library(folder);
CREATE INDEX idx_media_tags ON media_library USING GIN(tags);
CREATE INDEX idx_media_alt_text ON media_library(alt_text);

-- Define editable content areas for each page
CREATE TABLE editable_areas (
    id SERIAL PRIMARY KEY,
    page_slug VARCHAR(255) NOT NULL,
    area_key VARCHAR(255) NOT NULL,
    area_label VARCHAR(255) NOT NULL,
    content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('text', 'html', 'image', 'url', 'boolean')),
    default_value TEXT,
    help_text TEXT,
    is_required BOOLEAN DEFAULT false,
    max_length INTEGER,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(page_slug, area_key)
);

-- Store actual content for editable areas
CREATE TABLE page_content (
    id SERIAL PRIMARY KEY,
    page_slug VARCHAR(255) NOT NULL,
    section_key VARCHAR(255) NOT NULL,
    content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('text', 'html', 'image', 'url', 'boolean')),
    content_value TEXT,
    alt_text VARCHAR(500), -- For images
    media_id INTEGER REFERENCES media_library(id) ON DELETE SET NULL, -- Link to media library
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE(page_slug, section_key)
);

-- Content version history for rollback capability
CREATE TABLE content_versions (
    id SERIAL PRIMARY KEY,
    page_content_id INTEGER REFERENCES page_content(id) ON DELETE CASCADE,
    content_value TEXT,
    alt_text VARCHAR(500),
    media_id INTEGER REFERENCES media_library(id) ON DELETE SET NULL,
    version_number INTEGER NOT NULL,
    change_description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- Blog categories
CREATE TABLE blog_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7), -- Hex color code
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Blog posts
CREATE TABLE blog_posts (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    featured_image_id INTEGER REFERENCES media_library(id) ON DELETE SET NULL,
    category_id INTEGER REFERENCES blog_categories(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
    published_at TIMESTAMP,
    scheduled_for TIMESTAMP,
    seo_title VARCHAR(255),
    seo_description VARCHAR(500),
    tags TEXT[], -- PostgreSQL array for tags
    view_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    author_id INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- Blog post revisions for draft management
CREATE TABLE blog_post_revisions (
    id SERIAL PRIMARY KEY,
    blog_post_id INTEGER REFERENCES blog_posts(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    excerpt TEXT,
    content TEXT,
    revision_note TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- Calendar settings for Google Calendar integration
CREATE TABLE calendar_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(255) UNIQUE NOT NULL,
    setting_value TEXT,
    is_encrypted BOOLEAN DEFAULT false,
    description TEXT,
    updated_at TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- System settings for general CMS configuration
CREATE TABLE system_settings (
    id SERIAL PRIMARY KEY,
    setting_group VARCHAR(255) NOT NULL,
    setting_key VARCHAR(255) NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
    description TEXT,
    is_public BOOLEAN DEFAULT false, -- Whether setting can be accessed in frontend
    updated_at TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE(setting_group, setting_key)
);

-- Activity log for audit trail
CREATE TABLE activity_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_page_content_page_slug ON page_content(page_slug);
CREATE INDEX idx_page_content_section_key ON page_content(section_key);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX idx_blog_posts_tags ON blog_posts USING GIN(tags);
CREATE INDEX idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at DESC);

-- Insert default editable areas for existing pages
INSERT INTO editable_areas (page_slug, area_key, area_label, content_type, default_value, help_text, display_order) VALUES

-- Home Page
('home', 'hero_title', 'Hero Section Title', 'text', 'No matter where you''ve been, you''re welcome here.', 'Main headline that visitors see first', 1),
('home', 'hero_description', 'Hero Section Description', 'text', 'Come as you are and discover the hope, truth, and grace of Jesus Christ. We are a community of real people, with real struggles, following a real Savior.', 'Supporting text under the main headline', 2),
('home', 'service_time', 'Sunday Service Time', 'text', 'Sunday Service: 10:30 AM', 'When your main worship service takes place', 3),
('home', 'church_address', 'Church Address', 'text', '860 N. Leroy St., Fenton, MI', 'Your church''s physical address', 4),
('home', 'about_section_title', 'About Section Title', 'text', 'A Place to Belong, A Space to Grow', 'Title for the about section on homepage', 5),
('home', 'about_section_description', 'About Section Description', 'text', 'We focus on three things: loving God, growing together in community, and serving our world.', 'Brief description of your church''s mission', 6),

-- About Page
('about', 'page_title', 'About Page Title', 'text', 'About First Baptist Church Fenton', 'Main page title', 1),
('about', 'mission_statement', 'Mission Statement', 'html', '', 'Your church''s mission statement', 2),
('about', 'history_overview', 'Church History Overview', 'html', '', 'Brief overview of your church''s history', 3),
('about', 'pastor_bio', 'Pastor Biography', 'html', '', 'Information about your lead pastor', 4),

-- Contact Page
('contact', 'office_phone', 'Office Phone Number', 'text', '', 'Main church office phone number', 1),
('contact', 'office_email', 'Office Email', 'text', '', 'Main church office email address', 2),
('contact', 'office_hours', 'Office Hours', 'html', '', 'When your office is open to visitors', 3),

-- Visit Page
('visit', 'what_to_expect_intro', 'What to Expect Introduction', 'html', '', 'Introduction text for visitors', 1),
('visit', 'service_style_description', 'Service Style Description', 'html', '', 'Description of your worship style', 2),
('visit', 'parking_info', 'Parking Information', 'html', '', 'Where visitors should park', 3),

-- Ministries Page
('ministries', 'ministries_intro', 'Ministries Introduction', 'html', '', 'Introduction to your ministries', 1),
('ministries', 'adult_ministry_description', 'Adult Ministry Description', 'html', '', 'Description of adult ministry programs', 2),
('ministries', 'youth_ministry_description', 'Youth Ministry Description', 'html', '', 'Description of youth ministry programs', 3),
('ministries', 'children_ministry_description', 'Children Ministry Description', 'html', '', 'Description of children''s ministry programs', 4);

-- Insert default blog categories
INSERT INTO blog_categories (name, slug, description, color, display_order) VALUES
('Sermons', 'sermons', 'Weekly sermon posts and messages', '#3B82F6', 1),
('Church News', 'church-news', 'Updates and announcements from the church', '#10B981', 2),
('Community', 'community', 'Stories and updates from our church community', '#F59E0B', 3),
('Events', 'events', 'Upcoming events and activities', '#EF4444', 4),
('Faith & Life', 'faith-life', 'Thoughts on faith, Christian living, and spiritual growth', '#8B5CF6', 5);

-- Insert default system settings
INSERT INTO system_settings (setting_group, setting_key, setting_value, setting_type, description, is_public) VALUES
('site', 'site_title', 'First Baptist Church Fenton', 'string', 'Main site title', true),
('site', 'site_description', 'Growing in Faith, Sharing God''s Love', 'string', 'Site tagline/description', true),
('site', 'contact_email', '', 'string', 'Main contact email', false),
('site', 'contact_phone', '', 'string', 'Main contact phone', false),
('site', 'facebook_url', '', 'string', 'Facebook page URL', true),
('site', 'youtube_url', '', 'string', 'YouTube channel URL', true),
('media', 'max_file_size', '10485760', 'number', 'Maximum file upload size in bytes (10MB)', false),
('media', 'allowed_file_types', '["image/jpeg", "image/png", "image/webp", "image/gif"]', 'json', 'Allowed file upload types', false),
('blog', 'posts_per_page', '10', 'number', 'Number of blog posts to show per page', false),
('calendar', 'google_calendar_id', '', 'string', 'Google Calendar ID for event sync', false),
('calendar', 'events_to_show', '5', 'number', 'Number of upcoming events to display', true);

-- Insert default admin user (password should be changed immediately)
-- Password is 'admin123' hashed with bcrypt
INSERT INTO users (email, name, role, password_hash, is_active) VALUES
('admin@fbcfenton.org', 'Site Administrator', 'admin', '$2b$10$rGq9SvF4LbXPgFzKJCYnNeLPGK7t8W2iWyOy6sXKFqNF1sXKFqNF1s', true);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_library_updated_at BEFORE UPDATE ON media_library
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_page_content_updated_at BEFORE UPDATE ON page_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calendar_settings_updated_at BEFORE UPDATE ON calendar_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a view for easy content retrieval
CREATE VIEW content_with_media AS
SELECT 
    pc.*,
    ml.file_url,
    ml.alt_text as media_alt_text,
    ml.caption as media_caption,
    u.name as updated_by_name
FROM page_content pc
LEFT JOIN media_library ml ON pc.media_id = ml.id
LEFT JOIN users u ON pc.updated_by = u.id;

-- Create a view for published blog posts with author info
CREATE VIEW published_blog_posts AS
SELECT 
    bp.*,
    bc.name as category_name,
    bc.color as category_color,
    u.name as author_name,
    ml.file_url as featured_image_url,
    ml.alt_text as featured_image_alt
FROM blog_posts bp
LEFT JOIN blog_categories bc ON bp.category_id = bc.id
LEFT JOIN users u ON bp.author_id = u.id
LEFT JOIN media_library ml ON bp.featured_image_id = ml.id
WHERE bp.status = 'published' 
AND (bp.published_at IS NULL OR bp.published_at <= NOW())
ORDER BY bp.published_at DESC;

-- Grant necessary permissions (adjust based on your setup)
-- These would typically be run with appropriate database user permissions

COMMENT ON TABLE users IS 'Admin users who can access the CMS';
COMMENT ON TABLE media_library IS 'Uploaded files and images with metadata';
COMMENT ON TABLE editable_areas IS 'Defines which content areas can be edited through CMS';
COMMENT ON TABLE page_content IS 'Actual content for editable areas';
COMMENT ON TABLE content_versions IS 'Version history for content changes';
COMMENT ON TABLE blog_posts IS 'Blog posts and articles';
COMMENT ON TABLE blog_categories IS 'Categories for organizing blog posts';
COMMENT ON TABLE system_settings IS 'Configurable system settings';
COMMENT ON TABLE activity_log IS 'Audit trail for admin actions';
