'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ProfileCard } from '@/components/ui/ProfileCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { Loader2 } from 'lucide-react';

export default function MentorDirectoryPage() {
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchMentors() {
      setLoading(true);
      try {
        const url = new URL('/api/mentors', window.location.origin);
        if (search) url.searchParams.set('search', search);
        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();
        setMentors(data.mentors || []);
      } catch (error) {
        console.error('Error fetching mentors:', error);
      } finally {
        setLoading(false);
      }
    }
    const timeoutId = setTimeout(fetchMentors, 300);
    return () => clearTimeout(timeoutId);
  }, [search]);

  return (
    <div>
      <PageHeader
        title="Mentor Directory"
        description="Discover and connect with mentors across the organization."
        action={
          <SearchBar 
            value={search} 
            onChange={setSearch} 
            placeholder="Search mentors by name or department..." 
            className="w-full sm:w-72"
          />
        }
      />

      {loading ? (
        <div className="py-12 text-center text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
        </div>
      ) : mentors.length === 0 ? (
        <div className="py-12 text-center text-gray-500 p-8 rounded-xl border" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
          No mentors found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mentors.map((mentor) => (
            <ProfileCard
              key={mentor.id}
              id={mentor.id}
              name={mentor.full_name}
              role={mentor.role}
              avatarUrl={mentor.avatar_url}
              subtitle={mentor.profile?.department || mentor.profile?.designation}
              skills={mentor.skills}
              href={`/mentors/${mentor.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
