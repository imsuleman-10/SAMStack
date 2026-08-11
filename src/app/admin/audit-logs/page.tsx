'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { UserAvatar } from '@/components/ui/UserAvatar';

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  CREATE_USER: { label: 'Create User', color: '#34d399' },
  DELETE_USER: { label: 'Delete User', color: '#f87171' },
  CHANGE_ROLE: { label: 'Change Role', color: '#fbbf24' },
  CHANGE_STATUS: { label: 'Change Status', color: '#fb923c' },
  ASSIGN_MENTOR: { label: 'Assign Mentor', color: '#a78bfa' },
  REASSIGN_MENTOR: { label: 'Reassign Mentor', color: '#818cf8' },
  REMOVE_MENTOR_ASSIGNMENT: { label: 'Remove Mentor', color: '#f87171' },
  ADMIN_EDIT_PROFILE: { label: 'Edit Profile', color: '#22d3ee' },
  RESET_PASSWORD: { label: 'Reset Password', color: '#fbbf24' },
  CREATE_POST: { label: 'Create Post', color: '#34d399' },
  DELETE_POST: { label: 'Delete Post', color: '#f87171' },
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch('/api/admin/audit-logs?limit=100');
        const data = await res.json();
        setLogs(data.logs || []);
      } catch (error) {
        console.error('Error fetching audit logs:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  return (
    <div>
      <PageHeader
        title="Audit Logs"
        description="A full record of admin actions performed on the platform."
      />

      <DataTable
        data={logs}
        isLoading={loading}
        keyExtractor={(l) => l.id}
        columns={[
          {
            key: 'actor',
            label: 'Actor',
            render: (l) =>
              l.actor ? (
                <div className="flex items-center gap-2">
                  <UserAvatar name={l.actor.full_name} size="xs" />
                  <span className="text-sm text-gray-300">{l.actor.full_name}</span>
                </div>
              ) : (
                <span className="text-gray-500 text-sm">System</span>
              ),
          },
          {
            key: 'action',
            label: 'Action',
            render: (l) => {
              const cfg = ACTION_LABELS[l.action] || { label: l.action, color: '#94a3b8' };
              return (
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                  style={{ background: `${cfg.color}15`, color: cfg.color }}
                >
                  {cfg.label}
                </span>
              );
            },
          },
          {
            key: 'target',
            label: 'Affected User',
            render: (l) =>
              l.target_user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-300">{l.target_user.full_name}</span>
                  <RoleBadge role={l.target_user.role} />
                </div>
              ) : (
                <span className="text-gray-600 text-sm">—</span>
              ),
          },
          {
            key: 'created_at',
            label: 'Time',
            render: (l) => (
              <span className="text-xs text-gray-400">
                {new Date(l.created_at).toLocaleString()}
              </span>
            ),
          },
        ]}
      />
    </div>
  );
}
