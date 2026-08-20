'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { EmptyState } from '@/components/ui/EmptyState';
import { Star, Loader2, Mail, Briefcase, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function InternMentorPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchMentor() {
      try {
        const res = await fetch('/api/intern/mentor');
        if (!res.ok) throw new Error('Failed to fetch mentor data');
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMentor();
  }, []);

  if (loading) return <div className="p-12 text-center text-gray-500"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>;
  if (error) return <div className="p-12 text-center text-red-500">{error}</div>;
  if (!data) return null;

  const { mentor, assignment } = data;

  if (!mentor) {
    return (
      <div>
        <PageHeader title="My Mentor" />
        <EmptyState 
          icon={Star}
          title="No Mentor Assigned Yet"
          description="You haven't been assigned a mentor yet. Admin team will assign you one soon."
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="My Mentor"
        description={`You were assigned to this mentor on ${new Date(assignment.assigned_at).toLocaleDateString()}`}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="p-6 rounded-xl border flex flex-col items-center text-center" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
            <UserAvatar src={mentor.avatar_url} name={mentor.full_name} size="xl" className="mb-4" />
            <h2 className="text-xl font-bold text-white mb-1">{mentor.full_name}</h2>
            <p className="text-sm text-gray-400 mb-4">{mentor.email}</p>
            
            <a 
              href={`mailto:${mentor.email}`}
              className="w-full py-2.5 rounded-lg text-sm font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Email Mentor
            </a>
            
            <Link 
              href={`/mentors/${mentor.id}`}
              className="w-full mt-3 py-2.5 rounded-lg text-sm font-semibold text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors flex items-center justify-center"
            >
              View Full Profile
            </Link>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="p-6 rounded-xl border" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/5 pb-2">Professional Summary</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 text-gray-300">
                <Briefcase className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Department</p>
                  <p className="text-sm">{mentor.mentor_profile?.department || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Star className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Designation</p>
                  <p className="text-sm">{mentor.mentor_profile?.designation || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm">{mentor.city ? `${mentor.city}, ${mentor.country}` : 'Not specified'}</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">About</p>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                {mentor.bio || 'This mentor hasn\'t added a bio yet.'}
              </p>
            </div>

            {mentor.skills && mentor.skills.length > 0 && (
              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-2">Skills & Expertise</p>
                <div className="flex flex-wrap gap-2">
                  {mentor.skills.map((skill: string) => (
                    <span key={skill} className="px-2.5 py-1 rounded bg-white/5 text-gray-300 text-xs font-medium border border-white/10">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
