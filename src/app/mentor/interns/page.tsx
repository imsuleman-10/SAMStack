'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ProfileCard } from '@/components/ui/ProfileCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { GraduationCap, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MentorInternsPage() {
  const router = useRouter();
  const [interns, setInterns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInterns() {
      try {
        const res = await fetch('/api/mentor/interns');
        if (!res.ok) return;
        const data = await res.json();
        setInterns(data.interns || []);
      } catch (error) {
        console.error('Error fetching interns:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchInterns();
  }, []);

  return (
    <div>
      <PageHeader
        title="My Interns"
        description="All interns currently assigned to you."
      />

      {loading ? (
        <div className="py-12 text-center text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
        </div>
      ) : interns.length === 0 ? (
        <EmptyState 
          icon={GraduationCap}
          title="No Interns Assigned"
          description="You don't have any interns assigned to you right now. The admin team will assign interns to you based on your department."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {interns.map((intern) => (
            <ProfileCard
              key={intern.id}
              id={intern.id}
              name={intern.full_name}
              role={intern.role}
              avatarUrl={intern.avatar_url}
              subtitle={intern.intern_profile?.department}
              skills={intern.skills}
              onViewProfile={() => router.push(`/mentor/interns/${intern.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
