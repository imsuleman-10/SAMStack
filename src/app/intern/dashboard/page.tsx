'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Star, FileText, Bell, Globe, Award, Loader2, CheckCircle2, AlertCircle, ArrowRight, Lock, Trophy, CircleDashed, Clock } from 'lucide-react';
import Link from 'next/link';
import { tracks } from '@/lib/curriculum';

interface QuickLinkCardProps {
  href: string;
  icon: any;
  title: string;
  desc: string;
  color: string;
  locked?: boolean;
}

const QuickLinkCard = ({ href, icon: Icon, title, desc, color, locked }: QuickLinkCardProps) => (
  <Link 
    href={locked ? '#' : href}
    className={`p-6 rounded-xl border block transition-all duration-300 relative overflow-hidden group ${
      locked ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1 hover:shadow-lg'
    }`} 
    style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}
  >
    {locked && (
      <div className="absolute top-3 right-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
        <Lock className="w-2.5 h-2.5" /> Locked
      </div>
    )}
    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ background: `${color}15` }}>
      <Icon className="w-6 h-6" style={{ color }} />
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-sm text-gray-400">{desc}</p>
  </Link>
);

function checkIsProfileComplete(user: any, intern: any) {
  if (!user || !intern) return false;
  return !!(
    user.full_name &&
    user.bio &&
    user.city &&
    user.skills && user.skills.length > 0 &&
    (user.social_links?.linkedin || user.social_links?.github) &&
    user.phone &&
    user.avatar_url &&
    intern.university &&
    intern.department &&
    intern.semester
  );
}

function getProfileCompletionPercentage(user: any, intern: any) {
  if (!user) return 0;
  const fields = [
    { done: !!user.full_name },
    { done: !!user.bio },
    { done: !!user.city },
    { done: Array.isArray(user.skills) && user.skills.length > 0 },
    { done: !!(user.social_links?.linkedin || user.social_links?.github) },
    { done: !!user.phone },
    { done: !!user.avatar_url },
  ];

  if (intern) {
    fields.push(
      { done: !!intern.university },
      { done: !!intern.department },
      { done: !!intern.semester },
    );
  }

  const done = fields.filter(f => f.done).length;
  return Math.round((done / fields.length) * 100);
}

