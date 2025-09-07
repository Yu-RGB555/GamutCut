'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const tabs = [
  { id: 1, label: "公開作品", href: "/mypage" },
  { id: 2, label: "下書き", href: "/mypage/drafts" },
  { id: 3, label: "いいね", href: "/mypage/likes" },
  { id: 4, label: "ブックマーク", href: "/mypage/bookmarks" }
];

interface MyPageLayoutProps {
  children: React.ReactNode;
}

export function MyPageLayout({ children }: MyPageLayoutProps) {
  const pathname = usePathname();

  // パスからアクティブなタブを判定
  const getActiveIndex = () => {
    switch (pathname) {
      case '/mypage': return 0;
      case '/mypage/drafts': return 1;
      case '/mypage/likes': return 2;
      case '/mypage/bookmarks': return 3;
      default: return 0;
    }
  };

  const activeIndex = getActiveIndex();

  return (
    <div className="px-12">
      <div className="grid grid-cols-1 gap-8">
        <div className="grid justify-items-center align-items-center gap-8">
          <h3 className="text-xl font-semibold text-label">プロフィール</h3>
          <Button>プロフィール設定</Button>
        </div>

        {/* タブナビゲーション */}
        <div className="relative w-full border-b border-gray-200">
          <nav className="flex gap-6 justify-center">
            {tabs.map((tab, idx) => (
              <Link
                key={tab.id}
                href={tab.href}
                className={`relative py-2 px-4 font-semibold transition-none hover:cursor-pointer
                  ${idx === activeIndex ? "text-primary" : "text-gray-500"}
                `}
              >
                {tab.label}
              </Link>
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

        {/* タブの内容 */}
        <div className="mt-6">
          {children}
        </div>
      </div>
    </div>
  );
}
