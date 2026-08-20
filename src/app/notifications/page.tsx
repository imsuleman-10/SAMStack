'use client';

import React, { useEffect, useState } from 'react';
import { Bell, CheckCheck, BellOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNotifications } from '@/context/NotificationContext';
import { PageHeader } from '@/components/ui/PageHeader';

const NOTIFICATION_ICONS: Record<string, { bg: string; color: string; emoji: string }> = {
  mentor_assigned:    { bg: 'rgba(167,139,250,0.1)', color: '#a78bfa', emoji: '🎓' },
  mentor_changed:     { bg: 'rgba(251,191,36,0.1)',  color: '#fbbf24', emoji: '🔄' },
  mentor_removed:     { bg: 'rgba(248,113,113,0.1)', color: '#f87171', emoji: '❌' },
  account_activated:  { bg: 'rgba(52,211,153,0.1)',  color: '#34d399', emoji: '✅' },
  account_suspended:  { bg: 'rgba(248,113,113,0.1)', color: '#f87171', emoji: '🚫' },
  post_liked:         { bg: 'rgba(251,113,133,0.1)', color: '#fb7185', emoji: '❤️' },
  post_commented:     { bg: 'rgba(34,211,238,0.1)',  color: '#22d3ee', emoji: '💬' },
  role_changed:       { bg: 'rgba(251,191,36,0.1)',  color: '#fbbf24', emoji: '🔑' },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [markingAll, setMarkingAll] = useState(false);

  const markOne = async (id: string) => {
    await markAsRead(id);
  };

  const markAll = async () => {
    setMarkingAll(true);
    try {
      await markAllAsRead();
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark all as read');
    } finally {
      setMarkingAll(false);
    }
  };

  const unread = notifications.filter(n => !n.is_read);

  return (
    <div>
      <PageHeader
        title="Notifications"
        description={unread.length > 0 ? `You have ${unread.length} unread notification${unread.length > 1 ? 's' : ''}` : 'You are all caught up!'}
        action={
          <div className="flex items-center gap-2">
            {unread.length > 0 && (
              <button
                onClick={markAll}
                disabled={markingAll}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-500 transition-colors disabled:opacity-60"
              >
                {markingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCheck className="w-4 h-4" />}
                Mark all read
              </button>
            )}
          </div>
        }
      />

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <BellOff className="w-7 h-7 text-gray-500" />
          </div>
          <div className="text-center">
            <p className="text-white font-semibold">No notifications yet</p>
            <p className="text-sm text-gray-500 mt-1">When something important happens, you'll see it here.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-2 max-w-3xl">
          {notifications.map((n: any) => {
            const style = NOTIFICATION_ICONS[n.type] ?? { bg: 'rgba(148,163,184,0.1)', color: '#94a3b8', emoji: '🔔' };
            return (
              <button
                key={n.id}
                onClick={() => !n.is_read && markOne(n.id)}
                className={`w-full text-left flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 group ${
                  n.is_read
                    ? 'border-white/5 bg-white/[0.01] opacity-60 hover:opacity-80'
                    : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20 cursor-pointer'
                }`}
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 mt-0.5"
                  style={{ background: style.bg, border: `1px solid ${style.color}30` }}
                >
                  {style.emoji}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${n.is_read ? 'text-gray-400' : 'text-white'}`}>
                    {n.title}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                  <p className="text-xs text-gray-600 mt-1.5">{timeAgo(n.created_at)}</p>
                </div>

                {/* Unread dot */}
                {!n.is_read && (
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0 mt-2 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
