import { MaintenanceGuard } from '@/components/MaintenanceGuard';

export default function CommentsLayout({ children }: { children: React.ReactNode }) {
  return <MaintenanceGuard>{children}</MaintenanceGuard>;
}
