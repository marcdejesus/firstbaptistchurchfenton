export type Event = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM AM/PM
  location: string;
  description: string;
  summary?: string; // AI generated
  rsvps: number;
  isUserRsvped?: boolean; // To track if the current logged-in user has RSVPed
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: 'member' | 'admin'; // Added role for forum permissions
};

// For AI event summary generation
export type GenerateEventSummaryInput = {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
};

export type Testimonial = {
  id: string;
  name: string;
  avatarUrl: string;
  rating: number; // 1-5
  date: string; // e.g., "July 20, 2024"
  content: string;
  aiHint?: string; // For avatar placeholder
};

// Forum Types
export type ForumCategory = {
  id: string;
  name: string;
  description?: string;
  color: string;
  created_at: string;
  updated_at: string;
};

export type ForumPost = {
  id: string;
  title: string;
  content: string;
  author_id: string;
  category_id: string;
  attachments?: string[];
  is_flagged: boolean;
  flag_count: number;
  created_at: string;
  updated_at: string;
  // Relations
  author?: User;
  category?: ForumCategory;
  comments?: ForumComment[];
  comment_count?: number;
};

export type ForumComment = {
  id: string;
  content: string;
  author_id: string;
  post_id: string;
  parent_comment_id?: string;
  is_flagged: boolean;
  flag_count: number;
  created_at: string;
  updated_at: string;
  // Relations
  author?: User;
  replies?: ForumComment[];
  reply_count?: number;
};

export type ForumFlag = {
  id: string;
  user_id: string;
  post_id?: string;
  comment_id?: string;
  reason: string;
  created_at: string;
};

// Content filtering types
export type ContentModerationResult = {
  isClean: boolean;
  flaggedWords: string[];
  cleanedContent: string;
};

// Form types for creating posts and comments
export type CreatePostForm = {
  title: string;
  content: string;
  category_id: string;
  attachments?: File[];
};

export type CreateCommentForm = {
  content: string;
  post_id: string;
  parent_comment_id?: string;
};
