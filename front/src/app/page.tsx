'use client';

import { useEffect, useState } from "react";
// import { testApiConnection } from '@/lib/api';
import { MaskMaking } from "@/components/MaskMaking";
import { getPresets } from "@/lib/api";
import { Preset } from "@/types/preset";
import { PresetCard } from "@/components/PresetCard";

export default function Home() {
  // useEffect(() => {
  //   testApiConnection();
  // }, []);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPresets = async () => {
      try{
        const presetData = await getPresets();
        console.log('presets.id', presetData)
        setPresets(presetData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPresets();
  }, []);

  return (
    <div className="justify-items-center mx-16 mb-40 space-y-8">
      <MaskMaking />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {presets.map((preset) => (
          <PresetCard key={preset.id} preset={preset} />
        ))}
      </div>
    </div>
  );
}
