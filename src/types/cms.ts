// CMS TypeScript Types and Interfaces
// First Baptist Church Fenton

export interface User {
  id: number;
  uuid: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaFile {
  id: number;
  uuid: string;
  filename: string;
  originalName: string;
  filePath: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  width?: number;
  height?: number;
  altText?: string;
  caption?: string;
  folder: string;
  tags: string[];
  isOptimized: boolean;
  uploadedBy?: number;
  uploadedByName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EditableArea {
  id: number;
  pageSlug: string;
  areaKey: string;
  areaLabel: string;
  contentType: 'text' | 'html' | 'image' | 'url' | 'boolean';
  defaultValue?: string;
  helpText?: string;
  isRequired: boolean;
  maxLength?: number;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
}

export interface PageContent {
  id: number;
  pageSlug: string;
  sectionKey: string;
  contentType: 'text' | 'html' | 'image' | 'url' | 'boolean';
  contentValue?: string;
  altText?: string;
  mediaId?: number;
  mediaFile?: MediaFile;
  displayOrder: number;
  isActive: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  updatedBy?: number;
  updatedByName?: string;
}

export interface ContentVersion {
  id: number;
  pageContentId: number;
  contentValue?: string;
  altText?: string;
  mediaId?: number;
  versionNumber: number;
  changeDescription?: string;
  createdAt: Date;
  createdBy?: number;
  createdByName?: string;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  postCount?: number;
}

export interface BlogPost {
  id: number;
  uuid: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  featuredImageId?: number;
  featuredImage?: MediaFile;
  categoryId?: number;
  category?: BlogCategory;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  publishedAt?: Date;
  scheduledFor?: Date;
  seoTitle?: string;
  seoDescription?: string;
  tags: string[];
  viewCount: number;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  authorId?: number;
  authorName?: string;
}

export interface BlogPostRevision {
  id: number;
  blogPostId: number;
  title: string;
  excerpt?: string;
  content?: string;
  revisionNote?: string;
  createdAt: Date;
  createdBy?: number;
  createdByName?: string;
}

export interface SystemSetting {
  id: number;
  settingGroup: string;
  settingKey: string;
  settingValue?: string;
  settingType: 'string' | 'number' | 'boolean' | 'json';
  description?: string;
  isPublic: boolean;
  updatedAt: Date;
  updatedBy?: number;
  updatedByName?: string;
}

export interface CalendarSetting {
  id: number;
  settingKey: string;
  settingValue?: string;
  isEncrypted: boolean;
  description?: string;
  updatedAt: Date;
  updatedBy?: number;
  updatedByName?: string;
}

export interface ActivityLogEntry {
  id: number;
  userId?: number;
  userName?: string;
  action: string;
  resourceType: string;
  resourceId?: number;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

// Form interfaces for admin operations
export interface MediaUploadForm {
  file: File;
  altText: string;
  caption?: string;
  folder: string;
  tags: string[];
}

export interface ContentUpdateForm {
  pageSlug: string;
  sectionKey: string;
  contentValue: string;
  altText?: string;
  mediaId?: number;
}

export interface BlogPostForm {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  featuredImageId?: number;
  categoryId?: number;
  status: 'draft' | 'published' | 'scheduled';
  publishedAt?: Date;
  scheduledFor?: Date;
  seoTitle?: string;
  seoDescription?: string;
  tags: string[];
  isFeatured: boolean;
}

export interface UserForm {
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  isActive: boolean;
}

// API Response interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Dashboard interfaces
export interface DashboardStats {
  totalBlogPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalMediaFiles: number;
  totalUsers: number;
  recentActivity: ActivityLogEntry[];
  upcomingScheduledPosts: BlogPost[];
  storageUsed: number;
  storageLimit: number;
}

export interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: string;
  color: string;
}

// Content editor interfaces
export interface ContentEditorProps {
  editableArea: EditableArea;
  currentContent?: PageContent;
  onSave: (content: ContentUpdateForm) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
}

export interface ImageSelectorProps {
  currentImageId?: number;
  onSelect: (mediaFile: MediaFile) => void;
  onUpload?: (file: MediaUploadForm) => Promise<MediaFile>;
  folder?: string;
  aspectRatio?: number;
}

// Media manager interfaces
export interface MediaFilter {
  folder?: string;
  mimeType?: string;
  tags?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export interface MediaSort {
  field: 'createdAt' | 'filename' | 'fileSize';
  direction: 'asc' | 'desc';
}

export interface MediaManagerProps {
  onSelect?: (mediaFile: MediaFile) => void;
  selectionMode?: 'single' | 'multiple';
  allowUpload?: boolean;
  filter?: MediaFilter;
  defaultFolder?: string;
}

// Blog editor interfaces
export interface BlogEditorProps {
  post?: BlogPost;
  onSave: (post: BlogPostForm) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface BlogFilter {
  status?: 'draft' | 'published' | 'scheduled' | 'archived';
  categoryId?: number;
  authorId?: number;
  tags?: string[];
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

// Calendar integration interfaces
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  isAllDay: boolean;
  calendarId: string;
  htmlLink?: string;
}

export interface CalendarConfig {
  googleCalendarId: string;
  apiKey: string;
  eventsToShow: number;
  defaultView: 'upcoming' | 'month' | 'week';
  showPastEvents: boolean;
}

export interface CalendarSyncStatus {
  isConnected: boolean;
  lastSyncAt?: Date;
  syncErrors?: string[];
  eventsCount: number;
  nextSyncAt?: Date;
}

// Permission interfaces
export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
}

export interface RolePermissions {
  admin: Permission[];
  editor: Permission[];
  viewer: Permission[];
}

// Validation interfaces
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface FormValidation {
  isValid: boolean;
  errors: ValidationError[];
}

// CMS Configuration
export interface CmsConfig {
  siteName: string;
  siteDescription: string;
  maxFileSize: number;
  allowedFileTypes: string[];
  mediaFolders: string[];
  defaultUserRole: 'editor' | 'viewer';
  enableRevisions: boolean;
  enableActivityLog: boolean;
  enableFileOptimization: boolean;
  imageQuality: number;
  thumbnailSizes: number[];
}

// Search interfaces
export interface SearchResult {
  type: 'content' | 'blog' | 'media';
  id: number;
  title: string;
  excerpt?: string;
  url: string;
  highlight?: string;
  createdAt: Date;
}

export interface SearchQuery {
  query: string;
  types?: ('content' | 'blog' | 'media')[];
  limit?: number;
  offset?: number;
}

// Backup and export interfaces
export interface BackupData {
  users: User[];
  mediaLibrary: MediaFile[];
  pageContent: PageContent[];
  blogPosts: BlogPost[];
  blogCategories: BlogCategory[];
  systemSettings: SystemSetting[];
  exportedAt: Date;
  version: string;
}

export interface ExportOptions {
  includeMedia: boolean;
  includeUsers: boolean;
  includeDrafts: boolean;
  includeActivityLog: boolean;
  dateFrom?: Date;
  dateTo?: Date;
}

// Utility types
export type ContentType = 'text' | 'html' | 'image' | 'url' | 'boolean';
export type UserRole = 'admin' | 'editor' | 'viewer';
export type PostStatus = 'draft' | 'published' | 'scheduled' | 'archived';
export type SortDirection = 'asc' | 'desc';
export type SettingType = 'string' | 'number' | 'boolean' | 'json';

// Hook return types
export interface UseMediaQuery {
  media: MediaFile[];
  isLoading: boolean;
  error?: string;
  totalCount: number;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
}

export interface UseBlogPosts {
  posts: BlogPost[];
  isLoading: boolean;
  error?: string;
  totalCount: number;
  createPost: (post: BlogPostForm) => Promise<BlogPost>;
  updatePost: (id: number, post: Partial<BlogPostForm>) => Promise<BlogPost>;
  deletePost: (id: number) => Promise<void>;
  publishPost: (id: number) => Promise<BlogPost>;
}

export interface UsePageContent {
  content: PageContent[];
  isLoading: boolean;
  error?: string;
  updateContent: (updates: ContentUpdateForm[]) => Promise<void>;
  previewChanges: (updates: ContentUpdateForm[]) => PageContent[];
  discardChanges: () => void;
  hasChanges: boolean;
}

// Constants
export const MEDIA_FOLDERS = [
  'general',
  'events',
  'staff',
  'ministries',
  'blog',
  'sermons',
  'youth',
  'children'
] as const;

export const CONTENT_TYPES = [
  'text',
  'html', 
  'image',
  'url',
  'boolean'
] as const;

export const USER_ROLES = [
  'admin',
  'editor', 
  'viewer'
] as const;

export const POST_STATUSES = [
  'draft',
  'published',
  'scheduled',
  'archived'
] as const;

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png', 
  'image/webp',
  'image/gif'
] as const;

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const IMAGE_QUALITY = 85;
export const THUMBNAIL_SIZES = [150, 300, 600, 1200] as const;
