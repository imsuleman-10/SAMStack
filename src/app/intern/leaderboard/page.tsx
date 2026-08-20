"use client";

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { Trophy, Medal, Star, Filter, Loader2, Search } from 'lucide-react';

interface LeaderboardEntry {
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  track: string;
  completed_tasks: number;
  reviewing_tasks: number;
  score: number;
  rank: number;
}

export default function InternLeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [trackFilter, setTrackFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch('/api/intern/leaderboard');
        if (res.ok) {
          const data = await res.json();
          setEntries(data.leaderboard || []);
          setMyRank(data.myRank || null);
        }
      } catch (err) {
        console.error("Failed to load leaderboard:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  // Compute filtered entries on the client
  const filteredEntries = entries.filter(e => {
    const matchesTrack = trackFilter === 'ALL' || e.track === trackFilter;
    const matchesSearch = e.full_name.toLowerCase().includes(search.toLowerCase());
    return matchesTrack && matchesSearch;
  });

  const tracks = Array.from(new Set(entries.map(e => e.track))).filter(Boolean).sort();

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader 
        title="Intern Leaderboard" 
      />

      {/* Stats / My Rank Banner */}
      {!loading && myRank && (
        <div className="glass-card rounded-2xl p-6 border-cyan-500/30 relative overflow-hidden flex flex-col sm:flex-row items-center gap-6">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent pointer-events-none" />
          <div className="w-20 h-20 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            {myRank.rank === 1 ? <Trophy className="w-10 h-10 text-yellow-400" /> : 
             myRank.rank === 2 ? <Medal className="w-10 h-10 text-slate-300" /> : 
             myRank.rank === 3 ? <Medal className="w-10 h-10 text-orange-400" /> : 
             <Star className="w-10 h-10 text-cyan-400" />}
          </div>
          <div className="flex-1 text-center sm:text-left z-10">
            <h2 className="text-xl font-bold text-white mb-1">Your Standing</h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm">
              <span className="text-slate-300">Global Rank: <strong className="text-cyan-400 text-lg">#{myRank.rank}</strong></span>
              <span className="w-1 h-1 rounded-full bg-slate-600 hidden sm:block" />
              <span className="text-slate-300">Score: <strong className="text-white text-lg">{myRank.score}</strong></span>
              <span className="w-1 h-1 rounded-full bg-slate-600 hidden sm:block" />
              <span className="text-slate-300">Completed Tasks: <strong className="text-white">{myRank.completed_tasks}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between glass-card p-4 rounded-xl">
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search interns..." 
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select 
            className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 w-full sm:w-auto"
            value={trackFilter}
            onChange={e => setTrackFilter(e.target.value)}
          >
            <option value="ALL">All Tracks</option>
            {tracks.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/40 text-xs uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4 font-medium">Rank</th>
                <th className="px-6 py-4 font-medium">Intern</th>
                <th className="px-6 py-4 font-medium hidden sm:table-cell">Track</th>
                <th className="px-6 py-4 font-medium text-right">Tasks Done</th>
                <th className="px-6 py-4 font-medium text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-500" />
                    Loading leaderboard...
                  </td>
                </tr>
              ) : filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No interns found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => {
                  const isTop3 = entry.rank <= 3;
                  const isMe = myRank && entry.user_id === myRank.user_id;

                  return (
                    <tr 
                      key={entry.user_id} 
                      className={`
                        transition-colors hover:bg-slate-800/30 group
                        ${isMe ? 'bg-cyan-900/20' : ''}
                      `}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`
                            w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                            ${entry.rank === 1 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.2)]' : 
                              entry.rank === 2 ? 'bg-slate-300/20 text-slate-300 border border-slate-300/50' : 
                              entry.rank === 3 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' : 
                              'bg-slate-800 text-slate-400'}
                          `}>
                            {entry.rank}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <UserAvatar src={entry.avatar_url} name={entry.full_name} size="sm" />
                          <div>
                            <div className={`font-medium ${isMe ? 'text-cyan-400' : 'text-slate-200'}`}>
                              {entry.full_name} {isMe && "(You)"}
                            </div>
                            <div className="text-xs text-slate-500 sm:hidden">{entry.track}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                          {entry.track}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-slate-300 font-medium">{entry.completed_tasks}</span>
                        {entry.reviewing_tasks > 0 && (
                          <span className="text-xs text-slate-500 ml-1" title="Under Review">
                            (+{entry.reviewing_tasks} ⏳)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`
                          font-bold text-lg
                          ${isTop3 ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500' : 'text-slate-300'}
                        `}>
                          {entry.score}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
