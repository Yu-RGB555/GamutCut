/**
 * バックエンドサーバー停止時のメンテナンスモード判定
 * 環境変数 NEXT_PUBLIC_MAINTENANCE_MODE=true で有効化
 */
export const isMaintenanceMode = (): boolean => {
  return process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';
};
