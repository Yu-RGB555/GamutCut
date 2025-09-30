'use client';

import { Suspense } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MyPageLayout } from "@/components/MyPageLayout";
import { LikesList } from "@/components/LikesList";

function LikesPageContent() {
  const { user } = useAuth();
  return (
    <MyPageLayout>
      <LikesList
        isActive={true}
        userId={user?.id || 0}
      />
    </MyPageLayout>
  );
}

export default function LikesPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center py-8">読み込み中...</div>}>
      <LikesPageContent />
    </Suspense>
  );
}
