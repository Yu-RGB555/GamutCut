'use client';

import { useAuth } from "@/contexts/AuthContext";
import { DraftWorks } from "@/components/DraftWorks";
import { MyPageLayout } from "@/components/MyPageLayout";

export default function DraftsPage() {
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
