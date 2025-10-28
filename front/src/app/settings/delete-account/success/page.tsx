'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MdOutlineCheckCircle } from 'react-icons/md';

export default function signOutSuccess() {
  const router = useRouter();

    return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <Card>
        <CardContent className="px-8 pt-6">
          <div className="text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full mb-4">
              <MdOutlineCheckCircle className="h-20 w-20 text-primary" />
            </div>
            <p className="text-3xl font-semibold text-label m-2">
              退会手続きが<br />
              完了しました
            </p>
            <div className="space-y-2 m-16">
              <Button
                variant="secondary"
                className="w-2/3 font-normal"
                onClick={() => { router.push('/') }}
              >
                ホームに戻る
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}