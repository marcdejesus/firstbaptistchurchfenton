import { createClient } from '@supabase/supabase-js';

// These environment variables need to be set in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types - we'll expand these as we build
export type Tables = {
  profiles: {
    Row: {
      id: string;
      email: string;
      name: string;
      avatar_url?: string;
      role: 'member' | 'admin';
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id: string;
      email: string;
      name: string;
      avatar_url?: string;
      role?: 'member' | 'admin';
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      email?: string;
      name?: string;
      avatar_url?: string;
      role?: 'member' | 'admin';
      created_at?: string;
      updated_at?: string;
    };
  };
  forum_categories: {
    Row: {
      id: string;
      name: string;
      description?: string;
      color: string;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      name: string;
      description?: string;
      color: string;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      name?: string;
      description?: string;
      color?: string;
      created_at?: string;
      updated_at?: string;
    };
  };
  forum_posts: {
    Row: {
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
    };
    Insert: {
      id?: string;
      title: string;
      content: string;
      author_id: string;
      category_id: string;
      attachments?: string[];
      is_flagged?: boolean;
      flag_count?: number;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      title?: string;
      content?: string;
      author_id?: string;
      category_id?: string;
      attachments?: string[];
      is_flagged?: boolean;
      flag_count?: number;
      created_at?: string;
      updated_at?: string;
    };
  };
  forum_comments: {
    Row: {
      id: string;
      content: string;
      author_id: string;
      post_id: string;
      parent_comment_id?: string;
      is_flagged: boolean;
      flag_count: number;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      content: string;
      author_id: string;
      post_id: string;
      parent_comment_id?: string;
      is_flagged?: boolean;
      flag_count?: number;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      content?: string;
      author_id?: string;
      post_id?: string;
      parent_comment_id?: string;
      is_flagged?: boolean;
      flag_count?: number;
      created_at?: string;
      updated_at?: string;
    };
  };
  forum_flags: {
    Row: {
      id: string;
      user_id: string;
      post_id?: string;
      comment_id?: string;
      reason: string;
      created_at: string;
    };
    Insert: {
      id?: string;
      user_id: string;
      post_id?: string;
      comment_id?: string;
      reason: string;
      created_at?: string;
    };
    Update: {
      id?: string;
      user_id?: string;
      post_id?: string;
      comment_id?: string;
      reason?: string;
      created_at?: string;
    };
  };
};

export type Database = {
  public: {
    Tables: Tables;
  };
}; 