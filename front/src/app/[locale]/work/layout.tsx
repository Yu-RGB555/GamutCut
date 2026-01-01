import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '作品一覧 - GamutCut',
  description: 'GamutCutで公開されているデジタルイラスト作品の一覧です。ユーザーが作成したガマットマスクを使った作品を閲覧できます。',
  alternates: {
    canonical: `${process.env.FRONTEND_URL}/work`,
  },
};

export default function WorkLayout({ children }: { children: React.ReactNode;}) {
  return <>{children}</>;
}
