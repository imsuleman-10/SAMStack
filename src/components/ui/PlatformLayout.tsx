import React from 'react';
import { Sidebar } from '@/components/ui/Sidebar';
import { getSession } from '@/lib/adminAuth';
import { redirect } from 'next/navigation';

export default async function PlatformLayout({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  if (allowedRoles && !allowedRoles.includes(session.role)) {
    redirect(`/${session.role === 'admin' ? 'admin' : session.role === 'staff' ? 'staff/dashboard' : session.role === 'intern' ? 'intern/dashboard' : session.role === 'mentor' ? 'mentor/dashboard' : 'dashboard'}`);
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0a0e1a' }}>
      <Sidebar role={session.role as any} userName={session.email || 'User'} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 md:p-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
