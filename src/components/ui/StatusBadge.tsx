'use client';

import React from 'react';
import type { AccountStatus } from '@/lib/firestore-schema';

const STATUS_CONFIG: Record<AccountStatus, { label: string; dot: string; bg: string; text: string }> = {
  active:    { label: 'Active',    dot: '#34d399', bg: 'rgba(52,211,153,0.12)',  text: '#34d399' },
  inactive:  { label: 'Inactive',  dot: '#94a3b8', bg: 'rgba(148,163,184,0.1)', text: '#94a3b8' },
  suspended: { label: 'Suspended', dot: '#f87171', bg: 'rgba(248,113,113,0.12)', text: '#f87171' },
  pending:   { label: 'Pending',   dot: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  text: '#fbbf24' },
};

interface StatusBadgeProps {
  status: AccountStatus;
  showDot?: boolean;
  className?: string;
}

export function StatusBadge({ status, showDot = true, className = '' }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}
      style={{ background: cfg.bg, color: cfg.text }}
    >
      {showDot && (
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
      )}
      {cfg.label}
    </span>
  );
}
