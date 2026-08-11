'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { Loader2, Mail, GraduationCap, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function MentorInternDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);

  useEffect(() => {
    async function fetchIntern() {
      if (!id) return;
      try {
        const res = await fetch(`/api/mentor/interns/${id}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to load intern details');
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchIntern();
  }, [id]);

  if (loading) return <div className="p-12 text-center text-gray-500"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>;
  if (error || !data) return <div className="p-12 text-center text-red-500">{error || 'Intern not found'}</div>;

  const { intern, profile } = data;

  return (
    <div>
      <PageHeader
        title="Intern Details"
        breadcrumbs={[
          { label: 'My Interns', href: '/mentor/interns' },
          { label: intern.full_name },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="p-6 rounded-xl border flex flex-col items-center text-center" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
            <UserAvatar src={intern.avatar_url} name={intern.full_name} size="xl" className="mb-4" />
            <h2 className="text-xl font-bold text-white mb-1">{intern.full_name}</h2>
            <p className="text-sm text-gray-400 mb-4">{intern.email}</p>
            
            <a 
              href={`mailto:${intern.email}`}
              className="w-full py-2.5 rounded-lg text-sm font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Send Email
            </a>
            
            <Link 
              href={`/interns/${intern.id}`}
              className="w-full mt-3 py-2.5 rounded-lg text-sm font-semibold text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors flex items-center justify-center"
            >
              View Public Profile
            </Link>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="p-6 rounded-xl border" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/5 pb-2">Internship Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 text-gray-300">
                <GraduationCap className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Department</p>
                  <p className="text-sm">{profile?.department || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Semester / Year</p>
                  <p className="text-sm">{profile?.semester || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm">{intern.city ? `${intern.city}, ${intern.country}` : 'Not specified'}</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">About</p>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                {intern.bio || 'This intern hasn\'t added a bio yet.'}
              </p>
            </div>

            {intern.skills && intern.skills.length > 0 && (
              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-2">Skills & Technologies</p>
                <div className="flex flex-wrap gap-2">
                  {intern.skills.map((skill: string) => (
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
