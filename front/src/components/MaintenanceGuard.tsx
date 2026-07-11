import { isMaintenanceMode } from '@/lib/maintenance';
import { MaintenancePage } from '@/components/MaintenancePage';

/**
 * メンテナンスモード中は配下のページを MaintenancePage に差し替えるガード。
 * API依存セグメントの layout.tsx で children を包んで使う。
 * メンテ中は配下のページ（クライアント・サーバーとも）は描画されない（E2Eで確認済み）。
 * ただし generateMetadata はガードの外で実行されるため、API呼び出しを伴う場合は
 * work/[id]/page.tsx のように generateMetadata 側に個別ガードが必要。
 */
export function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  if (isMaintenanceMode()) return <MaintenancePage />;
  return <>{children}</>;
}
