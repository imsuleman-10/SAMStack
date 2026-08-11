'use client';

import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

interface ProfileField {
  label: string;
  done: boolean;
}

interface ProfileCompletionProps {
  fields: ProfileField[];
  className?: string;
}

export function ProfileCompletion({ fields, className = '' }: ProfileCompletionProps) {
  const done = fields.filter(f => f.done).length;
  const pct = Math.round((done / fields.length) * 100);

  const barColor = pct >= 80 ? '#34d399' : pct >= 50 ? '#22d3ee' : '#f59e0b';

  return (
    <div
      className={`rounded-xl p-4 ${className}`}
      style={{ background: 'rgba(17,24,39,0.65)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-white">Profile Completion</span>
        <span className="text-sm font-bold" style={{ color: barColor }}>{pct}%</span>
      </div>

      <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="h-2 rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: barColor }}
        />
      </div>

      <ul className="mt-3 space-y-1.5">
        {fields.map(field => (
          <li key={field.label} className="flex items-center gap-2 text-xs">
            {field.done ? (
              <CheckCircle className="w-3.5 h-3.5 shrink-0" style={{ color: '#34d399' }} />
            ) : (
              <Circle className="w-3.5 h-3.5 shrink-0 text-gray-600" />
            )}
            <span className={field.done ? 'text-gray-300' : 'text-gray-500'}>{field.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
