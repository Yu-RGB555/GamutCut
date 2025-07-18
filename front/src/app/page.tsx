'use client';

import { useEffect } from "react";
import { testApiConnection } from '@/lib/api'

export default function Home() {
  useEffect(() => {
    testApiConnection();
  }, []);
  return (
    <div className="font-sans items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">

    </div>
  );
}
