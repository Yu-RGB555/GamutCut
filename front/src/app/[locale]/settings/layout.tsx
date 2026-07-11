import { MaintenanceGuard } from '@/components/MaintenanceGuard';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <MaintenanceGuard>{children}</MaintenanceGuard>;
}
