'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { GraduationCap, Users, Bell, FileText, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { UserAvatar } from '@/components/ui/UserAvatar';

const QuickLinkCard = ({ href, icon: Icon, title, desc, color }: any) => (
  <Link 
    href={href}
    className="p-6 rounded-xl border block transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" 
    style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}
  >
    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}15` }}>
      <Icon className="w-6 h-6" style={{ color }} />
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-sm text-gray-400">{desc}</p>
  </Link>
);

export default function MentorDashboardPage() {
  const [interns, setInterns] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchInterns() {
      try {
        const res = await fetch('/api/mentor/interns');
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
        title="Mentor Dashboard"
        description="Overview of your mentorship program and assigned interns."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <QuickLinkCard 
          href="/mentor/interns" 
          icon={GraduationCap} 
          title="My Interns" 
          desc="Manage your assigned interns." 
          color="#22d3ee" 
        />
        <QuickLinkCard 
          href="/interns" 
          icon={Users} 
          title="Intern Directory" 
          desc="Browse all interns in the organization." 
          color="#3b82f6" 
        />
        <QuickLinkCard 
          href="/profile" 
          icon={FileText} 
          title="My Profile" 
          desc="Update your professional details." 
          color="#10b981" 
        />
        <QuickLinkCard 
          href="/notifications" 
          icon={Bell} 
          title="Notifications" 
          desc="Check your latest updates." 
          color="#f59e0b" 
        />
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Your Assigned Interns</h2>
          <Link href="/mentor/interns" className="text-sm font-medium text-cyan-400 hover:text-cyan-300">
            View All →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full py-12 text-center text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin mx-auto" />
            </div>
          ) : interns.length === 0 ? (
            <div className="col-span-full p-8 rounded-xl border text-center" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-gray-400">You do not have any interns assigned to you right now.</p>
            </div>
          ) : (
            interns.slice(0, 3).map((intern) => (
              <Link 
                key={intern.id} 
                href={`/mentor/interns/${intern.id}`}
                className="p-5 rounded-xl border transition-colors hover:bg-white/5 flex items-center gap-4" 
                style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}
              >
                <UserAvatar src={intern.avatar_url} name={intern.full_name} size="md" />
                <div>
                  <h3 className="font-medium text-white">{intern.full_name}</h3>
                  <p className="text-xs text-gray-400">{intern.email}</p>
                  {intern.intern_profile?.department && (
                    <p className="text-xs text-cyan-400 mt-1">{intern.intern_profile.department}</p>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
