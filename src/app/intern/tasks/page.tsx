'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  Loader2,
  CheckCircle2,
  Link as LinkIcon,
  Clock,
  CircleDashed,
  ArrowRight,
  Trophy,
  AlertCircle,
  X,
  Send,
} from 'lucide-react';
import { tracks, Task } from '@/lib/curriculum';
import Link from 'next/link';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Submission {
  id: string;
  task_id: string;
  title?: string;
  status: 'reviewing' | 'completed' | 'pending';
  submission_link: string;
  updated_at: string;
  mentor_feedback?: string;
}

// ─── Status helpers ───────────────────────────────────────────────────────────

const STATUS_REQUIRED = 4;
const TOTAL_TASKS = 5;

function StatusBadge({ status }: { status: string }) {
  if (status === 'completed')
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
        <CheckCircle2 className="w-3 h-3" /> Completed
      </span>
    );
  if (status === 'reviewing')
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
        <Clock className="w-3 h-3" /> Reviewing
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase bg-gray-500/10 border border-gray-500/20 text-gray-500">
      <CircleDashed className="w-3 h-3" /> Not Started
    </span>
  );
}

// ─── Submit Modal ─────────────────────────────────────────────────────────────

interface SubmitModalProps {
  task: Task;
  existing?: Submission;
  onClose: () => void;
  onSuccess: () => void;
}

