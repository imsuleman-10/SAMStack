'use client';

import React from 'react';
import { UserAvatar } from './UserAvatar';
import { RoleBadge } from './RoleBadge';
import type { UserRole } from '@/lib/firestore-schema';

interface ProfileCardProps {
  id: string;
  name: string;
  avatarUrl?: string | null;
  role: UserRole;
  subtitle?: string;
  skills?: string[];
  href?: string;
  onViewProfile?: (id: string) => void;
  className?: string;
}

export function ProfileCard({
  id,
  name,
  avatarUrl,
  role,
  subtitle,
  skills = [],
  href,
  onViewProfile,
  className = '',
}: ProfileCardProps) {
  const handleClick = () => {
    if (onViewProfile) onViewProfile(id);
  };

  return (
    <div
      className={`platform-card group cursor-pointer transition-all duration-300 hover:-translate-y-1 ${className}`}
      style={{
        background: 'rgba(17,24,39,0.65)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: '1.25rem',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <UserAvatar src={avatarUrl} name={name} size="lg" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate">{name}</h3>
          {subtitle && <p className="text-sm text-gray-400 truncate mt-0.5">{subtitle}</p>}
          <RoleBadge role={role} className="mt-1.5" />
        </div>
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {skills.slice(0, 4).map(skill => (
            <span
              key={skill}
              className="px-2 py-0.5 rounded text-xs font-medium"
              style={{ background: 'rgba(6,182,212,0.12)', color: '#22d3ee' }}
            >
              {skill}
            </span>
          ))}
          {skills.length > 4 && (
            <span className="px-2 py-0.5 rounded text-xs text-gray-500">+{skills.length - 4}</span>
          )}
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-white/5 flex justify-end">
        {href ? (
          <a
            href={href}
            className="text-xs font-semibold transition-colors"
            style={{ color: '#22d3ee' }}
            onClick={e => e.stopPropagation()}
          >
            View Profile →
          </a>
        ) : (
          <button
            className="text-xs font-semibold transition-colors"
            style={{ color: '#22d3ee' }}
          >
            View Profile →
          </button>
        )}
      </div>
    </div>
  );
}
