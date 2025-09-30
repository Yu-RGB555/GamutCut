'use client';

import { Suspense } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MyPageLayout } from "@/components/MyPageLayout";
import { BookmarksList } from "@/components/BookmarksList";

function BookmarksPageContent() {
  const { user } = useAuth();
  return (
    <MyPageLayout>
      <BookmarksList
        isActive={true}
        userId={user?.id || 0}
      />
    </MyPageLayout>
  );
}

export default function BookmarksPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center py-8">読み込み中...</div>}>
      <BookmarksPageContent />
    </Suspense>
  );
}
