'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Users, GraduationCap, Star, Briefcase, Activity } from 'lucide-react';
import Link from 'next/link';
import { DataTable } from '@/components/ui/DataTable';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import type { PlatformUser } from '@/lib/firestore-schema';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    interns: 0,
    mentors: 0,
    staff: 0,
    active: 0,
  });
  const [recentUsers, setRecentUsers] = useState<PlatformUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/admin/users?limit=10');
        const data = await res.json();
        if (data.users) {
          setRecentUsers(data.users);
          
          // These are basic stats from the fetched users (for demo, a real app would use aggregation)
          const allRes = await fetch('/api/admin/users?limit=500'); // hack for stats demo
          const allData = await allRes.json();
          if (allData.users) {
            setStats({
              total: allData.users.length,
              interns: allData.users.filter((u: any) => u.role === 'intern').length,
              mentors: allData.users.filter((u: any) => u.role === 'mentor').length,
              staff: allData.users.filter((u: any) => u.role === 'staff').length,
              active: allData.users.filter((u: any) => u.status === 'active').length,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="p-6 rounded-xl border" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400 font-medium">{title}</h3>
        <div className="p-2 rounded-lg" style={{ background: `${color}15` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        description="Overview of platform users and activity."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard title="Total Users" value={stats.total} icon={Users} color="#3b82f6" />
        <StatCard title="Interns" value={stats.interns} icon={GraduationCap} color="#22d3ee" />
        <StatCard title="Mentors" value={stats.mentors} icon={Star} color="#a78bfa" />
        <StatCard title="Staff" value={stats.staff} icon={Briefcase} color="#34d399" />
        <StatCard title="Active Accounts" value={stats.active} icon={Activity} color="#10b981" />
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Registrations</h2>
          <Link href="/admin/users" className="text-sm font-medium text-cyan-400 hover:text-cyan-300">
            View All Users →
          </Link>
        </div>
        <DataTable
          data={recentUsers}
          isLoading={loading}
          keyExtractor={(u) => u.id}
          columns={[
            {
              key: 'user',
              label: 'User',
              render: (u) => (
                <div className="flex items-center gap-3">
                  <UserAvatar name={u.full_name} src={u.avatar_url} size="sm" />
                  <div>
                    <p className="font-medium text-white">{u.full_name}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </div>
                </div>
              ),
            },
            {
              key: 'role',
              label: 'Role',
              render: (u) => <RoleBadge role={u.role} />,
            },
            {
              key: 'status',
              label: 'Status',
              render: (u) => <StatusBadge status={u.status} />,
            },
            {
              key: 'created',
              label: 'Joined',
              render: (u) => <span className="text-gray-400">{new Date(u.created_at).toLocaleDateString()}</span>,
            },
          ]}
        />
      </div>
    </div>
  );
}
