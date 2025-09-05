'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MyPageTabs } from "@/components/MyPageTabs";

export default function myPage() {

  return (
    <div className="px-12">
      <div className="grid grid-cols-2">
        <div></div>
        <MyPageTabs />
      </div>
    </div>
  )
}