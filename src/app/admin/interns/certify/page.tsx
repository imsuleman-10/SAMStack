'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, Award, Download } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

import { tracks } from '@/lib/curriculum';

const trackList = Object.values(tracks);

export default function CertifyInternPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [lastCert, setLastCert] = useState('');
  const [lastRollNumber, setLastRollNumber] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    university: '',
    trackSelected: trackList[0].id,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/interns/certify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to certify intern');
      }

      setLastCert(data.certificateNumber);
      setLastRollNumber(data.intern.rollNumber);
      
      if (formData.email) {
        toast.success(`Certificate ${data.certificateNumber} generated & emailed to ${formData.email}!`, { duration: 6000 });
      } else {
        toast.success(`Certificate ${data.certificateNumber} generated for ${formData.fullName}!`, { duration: 6000 });
      }
      setFormData({ fullName: '', email: '', university: '', trackSelected: trackList[0].id });
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate certificate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Instant Certificate Generation"
        description="Add a past or current intern and instantly generate their completion certificate."
        breadcrumbs={[
          { label: 'Interns', href: '/admin/interns' },
          { label: 'Certify' },
        ]}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 rounded-xl border" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
          <h2 className="text-lg font-semibold text-white mb-6">Intern Details</h2>
          
          {lastCert && (
            <div className="p-4 mb-6 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 shrink-0 text-green-400" />
                <div>Last generated: <span className="font-bold font-mono">{lastCert}</span></div>
              </div>
              <button
                type="button"
                onClick={() => window.open(`/api/admin/download?rollNumber=${lastRollNumber}&type=CERTIFICATE`, '_blank')}
                className="flex items-center gap-2 px-3 py-1.5 rounded bg-green-500/20 hover:bg-green-500/30 transition-colors text-xs font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </button>
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
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Email Address (Optional)</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-lg text-sm text-white outline-none transition-all focus:ring-2"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1.5">University / Institute *</label>
              <input
                type="text"
                name="university"
                required
                value={formData.university}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-lg text-sm text-white outline-none transition-all focus:ring-2"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Track Selected *</label>
              <select
                name="trackSelected"
                required
                value={formData.trackSelected}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-lg text-sm text-white outline-none transition-all focus:ring-2"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {trackList.map(track => (
                  <option key={track.id} value={track.id} className="bg-gray-900">
                    {track.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Link
            href="/admin/interns"
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 border border-white/10"
          >
            Back to Interns
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg,#10b981,#059669)',
              color: '#fff',
              boxShadow: '0 4px 16px rgba(16,185,129,0.3)',
            }}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Generate Certificate
          </button>
        </div>
      </form>
    </div>
  );
}