export default function InternDashboardPage() {
  const [profileData, setProfileData] = useState<any>(null);
  const [taskTrack, setTaskTrack] = useState<string | null>(null);
  const [submissionsMap, setSubmissionsMap] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const profileRes = await fetch('/api/profile');
        if (!profileRes.ok) throw new Error('Failed to load profile');
        const profileJson = await profileRes.json();
        setProfileData(profileJson);

        const isComplete = checkIsProfileComplete(profileJson.user, profileJson.internProfile);
        if (isComplete) {
          const tasksRes = await fetch('/api/intern/tasks');
          if (tasksRes.ok) {
            // Safe parse — avoids crash on empty-body responses
            const text = await tasksRes.text();
            const tasksJson = text ? (() => { try { return JSON.parse(text); } catch { return {}; } })() : {};
            setTaskTrack(tasksJson.track || null);
            setSubmissionsMap(tasksJson.submissionsMap || {});
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-cyan-400" />
        <p className="text-sm">Loading your dashboard...</p>
      </div>
    );
  }

  const user = profileData?.user;
  const intern = profileData?.internProfile;
  const isComplete = checkIsProfileComplete(user, intern);
  const pct = getProfileCompletionPercentage(user, intern);

  const checklist = profileData && user ? [
    { label: 'Full Name', done: !!user.full_name },
    { label: 'Bio / Introduction', done: !!user.bio },
    { label: 'City', done: !!user.city },
    { label: 'Skills Added', done: Array.isArray(user.skills) && user.skills.length > 0 },
    { label: 'LinkedIn or GitHub', done: !!(user.social_links?.linkedin || user.social_links?.github) },
    { label: 'Phone Number', done: !!user.phone },
    { label: 'Profile Picture', done: !!user.avatar_url },
    { label: 'University Name', done: !!intern?.university },
    { label: 'Academic Department', done: !!intern?.department },
    { label: 'Current Semester', done: !!intern?.semester },
  ] : [];

  const barColor = pct === 100 ? '#10b981' : pct >= 50 ? '#06b6d4' : '#f59e0b';

  return (
    <div className="space-y-8">
      <PageHeader
        title="Intern Dashboard"
        description="Welcome to your workspace. Access your mentorship, tasks, and the community."
      />

      {/* Grid: Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <QuickLinkCard 
          href="/intern/mentor" 
          icon={Star} 
          title="My Mentor" 
          desc="View your assigned mentor and connect." 
          color="#a78bfa" 
        />
        <QuickLinkCard 
          href="/community" 
          icon={Globe} 
          title="Community Feed" 
          desc="Connect with other interns and mentors." 
          color="#3b82f6" 
        />
        <QuickLinkCard 
          href="/profile" 
          icon={FileText} 
          title="My Profile" 
          desc="Update your professional details and resume." 
          color="#10b981" 
        />
        <QuickLinkCard 
          href="/intern/tasks" 
          icon={FileText} 
          title="My Submissions" 
          desc="Submit your work and GitHub repo links." 
          color="#ef4444"
          locked={!isComplete}
        />
        <QuickLinkCard 
          href="/intern/documents" 
          icon={Award} 
          title="My Documents" 
          desc="Download your Offer Letter and Certificate." 
          color="#10b981" 
        />
        <QuickLinkCard 
          href="/notifications" 
          icon={Bell} 
          title="Notifications" 
          desc="Check your latest updates and alerts." 
          color="#f59e0b" 
        />
      </div>

      {/* Conditional Tasks / Profile Completion Section */}
      {!isComplete ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Incomplete Callout */}
          <div className="lg:col-span-2 p-8 rounded-2xl border flex flex-col justify-between" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-yellow-500">
                <AlertCircle className="w-6 h-6" />
                <h3 className="text-xl font-bold text-white">Unlock Your Tasks</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed max-w-xl">
                To access your internship tasks and start submitting your project links, you must complete your profile (100%). Currently, your profile is at <strong>{pct}%</strong>. Please update the missing information.
              </p>
            </div>
            
            <div className="mt-8">
              <Link 
                href="/profile" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-all hover:scale-[1.02] shadow-lg shadow-cyan-400/20"
              >
                Complete Profile Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Checklist Widget */}
          <div className="p-6 rounded-2xl border" style={{ background: 'rgba(17,24,39,0.65)', borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-white">Completion Progress</span>
              <span className="text-sm font-bold" style={{ color: barColor }}>{pct}%</span>
            </div>
            
            <div className="w-full h-2 rounded-full mb-6" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div
                className="h-2 rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: barColor }}
              />
            </div>

            <ul className="space-y-2.5">
              {checklist.map(item => (
                <li key={item.label} className="flex items-center gap-2.5 text-xs">
                  {item.done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-gray-600 shrink-0 flex items-center justify-center text-[10px] text-gray-500 font-mono">•</span>
                  )}
                  <span className={item.done ? 'text-gray-300' : 'text-gray-500 font-medium'}>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        /* Mini Projects Progress Section for Complete Profiles */
        (() => {
          const trackInfo = taskTrack ? tracks[taskTrack] : null;
          const taskList = trackInfo?.tasks || [];
          const TOTAL = 5;
          const REQUIRED = 4;
          const completedCount = taskList.filter(
            (t: any) => submissionsMap[t.id]?.status === 'completed'
          ).length;
          const reviewingCount = taskList.filter(
            (t: any) => submissionsMap[t.id]?.status === 'reviewing'
          ).length;
          const submittedCount = taskList.filter((t: any) => !!submissionsMap[t.id]).length;
          const progressPct = trackInfo ? Math.round((completedCount / TOTAL) * 100) : 0;
          const isRequirementMet = completedCount >= REQUIRED;
          const barColor = isRequirementMet ? '#10b981' : completedCount >= 2 ? '#06b6d4' : '#f59e0b';

          return (
            <div className="p-6 rounded-2xl border" style={{ background: 'rgba(17,24,39,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>
              {/* Header */}
              <div className="flex items-center justify-between mb-5 pb-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: isRequirementMet ? 'rgba(16,185,129,0.12)' : 'rgba(6,182,212,0.1)' }}>
                    <Trophy className="w-4 h-4" style={{ color: isRequirementMet ? '#10b981' : '#06b6d4' }} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Mini Projects</h2>
                    <p className="text-xs text-gray-500">{REQUIRED} of {TOTAL} required to complete</p>
                  </div>
                </div>
                <Link
                  href="/intern/tasks"
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
                >
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {!trackInfo ? (
                <div className="py-6 text-center">
                  <AlertCircle className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Track not assigned yet.</p>
                  <p className="text-xs text-gray-600 mt-1">An admin will assign your internship track.</p>
                </div>
              ) : (
                <>
                  {/* Counts row */}
                  <div className="flex items-center gap-6 mb-4">
                    <div>
                      <p className="text-2xl font-black" style={{ color: barColor }}>{completedCount}/{TOTAL}</p>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500">Completed</p>
                    </div>
                    {reviewingCount > 0 && (
                      <div>
                        <p className="text-2xl font-black text-yellow-400">{reviewingCount}</p>
                        <p className="text-[10px] uppercase tracking-widest text-gray-500">Reviewing</p>
                      </div>
                    )}
                    <div>
                      <p className="text-2xl font-black text-gray-400">{TOTAL - submittedCount}</p>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500">Remaining</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full mb-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${progressPct}%`, background: barColor }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-600">{trackInfo.title}</span>
                    {isRequirementMet ? (
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Requirement met!
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-500">{REQUIRED - completedCount} more needed</span>
                    )}
                  </div>

                  {/* Task pills */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {taskList.map((t: any) => {
                      const sub = submissionsMap[t.id];
                      const s = sub?.status || 'not_started';
                      return (
                        <span
                          key={t.id}
                          title={t.title}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border ${
                            s === 'completed'
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                              : s === 'reviewing'
                              ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                              : 'bg-white/3 border-white/8 text-gray-600'
                          }`}
                        >
                          {s === 'completed' ? <CheckCircle2 className="w-3 h-3" /> : s === 'reviewing' ? <Clock className="w-3 h-3" /> : <CircleDashed className="w-3 h-3" />}
                          {t.id}
                        </span>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          );
        })()
      )}
    </div>
  );
}
