'use client';

import { useEffect, useState } from 'react';
import type { PlatformUser, InternProfile, MentorProfile } from '@/lib/firestore-schema';

export function useAuth() {
  const [user, setUser] = useState<PlatformUser | null>(null);
  const [internProfile, setInternProfile] = useState<InternProfile | null>(null);
  const [mentorProfile, setMentorProfile] = useState<MentorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setInternProfile(data.internProfile);
          setMentorProfile(data.mentorProfile);
        } else {
          setUser(null);
          setInternProfile(null);
          setMentorProfile(null);
        }
      } catch (err) {
        setUser(null);
        setInternProfile(null);
        setMentorProfile(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return { user, internProfile, mentorProfile, loading };
}
