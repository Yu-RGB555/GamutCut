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
        <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ring"></div>
        </div>
      }
    >
      <DraftsPageContent />
    </Suspense>
  );
}
