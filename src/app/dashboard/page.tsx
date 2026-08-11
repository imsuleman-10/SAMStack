'use client';

import React from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Globe, FileText, Bell, Users } from 'lucide-react';
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

export default function UserDashboardPage() {

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Welcome back to SAMStack Platform."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <QuickLinkCard 
          href="/community" 
          icon={Globe} 
          title="Community" 
          desc="Engage with the organization feed." 
          color="#3b82f6" 
        />
        <QuickLinkCard 
          href="/interns" 
          icon={Users} 
          title="Directory" 
          desc="Browse public profiles." 
          color="#22d3ee" 
        />
        <QuickLinkCard 
          href="/profile" 
          icon={FileText} 
          title="My Profile" 
          desc="Update your details." 
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

      <div className="p-8 rounded-xl border" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
        <h2 className="text-xl font-bold text-white mb-2">Welcome</h2>
        <p className="text-gray-400">Head over to the community tab to see what's happening, or update your profile.</p>
      </div>
    </div>
  );
}
