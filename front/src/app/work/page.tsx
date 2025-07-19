'use client';

import { Combobox } from "@/components/ui/combobox";
import { Search } from "@/components/ui/search";

export default function Work() {
  // ダミーデータ
  const works = Array.from({ length: 15 }, (_, index) => ({
  id: index + 1,
  title: `作品 ${index + 1}`,
  image: `/placeholder-${index + 1}.jpg`,
  description: `作品${index + 1}の説明文です。`,
  date: `2025-${String(Math.floor(index / 3) + 1).padStart(2, '0')}-${String((index % 3) + 1).padStart(2, '0')}`
  }));

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
          {works.map((work, index) => (
            <div
              key={work.id}
              className="bg-card rounded-lg border shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* 作品画像エリア */}
              <div className="aspect-video bg-card flex items-center justify-center">
                <span className="text-gray-500">作品 {work.id}</span>
              </div>

              {/* 作品情報エリア */}
              <div className="p-4 border-t">
                <h3 className="text-card-foreground font-semibold text-lg mb-2">{work.title}</h3>
                <p className="text-gray-400 text-xs">{work.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
