'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search...', className = '', id }: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
        style={{ color: '#64748b' }}
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 pl-9 pr-9 rounded-lg text-sm text-white placeholder-gray-500 outline-none transition-all focus:ring-2"
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          caretColor: '#22d3ee',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = 'rgba(34,211,238,0.4)'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(34,211,238,0.1)'; }}
        onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.boxShadow = 'none'; }}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <X className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300 transition-colors" />
        </button>
      )}
    </div>
  );
}
