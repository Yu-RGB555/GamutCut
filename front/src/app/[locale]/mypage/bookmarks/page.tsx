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
    <Suspense fallback={null}>
      <BookmarksPageContent />
    </Suspense>
  );
}
