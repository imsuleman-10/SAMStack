import PlatformLayout from '@/components/ui/PlatformLayout';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return <PlatformLayout allowedRoles={['staff', 'admin']}>{children}</PlatformLayout>;
}
