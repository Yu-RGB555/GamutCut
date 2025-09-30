'use client';

import { Suspense } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DraftWorks } from "@/components/DraftWorks";
import { MyPageLayout } from "@/components/MyPageLayout";

function DraftsPageContent() {
  const { user } = useAuth();

  return (
    <MyPageLayout>
      <DraftWorks
        isActive={true}
        userId={user?.id || 0}
      />
    </MyPageLayout>
  );
}

export default function DraftsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center py-8">読み込み中...</div>}>
      <DraftsPageContent />
    </Suspense>
  );
}
