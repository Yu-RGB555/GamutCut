'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, Download, Zap, Check } from "lucide-react";
import { BsPersonArmsUp } from "react-icons/bs";
import { FaPenNib } from "react-icons/fa";
import { Link } from '@/i18n/routing';
import Image from "next/image";
import { motion } from "motion/react";
import { useTranslations, useLocale } from "next-intl";

export default function HelpPage() {

  const t = useTranslations('Introduction');
  const locale = useLocale();

  return (
    <div className="min-h-screen mb-8">
      <div className="container max-w-md sm:max-w-lg md:max-w-4xl mx-auto px-8">

        {/* 導入 */}
        <motion.div
          className="text-center space-y-6 lg:space-y-12 min-h-screen flex flex-col justify-center items-center py-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="space-y-6 lg:space-y-12">
            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              {locale === 'ja' ? (
                <>
                  <Image
                    src="/app_logo.svg"
                    alt="App Logo"
                    width={200}
                    height={200}
                    priority
                    className="w-[160px] md:w-[200px] lg:w-[300px]"
                  />
                  <span className="text-2xl md:text-3xl lg:text-5xl pt-3 lg:pt-5 pl-1 lg:pl-2 font-bold text-label">
                    {t('welcome')}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-2xl md:text-3xl lg:text-5xl pt-3 lg:pt-5 pr-2 lg:pr-4 font-bold text-label">
                    {t('welcome')}
                  </span>
                  <Image
                    src="/app_logo.svg"
                    alt="App Logo"
                    width={200}
                    height={200}
                    priority
                    className="w-[160px] md:w-[200px] lg:w-[300px]"
                  />
                </>
              )}
            </motion.div>
            <motion.p
              className="text-sm text-label/80 max-w-lg sm:max-w-3xl sm:text-lg lg:text-xl lg:max-w-4xl mx-auto leading-relaxed lg:leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              viewport={{ once:true }}
            >
              {t('overview')}
            </motion.p>
          </div>
        </motion.div>

        {/* GamutCutの特徴 */}
        <motion.div
          className="flex items-center justify-center mt-32 mb-12 lg:mb-14"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {locale === 'ja' ? (
            <>
              <Image
                src="/app_logo.svg"
                alt="App Logo"
                width={200}
                height={200}
                priority
                className="w-[160px] md:w-[200px] lg:w-[300px]"
              />
              <span className="text-2xl md:text-3xl lg:text-5xl pt-3 lg:pt-5 pl-1 lg:pl-2 font-bold text-label">{t('features_title')}</span>
            </>
          ) : (
            <>
              <span className="text-2xl md:text-3xl lg:text-5xl pt-3 lg:pt-5 pr-2 lg:pr-4 font-bold text-label">{t('features_title')}</span>
              <Image
                src="/app_logo.svg"
                alt="App Logo"
                width={200}
                height={200}
                priority
                className="w-[160px] md:w-[200px] lg:w-[300px]"
              />
            </>
          )}
        </motion.div>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-32 items-stretch"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="h-full"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Card className="bg-card border-2 border-muted h-full">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Palette className="h-6 w-6 text-red-400" />
                  <CardTitle className="text-lg">{t('feature_hsv_title')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-label/70">
                  {t('feature_hsv_desc')}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="h-full"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Card className="bg-card border-2 border-muted h-full">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Zap className="h-6 w-6 text-cyan-400" />
                  <CardTitle className="text-lg">{t('feature_speedy_title')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-label/70">
                  {t('feature_speedy_desc')}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="h-full"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Card className="bg-card border-2 border-muted h-full">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Download className="h-6 w-6 text-green-400 flex-shrink-0" />
                  <CardTitle className="text-lg">{t('feature_export_title')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-label/70">
                  {t('feature_export_desc')}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="h-full"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Card className="bg-card border-2 border-muted h-full">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Check className="h-6 w-6 text-yellow-400" />
                  <CardTitle className="text-lg">{t('feature_no_download_title')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-label/70">
                  {t('feature_no_download_desc')}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="h-full"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Card className="bg-card border-2 border-muted h-full">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <BsPersonArmsUp className="h-6 w-6 text-lime-400" />
                  <CardTitle className="text-lg">{t('feature_intuitive_title')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-label/70">
                  {t('feature_intuitive_desc')}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="h-full"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Card className="bg-card border-2 border-muted h-full">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <FaPenNib className="h-6 w-6 text-blue-400" />
                  <CardTitle className="text-lg">{t('feature_share_title')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-label/70">
                  {t('feature_share_desc')}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* 使い方の流れ */}
        <motion.div
          className="my-64"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-3xl font-bold text-label text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {t('flow_title')}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-cyan-400 rounded-full flex items-center justify-center text-2xl font-bold text-black mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-label mb-2">{t('flow_1_title')}</h3>
              <p className="text-sm text-label/70">
                {t('flow_1_desc')}
              </p>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center text-2xl font-bold text-black mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-label mb-2">{t('flow_2_title')}</h3>
              <p className="text-sm text-label/70">
                {t('flow_2_desc')}
              </p>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-2xl font-bold text-black mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-label mb-2">{t('flow_3_title')}</h3>
              <p className="text-sm text-label/70">
                {t('flow_3_desc')}
              </p>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-pink-400 rounded-full flex items-center justify-center text-2xl font-bold text-black mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold text-label mb-2">{t('flow_4_title')}</h3>
              <p className="text-sm text-label/70">
                {t('flow_4_desc')}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center my-32"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-2xl font-bold text-label mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {t('cta_title')}
          </motion.h2>
          <motion.p
            className="text-label/70 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {t('cta_desc')}
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Button asChild size="lg" className="bg-cyan-400 hover:bg-cyan-500 text-black font-semibold">
              <Link href="/mask">
                {t('cta_button_create')}
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="border-gray-400">
              <Link href="/work">
                {t('cta_button_view')}
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          className="max-w-4xl mx-auto mt-64 mb-24"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-3xl font-bold text-label text-center mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {t('faq_title')}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="faq-1" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                {t('faq_1_q')}
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <p className="leading-7">
                  {t('faq_1_a')}
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                {t('faq_2_q')}
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <p className="leading-7">
                  {t('faq_2_a')}
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                {t('faq_3_q')}
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <p className="leading-7">
                  {t('faq_3_a')}
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                {t('faq_4_q')}
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <p className="leading-7">
                  {t('faq_4_a')}
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                {t('faq_5_q')}
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <p className="leading-7">
                  {t('faq_5_a')}
                </p>
              </AccordionContent>
            </AccordionItem>
            <p className="mt-2"></p>
            </Accordion>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}