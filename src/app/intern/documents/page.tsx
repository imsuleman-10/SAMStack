'use client';
import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Download, FileText, Award, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function InternDocumentsPage() {
  const [loadingType, setLoadingType] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/intern/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile);
        }
      } catch (e) {
        console.error('Failed to load profile', e);
      } finally {
        setProfileLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleDownload = async (type: string) => {
    setLoadingType(type);
    try {
      const endpoint = type === 'offer_letter' ? '/api/user/documents/offer-letter' : '/api/user/documents/certificate';
      const res = await fetch(endpoint);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to download document');
      }
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Document downloaded successfully');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoadingType(null);
    }
  };

  const handleApplyCertificate = async () => {
    setApplying(true);
    try {
      const res = await fetch('/api/intern/documents/apply', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to apply');
      toast.success('Certificate requested successfully. An admin or your mentor will review it shortly.');
      setProfile((prev: any) => ({ ...prev, certificate_status: 'pending' }));
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div>
      <PageHeader title="My Documents" description="Download your official Offer Letter and Certificate." />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Offer Letter Card */}
        <div className="relative overflow-hidden p-8 rounded-2xl border bg-[#0a0a0a] transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/20 group"
          style={{ borderColor: 'rgba(59,130,246,0.15)' }}>
          <div className="absolute top-0 right-0 p-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none transition-all group-hover:bg-blue-500/10"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-5 border border-blue-500/20 shadow-inner">
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Offer Letter</h3>
            <p className="text-sm text-gray-400 mb-8 max-w-sm">
              Your official internship offer letter containing your roll number, track details, and terms.
            </p>
            
            <button
              onClick={() => handleDownload('offer_letter')}
              disabled={!!loadingType}
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
              style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.39)' }}
            >
              {loadingType === 'offer_letter' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Download Offer Letter
            </button>
          </div>
        </div>

        {/* Certificate Card */}
        <div className="relative overflow-hidden p-8 rounded-2xl border bg-[#0a0a0a] transition-all duration-300 hover:shadow-2xl group"
          style={{ 
            borderColor: profile?.certificate_status === 'approved' ? 'rgba(16,185,129,0.2)' 
                       : profile?.certificate_status === 'pending' ? 'rgba(245,158,11,0.15)' 
                       : 'rgba(255,255,255,0.05)',
            boxShadow: profile?.certificate_status === 'approved' ? '0 10px 30px -10px rgba(16,185,129,0.1)' : ''
          }}>
          
          <div className={`absolute top-0 right-0 p-32 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none transition-all
            ${profile?.certificate_status === 'approved' ? 'bg-emerald-500/5 group-hover:bg-emerald-500/10' : 
              profile?.certificate_status === 'pending' ? 'bg-amber-500/5 group-hover:bg-amber-500/10' : 
              'bg-white/5 group-hover:bg-white/10'}`}></div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 border shadow-inner transition-colors
              ${profile?.certificate_status === 'approved' ? 'bg-emerald-500/10 border-emerald-500/20' : 
                profile?.certificate_status === 'pending' ? 'bg-amber-500/10 border-amber-500/20' : 
                'bg-gray-800/50 border-gray-700'}`}>
              <Award className={`w-8 h-8 ${profile?.certificate_status === 'approved' ? 'text-emerald-400' : profile?.certificate_status === 'pending' ? 'text-amber-400' : 'text-gray-400'}`} />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">Certificate of Completion</h3>
            
            <div className="h-[48px] mb-8 flex items-center justify-center">
              <p className="text-sm text-gray-400 max-w-sm">
                {!profile?.certificate_status || profile?.certificate_status === 'rejected'
                  ? 'Request your official certificate once you have successfully completed all your assigned tasks.'
                  : profile?.certificate_status === 'pending'
                  ? 'Your certificate request is currently under review by our administration. Please check back later.'
                  : 'Congratulations! Your certificate has been approved and is ready to be downloaded.'}
              </p>
            </div>
            
            {/* Action Button Area */}
            <div className="w-full">
              {(!profile?.certificate_status || profile?.certificate_status === 'rejected') && (
                <button
                  onClick={handleApplyCertificate}
                  disabled={applying || profileLoading}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 4px 14px 0 rgba(245, 158, 11, 0.39)' }}
                >
                  {applying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Request Certificate
                </button>
              )}

              {profile?.certificate_status === 'pending' && (
                <div className="w-full py-3 rounded-xl text-sm font-bold text-amber-400 border border-amber-500/30 flex items-center justify-center gap-2"
                  style={{ background: 'rgba(245, 158, 11, 0.05)' }}>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                  Under Review
                </div>
              )}

              {(profile?.certificate_status === 'approved' || profile?.certificate_status === 'issued') && (
                <button
                  onClick={() => handleDownload('certificate')}
                  disabled={!!loadingType}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)' }}
                >
                  {loadingType === 'certificate' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  Download Certificate
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
