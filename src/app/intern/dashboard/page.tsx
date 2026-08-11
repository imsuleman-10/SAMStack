'use client';

import React from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Star, FileText, Bell, Globe } from 'lucide-react';
import Link from 'next/link';

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

export default function InternDashboardPage() {

  return (
    <div>
      <PageHeader
        title="Intern Dashboard"
        description="Welcome to your workspace. Access your mentorship, tasks, and the community."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <QuickLinkCard 
          href="/intern/mentor" 
          icon={Star} 
          title="My Mentor" 
          desc="View your assigned mentor and connect." 
          color="#a78bfa" 
        />
        <QuickLinkCard 
          href="/community" 
          icon={Globe} 
          title="Community Feed" 
          desc="Connect with other interns and mentors." 
          color="#3b82f6" 
        />
        <QuickLinkCard 
          href="/profile" 
          icon={FileText} 
          title="My Profile" 
          desc="Update your professional details and resume." 
          color="#10b981" 
        />
        <QuickLinkCard 
          href="/notifications" 
          icon={Bell} 
          title="Notifications" 
          desc="Check your latest updates and alerts." 
          color="#f59e0b" 
        />
      </div>

      <div className="p-8 rounded-xl border bg-gradient-to-br from-cyan-900/20 to-blue-900/20" style={{ borderColor: 'rgba(34,211,238,0.2)' }}>
        <h2 className="text-xl font-bold text-white mb-2">Kickstart Your Internship</h2>
        <p className="text-gray-300 max-w-2xl">
          Make sure your profile is complete and up-to-date so your mentor and peers can learn more about you. 
          Head over to the Community tab to introduce yourself!
        </p>
      </div>
    </div>
  );
}
