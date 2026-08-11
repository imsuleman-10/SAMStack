import React from 'react';
import SiteHeader from '@/app/components/SiteHeader';
import Footer from '@/app/components/Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="flex-grow flex flex-col relative z-10">
        {children}
      </main>
      <Footer />
    </>
  );
}
