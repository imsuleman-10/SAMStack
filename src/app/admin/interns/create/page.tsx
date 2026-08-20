'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CreateInternPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    gender: 'Male',
    track: 'Web Development',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/interns/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create intern');
      }

      toast.success('Intern created successfully. Offer letter sent!');
      router.push('/admin/interns');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Add Intern"
        description="Manually create an intern account. This will trigger the auto-assignment and offer letter process."
        breadcrumbs={[
          { label: 'Interns', href: '/admin/interns' },
          { label: 'Add Intern' },
        ]}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 rounded-xl border" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
          <h2 className="text-lg font-semibold text-white mb-6">Intern Details</h2>
          
          {error && (
            <div className="p-3 mb-6 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Full Name *</label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-lg text-sm text-white outline-none transition-all focus:ring-2"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Email Address *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-lg text-sm text-white outline-none transition-all focus:ring-2"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Temporary Password *</label>
              <input
                type="text"
                name="password"
                required
                minLength={8}
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 8 characters"
                className="w-full h-10 px-3 rounded-lg text-sm text-white outline-none transition-all focus:ring-2"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Gender *</label>
              <select
                name="gender"
                required
                value={formData.gender}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-lg text-sm text-white outline-none transition-all focus:ring-2"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <option value="Male" className="bg-gray-900">Male</option>
                <option value="Female" className="bg-gray-900">Female</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Track / Department *</label>
              <select
                name="track"
                required
                value={formData.track}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-lg text-sm text-white outline-none transition-all focus:ring-2"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <option value="Frontend Development" className="bg-gray-900">Frontend Development</option>
                <option value="Backend Development" className="bg-gray-900">Backend Development</option>
                <option value="Fullstack Development" className="bg-gray-900">Fullstack Development</option>
                <option value="UI/UX Design" className="bg-gray-900">UI/UX Design</option>
                <option value="App Development" className="bg-gray-900">App Development</option>
                <option value="AI & Machine Learning" className="bg-gray-900">AI & Machine Learning</option>
                <option value="Data Science" className="bg-gray-900">Data Science</option>
                <option value="Cyber Security" className="bg-gray-900">Cyber Security</option>
                <option value="Python Development" className="bg-gray-900">Python Development</option>
                <option value="Graphic Design" className="bg-gray-900">Graphic Design</option>
                <option value="Digital Marketing" className="bg-gray-900">Digital Marketing</option>
                <option value="Social Media Marketing" className="bg-gray-900">Social Media Marketing</option>
                <option value="Human Resources" className="bg-gray-900">Human Resources</option>
                <option value="React Native" className="bg-gray-900">React Native</option>
                <option value="Flutter Development" className="bg-gray-900">Flutter Development</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Link
            href="/admin/interns"
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 border border-white/10"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg,#0ea5e9,#6366f1)',
              color: '#fff',
              boxShadow: '0 4px 16px rgba(14,165,233,0.3)',
            }}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Add Intern
          </button>
        </div>
      </form>
    </div>
  );
}
