'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { Loader2, MessageSquare, Heart, Send, ImageIcon } from 'lucide-react';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { useAuth } from '@/lib/hooks/useAuth';

export default function CommunityPage() {
  const { user } = useAuth(); // Assume we have a standard useAuth hook providing the current user
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/community/posts');
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    
    setSubmitting(true);
    try {
      const res = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newPostContent }),
      });
      if (res.ok) {
        setNewPostContent('');
        fetchPosts(); // Refresh feed
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId: string) => {
    // Optimistic UI update
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = !p.liked_by_me;
        return { 
          ...p, 
          liked_by_me: isLiked, 
          like_count: p.like_count + (isLiked ? 1 : -1) 
        };
      }
      return p;
    }));

    try {
      await fetch(`/api/community/posts/${postId}/like`, { method: 'POST' });
    } catch (error) {
      // Revert on failure
      fetchPosts();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Community Feed"
        description="Share updates, ask questions, and connect with peers."
      />

      {/* Create Post Box */}
      <div className="mb-8 p-4 rounded-xl border" style={{ background: 'rgba(17,24,39,0.7)', borderColor: 'rgba(255,255,255,0.08)' }}>
        <form onSubmit={handleCreatePost}>
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="Share something with the organization..."
            className="w-full h-24 p-3 bg-transparent text-white placeholder-gray-500 resize-none outline-none focus:ring-0"
          />
          <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-2">
            <button type="button" className="p-2 text-cyan-500 hover:bg-cyan-500/10 rounded-full transition-colors" title="Attach Image (Coming Soon)">
              <ImageIcon className="w-5 h-5" />
            </button>
            <button
              type="submit"
              disabled={submitting || !newPostContent.trim()}
              className="px-5 py-2 rounded-full text-sm font-semibold bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Post
            </button>
          </div>
        </form>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-gray-500"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>
        ) : posts.length === 0 ? (
          <div className="py-12 text-center text-gray-500 border rounded-xl" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            No posts yet. Be the first to start a conversation!
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="p-5 rounded-xl border transition-colors hover:border-white/10" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.05)' }}>
              <div className="flex items-start gap-3 mb-3">
                <UserAvatar src={post.author?.avatar_url} name={post.author?.full_name || 'User'} size="md" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{post.author?.full_name || 'Unknown User'}</span>
                    {post.author?.role && <RoleBadge role={post.author.role} />}
                  </div>
                  <p className="text-xs text-gray-500">{new Date(post.created_at).toLocaleString()}</p>
                </div>
              </div>
              
              <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap mb-4">
                {post.content}
              </p>

              <div className="flex items-center gap-6 pt-3 border-t border-white/5">
                <button 
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-2 text-sm transition-colors ${post.liked_by_me ? 'text-red-400' : 'text-gray-400 hover:text-white'}`}
                >
                  <Heart className={`w-4 h-4 ${post.liked_by_me ? 'fill-current' : ''}`} />
                  {post.like_count}
                </button>
                <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  {post.comment_count}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
