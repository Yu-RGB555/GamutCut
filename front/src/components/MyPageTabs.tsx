import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const tabs = ["公開作品", "下書き", "いいね", "ブックマーク"]

export function MyPageTabs() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="relative w-full border-b border-gray-200">
      <nav className="flex gap-6 justify-center">
        {tabs.map((tab, idx) => (
          <button
            key={tab}
            className={`relative py-2 px-4 font-semibold transition-none hover:cursor-pointer
              ${idx === activeIndex ? "text-primary" : "text-gray-500"}
            `}
            onClick={() => setActiveIndex(idx)}
          >
            {tab}
          </button>
        ))}
      </nav>
      {/* アンダーライン */}
      <div
        className="absolute bottom-0 h-0.5 bg-primary transition-all duration-300 rounded"
        style={{
          width: `calc(100% / ${tabs.length})`,
          left: `calc(${activeIndex} * (100% / ${tabs.length}))`,
        }}
      />
    </div>
  );
}