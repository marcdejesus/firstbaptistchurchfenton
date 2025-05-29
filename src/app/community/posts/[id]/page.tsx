"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft,
  MessageSquare, 
  Calendar, 
  User,
  Flag,
  Trash2,
  Reply,
  Send
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import type { ForumPost, ForumComment, CreateCommentForm } from '@/types';

// Mock data - replace with actual API calls when Supabase is set up
const mockPost: ForumPost = {
  id: '1',
  title: 'Welcome to our new Community Forum!',
  content: 'We are excited to launch this new platform for our church family to connect, share, and grow together. This space will serve as a hub for prayer requests, event planning, Bible discussions, and general fellowship.\n\nPlease remember to be respectful and kind in all your interactions. Let\'s build each other up and create a welcoming environment for all members of our church family.\n\nFeel free to explore the different categories and start sharing!',
  author_id: '1',
  category_id: '6',
  attachments: [],
  is_flagged: false,
  flag_count: 0,
  created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  author: { id: '1', name: 'Pastor Smith', email: 'pastor@church.com', avatarUrl: '', role: 'admin' },
  category: { id: '6', name: 'Announcements', description: 'Important church announcements', color: '#6366F1', created_at: '', updated_at: '' },
  comment_count: 5
};

const mockComments: ForumComment[] = [
  {
    id: '1',
    content: 'Thank you for creating this wonderful platform! Looking forward to connecting with everyone.',
    author_id: '2',
    post_id: '1',
    parent_comment_id: undefined,
    is_flagged: false,
    flag_count: 0,
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    author: { id: '2', name: 'Sarah Johnson', email: 'sarah@email.com', avatarUrl: '', role: 'member' },
    replies: [
      {
        id: '2',
        content: 'I agree! This is exactly what our community needed.',
        author_id: '3',
        post_id: '1',
        parent_comment_id: '1',
        is_flagged: false,
        flag_count: 0,
        created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        author: { id: '3', name: 'Mike Wilson', email: 'mike@email.com', avatarUrl: '', role: 'member' },
        replies: []
      }
    ]
  },
  {
    id: '3',
    content: 'God bless this initiative. May it bring our church family closer together.',
    author_id: '4',
    post_id: '1',
    parent_comment_id: undefined,
    is_flagged: false,
    flag_count: 0,
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    author: { id: '4', name: 'Mary Davis', email: 'mary@email.com', avatarUrl: '', role: 'member' },
    replies: []
  }
];

interface CommentThreadProps {
  comment: ForumComment;
  onReply: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  replyingTo: string | null;
  onCancelReply: () => void;
  onSubmitReply: (content: string, parentId: string) => void;
  currentUser: any;
  depth?: number;
}

