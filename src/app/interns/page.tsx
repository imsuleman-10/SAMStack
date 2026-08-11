'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ProfileCard } from '@/components/ui/ProfileCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { Loader2 } from 'lucide-react';

export default function InternDirectoryPage() {
  const [interns, setInterns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchInterns() {
      setLoading(true);
      try {
        const url = new URL('/api/interns', window.location.origin);
        if (search) url.searchParams.set('search', search);
        const res = await fetch(url);
        const data = await res.json();
        setInterns(data.interns || []);
      } catch (error) {
        console.error('Error fetching interns:', error);
      } finally {
        setLoading(false);
      }
    }
    const timeoutId = setTimeout(fetchInterns, 300);
    return () => clearTimeout(timeoutId);
  }, [search]);

  return (
    <div>
      <PageHeader
        title="Intern Directory"
        description="Discover and connect with interns across the organization."
        action={
          <SearchBar 
            value={search} 
            onChange={setSearch} 
            placeholder="Search interns by name or department..." 
            className="w-full sm:w-72"
          />
        }
      />

      {loading ? (
        <div className="py-12 text-center text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
        </div>
      ) : interns.length === 0 ? (
        <div className="py-12 text-center text-gray-500 p-8 rounded-xl border" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
          No interns found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {interns.map((intern) => (
            <ProfileCard
              key={intern.id}
              id={intern.id}
              name={intern.full_name}
              role={intern.role}
              avatarUrl={intern.avatar_url}
              subtitle={intern.profile?.department}
              skills={intern.skills}
              href={`/interns/${intern.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
