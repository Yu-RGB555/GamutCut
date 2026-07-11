import { MaintenanceGuard } from '@/components/MaintenanceGuard';

export default function MyPageSegmentLayout({ children }: { children: React.ReactNode }) {
  return <MaintenanceGuard>{children}</MaintenanceGuard>;
}
