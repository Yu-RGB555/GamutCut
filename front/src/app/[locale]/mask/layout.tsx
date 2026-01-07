import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ガマットマスク作成 - GamutCut',
  description: 'デジタルイラストの着彩で、統一感を生み出せる着彩法『ガマットマッピング』で用いる『ガマットマスク』を簡単に作成できます。HSV色相環モデルを使用し、幅広いペイントソフトに対応しています。',
};

export default function MaskLayout({ children }: { children: React.ReactNode;}) {
  return <>{children}</>;
}
