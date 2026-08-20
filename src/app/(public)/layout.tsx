import React from 'react';
import SiteHeader from '@/app/components/SiteHeader';
import Footer from '@/app/components/Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow flex flex-col relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
