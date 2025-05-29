import { supabase } from './supabase';
import { validateForumContent } from './content-moderation';
import type { 
  ForumPost, 
  ForumComment, 
  ForumCategory, 
  ForumFlag,
  CreatePostForm,
  CreateCommentForm 
} from '@/types';

// Categories Service
export async function getForumCategories(): Promise<ForumCategory[]> {
  const { data, error } = await supabase
    .from('forum_categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }

  return data || [];
}

export async function createForumCategory(
  name: string, 
  description: string, 
  color: string
): Promise<ForumCategory> {
  const { data, error } = await supabase
    .from('forum_categories')
    .insert({
      name,
      description,
      color
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating category:', error);
    throw new Error('Failed to create category');
  }

  return data;
}

// Posts Service
export async function getForumPosts(
  categoryId?: string,
  limit: number = 20,
  offset: number = 0
): Promise<ForumPost[]> {
  let query = supabase
    .from('forum_posts')
    .select(`
      *,
      author:profiles(id, name, avatar_url, role),
      category:forum_categories(id, name, color),
      comment_count:forum_comments(count)
    `)
    .eq('is_flagged', false)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Failed to fetch posts');
  }

  return data || [];
}

export async function getForumPost(postId: string): Promise<ForumPost | null> {
  const { data, error } = await supabase
    .from('forum_posts')
    .select(`
      *,
      author:profiles(id, name, avatar_url, role),
      category:forum_categories(id, name, color),
      comments:forum_comments(
        *,
        author:profiles(id, name, avatar_url, role)
      )
    `)
    .eq('id', postId)
    .eq('is_flagged', false)
    .single();

  if (error) {
    console.error('Error fetching post:', error);
    return null;
  }

  return data;
}

export async function createForumPost(
  postData: CreatePostForm,
  authorId: string
): Promise<ForumPost> {
  // Validate and clean content
  const validation = validateForumContent(postData.content, postData.title);
  
  if (!validation.isValid) {
    throw new Error(`Content validation failed: ${validation.warnings.join(', ')}`);
  }

  const { data, error } = await supabase
    .from('forum_posts')
    .insert({
      title: validation.cleanedTitle || postData.title,
      content: validation.cleanedContent,
      author_id: authorId,
      category_id: postData.category_id,
      attachments: [], // TODO: Handle file uploads
      is_flagged: false,
      flag_count: 0
    })
    .select(`
      *,
      author:profiles(id, name, avatar_url, role),
      category:forum_categories(id, name, color)
    `)
    .single();

  if (error) {
    console.error('Error creating post:', error);
    throw new Error('Failed to create post');
  }

  return data;
}

export async function deleteForumPost(postId: string, userId: string, isAdmin: boolean = false): Promise<void> {
  // Check if user is author or admin
  if (!isAdmin) {
    const { data: post } = await supabase
      .from('forum_posts')
      .select('author_id')
      .eq('id', postId)
      .single();

    if (!post || post.author_id !== userId) {
      throw new Error('Unauthorized: You can only delete your own posts');
    }
  }

  // Delete all comments first (cascade delete)
  await supabase
    .from('forum_comments')
    .delete()
    .eq('post_id', postId);

  // Delete the post
  const { error } = await supabase
    .from('forum_posts')
    .delete()
    .eq('id', postId);

  if (error) {
    console.error('Error deleting post:', error);
    throw new Error('Failed to delete post');
  }
}

// Comments Service
export async function getForumComments(postId: string): Promise<ForumComment[]> {
  const { data, error } = await supabase
    .from('forum_comments')
    .select(`
      *,
      author:profiles(id, name, avatar_url, role)
    `)
    .eq('post_id', postId)
    .eq('is_flagged', false)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching comments:', error);
    throw new Error('Failed to fetch comments');
  }

  // Organize comments into threads
  const comments = data || [];
  const commentMap = new Map<string, ForumComment>();
  const rootComments: ForumComment[] = [];

  // First pass: create comment objects with replies array
  comments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // Second pass: organize into threads
  comments.forEach(comment => {
    const commentWithReplies = commentMap.get(comment.id)!;
    
    if (comment.parent_comment_id) {
      // This is a reply
      const parent = commentMap.get(comment.parent_comment_id);
      if (parent) {
        parent.replies = parent.replies || [];
        parent.replies.push(commentWithReplies);
      }
    } else {
      // This is a root comment
      rootComments.push(commentWithReplies);
    }
  });

  return rootComments;
}

