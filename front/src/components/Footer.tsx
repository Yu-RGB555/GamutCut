import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* サイト情報 */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold text-foreground mb-4">GamutCut</h3>
            <p className="text-muted-foreground text-sm">
              着彩に悩むイラストレーターへ
            </p>
          </div>

          {/* User Guide */}
          <div>
            <h4 className="font-semibold text-white mb-4">User Guide</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/work" className="text-foreground hover:text-gray-900">
                  ガマットマスクとは？
                </Link>
              </li>
              <li>
                <Link href="/work/new" className="text-foreground hover:text-gray-900">
                  使い方
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/legal/terms_of_service" className="text-foreground hover:text-gray-900">
                  利用規約
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy_policy" className="text-foreground hover:text-gray-900">
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link href="/legal/contact" className="text-foreground hover:text-gray-900">
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </div>

          {/* About Me */}
          <div>
            <h4 className="font-semibold text-white mb-4">About Me</h4>

          </div>
        </div>

        <div className="mt-8 pt-8 border-gray-200">
          <p className="text-center text-gray-200 text-sm">
            © 2025 GamutCut. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}