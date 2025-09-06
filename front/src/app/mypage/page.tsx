'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { MyPageTabs } from "@/components/MyPageTabs";

export default function myPage() {

  return (
    <div className="px-12">
      <div className="grid grid-cols-1 gap-8">
        <div className="grid justify-items-center align-items-center gap-8">
          <h3 className="text-xl font-semibold text-label">プロフィール</h3>
          <Button>プロフィール設定</Button>
        </div>
        <MyPageTabs />
      </div>
    </div>
  )
}