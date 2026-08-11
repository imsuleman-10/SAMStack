import PlatformLayout from '@/components/ui/PlatformLayout';

export default function MentorLayout({ children }: { children: React.ReactNode }) {
  return <PlatformLayout allowedRoles={['mentor', 'admin', 'staff']}>{children}</PlatformLayout>;
}
