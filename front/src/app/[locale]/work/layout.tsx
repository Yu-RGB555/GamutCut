import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { generateAlternates } from '@/lib/metadata';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Work' });

  return {
    title: locale === 'ja' ? '作品一覧 - GamutCut' : 'Works - GamutCut',
    description: locale === 'ja'
      ? 'GamutCutで公開されているデジタルイラスト作品の一覧です。ユーザーが作成したガマットマスクを使った作品を閲覧できます。'
      : 'Browse digital illustrations published on GamutCut. Explore artworks created using user-generated gamut masks.',
    alternates: generateAlternates('/work', locale),
  };
}

export default function WorkLayout({ children }: { children: React.ReactNode;}) {
  return <>{children}</>;
}
