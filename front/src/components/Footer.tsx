import Link from 'next/link'
import XLogo from "./XLogo";
import GitHubLogo from './GitHubLogo';

export function Footer() {
  return (
    <footer className="bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="space-y-2">

          {/* About Me */}
          <div className="flex gap-2 justify-center">
            <XLogo
              url="https://x.com/teq_63b_yutaro"
            />
            <GitHubLogo
              url="https://github.com/Yu-RGB555"
            />
          </div>

          {/* Legal */}
          <div className="flex gap-6 justify-center">
            <Link href="/legal/terms_of_service" className="text-label hover:underline">
              <p className="text-sm text-label">利用規約</p>
            </Link>
            <Link href="/legal/privacy_policy" className="text-label hover:underline">
              <p className="text-sm text-label">プライバシーポリシー</p>
            </Link>
            <Link href="/legal/contact" className="text-label hover:underline">
              <p className="text-sm text-label">お問い合わせ</p>
            </Link>
          </div>

          {/* コピーライト */}
          <div className="border-gray-200">
            <p className="text-center text-gray-400 text-xs">
              © 2025 GamutCut. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}