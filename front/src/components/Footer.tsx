import XLogo from "./XLogo";
import GitHubLogo from './GitHubLogo';
import { useTranslations, useLocale } from "next-intl";

export function Footer() {

  const t = useTranslations('Legal');
  const locale = useLocale();

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
            <a
              href={`/${locale}/legal/terms_of_service`}
              rel="noopener noreferrer"
              target="_blank"
              className="text-label hover:underline"
            >
              <p className="text-sm text-label">{t('terms_of_service')}</p>
            </a>
            <a
              href={`/${locale}/legal/privacy_policy`}
              rel="noopener noreferrer"
              target="_blank"
              className="text-label hover:underline"
            >
              <p className="text-sm text-label">{t('privacy_policy')}</p>
            </a>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSeAeKtDfGityDObNRo96NH87rdZKfoEkNCJMQWdqZxLmmNfKA/viewform?usp=dialog"
              rel="noopener noreferrer"
              target="_blank"
              className="text-label hover:underline"
            >
              <p className="text-sm text-label">{t('contact')}</p>
            </a>
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