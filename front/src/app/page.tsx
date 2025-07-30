'use client';

// import { useEffect } from "react";
// import { testApiConnection } from '@/lib/api';
import { MaskMaking } from "@/components/MaskMaking";

export default function Home() {
  // useEffect(() => {
  //   testApiConnection();
  // }, []);

  return (
    <div className="justify-items-center mx-16 mb-40">
      <MaskMaking />
    </div>
  );
}
