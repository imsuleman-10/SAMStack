'use client';

import React from 'react';
import type { UserRole } from '@/lib/firestore-schema';

const ROLE_CONFIG: Record<UserRole, { label: string; bg: string; text: string }> = {
  admin:   { label: 'Admin',   bg: 'rgba(251,191,36,0.15)',  text: '#fbbf24' },
  mentor:  { label: 'Mentor',  bg: 'rgba(167,139,250,0.15)', text: '#a78bfa' },
  intern:  { label: 'Intern',  bg: 'rgba(34,211,238,0.15)',  text: '#22d3ee' },
  staff:   { label: 'Staff',   bg: 'rgba(52,211,153,0.15)',  text: '#34d399' },
  member:  { label: 'Member',  bg: 'rgba(251,146,60,0.15)',  text: '#fb923c' },
  user:    { label: 'User',    bg: 'rgba(148,163,184,0.12)', text: '#94a3b8' },
};

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

export function RoleBadge({ role, className = '' }: RoleBadgeProps) {
  const cfg = ROLE_CONFIG[role] ?? ROLE_CONFIG.user;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${className}`}
      style={{ background: cfg.bg, color: cfg.text }}
    >
      {cfg.label}
    </span>
  );
}
