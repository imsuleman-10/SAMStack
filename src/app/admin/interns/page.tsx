'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useRouter } from 'next/navigation';
import type { RichIntern } from '@/lib/firestore-schema';

export default function AdminInternsPage() {
  const router = useRouter();
  const [interns, setInterns] = useState<RichIntern[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchInterns = async (p = 1, s = '') => {
    setLoading(true);
    try {
      // Re-using the users endpoint with role filter
      const url = new URL('/api/admin/users', window.location.origin);
      url.searchParams.set('role', 'intern');
      url.searchParams.set('page', p.toString());
      if (s) url.searchParams.set('search', s);
      
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      if (data.users) {
        setInterns(data.users);
        setTotalPages(data.pages);
        setPage(data.page);
      }
    } catch (error) {
      console.error('Error fetching interns:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => fetchInterns(1, search), 300);
    return () => clearTimeout(timeoutId);
  }, [search]);

  return (
    <div>
      <PageHeader
        title="Interns Management"
        description="View and manage all intern profiles."
      />

      <DataTable
        data={interns}
        isLoading={loading}
        keyExtractor={(i) => i.id}
        onRowClick={(i) => router.push(`/admin/users/${i.id}`)}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search interns..."
        page={page}
        totalPages={totalPages}
        onPageChange={(p) => fetchInterns(p, search)}
        columns={[
          {
            key: 'user',
            label: 'Intern',
            render: (i) => (
              <div className="flex items-center gap-3">
                <UserAvatar name={i.full_name} src={i.avatar_url} size="sm" />
                <div>
                  <p className="font-medium text-white">{i.full_name}</p>
                  <p className="text-xs text-gray-400">{i.email}</p>
                </div>
              </div>
            ),
          },
          {
            key: 'status',
            label: 'Account Status',
            render: (i) => <StatusBadge status={i.status} />,
          },
          {
            key: 'joined',
            label: 'Joined',
            render: (i) => <span className="text-gray-400">{new Date(i.created_at).toLocaleDateString()}</span>,
          },
        ]}
      />
    </div>
  );
}
