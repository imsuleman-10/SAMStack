import React from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DocumentGenerator } from '@/components/DocumentGenerator';

export default function MentorToolsPage() {
  return (
    <div>
      <PageHeader
        title="Mentor Tools"
        description="Manually generate and download Certificates and Offer Letters for your interns."
      />
      
      <DocumentGenerator />
    </div>
  );
}
