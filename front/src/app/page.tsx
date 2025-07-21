'use client';

import { useEffect } from "react";
import { testApiConnection } from '@/lib/api'
import { ColorWheel } from "@/components/colorwheel";

export default function Home() {
  useEffect(() => {
    testApiConnection();
  }, []);
  return (
    <div className="justify-items-center">
      <ColorWheel></ColorWheel>
    </div>
  );
}
