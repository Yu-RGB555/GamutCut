import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslations } from "next-intl";

export default function PrivacyPolicy() {
  const t = useTranslations("PrivacyPolicy");

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
            {t("title")}
          </h1>
        </div>

        {/* 各条項 */}
        <div className="max-w-xl md:max-w-2xl mx-auto">
          <p className="relative z-10  max-w-xl mx-auto text-sm text-label mb-6">
            {t("intro", { serviceName: "GamutCut" })}
          </p>
          <Accordion type="multiple" className="w-full space-y-4">
            <AccordionItem value="article-1" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                {t("article_1.title")}
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <p className="mb-4">{t("article_1.content_intro")}</p>
                <ul className="leading-7">
                  <li>{t("article_1.content_1")}</li>
                  <li>{t("article_1.content_2")}</li>
                  <li>{t("article_1.content_3")}</li>
                  <li>{t("article_1.content_4")}</li>
                  <li>{t("article_1.content_5")}</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-2" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                {t("article_2.title")}
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <p className="mb-4">{t("article_2.content_intro")}</p>
                <ul className="leading-7">
                  <li>{t("article_2.content_1")}</li>
                  <li>{t("article_2.content_2")}</li>
                  <li>{t("article_2.content_3")}</li>
                  <li>{t("article_2.content_4")}</li>
                  <li>{t("article_2.content_5")}</li>
                  <li>{t("article_2.content_6")}</li>
                  <li>{t("article_2.content_7")}</li>
                  <li>{t("article_2.content_8")}</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-3" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                {t("article_3.title")}
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <p className="mb-4">{t("article_3.content_intro")}</p>
                <ul className="leading-7">
                  <li>{t("article_3.content_1")}</li>
                  <li>{t("article_3.content_2")}</li>
                  <li>{t("article_3.content_3")}</li>
                  <li>{t("article_3.content_4")}</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-4" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                {t("article_4.title")}
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <p className="mb-4">
                  {t("article_4.content_intro")}
                  <a
                    href={t("article_4.link_url")}
                    className="text-blue-400 hover:underline hover:underline-offset-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("article_4.link_text")}
                  </a>
                  {t("article_4.content_outro")}
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-5" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                {t("article_5.title")}
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <ul className="leading-6">
                  <li>{t("article_5.content_1")}</li>
                  <li>{t("article_5.content_2")}</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-6" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                {t("article_6.title")}
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <ul className="leading-6">
                  <li>{t("article_6.content_1")}</li>
                  <li>{t("article_6.content_2")}</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-7" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                {t("article_7.title")}
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <ul className="leading-6">
                  <li>{t("article_7.content_1")}</li>
                  <li>{t("article_7.content_2")}</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="contact" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                {t("article_8.title")}
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <p className="text-label leading-7">
                  {t("article_8.content_1")}
                </p>
              </AccordionContent>
            </AccordionItem>
            <p className="text-label font-semibold text-end mr-2 mt-2">{t("end")}</p>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
