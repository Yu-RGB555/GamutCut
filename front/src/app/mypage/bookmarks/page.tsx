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
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ring"></div>
        </div>
      }
    >
      <BookmarksPageContent />
    </Suspense>
  );
}
