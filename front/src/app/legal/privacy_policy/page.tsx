import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen mb-8">
      {/* タイトル */}
      <div className="container mx-auto px-8 py-16">
        <div className="relative mt-4">
          {/* 背景ロゴ - タイトルを基準に左上配置 */}
          {/* <Image
            src="/app_logo.svg"
            alt="App Logo"
            width={300}
            height={300}
            className="absolute -top-14 left-18 opacity-40 z-0"
          /> */}
          <h1 className="relative z-10 text-4xl font-normal text-label text-center mb-12">
            プライバシーポリシー
          </h1>
        </div>

        {/* 各条項 */}
        <div className="max-w-xl md:max-w-2xl mx-auto">
          <p className="relative z-10  max-w-xl mx-auto text-sm text-label mb-6">
            <span className="text-base font-semibold">GamutCut</span>（以下、「当社」といいます。）は、
            本ウェブサイト上で提供するサービス（以下、「本サービス」といいます。）における、
            ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下、「本ポリシー」といいます。）を定めます。
          </p>
          <Accordion type="multiple" className="w-full space-y-4">
            <AccordionItem value="article-1" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                第1条　お客様から取得する情報
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <p className="mb-4">当社は、お客様から以下の情報を取得します。</p>
                <ul className="leading-7">
                  <li>・氏名（ハンドルネームやペンネームも含む）</li>
                  <li>・メールアドレス</li>
                  <li>・外部サービスでお客様が利用するID、その他外部サービスのプライバシー設定によりお客様が連携先に開示を認めた情報</li>
                  <li>・Cookie、ローカルストレージを用いて生成された識別情報</li>
                  <li>・OSが生成するID、端末の種類、端末識別子等のお客様が利用するOSや端末に関する情報</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-2" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                第2条　お客様の情報を利用する目的
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <p className="mb-4">当社は、お客様から取得した情報について、以下の目的以外で利用することはありません。</p>
                <ul className="leading-7">
                  <li>・当社サービスに関する登録の受付、お客様の本人確認、認証のため</li>
                  <li>・お客様の当社サービスの利用履歴を管理するため</li>
                  <li>・当社サービスにおけるお客様の行動履歴を分析し、当社サービスの維持改善に役立てるため</li>
                  <li>・当社のサービスに関するご案内をするため</li>
                  <li>・お客様からのお問い合わせに対応するため</li>
                  <li>・当社の規約や法令に違反する行為に対応するため</li>
                  <li>・当社サービスの変更、提供中止、終了、契約解除をご連絡するため</li>
                  <li>・以上の他、当社サービスの提供、維持、保護及び改善のため</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-3" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                第3条　個人情報の第三者提供
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <p className="mb-4">
                  当社は、お客様から取得する情報のうち、個人データ（個人情報保護法第１６条第３項）に該当するものついては、あらかじめお客様の同意を得ずに、第三者（日本国外にある者を含みます。）に提供しません。
                  但し、次の場合は除きます。
                </p>
                <ul className="leading-7">
                  <li>・当社が利用目的の達成に必要な範囲内において、個人情報の取扱いの全部または一部を委託する場合</li>
                  <li>・当社や当社サービスが買収された場合</li>
                  <li>・事業パートナーと共同利用する場合（具体的な共同利用がある場合は、その内容を別途公表します。）</li>
                  <li>・その他、法律によって合法的に第三者提供が許されている場合</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-4" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                第4条　アクセス解析ツール
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <p className="mb-4">
                  当社は、お客様のアクセス解析のために、「Googleアナリティクス」を利用しています。
                  Googleアナリティクスは、トラフィックデータの収集のためにCookieを使用しています。
                  トラフィックデータは匿名で収集されており、個人を特定するものではありません。
                  Cookieを無効にすれば、これらの情報の収集を拒否することができます。
                  詳しくはお使いのブラウザの設定をご確認ください。
                  Googleアナリティクスについて、詳しくは
                  <a
                    href="https://marketingplatform.google.com/about/analytics/terms/jp/"
                    className="text-blue-400 hover:underline hover:underline-offset-2"
                    target="_blank"
                  >
                    こちら
                  </a>
                  からご確認ください。
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-5" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                第5条　プライバシーポリシーの変更
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <ul className="leading-6">
                  <li>・本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除き、ユーザーに通知することなく、変更することができるものとします。</li>
                  <li>・変更後の本ポリシーは、本サービス内に掲載したときから効力を生じるものとします。</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-6" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                第6条　利用目的の変更
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <ul className="leading-6">
                  <li>・当社は、利用目的が変更前と関連性を有すると合理的に認められる場合に限り、個人情報の利用目的を変更するものとします。</li>
                  <li>・利用目的の変更を行った場合には、変更後の目的について、当社所定の方法により、本ウェブサイト上に公表するものとします。</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-7" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                第7条　個人情報の訂正および削除
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <ul className="leading-6">
                  <li>・ユーザーは、当社の保有する自己の個人情報が誤った情報である場合には、当社が定める手続きにより、当社に対して個人情報の訂正、追加または削除（以下、「訂正等」といいます。）を請求することができます。</li>
                  <li>・当社は、ユーザーから前項の請求を受けてその請求に応じる必要があると判断した場合には、遅滞なく、当該個人情報の訂正等を行うものとします。</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="contact" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                第8条　お問い合わせ窓口
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <p className="text-label leading-7">
                  本ポリシーに関するお問い合わせは、サイト内のお問い合わせフォームにて受付いたします。
                </p>
              </AccordionContent>
            </AccordionItem>
            <p className="text-label font-semibold text-end mr-2 mt-2">以上</p>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
