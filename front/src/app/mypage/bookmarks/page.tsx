'use client';

import { useAuth } from "@/contexts/AuthContext";
import { MyPageLayout } from "@/components/MyPageLayout";
import { BookmarksList } from "@/components/BookmarksList";

export default function BookmarksPage() {
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
