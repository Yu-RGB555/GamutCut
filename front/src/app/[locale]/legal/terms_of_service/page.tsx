import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslations } from "next-intl";

export default function TermsOfService() {
  const t = useTranslations("TermsOfService");

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
            {t("intro", { serviceName: "GamutCut"})}
          </p>
          <Accordion type="multiple" className="w-full space-y-4">
            <AccordionItem value="article-1" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                {t("article_1.title")}
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <ul className="leading-7">
                  <li>{t("article_1.content_1")}</li>
                  <li>{t("article_1.content_2")}</li>
                  <li>{t("article_1.content_3")}</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-2" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                {t("article_2.title")}
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <ul className="leading-7">
                  <li>{t("article_2.content_1")}</li>
                  <li>{t("article_2.content_2")}</li>
                  <li>{t("article_2.content_3")}</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-3" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                {t("article_3.title")}
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <ul className="leading-7">
                  <li>{t("article_3.content_1")}</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-4" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                {t("article_4.title")}
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <p className="mb-4">{t("article_4.content_intro")}</p>
                <ol className="leading-7">
                  <li>{t("article_4.content_1")}</li>
                  <li>{t("article_4.content_2")}</li>
                  <li>{t("article_4.content_2_1")}</li>
                  <li>{t("article_4.content_2_2")}</li>
                  <li>{t("article_4.content_2_3")}</li>
                </ol>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-5" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                {t("article_5.title")}
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <ul className="leading-7">
                  <li>{t("article_5.content_1")}</li>
                  <li>{t("article_5.content_2")}</li>
                  <li>{t("article_5.content_3")}</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-6" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                {t("article_6.title")}
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <p className="mb-4">
                  {t("article_6.content_1")}
                </p>
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
                  <li>{t("article_7.content_3")}</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-8" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                {t("article_8.title")}
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <ul className="leading-6">
                  <li>{t("article_8.content_1")}</li>
                  <li>{t("article_8.content_2")}</li>
                  <ol className="leading-7">
                    <li>{t("article_8.content_2_1")}</li>
                    <li>{t("article_8.content_2_2")}</li>
                    <li>{t("article_8.content_2_3")}</li>
                    <li>{t("article_8.content_2_4")}</li>
                    <li>{t("article_8.content_2_5")}</li>
                    <li>{t("article_8.content_2_6")}</li>
                    <li>{t("article_8.content_2_7")}</li>
                    <li>{t("article_8.content_2_8")}</li>
                    <li>{t("article_8.content_2_9")}</li>
                    <li>{t("article_8.content_2_10")}</li>
                  </ol>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-9" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                {t("article_9.title")}
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <p className="mb-4">{t("article_9.content_intro")}</p>
                <ul className="leading-6">
                  <li>{t("article_9.content_1")}</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-10" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                {t("article_10.title")}
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <p className="mb-4">{t("article_10.content_intro")}</p>
                <ul className="leading-6">
                  <li>{t("article_10.content_1")}</li>
                  <li>{t("article_10.content_2")}</li>
                  <li>{t("article_10.content_3")}</li>
                  <li>{t("article_10.content_4")}</li>
                  <li>{t("article_10.content_5")}</li>
                  <li>{t("article_10.content_6")}</li>
                  <li>{t("article_10.content_7")}</li>
                  <li>{t("article_10.content_8")}</li>
                  <li>{t("article_10.content_9")}</li>
                  <li>{t("article_10.content_10")}</li>
                  <li>{t("article_10.content_11")}</li>
                  <li>{t("article_10.content_12")}</li>
                  <li>{t("article_10.content_13")}</li>
                  <li>{t("article_10.content_14")}</li>
                  <li>{t("article_10.content_15")}</li>
                  <li>{t("article_10.content_16")}</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-11" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                {t("article_11.title")}
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <ul className="leading-6">
                  <li>{t("article_11.content_1")}</li>
                  <li>{t("article_11.content_2")}</li>
                  <li>{t("article_11.content_3")}</li>
                  <li>{t("article_11.content_4")}</li>
                  <li>{t("article_11.content_5")}</li>
                  <ol className="leading-7">
                    <li>{t("article_11.content_5_1")}</li>
                    <li>{t("article_11.content_5_2")}</li>
                    <li>{t("article_11.content_5_3")}</li>
                    <li>{t("article_11.content_5_4")}</li>
                    <li>{t("article_11.content_5_5")}</li>
                    <li>{t("article_11.content_5_6")}</li>
                    <li>{t("article_11.content_5_7")}</li>
                    <li>{t("article_11.content_5_8")}</li>
                  </ol>
                  <li>{t("article_11.content_6")}</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-12" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                {t("article_12.title")}
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <p className="mb-4">{t("article_12.content_1")}</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-13" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                {t("article_13.title")}
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <p className="mb-4">{t("article_13.content_1")}</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-14" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                {t("article_14.title")}
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <p className="mb-4">{t("article_14.content_1")}</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-15" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                {t("article_15.title")}
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <ul className="leading-6">
                  <li>{t("article_15.content_1")}</li>
                  <li>{t("article_15.content_2")}</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-16" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                {t("article_16.title")}
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <ul className="leading-6">
                  <li>{t("article_16.content_1")}</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <p className="text-label font-semibold text-end mr-2 mt-2">{t("end")}</p>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
