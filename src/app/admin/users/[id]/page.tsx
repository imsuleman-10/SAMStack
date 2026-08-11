'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2, Edit3, ShieldAlert } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import Link from 'next/link';

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modals state
  const [showDelete, setShowDelete] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);

  const fetchUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`);
      if (!res.ok) throw new Error('Failed to load user');
      const json = await res.json();
      setData(json);
      setEditForm({
        full_name: json.user.full_name,
        role: json.user.role,
        status: json.user.status,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchUser(id);
  }, [id]);

  const handleUpdate = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error('Failed to update');
      await fetchUser(id);
      setIsEditing(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Failed to delete');
      router.push('/admin/users');
    } catch (err: any) {
      alert(err.message);
      setShowDelete(false);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-gray-500"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>;
  if (error || !data) return <div className="p-12 text-center text-red-500">{error || 'User not found'}</div>;

  const { user, roleProfile, mentorAssignment } = data;

  return (
    <div>
      <PageHeader
        title="User Details"
        breadcrumbs={[
          { label: 'Users', href: '/admin/users' },
          { label: user.full_name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Core Info & Actions */}
        <div className="space-y-6">
          <div className="p-6 rounded-xl border flex flex-col items-center text-center" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
            <UserAvatar src={user.avatar_url} name={user.full_name} size="xl" className="mb-4" />
            <h2 className="text-xl font-bold text-white mb-1">{user.full_name}</h2>
            <p className="text-sm text-gray-400 mb-4">{user.email}</p>
            <div className="flex gap-2">
              <RoleBadge role={user.role} />
              <StatusBadge status={user.status} />
            </div>
            
            <div className="w-full mt-6 pt-6 border-t border-white/5 space-y-3">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="w-full py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                {isEditing ? 'Cancel Editing' : 'Edit User'}
              </button>
              
              <button 
                onClick={() => setShowDelete(true)}
                className="w-full py-2 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Edit Form */}
        <div className="lg:col-span-2 space-y-6">
          {isEditing ? (
            <div className="p-6 rounded-xl border" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
              <h3 className="text-lg font-semibold text-white mb-4">Edit Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={editForm.full_name}
                    onChange={e => setEditForm({ ...editForm, full_name: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg text-sm text-white bg-white/5 border border-white/10" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Role</label>
                    <select 
                      value={editForm.role}
                      onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                      className="w-full h-10 px-3 rounded-lg text-sm text-white bg-white/5 border border-white/10" 
                    >
                      <option value="intern" className="bg-gray-900">Intern</option>
                      <option value="mentor" className="bg-gray-900">Mentor</option>
                      <option value="staff" className="bg-gray-900">Staff</option>
                      <option value="member" className="bg-gray-900">Member</option>
                      <option value="user" className="bg-gray-900">User</option>
                      <option value="admin" className="bg-gray-900">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Status</label>
                    <select 
                      value={editForm.status}
                      onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                      className="w-full h-10 px-3 rounded-lg text-sm text-white bg-white/5 border border-white/10" 
                    >
                      <option value="active" className="bg-gray-900">Active</option>
                      <option value="inactive" className="bg-gray-900">Inactive</option>
                      <option value="suspended" className="bg-gray-900">Suspended</option>
                      <option value="pending" className="bg-gray-900">Pending</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button 
                    onClick={handleUpdate}
                    disabled={actionLoading}
                    className="px-5 py-2 rounded-lg text-sm font-semibold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-2"
                  >
                    {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="p-6 rounded-xl border" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
                <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/5 pb-2">Account Overview</h3>
                <div className="grid grid-cols-2 gap-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Joined Date</p>
                    <p className="text-sm text-gray-300 mt-1">{new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Login</p>
                    <p className="text-sm text-gray-300 mt-1">{user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-sm text-gray-300 mt-1">{user.phone || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-sm text-gray-300 mt-1">{user.city ? `${user.city}, ${user.country}` : '-'}</p>
                  </div>
                </div>
              </div>

              {roleProfile && (
                <div className="p-6 rounded-xl border" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
                  <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/5 pb-2">
                    {user.role === 'intern' ? 'Internship Details' : 'Professional Details'}
                  </h3>
                  <div className="grid grid-cols-2 gap-y-4">
                    {roleProfile.department && (
                      <div>
                        <p className="text-sm text-gray-500">Department</p>
                        <p className="text-sm text-gray-300 mt-1">{roleProfile.department}</p>
                      </div>
                    )}
                    {(roleProfile.position || roleProfile.designation) && (
                      <div>
                        <p className="text-sm text-gray-500">Designation</p>
                        <p className="text-sm text-gray-300 mt-1">{roleProfile.position || roleProfile.designation}</p>
                      </div>
                    )}
                    {user.role === 'intern' && mentorAssignment && (
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">Assigned Mentor</p>
                        <div className="mt-2 p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                          <span className="text-sm text-gray-300">Mentor ID: {mentorAssignment.mentor_id}</span>
                          <Link href={`/admin/users/${mentorAssignment.mentor_id}`} className="text-xs text-cyan-400 hover:underline">
                            View
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={showDelete}
        title="Delete User Account"
        description={`Are you sure you want to permanently delete ${user.full_name}? This will remove their authentication record, profile, and any associated data.`}
        confirmLabel="Delete User"
        danger
        loading={actionLoading}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  );
}
