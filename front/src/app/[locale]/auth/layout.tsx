import { MaintenanceGuard } from '@/components/MaintenanceGuard';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <MaintenanceGuard>{children}</MaintenanceGuard>;
}
