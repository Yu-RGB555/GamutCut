import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ガマットマスク作成 - GamutCut',
  description: 'デジタルイラストの着彩に統一感を生み出すガマットマスクを簡単に作成できます。HSV色相環モデルを使用し、幅広いペイントソフトに対応しています。',
  alternates: {
    canonical: `${process.env.FRONTEND_URL}/mask`,
  },
};

export default function MaskLayout({ children }: { children: React.ReactNode;}) {
  return <>{children}</>;
}
