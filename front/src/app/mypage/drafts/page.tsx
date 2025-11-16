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
    <Suspense fallback={null}>
      <DraftsPageContent />
    </Suspense>
  );
}