export async function createForumComment(
  commentData: CreateCommentForm,
  authorId: string
): Promise<ForumComment> {
  // Validate and clean content
  const validation = validateForumContent(commentData.content);
  
  if (!validation.isValid) {
    throw new Error(`Content validation failed: ${validation.warnings.join(', ')}`);
  }

  const { data, error } = await supabase
    .from('forum_comments')
    .insert({
      content: validation.cleanedContent,
      author_id: authorId,
      post_id: commentData.post_id,
      parent_comment_id: commentData.parent_comment_id,
      is_flagged: false,
      flag_count: 0
    })
    .select(`
      *,
      author:profiles(id, name, avatar_url, role)
    `)
    .single();

  if (error) {
    console.error('Error creating comment:', error);
    throw new Error('Failed to create comment');
  }

  return data;
}

export async function deleteForumComment(commentId: string, userId: string, isAdmin: boolean = false): Promise<void> {
  // Check if user is author or admin
  if (!isAdmin) {
    const { data: comment } = await supabase
      .from('forum_comments')
      .select('author_id')
      .eq('id', commentId)
      .single();

    if (!comment || comment.author_id !== userId) {
      throw new Error('Unauthorized: You can only delete your own comments');
    }
  }

  // Delete replies first (cascade delete)
  await supabase
    .from('forum_comments')
    .delete()
    .eq('parent_comment_id', commentId);

  // Delete the comment
  const { error } = await supabase
    .from('forum_comments')
    .delete()
    .eq('id', commentId);

  if (error) {
    console.error('Error deleting comment:', error);
    throw new Error('Failed to delete comment');
  }
}

// Flagging Service
export async function flagForumContent(
  userId: string,
  reason: string,
  postId?: string,
  commentId?: string
): Promise<void> {
  if (!postId && !commentId) {
    throw new Error('Either postId or commentId must be provided');
  }

  // Check if user already flagged this content
  let existingFlagQuery = supabase
    .from('forum_flags')
    .select('id')
    .eq('user_id', userId);

  if (postId) {
    existingFlagQuery = existingFlagQuery.eq('post_id', postId);
  } else if (commentId) {
    existingFlagQuery = existingFlagQuery.eq('comment_id', commentId);
  }

  const { data: existingFlag } = await existingFlagQuery.single();

  if (existingFlag) {
    throw new Error('You have already flagged this content');
  }

  // Create the flag
  const { error: flagError } = await supabase
    .from('forum_flags')
    .insert({
      user_id: userId,
      post_id: postId,
      comment_id: commentId,
      reason
    });

  if (flagError) {
    console.error('Error creating flag:', flagError);
    throw new Error('Failed to flag content');
  }

  // Increment flag count
  if (postId) {
    await supabase.rpc('increment_post_flag_count', { post_id: postId });
  } else if (commentId) {
    await supabase.rpc('increment_comment_flag_count', { comment_id: commentId });
  }
}

// Admin Services
export async function getFlaggedContent(): Promise<{
  posts: ForumPost[];
  comments: ForumComment[];
}> {
  const [postsResult, commentsResult] = await Promise.all([
    supabase
      .from('forum_posts')
      .select(`
        *,
        author:profiles(id, name, avatar_url, role),
        category:forum_categories(id, name, color)
      `)
      .gt('flag_count', 0)
      .order('flag_count', { ascending: false }),
    
    supabase
      .from('forum_comments')
      .select(`
        *,
        author:profiles(id, name, avatar_url, role)
      `)
      .gt('flag_count', 0)
      .order('flag_count', { ascending: false })
  ]);

  if (postsResult.error) {
    console.error('Error fetching flagged posts:', postsResult.error);
  }

  if (commentsResult.error) {
    console.error('Error fetching flagged comments:', commentsResult.error);
  }

  return {
    posts: postsResult.data || [],
    comments: commentsResult.data || []
  };
} 