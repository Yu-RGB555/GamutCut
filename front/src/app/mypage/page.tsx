'use client';

import { Suspense } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PublishedWorks } from "@/components/PublishedWorks";
import { MyPageLayout } from "@/components/MyPageLayout";

function MyPageContent() {
  const { user } = useAuth();

  return (
    <MyPageLayout>
      <PublishedWorks
        isActive={true}
        userId={user?.id || 0}
      />
    </MyPageLayout>
  );
}

export default function MyPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center py-8">読み込み中...</div>}>
      <MyPageContent />
    </Suspense>
  );
}