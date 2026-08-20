'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, Download, FileText, Award, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export function DocumentGenerator() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'certificate',
    fullName: '',
    identifier: '', // Certificate Number or Roll Number
    track: 'Frontend Development',
    date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
  });

  const generateIdentifier = (type: string) => {
    const randomHex = Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, '0');
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    if (type === 'certificate') {
      return `SAM-CERT-${randomHex}-${randomNum}`;
    } else {
      return `SAM-${randomHex}-${randomNum}`;
    }
  };

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      identifier: generateIdentifier(prev.type)
    }));
  }, [formData.type]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate document');
      }

      // Handle file download
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formData.type}_${formData.fullName.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success(`${formData.type === 'certificate' ? 'Certificate' : 'Offer Letter'} downloaded successfully!`);
    } catch (err: any) {
      toast.error(err.message || 'Error downloading document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 shadow-sm mt-6 transition-colors duration-300">
      <div className="mb-6 border-b border-[var(--border)] pb-4">
        <h2 className="text-xl font-bold text-[var(--foreground)] flex items-center gap-2">
          {formData.type === 'certificate' ? <Award className="w-5 h-5 text-brand-500" /> : <FileText className="w-5 h-5 text-brand-500" />}
          Manual Document Generator
        </h2>
        <p className="text-sm text-[var(--foreground)] opacity-70 mt-1">
          Generate an official Offer Letter or Certificate by manually entering the candidate's details.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">Document Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full h-10 px-3 rounded-lg text-sm bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] focus:ring-2 focus:ring-brand-500/50 outline-none transition-colors"
            >
              <option value="certificate">Certificate of Completion</option>
              <option value="offer_letter">Offer Letter</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">Candidate Full Name *</label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Muhammad Ali"
              className="w-full h-10 px-3 rounded-lg text-sm bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] focus:ring-2 focus:ring-brand-500/50 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5 flex justify-between items-center">
              <span>{formData.type === 'certificate' ? 'Certificate ID *' : 'Roll Number *'}</span>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, identifier: generateIdentifier(prev.type) }))}
                className="text-xs text-brand-500 hover:text-brand-600 flex items-center gap-1 transition-colors"
                title="Regenerate random ID"
              >
                <RefreshCw className="w-3 h-3" />
                Regenerate
              </button>
            </label>
            <input
              type="text"
              name="identifier"
              required
              value={formData.identifier}
              onChange={handleChange}
              placeholder={formData.type === 'certificate' ? 'e.g. SAM-CERT-1234' : 'e.g. SAM-A1B2-1234'}
              className="w-full h-10 px-3 rounded-lg text-sm bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] focus:ring-2 focus:ring-brand-500/50 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">Specialization Track *</label>
            <select
              name="track"
              required
              value={formData.track}
              onChange={handleChange}
              className="w-full h-10 px-3 rounded-lg text-sm bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] focus:ring-2 focus:ring-brand-500/50 outline-none transition-colors"
            >
              <option value="">-- Select Track --</option>
              <option value="Frontend Development">Frontend Development</option>
              <option value="Backend Development">Backend Development</option>
              <option value="Fullstack Development">Fullstack Development</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="App Development">App Development</option>
              <option value="AI & Machine Learning">AI &amp; Machine Learning</option>
              <option value="Data Science">Data Science</option>
              <option value="Cyber Security">Cyber Security</option>
              <option value="Python Development">Python Development</option>
              <option value="Graphic Design">Graphic Design</option>
              <option value="Digital Marketing">Digital Marketing</option>
              <option value="Social Media Marketing">Social Media Marketing</option>
              <option value="Human Resources">Human Resources</option>
              <option value="React Native">React Native</option>
              <option value="Flutter Development">Flutter Development</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">Date Issued *</label>
            <input
              type="text"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="w-full h-10 px-3 rounded-lg text-sm bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] focus:ring-2 focus:ring-brand-500/50 outline-none transition-colors"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-[var(--border)]">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all disabled:opacity-50 bg-brand-600 text-white hover:bg-brand-500 shadow-md"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Download {formData.type === 'certificate' ? 'Certificate' : 'Offer Letter'}
          </button>
        </div>
      </form>
    </div>
  );
}
