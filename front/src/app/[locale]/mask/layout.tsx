import { Metadata } from 'next';
import { generateAlternates } from '@/lib/metadata';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: locale === 'ja' ? 'ガマットマスク作成 - GamutCut' : 'Create Gamut Mask - GamutCut',
    description: locale === 'ja' 
      ? 'デジタルイラストの着彩で、統一感を生み出せる着彩法『ガマットマッピング』で用いる『ガマットマスク』を簡単に作成できます。HSV色相環モデルを使用し、幅広いペイントソフトに対応しています。'
      : 'Create gamut masks for digital art coloring. Use the HSV color wheel model to achieve color harmony in your illustrations. Compatible with various paint software.',
    alternates: generateAlternates('/mask', locale),
  };
}

export default function MaskLayout({ children }: { children: React.ReactNode;}) {
  return <>{children}</>;
}
