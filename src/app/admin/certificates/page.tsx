'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { UserAvatar } from '@/components/ui/UserAvatar';
import {
  Award, CheckCircle2, XCircle, Clock, Search, RefreshCw,
  Download, Filter, Eye, Loader2, FileCheck2, ChevronDown,
  Hash, GraduationCap, Building2, Calendar, Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { tracks } from '@/lib/curriculum';

type CertStatus = 'pending' | 'approved' | 'rejected';

interface CertRequest {
  intern_id: string;
  full_name: string;
  email: string | null;
  avatar_url: string | null;
  roll_number: string | null;
  track_selected: string | null;
  certificate_status: CertStatus;
  certificate_id: string | null;
  updated_at: string;
  university: string | null;
  department: string | null;
}

interface Summary { pending: number; approved: number; rejected: number }

const STATUS_CONFIG = {
  pending:  { label: 'Pending Review', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)',  icon: Clock },
  approved: { label: 'Approved',       color: '#10b981', bg: 'rgba(16,185,129,0.1)',   border: 'rgba(16,185,129,0.25)',   icon: CheckCircle2 },
  rejected: { label: 'Rejected',       color: '#ef4444', bg: 'rgba(239,68,68,0.1)',    border: 'rgba(239,68,68,0.25)',    icon: XCircle },
};

export default function AdminCertificatesPage() {
  const [requests, setRequests] = useState<CertRequest[]>([]);
  const [filtered, setFiltered] = useState<CertRequest[]>([]);
  const [summary, setSummary] = useState<Summary>({ pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CertStatus | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/certificates');
      if (!res.ok) throw new Error('Failed to load certificate requests');
      const data = await res.json();
      setRequests(data.requests || []);
      setSummary(data.summary || { pending: 0, approved: 0, rejected: 0 });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  useEffect(() => {
    let result = [...requests];
    if (statusFilter !== 'all') result = result.filter(r => r.certificate_status === statusFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r =>
        r.full_name.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q) ||
        r.roll_number?.toLowerCase().includes(q) ||
        r.university?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [requests, statusFilter, searchQuery]);

  const handleApprove = async (internId: string, name: string) => {
    if (!confirm(`Approve certificate for ${name}? A unique certificate ID will be generated.`)) return;
    setProcessingId(internId);
    try {
      const res = await fetch(`/api/admin/users/${internId}/certificate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Approval failed');
      toast.success(`✓ Certificate approved for ${name}`);
      setRequests(prev => prev.map(r =>
        r.intern_id === internId
          ? { ...r, certificate_status: 'approved', certificate_id: d.certificate_id || r.certificate_id }
          : r
      ));
      setSummary(prev => ({ ...prev, pending: prev.pending - 1, approved: prev.approved + 1 }));
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (internId: string, name: string) => {
    if (!confirm(`Reject certificate request for ${name}?`)) return;
    setProcessingId(internId);
    try {
      const res = await fetch(`/api/admin/users/${internId}/certificate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject' }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Rejection failed');
      toast.success(`Request rejected for ${name}`);
      setRequests(prev => prev.map(r =>
        r.intern_id === internId ? { ...r, certificate_status: 'rejected' } : r
      ));
      setSummary(prev => ({ ...prev, pending: prev.pending - 1, rejected: prev.rejected + 1 }));
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDownload = async (internId: string, name: string) => {
    try {
      const res = await fetch(`/api/admin/download?userId=${internId}&type=CERTIFICATE`);
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `Certificate_${name.replace(/\s+/g, '_')}.pdf`;
      a.click(); URL.revokeObjectURL(url);
    } catch (err: any) {
      toast.error(err.message || 'Download failed');
    }
  };

  // ─── Summary Cards ──────────────────────────────────────────────────────────
  const SummaryCard = ({ title, count, status, Icon, color, bg, border }: any) => (
    <button
      onClick={() => setStatusFilter(prev => prev === status ? 'all' : status)}
      className="relative p-5 rounded-2xl border text-left transition-all duration-200 hover:scale-[1.02] group overflow-hidden"
      style={{
        background: statusFilter === status ? bg : 'rgba(17,24,39,0.6)',
        borderColor: statusFilter === status ? border : 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: `radial-gradient(circle at 80% 20%, ${color}08 0%, transparent 60%)` }} />
      <div className="flex items-center justify-between mb-3">
        <div className="p-2.5 rounded-xl" style={{ background: bg, border: `1px solid ${border}` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        {statusFilter === status && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: color, color: '#000' }}>
            ACTIVE
          </span>
        )}
      </div>
      <p className="text-3xl font-black text-white mb-0.5">{count}</p>
      <p className="text-xs font-medium text-gray-400">{title}</p>
    </button>
  );

  return (
    <div>
      <PageHeader
        title="Certificate Management"
        description="Review and approve intern certificate requests. Each approved certificate gets a unique, verified ID."
      />

      {/* ── Summary Cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <SummaryCard title="Pending Review" count={summary.pending} status="pending"
          Icon={Clock} color="#f59e0b" bg="rgba(245,158,11,0.1)" border="rgba(245,158,11,0.25)" />
        <SummaryCard title="Approved" count={summary.approved} status="approved"
          Icon={CheckCircle2} color="#10b981" bg="rgba(16,185,129,0.1)" border="rgba(16,185,129,0.25)" />
        <SummaryCard title="Rejected" count={summary.rejected} status="rejected"
          Icon={XCircle} color="#ef4444" bg="rgba(239,68,68,0.1)" border="rgba(239,68,68,0.25)" />
      </div>

      {/* ── Toolbar ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, email, roll number, university..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl text-sm text-white placeholder-gray-500 outline-none focus:ring-2"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as CertStatus | 'all')}
            className="h-10 pl-9 pr-8 rounded-xl text-sm text-white outline-none appearance-none cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <option value="all" className="bg-gray-900">All Statuses</option>
            <option value="pending" className="bg-gray-900">Pending</option>
            <option value="approved" className="bg-gray-900">Approved</option>
            <option value="rejected" className="bg-gray-900">Rejected</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
        </div>
        <button
          onClick={fetchRequests}
          disabled={loading}
          className="h-10 px-4 rounded-xl text-sm font-medium text-gray-300 hover:text-white flex items-center gap-2 transition-colors"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* ── Table ─────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: 'rgba(17,24,39,0.6)', borderColor: 'rgba(255,255,255,0.08)' }}>
        {/* Header */}
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 border-b text-[11px] font-bold uppercase tracking-widest text-gray-500"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <span>Intern</span>
          <span>Track</span>
          <span>Requested</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center gap-3 text-gray-500">
            <Loader2 className="w-7 h-7 animate-spin" />
            <p className="text-sm">Loading requests...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-3 text-gray-500">
            <FileCheck2 className="w-10 h-10 text-gray-700" />
            <p className="font-semibold text-white">No requests found</p>
            <p className="text-sm">
              {searchQuery || statusFilter !== 'all' ? 'Try adjusting your filters.' : 'No certificate requests have been submitted yet.'}
            </p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            {filtered.map(req => {
              const sc = STATUS_CONFIG[req.certificate_status];
              const StatusIcon = sc.icon;
              const trackTitle = req.track_selected ? (tracks[req.track_selected]?.title || req.track_selected) : '—';
              const isProcessing = processingId === req.intern_id;
              const isExpanded = expandedId === req.intern_id;

              return (
                <div key={req.intern_id}>
                  {/* Main row */}
                  <div
                    className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 transition-colors hover:bg-white/[0.02] cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : req.intern_id)}
                  >
                    {/* Intern info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <UserAvatar src={req.avatar_url} name={req.full_name} size="sm" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{req.full_name}</p>
                        <p className="text-xs text-gray-500 truncate">{req.email}</p>
                      </div>
                    </div>

                    {/* Track */}
                    <div className="flex items-center">
                      <span className="text-xs font-medium text-gray-300 truncate">{trackTitle}</span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500">
                        {req.updated_at ? new Date(req.updated_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </span>
                    </div>

                    {/* Status badge */}
                    <div className="flex items-center">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold"
                        style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {sc.label}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                      {req.certificate_status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(req.intern_id, req.full_name)}
                            disabled={!!processingId}
                            className="h-8 px-3 rounded-lg text-xs font-bold text-emerald-400 hover:text-white hover:bg-emerald-500 flex items-center gap-1.5 transition-all disabled:opacity-40"
                            style={{ border: '1px solid rgba(16,185,129,0.3)' }}
                          >
                            {isProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(req.intern_id, req.full_name)}
                            disabled={!!processingId}
                            className="h-8 px-3 rounded-lg text-xs font-bold text-red-400 hover:text-white hover:bg-red-500 flex items-center gap-1.5 transition-all disabled:opacity-40"
                            style={{ border: '1px solid rgba(239,68,68,0.3)' }}
                          >
                            <XCircle className="w-3 h-3" />
                            Reject
                          </button>
                        </>
                      )}

                      {req.certificate_status === 'approved' && (
                        <button
                          onClick={() => handleDownload(req.intern_id, req.full_name)}
                          className="h-8 px-3 rounded-lg text-xs font-bold text-cyan-400 hover:text-white hover:bg-cyan-500/20 flex items-center gap-1.5 transition-all"
                          style={{ border: '1px solid rgba(34,211,238,0.3)' }}
                        >
                          <Download className="w-3 h-3" />
                          Download
                        </button>
                      )}

                      <Link
                        href={`/admin/users/${req.intern_id}`}
                        className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                        style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                        title="View Profile"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>

                      <ChevronDown
                        className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div
                      className="px-6 pb-5 pt-0 border-t"
                      style={{ background: 'rgba(0,0,0,0.2)', borderColor: 'rgba(255,255,255,0.05)' }}
                    >
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                        {[
                          { icon: Hash, label: 'Roll Number', value: req.roll_number || '—' },
                          { icon: Building2, label: 'University', value: req.university || '—' },
                          { icon: GraduationCap, label: 'Department', value: req.department || '—' },
                          { icon: Calendar, label: 'Request Date', value: req.updated_at ? new Date(req.updated_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '—' },
                        ].map(({ icon: Icon, label, value }) => (
                          <div key={label} className="flex items-start gap-2.5">
                            <div className="p-1.5 rounded-lg mt-0.5 shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
                              <Icon className="w-3.5 h-3.5 text-gray-500" />
                            </div>
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-0.5">{label}</p>
                              <p className="text-sm font-medium text-gray-200">{value}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {req.certificate_status === 'approved' && req.certificate_id && (
                        <div
                          className="mt-4 flex items-center gap-3 p-3 rounded-xl"
                          style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)' }}
                        >
                          <div className="p-2 rounded-lg" style={{ background: 'rgba(16,185,129,0.1)' }}>
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-0.5">Certificate ID</p>
                            <p className="text-sm font-black font-mono text-emerald-300 select-all tracking-wider">
                              {req.certificate_id}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="px-6 py-3 border-t flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <span className="text-xs text-gray-500">
              Showing <span className="text-white font-semibold">{filtered.length}</span> of{' '}
              <span className="text-white font-semibold">{requests.length}</span> requests
            </span>
            {statusFilter !== 'all' && (
              <button onClick={() => setStatusFilter('all')} className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                Clear filter
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
