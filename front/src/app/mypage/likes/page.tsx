'use client';

import { useAuth } from "@/contexts/AuthContext";
import { MyPageLayout } from "@/components/MyPageLayout";
import { LikesList } from "@/components/LikesList";

export default function LikesPage() {
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
