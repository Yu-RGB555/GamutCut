import { MaintenanceGuard } from '@/components/MaintenanceGuard';

export default function UsersLayout({ children }: { children: React.ReactNode }) {
  return <MaintenanceGuard>{children}</MaintenanceGuard>;
}
