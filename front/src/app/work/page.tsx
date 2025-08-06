'use client';

import { useState, useEffect } from "react";
import { Combobox } from "@/components/ui/combobox";
import { Search } from "@/components/ui/search";
import Link from "next/link";
import { Work } from "@/types/work";
import { getWorks } from "@/lib/api";

export default function WorksList() {
  const [works, setWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchWorks = async () => {
      try{
        const worksData = await getWorks();
        console.log('workData:', worksData);
        setWorks(worksData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorks();
  }, []);

  return (
    <div>
      <div className="flex justify-center py-8 px-8">
        <Search></Search>
      </div>
      <div className="flex justify-end py-8 px-8">
        <Combobox></Combobox>
      </div>
      <div className="px-8 pb-8 mb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {works.map((work) => (
            <Link key={work.id} href={`/work/${work.id}`}>
              <div className="bg-background rounded-lg border shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* 作品画像エリア */}
                <div className="aspect-video bg-background flex items-center justify-center">
                  {work.illustration_image_url ? (
                    <img
                      src={work.illustration_image_url}
                      alt={work.title}
                      className="object-contain w-full h-full"
                    />
                  ) : (
                    <span className="text-gray-500">作品 {work.id}</span>
                  )}
                </div>

                {/* 作品情報エリア */}
                <div className="p-4 border-t">
                  <h3 className="text-card-foreground font-semibold text-xl mb-2">{work.title}</h3>
                  <p className="text-white text-base font-normal">{work.user.name}</p>
                  <p className="text-gray-400 text-xs">{work.created_at}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
