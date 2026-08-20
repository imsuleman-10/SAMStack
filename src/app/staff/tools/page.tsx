import React from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DocumentGenerator } from '@/components/DocumentGenerator';

export default function StaffToolsPage() {
  return (
    <div>
      <PageHeader
        title="Staff Tools"
        description="Manually generate and download Certificates and Offer Letters."
      />
      
      <DocumentGenerator />
    </div>
  );
}