function CommentThread({ 
  comment, 
  onReply, 
  onDelete, 
  replyingTo, 
  onCancelReply, 
  onSubmitReply,
  currentUser,
  depth = 0 
}: CommentThreadProps) {
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmitReply(replyContent, comment.id);
      setReplyContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canDelete = currentUser && (
    currentUser.id === comment.author_id || 
    currentUser.role === 'admin'
  );

  return (
    <div className={`${depth > 0 ? 'ml-8 mt-4' : ''}`}>
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={comment.author?.avatarUrl} />
              <AvatarFallback className="text-xs">
                {comment.author?.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="font-medium">{comment.author?.name}</span>
                  {comment.author?.role === 'admin' && (
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      Admin
                    </Badge>
                  )}
                  <span className="text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.created_at))} ago
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onReply(comment.id)}
                    className="h-6 px-2 text-xs"
                  >
                    <Reply className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                  
                  {canDelete && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onDelete(comment.id)}
                      className="h-6 px-2 text-xs text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                  
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                    <Flag className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {comment.content}
              </p>
              
              {/* Reply Form */}
              {replyingTo === comment.id && (
                <form onSubmit={handleSubmitReply} className="mt-3 space-y-2">
                  <Textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write your reply..."
                    rows={3}
                    className="text-sm"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={onCancelReply}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      size="sm"
                      disabled={!replyContent.trim() || isSubmitting}
                    >
                      <Send className="h-3 w-3 mr-1" />
                      {isSubmitting ? 'Posting...' : 'Reply'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map(reply => (
            <CommentThread
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onDelete={onDelete}
              replyingTo={replyingTo}
              onCancelReply={onCancelReply}
              onSubmitReply={onSubmitReply}
              currentUser={currentUser}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();
  
  const [post, setPost] = useState<ForumPost | null>(mockPost);
  const [comments, setComments] = useState<ForumComment[]>(mockComments);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not authenticated
  if (!user) {
    router.push('/login');
    return null;
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <Link href="/community">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Forum
          </Button>
        </Link>
      </div>
    );
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call
      // const createdComment = await createForumComment({
      //   content: newComment,
      //   post_id: post.id,
      //   parent_comment_id: undefined
      // }, user.id);

      // Mock creation for now
      const mockNewComment: ForumComment = {
        id: Date.now().toString(),
        content: newComment,
        author_id: user.id,
        post_id: post.id,
        parent_comment_id: undefined,
        is_flagged: false,
        flag_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        author: user,
        replies: []
      };

      setComments(prev => [...prev, mockNewComment]);
      setNewComment('');

      toast({
        title: 'Comment Posted',
        description: 'Your comment has been added successfully.',
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to post comment. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const handleSubmitReply = async (content: string, parentId: string) => {
    try {
      // TODO: Replace with actual API call
      const mockReply: ForumComment = {
        id: Date.now().toString(),
        content,
        author_id: user.id,
        post_id: post.id,
        parent_comment_id: parentId,
        is_flagged: false,
        flag_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        author: user,
        replies: []
      };

      // Add reply to the correct parent comment
      setComments(prev => prev.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), mockReply]
          };
        }
        return comment;
      }));

      setReplyingTo(null);

      toast({
        title: 'Reply Posted',
        description: 'Your reply has been added successfully.',
      });
    } catch (error) {
      console.error('Error posting reply:', error);
      toast({
        title: 'Error',
        description: 'Failed to post reply. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      // TODO: Replace with actual API call
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      
      toast({
        title: 'Comment Deleted',
        description: 'The comment has been removed.',
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete comment.',
        variant: 'destructive'
      });
    }
  };

  const canDeletePost = user && (
    user.id === post.author_id || 
    user.role === 'admin'
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/community">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Forum
            </Button>
          </Link>
        </div>

        {/* Post Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-start space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={post.author?.avatarUrl} />
                <AvatarFallback>
                  {post.author?.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{post.author?.name}</span>
                        {post.author?.role === 'admin' && (
                          <Badge variant="secondary" className="text-xs px-1 py-0">
                            Admin
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDistanceToNow(new Date(post.created_at))} ago</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {post.category && (
                      <Badge 
                        variant="outline" 
                        className="border-2"
                        style={{ 
                          borderColor: post.category.color,
                          color: post.category.color 
                        }}
                      >
                        {post.category.name}
                      </Badge>
                    )}
                    {canDeletePost && (
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap text-muted-foreground">
                    {post.content}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <h2 className="text-xl font-semibold">
              {comments.length} Comment{comments.length !== 1 ? 's' : ''}
            </h2>
          </div>

          {/* Add Comment Form */}
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleAddComment} className="space-y-4">
                <Label htmlFor="new-comment">Add a comment</Label>
                <Textarea
                  id="new-comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={4}
                />
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={!newComment.trim() || isSubmitting}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No comments yet</h3>
                  <p className="text-muted-foreground">
                    Be the first to share your thoughts!
                  </p>
                </CardContent>
              </Card>
            ) : (
              comments.map(comment => (
                <CommentThread
                  key={comment.id}
                  comment={comment}
                  onReply={handleReply}
                  onDelete={handleDeleteComment}
                  replyingTo={replyingTo}
                  onCancelReply={handleCancelReply}
                  onSubmitReply={handleSubmitReply}
                  currentUser={user}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 