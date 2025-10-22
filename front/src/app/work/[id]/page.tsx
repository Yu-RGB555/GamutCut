// サーバーコンポーネント

import type { Metadata } from "next";
import { WorkDetailClient } from "./work-detail-client";
import { showWork } from "@/lib/api";

type Props = {
  params: Promise<{id: number}>
}

// メタデータ生成用メソッド
export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {

  // 作品idをparamsから読み取り
  const { id } = await params;

  // 作品データを取得
  const workData = await showWork(id);

  const title = `${workData.title} | ${workData.user.name} - GamutCut`
  const description = `${workData.description.slice(0, 100)}...`

  // フロントエンドのベースURL（作品ページのURL用）
  const frontendBaseUrl = process.env.FRONTEND_URL || 'http://localhost:3003'
  const url = `${frontendBaseUrl}/work/${id}`

  // 画像のベースURL（API/画像サーバーのURL用）
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'
  const imageUrl = workData.illustration_image_url || `${frontendBaseUrl}/og-image.png`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'GamutCut',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

export default async function Page({ params }: Props) {
  // 作品idをparamsから読み取り
  const { id } = await params;

  // 作品データを取得
  const workData = await showWork(id);

  return <WorkDetailClient initialData={workData} />;
}