'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, GraduationCap, Star, Briefcase, UserCircle,
  Link2, Globe, Bell, Settings, LogOut, ChevronLeft, ChevronRight,
  ShieldCheck, FileText, MessageSquare, UserPlus, BarChart2, BookOpen,
  Users2,
} from 'lucide-react';
import type { UserRole } from '@/lib/firestore-schema';
import { UserAvatar } from './UserAvatar';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  admin: [
    { label: 'Dashboard',   href: '/admin',                    icon: LayoutDashboard },
    { label: 'Users',       href: '/admin/users',              icon: Users },
    { label: 'Interns',     href: '/admin/interns',            icon: GraduationCap },
    { label: 'Mentors',     href: '/admin/mentors',            icon: Star },
    { label: 'Staff',       href: '/admin/staff',              icon: Briefcase },
    { label: 'Members',     href: '/admin/members',            icon: Users2 },
    { label: 'Assignments', href: '/admin/mentor-assignments', icon: Link2 },
    { label: 'Community',   href: '/community',                icon: Globe },
    { label: 'Audit Logs',  href: '/admin/audit-logs',         icon: FileText },
    { label: 'Settings',    href: '/admin/settings',           icon: Settings },
  ],
  mentor: [
    { label: 'Dashboard',      href: '/mentor/dashboard',  icon: LayoutDashboard },
    { label: 'My Interns',     href: '/mentor/interns',    icon: GraduationCap },
    { label: 'Intern Directory', href: '/interns',         icon: Users },
    { label: 'Community',      href: '/community',         icon: Globe },
    { label: 'Profile',        href: '/profile',           icon: UserCircle },
    { label: 'Notifications',  href: '/notifications',     icon: Bell },
    { label: 'Settings',       href: '/settings',          icon: Settings },
  ],
  intern: [
    { label: 'Dashboard',     href: '/intern/dashboard', icon: LayoutDashboard },
    { label: 'My Mentor',     href: '/intern/mentor',    icon: Star },
    { label: 'Intern Directory', href: '/interns',       icon: Users },
    { label: 'Community',     href: '/community',        icon: Globe },
    { label: 'Profile',       href: '/profile',          icon: UserCircle },
    { label: 'Notifications', href: '/notifications',    icon: Bell },
    { label: 'Settings',      href: '/settings',         icon: Settings },
  ],
  staff: [
    { label: 'Dashboard',     href: '/staff/dashboard', icon: LayoutDashboard },
    { label: 'Users',         href: '/admin/users',     icon: Users },
    { label: 'Community',     href: '/community',       icon: Globe },
    { label: 'Profile',       href: '/profile',         icon: UserCircle },
    { label: 'Notifications', href: '/notifications',   icon: Bell },
    { label: 'Settings',      href: '/settings',        icon: Settings },
  ],
  member: [
    { label: 'Dashboard',     href: '/dashboard',    icon: LayoutDashboard },
    { label: 'Community',     href: '/community',    icon: Globe },
    { label: 'Directory',     href: '/interns',      icon: Users },
    { label: 'Profile',       href: '/profile',      icon: UserCircle },
    { label: 'Notifications', href: '/notifications',icon: Bell },
    { label: 'Settings',      href: '/settings',     icon: Settings },
  ],
  user: [
    { label: 'Dashboard',     href: '/dashboard',    icon: LayoutDashboard },
    { label: 'Community',     href: '/community',    icon: Globe },
    { label: 'Profile',       href: '/profile',      icon: UserCircle },
    { label: 'Notifications', href: '/notifications',icon: Bell },
    { label: 'Settings',      href: '/settings',     icon: Settings },
  ],
};

const ROLE_ACCENT: Record<UserRole, string> = {
  admin:  '#fbbf24',
  mentor: '#a78bfa',
  intern: '#22d3ee',
  staff:  '#34d399',
  member: '#fb923c',
  user:   '#94a3b8',
};

interface SidebarProps {
  role: UserRole;
  userName: string;
  userAvatar?: string | null;
  unreadCount?: number;
  onLogout?: () => void;
}

export function Sidebar({ role, userName, userAvatar, unreadCount = 0, onLogout }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const nav = NAV_BY_ROLE[role] ?? NAV_BY_ROLE.user;
  const accent = ROLE_ACCENT[role];

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    if (onLogout) onLogout();
    else window.location.href = '/login';
  };

  return (
    <aside
      className="flex flex-col h-screen sticky top-0 transition-all duration-300 shrink-0"
      style={{
        width: collapsed ? 64 : 240,
        background: 'rgba(10,14,26,0.96)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Logo / Brand */}
      <div
        className="flex items-center gap-3 px-4 h-16 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0"
          style={{ background: `linear-gradient(135deg, ${accent}, ${accent}99)`, color: '#fff' }}
        >
          S
        </div>
        {!collapsed && (
          <span className="font-bold text-white text-sm tracking-wide whitespace-nowrap">SAMStack</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-gray-500 hover:text-gray-300 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {nav.map(item => {
          const active = pathname === item.href || (item.href !== '/admin' && item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative"
              style={{
                color: active ? '#fff' : '#64748b',
                background: active ? `linear-gradient(90deg, ${accent}22, ${accent}11)` : 'transparent',
                borderLeft: active ? `3px solid ${accent}` : '3px solid transparent',
              }}
            >
              <Icon
                className="w-4 h-4 shrink-0 transition-colors"
                style={{ color: active ? accent : undefined }}
              />
              {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
              {!collapsed && item.label === 'Notifications' && unreadCount > 0 && (
                <span
                  className="ml-auto text-xs font-bold rounded-full px-1.5 py-0.5"
                  style={{ background: accent, color: '#000', minWidth: 18, textAlign: 'center' }}
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div
        className="shrink-0 px-2 py-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className={`flex items-center gap-2.5 px-2 py-2 rounded-lg ${collapsed ? 'justify-center' : ''}`}>
          <UserAvatar src={userAvatar} name={userName} size="sm" />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{userName}</p>
              <p className="text-xs capitalize" style={{ color: accent }}>{role}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            title="Sign out"
            className="text-gray-600 hover:text-red-400 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