function SubmitModal({ task, existing, onClose, onSuccess }: SubmitModalProps) {
  const [link, setLink] = useState(existing?.submission_link || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/intern/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: task.id, title: task.title, submissionLink: link }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div
        className="w-full max-w-lg rounded-2xl border shadow-2xl"
        style={{ background: '#0f1724', borderColor: 'rgba(255,255,255,0.1)' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div>
            <p className="text-xs text-cyan-400 font-mono mb-1">{task.id}</p>
            <h3 className="text-white font-bold text-lg leading-snug">{task.title}</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors mt-1 shrink-0 ml-4">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 text-sm text-gray-400 leading-relaxed">
            <p className="font-semibold text-gray-300 mb-1">Scope</p>
            <p>{task.scope}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              GitHub Repository Link <span className="text-red-400">*</span>
            </label>
            <input
              type="url"
              required
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://github.com/yourusername/repo"
              className="w-full h-11 px-4 rounded-xl text-sm text-white outline-none bg-white/5 border border-white/10 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50 transition-all"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-all hover:scale-[1.02] shadow-lg shadow-cyan-400/20 disabled:opacity-50 disabled:scale-100"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {existing ? 'Update Submission' : 'Submit Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Task Card ────────────────────────────────────────────────────────────────

interface TaskCardProps {
  index: number;
  task: Task;
  submission?: Submission;
  onSubmit: (task: Task) => void;
}

function TaskCard({ index, task, submission, onSubmit }: TaskCardProps) {
  const status = submission?.status || 'not_started';

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all duration-300 hover:border-white/15 group"
      style={{ background: 'rgba(17,24,39,0.6)', borderColor: 'rgba(255,255,255,0.07)' }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
      >
        <div className="flex items-center gap-3">
          <span
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
            style={{
              background: status === 'completed' ? 'rgba(16,185,129,0.12)' : 'rgba(6,182,212,0.08)',
              color: status === 'completed' ? '#10b981' : '#06b6d4',
            }}
          >
            {index + 1}
          </span>
          <span className="text-[11px] font-mono text-gray-500">{task.id}</span>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-white font-semibold text-base mb-3 leading-snug">{task.title}</h3>

        <div className="space-y-2 mb-5">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-gray-600 font-semibold">Scope</span>
            <p className="text-sm text-gray-400 mt-1 leading-relaxed">{task.scope}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-gray-600 font-semibold">Criteria</span>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{task.criteria}</p>
          </div>
        </div>

        {/* Feedback */}
        {submission?.mentor_feedback && (
          <div className="mb-4 p-3 rounded-xl bg-blue-500/8 border border-blue-500/15 text-blue-300 text-xs leading-relaxed">
            <p className="font-semibold text-blue-400 mb-1">Mentor Feedback</p>
            {submission.mentor_feedback}
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between gap-3">
          {submission ? (
            <a
              href={submission.submission_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <LinkIcon className="w-3.5 h-3.5" /> View Submission
            </a>
          ) : (
            <span />
          )}

          {status !== 'completed' && (
            <button
              onClick={() => onSubmit(task)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg transition-all text-slate-900 bg-cyan-400 hover:bg-cyan-300 hover:scale-[1.02] shadow-md shadow-cyan-400/10"
            >
              {submission ? 'Update Link' : 'Submit Link'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Track Selection View ──────────────────────────────────────────────────────

function TrackSelectionView({ onTrackSaved }: { onTrackSaved: () => void }) {
  const [selectedTrack, setSelectedTrack] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!selectedTrack) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          internProfile: { track_selected: selectedTrack }
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to save track');
      }
      onTrackSaved();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="My Tasks"
        description="Complete your internship mini-projects and submit GitHub links."
      />
      <div className="p-8 rounded-2xl border text-center max-w-xl mx-auto mt-10 bg-neutral-900/60 shadow-xl" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/15 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <AlertCircle className="w-8 h-8 text-blue-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-3">Select Your Internship Track</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-6">
          You haven't selected an internship track yet. Please select your desired specialization below to view your required mini-projects.
        </p>

        <div className="text-left mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Internship Track</label>
          <select
            value={selectedTrack}
            onChange={(e) => setSelectedTrack(e.target.value)}
            className="w-full h-11 px-4 rounded-xl text-sm text-white outline-none bg-white/5 border border-white/10 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50 transition-all"
          >
            <option value="" className="bg-gray-900" disabled>— Select a track —</option>
            {Object.values(tracks).map(t => (
              <option key={t.id} value={t.id} className="bg-gray-900">{t.title}</option>
            ))}
          </select>
        </div>

        {error && (
          <div className="p-3 mb-6 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-left">
            {error}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving || !selectedTrack}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-all hover:scale-[1.02] shadow-lg shadow-cyan-400/20 disabled:opacity-50 disabled:scale-100"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
          {saving ? 'Saving...' : 'Save Track & View Tasks'}
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function InternTasksPage() {
  const [track, setTrack] = useState<string | null>(null);
  const [submissionsMap, setSubmissionsMap] = useState<Record<string, Submission>>({});
  const [loading, setLoading] = useState(true);
  const [profileIncomplete, setProfileIncomplete] = useState(false);
  const [activeModal, setActiveModal] = useState<Task | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/intern/tasks');
      const text = await res.text();
      const data = text ? (() => { try { return JSON.parse(text); } catch { return {}; } })() : {};

      if (res.status === 403) {
        if (data.profileIncomplete) {
          setProfileIncomplete(true);
          return;
        }
      }
      if (!res.ok) throw new Error(data.error || 'Failed to fetch tasks');
      setTrack(data.track || null);
      setSubmissionsMap(data.submissionsMap || {});
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ── Profile Incomplete Gate ────────────────────────────────────────────────
  if (profileIncomplete) {
    return (
      <div>
        <PageHeader
          title="My Tasks"
          description="Complete your internship mini-projects and submit GitHub links."
        />
        <div className="p-8 rounded-2xl border text-center max-w-2xl mx-auto mt-10 bg-neutral-900/60 border-yellow-500/20 shadow-xl">
          <div className="w-16 h-16 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl">
            ⚠️
          </div>
          <h2 className="text-xl font-bold text-white mb-3">Profile Incomplete</h2>
          <p className="text-gray-400 mb-2 text-sm leading-relaxed">
            You must complete your profile to <strong className="text-white">100%</strong> before you can view
            your assigned tasks or submit any work.
          </p>
          <p className="text-gray-500 text-xs mb-7">
            Please fill out all required fields — name, bio, city, skills, social links, phone, profile picture,
            university, department, and semester.
          </p>
          <Link
            href="/profile"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-lg shadow-cyan-400/20"
          >
            Complete My Profile <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="py-24 text-center text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-cyan-400" />
        <p className="text-sm">Loading your tasks...</p>
      </div>
    );
  }

  // ── No track assigned ─────────────────────────────────────────────────────
  if (!track || !tracks[track]) {
    return (
      <TrackSelectionView onTrackSaved={fetchData} />
    );
  }

  // ── Track data ─────────────────────────────────────────────────────────────
  const trackInfo = tracks[track];
  const taskList = trackInfo.tasks;

  const completedCount = taskList.filter(
    (t) => submissionsMap[t.id]?.status === 'completed'
  ).length;

  const reviewingCount = taskList.filter(
    (t) => submissionsMap[t.id]?.status === 'reviewing'
  ).length;

  const submittedCount = taskList.filter((t) => !!submissionsMap[t.id]).length;

  const progressPct = Math.round((completedCount / TOTAL_TASKS) * 100);
  const isRequirementMet = completedCount >= STATUS_REQUIRED;

  const barColor = isRequirementMet
    ? '#10b981'
    : completedCount >= 2
    ? '#06b6d4'
    : '#f59e0b';

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Tasks"
        description={`${trackInfo.title} — Complete at least ${STATUS_REQUIRED} of ${TOTAL_TASKS} projects.`}
      />

      {/* ── Mini Projects Progress Banner ──────────────────────────────────── */}
      <div
        className="p-6 rounded-2xl border"
        style={{ background: 'rgba(17,24,39,0.7)', borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: isRequirementMet ? 'rgba(16,185,129,0.12)' : 'rgba(6,182,212,0.1)' }}
            >
              <Trophy className="w-5 h-5" style={{ color: isRequirementMet ? '#10b981' : '#06b6d4' }} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Mini Projects Progress</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {STATUS_REQUIRED} projects required to complete your internship track
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-right shrink-0">
            <div className="text-center">
              <p className="text-2xl font-black" style={{ color: barColor }}>
                {completedCount}/{TOTAL_TASKS}
              </p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Completed</p>
            </div>
            {reviewingCount > 0 && (
              <div className="text-center">
                <p className="text-2xl font-black text-yellow-400">{reviewingCount}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Reviewing</p>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div
            className="h-2.5 rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%`, background: barColor }}
          />
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-[11px] text-gray-600">
            {submittedCount} submitted · {completedCount} approved
          </span>
          {isRequirementMet ? (
            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Requirement met!
            </span>
          ) : (
            <span className="text-[11px] text-gray-500">
              {STATUS_REQUIRED - completedCount} more needed
            </span>
          )}
        </div>
      </div>

      {/* ── Track Info ─────────────────────────────────────────────────────── */}
      <div
        className="px-5 py-4 rounded-xl border text-sm text-gray-400 leading-relaxed"
        style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
      >
        <span className="font-semibold text-gray-300">{trackInfo.title}: </span>
        {trackInfo.desc}
      </div>

      {/* ── Task Grid ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {taskList.map((task, i) => (
          <TaskCard
            key={task.id}
            index={i}
            task={task}
            submission={submissionsMap[task.id]}
            onSubmit={setActiveModal}
          />
        ))}
      </div>

      {/* ── Submit Modal ───────────────────────────────────────────────────── */}
      {activeModal && (
        <SubmitModal
          task={activeModal}
          existing={submissionsMap[activeModal.id]}
          onClose={() => setActiveModal(null)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}
