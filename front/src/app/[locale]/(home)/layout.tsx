import { Metadata } from 'next';
import { generateAlternates } from '@/lib/metadata';

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return {
    alternates: generateAlternates('', locale),
  };
}

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
