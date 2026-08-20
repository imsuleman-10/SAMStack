'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2, Edit3, KeyRound, Send, Lock, Mail, CheckCircle2 } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import Link from 'next/link';
import { toast } from 'sonner';
import { tracks } from '@/lib/curriculum';

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
  const [sendingCreds, setSendingCreds] = useState(false);
  const [showSetPassword, setShowSetPassword] = useState(false);
  const [customPassword, setCustomPassword] = useState('');
  const [settingPassword, setSettingPassword] = useState(false);

  const [showSetEmail, setShowSetEmail] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [settingEmail, setSettingEmail] = useState(false);
  
  const [approvingCert, setApprovingCert] = useState(false);

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
        track_selected: json.roleProfile?.track_selected || json.roleProfile?.trackSelected || '',
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
      toast.success('User updated successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update user');
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
      toast.success('User deleted successfully');
      router.push('/admin/users');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete user');
      setShowDelete(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendCredentials = async () => {
    if (!id) return;
    setSendingCreds(true);
    try {
      const res = await fetch(`/api/admin/users/${id}/send-credentials`, { method: 'POST' });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Failed');
      toast.success(`Credentials sent to ${d.email}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to send credentials');
    } finally {
      setSendingCreds(false);
    }
  };

  const handleSetPassword = async () => {
    if (!id) return;
    if (customPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setSettingPassword(true);
    try {
      const res = await fetch(`/api/admin/users/${id}/set-password`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: customPassword }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Failed');
      toast.success(d.message);
      setShowSetPassword(false);
      setCustomPassword('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to set password');
    } finally {
      setSettingPassword(false);
    }
  };

  const handleSetEmail = async () => {
    if (!id) return;
    if (!customEmail || !customEmail.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }
    setSettingEmail(true);
    try {
      const res = await fetch(`/api/admin/users/${id}/set-email`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newEmail: customEmail }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Failed');
      toast.success(d.message);
      setShowSetEmail(false);
      setCustomEmail('');
      fetchUser(id); // Reload user to show updated email
    } catch (err: any) {
      toast.error(err.message || 'Failed to update email');
    } finally {
      setSettingEmail(false);
    }
  };

  const handleApproveCertificate = async () => {
    if (!id) return;
    if (!confirm('Are you sure you want to approve this certificate request?')) return;
    setApprovingCert(true);
    try {
      const res = await fetch(`/api/admin/users/${id}/certificate`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Failed to approve certificate');
      toast.success('Certificate approved successfully');
      fetchUser(id);
    } catch (err: any) {
      toast.error(err.message || 'Failed to approve certificate');
    } finally {
      setApprovingCert(false);
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
                onClick={handleSendCredentials}
                disabled={sendingCreds}
                className="w-full py-2 rounded-lg text-sm font-medium text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {sendingCreds ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {sendingCreds ? 'Sending...' : 'Auto-Send Credentials'}
              </button>

              <button 
                onClick={() => setShowSetPassword(true)}
                className="w-full py-2 rounded-lg text-sm font-medium text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 transition-colors flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Set Custom Password
              </button>
              
              <button 
                onClick={() => setShowSetEmail(true)}
                className="w-full py-2 rounded-lg text-sm font-medium text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Change Email Address
              </button>

              <button 
                onClick={() => setShowDelete(true)}
                className="w-full py-2 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>

              {user.role === 'intern' && roleProfile?.certificate_status === 'pending' && (
                <button
                  onClick={handleApproveCertificate}
                  disabled={approvingCert}
                  className="w-full mt-4 py-3 rounded-lg text-sm font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-2 border border-emerald-500/20 disabled:opacity-50"
                >
                  {approvingCert ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  {approvingCert ? 'Approving...' : 'Approve Certificate Request'}
                </button>
              )}
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

                {/* Track field — only for interns */}
                {(editForm.role === 'intern' || data?.user?.role === 'intern') && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Internship Track</label>
                    <select
                      value={editForm.track_selected || ''}
                      onChange={e => setEditForm({ ...editForm, track_selected: e.target.value })}
                      className="w-full h-10 px-3 rounded-lg text-sm text-white bg-white/5 border border-white/10"
                    >
                      <option value="" className="bg-gray-900">— Not Assigned —</option>
                      {Object.values(tracks).map(t => (
                        <option key={t.id} value={t.id} className="bg-gray-900">{t.title}</option>
                      ))}
                    </select>
                  </div>
                )}

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
                    {user.role === 'intern' && (
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">Internship Track</p>
                        <p className="text-sm mt-1">
                          {roleProfile?.track_selected || roleProfile?.trackSelected
                            ? <span className="text-cyan-400 font-medium">{tracks[roleProfile.track_selected || roleProfile.trackSelected]?.title || roleProfile.track_selected || roleProfile.trackSelected}</span>
                            : <span className="text-gray-600">— Not Assigned —</span>
                          }
                        </p>
                      </div>
                    )}
                    {user.role === 'intern' && mentorAssignment && (
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">Assigned Mentor</p>
                        <div className="mt-2 p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                          <span className="text-sm text-gray-300">
                            {mentorAssignment.mentor_name || `ID: ${mentorAssignment.mentor_id}`}
                          </span>
                          <Link href={`/admin/users/${mentorAssignment.mentor_id}`} className="text-xs text-cyan-400 hover:underline">
                            View Profile
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
        title="Delete User"
        description={`Are you sure you want to delete ${user.full_name}? This action cannot be undone and will remove all their data from the platform.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        loading={actionLoading}
        confirmLabel="Yes, delete user"
        danger={true}
      />

      {/* Set Password Modal */}
      {showSetPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">Set Custom Password</h3>
              <p className="text-sm text-gray-400 mb-6">Manually override the password for <strong className="text-white">{user.email}</strong>.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">New Password</label>
                  <input 
                    type="text" 
                    value={customPassword}
                    onChange={e => setCustomPassword(e.target.value)}
                    placeholder="e.g. TempPass123!"
                    className="w-full h-10 px-3 rounded-lg text-sm text-white bg-black/50 border border-white/10" 
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-900/50 border-t border-white/5 flex justify-end gap-3">
              <button 
                onClick={() => { setShowSetPassword(false); setCustomPassword(''); }}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSetPassword}
                disabled={settingPassword || customPassword.length < 8}
                className="px-5 py-2 rounded-lg text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-gray-900 flex items-center gap-2 disabled:opacity-50"
              >
                {settingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                {settingPassword ? 'Saving...' : 'Set Password'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Set Email Modal */}
      {showSetEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">Change Email Address</h3>
              <p className="text-sm text-gray-400 mb-6">Update the primary email address for <strong className="text-white">{user.full_name}</strong>. Their old email is {user.email}.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">New Email Address</label>
                  <input 
                    type="email" 
                    value={customEmail}
                    onChange={e => setCustomEmail(e.target.value)}
                    placeholder="new@example.com"
                    className="w-full h-10 px-3 rounded-lg text-sm text-white bg-black/50 border border-white/10" 
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-900/50 border-t border-white/5 flex justify-end gap-3">
              <button 
                onClick={() => { setShowSetEmail(false); setCustomEmail(''); }}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSetEmail}
                disabled={settingEmail || !customEmail.includes('@')}
                className="px-5 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 disabled:opacity-50"
              >
                {settingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                {settingEmail ? 'Updating...' : 'Update Email'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
