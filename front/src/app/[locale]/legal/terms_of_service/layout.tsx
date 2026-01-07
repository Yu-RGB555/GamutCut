import { Metadata } from 'next';
import { generateAlternates } from '@/lib/metadata';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: locale === 'ja' ? '利用規約 - GamutCut' : 'Terms of Service - GamutCut',
    description: locale === 'ja'
      ? 'GamutCutの利用規約です。サービスの利用条件について説明しています。'
      : 'GamutCut Terms of Service. Learn about the terms and conditions for using our service.',
    alternates: generateAlternates('/legal/terms_of_service', locale),
  };
}

export default function TermsOfServiceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
