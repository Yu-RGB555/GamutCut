import { Metadata } from 'next';
import { generateAlternates } from '@/lib/metadata';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: locale === 'ja' ? 'プライバシーポリシー - GamutCut' : 'Privacy Policy - GamutCut',
    description: locale === 'ja'
      ? 'GamutCutのプライバシーポリシーです。個人情報の取り扱いについて説明しています。'
      : 'GamutCut Privacy Policy. Learn about how we handle your personal information.',
    alternates: generateAlternates('/legal/privacy_policy', locale),
  };
}

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
