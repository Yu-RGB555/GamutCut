import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
            利用規約
          </h1>
        </div>

        {/* 各条項 */}
        <div className="max-w-xl md:max-w-2xl mx-auto">
          <p className="relative z-10  max-w-xl mx-auto text-sm text-label mb-6">
            この利用規約（以下、「本規約」といいます。）は、<span className="text-base font-semibold">GamutCut</span>
            （以下、「当社」といいます。）がこのウェブサイト上で提供するサービス（以下、「本サービス」といいます。）の利用条件を定めるものです。
            登録ユーザーの皆さま（以下、「ユーザー」といいます。）には、本規約に従って、本サービスをご利用いただきます。
          </p>
          <Accordion type="multiple" className="w-full space-y-4">
            <AccordionItem value="article-1" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                第1条　適用
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <ul className="leading-7">
                  <li>・本規約は、ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されるものとします。</li>
                  <li>・当社は本サービスに関し、本規約のほか、ご利用にあたってのルール等、各種の定め（以下、「個別規定」といいます。）をすることがあります。これら個別規定はその名称のいかんに関わらず、本規約の一部を構成するものとします。</li>
                  <li>・本規約の規定が前条の個別規定の規定と矛盾する場合には、個別規定において特段の定めなき限り、個別規定の規定が優先されるものとします。</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-2" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                第2条　利用規約の変更
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <ul className="leading-7">
                  <li>・本規約は、当社の判断により、いつでも変更することができるものとします。変更の際はその旨およびその内容、施行時期を当社の定める方法で適切に周知します。</li>
                  <li>・変更後の本規約は、当社が別途定める場合を除き、本サービス上に掲載した時点より効力を生じるものとします。</li>
                  <li>・本規約の変更の効力が生じた後にユーザーが該当する本サービスを利用した場合には、変更後の本規約のすべてにつき、同意したものとみなします。</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-3" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                第3条　個人情報の取り扱い
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <ul className="leading-7">
                  <li>・当社は、本サービスの利用によって取得する個人情報については、当社「プライバシーポリシー」に従い適切に取り扱うものとします。</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-4" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                第4条　利用登録
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <p className="mb-4">当社は、お客様から取得した情報について、以下の目的以外で利用することはありません。</p>
                <ol className="leading-7">
                  <li>1. 本サービスにおいては、登録希望者が本規約に同意の上、当社の定める方法によって利用登録を申請し、当社がこれを承認することによって、利用登録が完了するものとします。</li>
                  <li>2. 当社は、利用登録の申請者に以下の事由があると判断した場合、利用登録の申請を承認しないことがあり、その理由については一切の開示義務を負わないものとします。</li>
                  <li>　・利用登録の申請に際して虚偽の事項を届け出た場合</li>
                  <li>　・本規約に違反したことがある者からの申請である場合</li>
                  <li>　・その他、当社が利用登録を相当でないと判断した場合</li>
                </ol>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-5" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                第5条　ユーザーIDおよびパスワードの管理
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <ul className="leading-7">
                  <li>・ユーザーは、自己の責任において、本サービスのユーザーIDおよびパスワードを適切に管理するものとします。</li>
                  <li>・ユーザーは、いかなる場合にも、ユーザーIDおよびパスワードを第三者に譲渡または貸与し、もしくは第三者と共用することはできません。当社は、ユーザーIDとパスワードの組み合わせが登録情報と一致してログインされた場合には、そのユーザーIDを登録しているユーザー自身による利用とみなします。</li>
                  <li>・ユーザーID及びパスワードが第三者によって使用されたことによって生じた損害は、当社に故意又は重大な過失がある場合を除き、当社は一切の責任を負わないものとします。</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-6" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                第6条　利用料金および支払方法
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <p className="mb-4">
                  本サービスの利用料金（本サービスを利用するために必要となる通信料は除きます。）は無料ですが、将来的に一部有償サービスまたは有料プランを導入する場合があります。
                  その際は、事前にサイト内での告知等、当社が適切と判断する方法でご案内いたします。
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-7" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                第7条　投稿情報等に関する保証および義務
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <ul className="leading-6">
                  <li>・本サービスを利用して投稿情報を投稿等するユーザーは、当社に対し、当該投稿情報が第三者の権利を侵害するものでないことを保証するものとします。</li>
                  <li>・万一、ユーザーが投稿等した情報が第三者の権利を侵害するなど第三者との間で何らかの紛争が発生した場合には、当該ユーザーの費用と責任において問題を解決するとともに、当社に何らかの損害を与えないものとします。</li>
                  <li>・ユーザーは、自己が作成した画像、テキスト等の一切のデータを自己の責任において管理・保存するものとします。本サービスにアップロードするため編集中の画像またはテキスト等、アップロードされた画像またはテキスト等のデータは、ユーザー自身が適宜バックアップを取るなどの手法で保存するものとし、当社は画像、テキスト等のデータの保存等についてサービス運営上合理的な努力は行いますが、保証をするものではありません。</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-8" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                第8条　投稿
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <ul className="leading-6">
                  <li>・クリエイターは、当社所定の方法により公開範囲を設定したうえ、クリエイターページ上に、任意の投稿コンテンツを投稿することができます。</li>
                  <li>・クリエイターは、本サービスの利用にあたり、以下のいずれかに該当する投稿データ又は投稿コンテンツの公開や、公開を目的とした外部のオンラインストレージサービスその他外部のウェブサービス等への誘導行為を行ってはならないものとします。これらに該当すると判断した場合、当社はクリエイターに修正を求め、投稿コンテンツの全部又は一部の削除または公開範囲の変更等の措置を行うことができるものとし、事情によっては当該クリエイターのクリエイター登録を抹消することができるものとします。但し、当社はこれらの措置をとる義務を負うものではなく、また、これらの措置を講じた理由を開示する義務を負うものではありません。</li>
                  <ol className="leading-7">
                    <li>　1. 猥褻性がある表現、又は過度に歪んだ状態での性表現</li>
                    <li>　2. 刺激が強く嫌悪感や不快感を与える暴力的表現又は残虐な表現</li>
                    <li>　3. 極端な思想や反社会的行為を賛美・助長する表現</li>
                    <li>　4. 人種、信条、職業、性別、宗教などの差別を賛美・助長する表現</li>
                    <li>　5. カルト的宗教活動、過度な政治活動を賛美・助長する表現</li>
                    <li>　6. 第三者から権利侵害その他の主張があった場合において、当社がこれを検討し、当該第三者の主張に理由がないとまではいえないと判断したもの</li>
                    <li>　7. 公的機関又は専門家（国、地方公共団体、特定電気通信役務提供者の損害賠償責任の制限及び発信者情報の開示に関する法律のガイドラインに規定された信頼性確認団体、インターネット・ホットライン、弁護士等）から、違法、公序良俗違反又は他人の権利を侵害する等の指摘・意見があったもの</li>
                    <li>　8. 第三者の権利を侵害する表現であり、かつ表現の自由に配慮してもなお本個別サービス上で提供される表現として適切でないと認められるもの</li>
                    <li>　9. FX、株、仮想通貨など金融に関する情報商材、それに伴うツール及び関連するコンテンツ</li>
                    <li>　10. 当社が本サービスにおいて「AI生成コンテンツ」（次条で定義します。）として定めたコンテンツ</li>
                  </ol>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-9" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                第9条　AI生成コンテンツ
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <p className="mb-4">本サービスでは、以下の要件を満たすコンテンツを「AI生成コンテンツ」と定義します。</p>
                <ul className="leading-6">
                  <li>・制作過程のすべてもしくはその主要な部分にAI（これに類する技術を含みます。）を使用して生成したコンテンツまたは当該コンテンツに軽微な加工・修正を施したコンテンツ</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-10" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                第10条　禁止行為
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <p className="mb-4">ユーザーは、本サービスの利用にあたり、以下の行為は行ってはならないものとします。禁止行為を行なった場合、投稿コンテンツの全部もしくは一部の削除、強制退会、利用停止などの措置をとることがあります。</p>
                <ul className="leading-6">
                  <li>・法令または公序良俗に違反する行為</li>
                  <li>・犯罪行為に関連する行為</li>
                  <li>・当社もしくは第三者の著作権、意匠権等の知的財産権、その他の権利を侵害する行為、または侵害するおそれのある行為</li>
                  <li>・本サービスに投稿等されている投稿情報を、当該著作者（創作者）の同意なくして転載する行為</li>
                  <li>・当社、ほかのユーザー、またはその他第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
                  <li>・本サービスによって得られた情報を商業的に利用する行為</li>
                  <li>・当社のサービスの運営を妨害するおそれのある行為</li>
                  <li>・不正アクセスをし、またはこれを試みる行為</li>
                  <li>・他のユーザーに関する個人情報等を収集または蓄積する行為</li>
                  <li>・不正な目的を持って本サービスを利用する行為</li>
                  <li>・本サービスの他のユーザーまたはその他の第三者に不利益、損害、不快感を与える行為</li>
                  <li>・他のユーザーに成りすます行為</li>
                  <li>・当社が許諾しない本サービス上での宣伝、広告、勧誘、または営業行為</li>
                  <li>・面識のない異性との出会いを目的とした行為</li>
                  <li>・当社のサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為</li>
                  <li>・その他、当社が不適切と判断する行為</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-11" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                第11条　保証の否認および免責事項
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <ul className="leading-6">
                  <li>・当社は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。</li>
                  <li>・当社は、本サービスに起因してユーザーに生じたあらゆる損害について、当社の故意又は重過失による場合を除き、一切の責任を負いません。ただし、本サービスに関する当社とユーザーとの間の契約（本規約を含みます。）が消費者契約法に定める消費者契約となる場合、この免責規定は適用されません。</li>
                  <li>・前項ただし書に定める場合であっても、当社は、当社の過失（重過失を除きます。）による債務不履行または不法行為によりユーザーに生じた損害のうち特別な事情から生じた損害（当社またはユーザーが損害発生につき予見し、または予見し得た場合を含みます。）について一切の責任を負いません。また、当社の過失（重過失を除きます。）による債務不履行または不法行為によりユーザーに生じた損害の賠償は、ユーザーから当該損害が発生した月に受領した利用料の額を上限とします。</li>
                  <li>・万一ユーザー間またはユーザーと第三者の間の紛争があった場合でも、当該ユーザー間またはユーザーと第三者の間で解決するものとし、当社はその責任を負いません。</li>
                  <li>・当社は、以下のいずれか、またはその他の事由により本サービスの提供の遅延または中断等が発生したとしても、これに起因するユーザーまたは他者が被った損害について、本規約で特に定める場合を除き、責任を負いません。</li>
                  <ol className="leading-7">
                    <li>　1. 本サービス用設備等の保守を定期的にまたは緊急に行う場合</li>
                    <li>　2. 火災、停電等により本サービスの提供ができなくなった場合</li>
                    <li>　3. 地震、噴火、洪水、津波等の天災により本サービスの提供ができなくなった場合</li>
                    <li>　4. 戦争、動乱、暴動、騒乱、労働争議等により本サービスの提供ができなくなった場合</li>
                    <li>　5. 当社の使用する設備やシステム等の障害、保守およびメンテナンス等の事由による場合</li>
                    <li>　6. アクセス過多、その他予期せぬ要因で表示速度の低下や障害等が生じた場合</li>
                    <li>　7. 通常講ずべき覗き見防止や公知の欠陥のないソフトウェアの利用、ウィルス対策等では防止できないセキュリティ上の問題が生じた場合</li>
                    <li>　8. その他、運用上または技術上当社が本サービスの一時的な中断が必要と判断した場合</li>
                  </ol>
                  <li>・当社は、ユーザーによって投稿等される投稿情報を管理・保存する義務を負いません</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-12" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                第12条　権利義務の譲渡の禁止
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <p className="mb-4">ユーザーは、当社の書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し、または担保に供することはできません。</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-13" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                第13条　サービス内容の変更など
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <p className="mb-4">当社は、ユーザーへの事前の告知なく、本サービスの内容を変更、追加または廃止することがあり、ユーザーはこれを承諾するものとします。なお、これらの対応はユーザーの利便性を考慮して行われるものとします。</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-14" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                第14条　通知または連絡
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <p className="mb-4">ユーザーと当社との間の通知または連絡は、当社の定める方法によって行うものとします。当社は,ユーザーから,当社が別途定める方式に従った変更届け出がない限り,現在登録されている連絡先が有効なものとみなして当該連絡先へ通知または連絡を行い,これらは,発信時にユーザーへ到達したものとみなします。</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-15" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                第15条　準拠法・裁判管轄
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <ul className="leading-6">
                  <li>・本規約の解釈にあたっては、日本法を準拠法とします。</li>
                  <li>・本サービスに関して紛争が生じた場合には、当社の所在地を管轄する裁判所を専属的合意管轄とします。</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-16" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                第16条　当社情報
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <ul className="leading-6">
                  <li>所在地および個人情報は、正当な理由がある場合に限り開示するとします。</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <p className="text-label font-semibold text-end mr-2 mt-2">以上</p>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
