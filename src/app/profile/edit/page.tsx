'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { Loader2, Camera, X, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { PlatformUser, InternProfile, MentorProfile } from '@/lib/firestore-schema';

export default function ProfileEditPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [data, setData] = useState<{ user: PlatformUser; internProfile?: InternProfile | null; mentorProfile?: MentorProfile | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState<any>({});
  const [internForm, setInternForm] = useState<any>({});
  const [mentorForm, setMentorForm] = useState<any>({});
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile');
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to load profile');

        setData({ user: json.user, internProfile: json.internProfile, mentorProfile: json.mentorProfile });
        setForm({
          full_name: json.user.full_name || '',
          bio: json.user.bio || '',
          phone: json.user.phone || '',
          city: json.user.city || '',
          country: json.user.country || '',
          skills: json.user.skills || [],
          visibility: json.user.visibility || 'organization',
          social_links: json.user.social_links || {},
        });
        if (json.internProfile) {
          setInternForm({
            university: json.internProfile.university || '',
            degree: json.internProfile.degree || '',
            semester: json.internProfile.semester || '',
            cgpa: json.internProfile.cgpa || '',
            department: json.internProfile.department || '',
            position: json.internProfile.position || '',
            roll_number: json.internProfile.roll_number || '',
            track_selected: json.internProfile.track_selected || '',
          });
        }
        if (json.mentorProfile) {
          setMentorForm({
            department: json.mentorProfile.department || '',
            designation: json.mentorProfile.designation || '',
            experience: json.mentorProfile.experience || '',
          });
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const fd = new FormData();
      fd.append('avatar', file);
      const res = await fetch('/api/upload/avatar', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');
      setData(prev => prev ? { ...prev, user: { ...prev.user, avatar_url: json.avatar_url } } : null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed || form.skills.includes(trimmed)) { setSkillInput(''); return; }
    setForm((f: any) => ({ ...f, skills: [...f.skills, trimmed] }));
    setSkillInput('');
  };

  const removeSkill = (skill: string) => {
    setForm((f: any) => ({ ...f, skills: f.skills.filter((s: string) => s !== skill) }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload: any = { ...form };
      if (data?.user.role === 'intern') payload.internProfile = internForm;
      if (data?.user.role === 'mentor') payload.mentorProfile = mentorForm;

      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to save');

      setSuccess(true);
      setTimeout(() => router.push('/profile'), 1200);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-1.5">{label}</label>
      {children}
    </div>
  );

  const inputClass = "w-full h-10 px-3 rounded-lg text-sm text-white bg-white/5 border border-white/10 outline-none focus:border-cyan-500/50 transition-colors";

  if (loading) return <div className="p-12 text-center text-gray-500"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>;
  if (!data) return <div className="p-12 text-center text-red-500">{error || 'Failed to load profile'}</div>;

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Edit Profile"
        breadcrumbs={[{ label: 'Profile', href: '/profile' }, { label: 'Edit' }]}
      />

      {success && (
        <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
          ✓ Profile saved! Redirecting…
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Avatar */}
        <div className="p-6 rounded-xl border" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
          <h2 className="text-base font-semibold text-white mb-4">Profile Photo</h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              <UserAvatar src={data.user.avatar_url} name={data.user.full_name} size="xl" />
              {uploadingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </div>
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white/10 hover:bg-white/15 text-white transition-colors disabled:opacity-50"
              >
                <Camera className="w-4 h-4" />
                Change Photo
              </button>
              <p className="text-xs text-gray-500 mt-1.5">JPEG, PNG or WebP · Max 5MB</p>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="p-6 rounded-xl border" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
          <h2 className="text-base font-semibold text-white mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Full Name">
              <input type="text" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Phone">
              <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={inputClass} />
            </Field>
            <Field label="City">
              <input type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Country">
              <input type="text" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} className={inputClass} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Bio">
                <textarea
                  value={form.bio}
                  onChange={e => setForm({ ...form, bio: e.target.value })}
                  rows={4}
                  className="w-full p-3 rounded-lg text-sm text-white bg-white/5 border border-white/10 outline-none focus:border-cyan-500/50 transition-colors resize-none"
                />
              </Field>
            </div>
            <Field label="Profile Visibility">
              <select value={form.visibility} onChange={e => setForm({ ...form, visibility: e.target.value })} className={inputClass}>
                <option value="public" className="bg-gray-900">Public</option>
                <option value="organization" className="bg-gray-900">Organization Only</option>
                <option value="private" className="bg-gray-900">Private</option>
              </select>
            </Field>
          </div>
        </div>

        {/* Skills */}
        <div className="p-6 rounded-xl border" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
          <h2 className="text-base font-semibold text-white mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {form.skills.map((skill: string) => (
              <span key={skill} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-medium border border-cyan-500/20">
                {skill}
                <button type="button" onClick={() => removeSkill(skill)} className="hover:text-white transition-colors"><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
              placeholder="Add a skill..."
              className="flex-1 h-9 px-3 rounded-lg text-sm text-white bg-white/5 border border-white/10 outline-none focus:border-cyan-500/50 transition-colors"
            />
            <button type="button" onClick={addSkill} className="h-9 px-3 rounded-lg text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors flex items-center gap-1 text-sm font-medium">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </div>

        {/* Social Links */}
        <div className="p-6 rounded-xl border" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
          <h2 className="text-base font-semibold text-white mb-6">Social Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="LinkedIn URL">
              <input type="url" value={form.social_links.linkedin || ''} onChange={e => setForm({ ...form, social_links: { ...form.social_links, linkedin: e.target.value } })} className={inputClass} placeholder="https://linkedin.com/in/..." />
            </Field>
            <Field label="GitHub URL">
              <input type="url" value={form.social_links.github || ''} onChange={e => setForm({ ...form, social_links: { ...form.social_links, github: e.target.value } })} className={inputClass} placeholder="https://github.com/..." />
            </Field>
            <Field label="Portfolio URL">
              <input type="url" value={form.social_links.portfolio || ''} onChange={e => setForm({ ...form, social_links: { ...form.social_links, portfolio: e.target.value } })} className={inputClass} placeholder="https://yoursite.com" />
            </Field>
            <Field label="Twitter/X URL">
              <input type="url" value={form.social_links.twitter || ''} onChange={e => setForm({ ...form, social_links: { ...form.social_links, twitter: e.target.value } })} className={inputClass} placeholder="https://x.com/..." />
            </Field>
          </div>
        </div>

        {/* Intern-specific */}
        {data.user.role === 'intern' && (
          <div className="p-6 rounded-xl border" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
            <h2 className="text-base font-semibold text-white mb-6">Internship Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="University"><input type="text" value={internForm.university} onChange={e => setInternForm({ ...internForm, university: e.target.value })} className={inputClass} /></Field>
              <Field label="Degree / Program"><input type="text" value={internForm.degree} onChange={e => setInternForm({ ...internForm, degree: e.target.value })} className={inputClass} /></Field>
              <Field label="Semester / Year"><input type="text" value={internForm.semester} onChange={e => setInternForm({ ...internForm, semester: e.target.value })} className={inputClass} /></Field>
              <Field label="CGPA"><input type="text" value={internForm.cgpa} onChange={e => setInternForm({ ...internForm, cgpa: e.target.value })} className={inputClass} /></Field>
              <Field label="Department"><input type="text" value={internForm.department} onChange={e => setInternForm({ ...internForm, department: e.target.value })} className={inputClass} /></Field>
              <Field label="Roll Number"><input type="text" value={internForm.roll_number} onChange={e => setInternForm({ ...internForm, roll_number: e.target.value })} className={inputClass} /></Field>
            </div>
          </div>
        )}

        {/* Mentor-specific */}
        {data.user.role === 'mentor' && (
          <div className="p-6 rounded-xl border" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
            <h2 className="text-base font-semibold text-white mb-6">Professional Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Department"><input type="text" value={mentorForm.department} onChange={e => setMentorForm({ ...mentorForm, department: e.target.value })} className={inputClass} /></Field>
              <Field label="Designation"><input type="text" value={mentorForm.designation} onChange={e => setMentorForm({ ...mentorForm, designation: e.target.value })} className={inputClass} /></Field>
              <Field label="Years of Experience"><input type="text" value={mentorForm.experience} onChange={e => setMentorForm({ ...mentorForm, experience: e.target.value })} className={inputClass} /></Field>
            </div>
          </div>
        )}

        <div className="flex gap-4 pb-8">
          <Link href="/profile" className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-300 border border-white/10 hover:bg-white/5 transition-colors">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 text-white disabled:opacity-50 transition-all"
            style={{ background: 'linear-gradient(135deg,#0ea5e9,#6366f1)', boxShadow: '0 4px 16px rgba(14,165,233,0.3)' }}
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
