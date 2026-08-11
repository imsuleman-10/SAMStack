'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { UserPlus, MoreVertical, Edit } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { PlatformUser } from '@/lib/firestore-schema';

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async (p = 1, s = '') => {
    setLoading(true);
    try {
      const url = new URL('/api/admin/users', window.location.origin);
      url.searchParams.set('page', p.toString());
      if (s) url.searchParams.set('search', s);
      
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
        setTotalPages(data.pages);
        setPage(data.page);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers(1, search);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [search]);

  const handleRowClick = (user: PlatformUser) => {
    router.push(`/admin/users/${user.id}`);
  };

  return (
    <div>
      <PageHeader
        title="User Management"
        description="Manage all users across the platform."
        action={
          <Link
            href="/admin/users/create"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-500 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </Link>
        }
      />

      <DataTable
        data={users}
        isLoading={loading}
        keyExtractor={(u) => u.id}
        onRowClick={handleRowClick}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name, email or username..."
        page={page}
        totalPages={totalPages}
        onPageChange={(p) => fetchUsers(p, search)}
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
            key: 'joined',
            label: 'Joined',
            render: (u) => <span className="text-gray-400">{new Date(u.created_at).toLocaleDateString()}</span>,
          },
          {
            key: 'actions',
            label: '',
            render: () => (
              <div className="flex justify-end">
                <button className="p-1 text-gray-500 hover:text-white transition-colors rounded hover:bg-white/10">
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}

function ChevronRightIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
