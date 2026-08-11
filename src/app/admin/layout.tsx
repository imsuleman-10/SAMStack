import PlatformLayout from '@/components/ui/PlatformLayout';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <PlatformLayout allowedRoles={['admin']}>{children}</PlatformLayout>;
}
