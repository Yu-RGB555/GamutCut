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
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";

export default function HelpPage() {
  return (
    <div className="min-h-screen mb-8">
      <div className="container max-w-md sm:max-w-lg md:max-w-4xl mx-auto px-8">

        {/* 導入 */}
        <motion.div
          className="text-center space-y-6 lg:space-y-12 min-h-screen flex flex-col justify-center items-center py-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ margin: "-50px" }}
        >
          <div className="space-y-6 lg:space-y-12">
            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              viewport={{ margin: "-50px" }}
            >
              <Image
                src="/app_logo.svg"
                alt="App Logo"
                width={200}
                height={200}
                priority
                className="w-[200px] lg:w-[300px]"
              />
              <span className="text-3xl lg:text-5xl pt-3 lg:pt-5 pl-1 lg:pl-2 font-bold text-label">とは？</span>
            </motion.div>
            <motion.p
              className="text-sm text-label/80 max-w-lg sm:max-w-3xl sm:text-lg lg:text-xl lg:max-w-4xl mx-auto leading-relaxed lg:leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              viewport={{ margin: "-50px" }}
            >
              色相環上に図形を配置して「ガマットマスク」を作成し、<br />
              統一感のある着彩をサポートするイラスト制作ツールです
            </motion.p>
          </div>
        </motion.div>

        {/* GamutCutの特徴 */}
        <motion.div
          className="flex items-center justify-center mt-32 mb-12 lg:mb-14"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ margin: "-100px" }}
        >
          <Image
            src="/app_logo.svg"
            alt="App Logo"
            width={200}
            height={200}
            priority
            className="w-[200px] lg:w-[300px]"
          />
          <span className="text-3xl lg:text-5xl pt-3 lg:pt-5 pl-1 lg:pl-2 font-bold text-label">の特徴</span>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-32 items-stretch"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ margin: "-100px" }}
        >
          <motion.div
            className="h-full"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            viewport={{ margin: "-50px" }}
          >
            <Card className="bg-card border-2 border-muted h-full">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Zap className="h-6 w-6 text-cyan-400" />
                  <CardTitle className="text-lg">スピーディーに作成</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-label/70">
                  ログインせずにガマットマスクの作成できます！
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="h-full"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ margin: "-50px" }}
          >
            <Card className="bg-card border-2 border-muted h-full">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Download className="h-6 w-6 text-green-400 flex-shrink-0" />
                  <CardTitle className="text-lg">スピーディーにエクスポート</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-label/70">
                  作成したマスクをPNG形式ですぐにエクスポートできます！
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="h-full"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            viewport={{ margin: "-50px" }}
          >
            <Card className="bg-card border-2 border-muted h-full">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Check className="h-6 w-6 text-yellow-400" />
                  <CardTitle className="text-lg">ダウンロード不要</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-label/70">
                  ブラウザ上で完結するので、ソフトのインストールや設定は一切不要です！
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="h-full"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            viewport={{ margin: "-50px" }}
          >
            <Card className="bg-card border-2 border-muted h-full">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <BsPersonArmsUp className="h-6 w-6 text-lime-400" />
                  <CardTitle className="text-lg">直感的な操作</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-label/70">
                  直感的で分かりやすく、快適な操作性を実現しました！
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="h-full"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            viewport={{ margin: "-50px" }}
          >
            <Card className="bg-card border-2 border-muted h-full">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Palette className="h-6 w-6 text-red-400" />
                  <CardTitle className="text-lg">色相環モデル</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-label/70">
                  デジタルイラストの着彩に適したHSV色相環モデルを採用しています！
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="h-full"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            viewport={{ margin: "-50px" }}
          >
            <Card className="bg-card border-2 border-muted h-full">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <FaPenNib className="h-6 w-6 text-blue-400" />
                  <CardTitle className="text-lg">作品投稿・共有</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-label/70">
                  作成したマスクを使ってイラスト作品を制作し、投稿してみましょう！他のユーザーの作品から着彩のコツが見つかるかも...！
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
          viewport={{ margin: "-100px" }}
        >
          <motion.h2
            className="text-3xl font-bold text-label text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ margin: "-100px" }}
          >
            使い方の流れ
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              viewport={{ margin: "-50px" }}
            >
              <div className="w-16 h-16 bg-cyan-400 rounded-full flex items-center justify-center text-2xl font-bold text-black mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-label mb-2">メインカラーを決める</h3>
              <p className="text-sm text-label/70">
                イラスト作品で使用したいメインカラーを決めます
              </p>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              viewport={{ margin: "-50px" }}
            >
              <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center text-2xl font-bold text-black mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-label mb-2">マスクを作成</h3>
              <p className="text-sm text-label/70">
                メインカラーを頂点とする図形をマスクとして作成します
              </p>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              viewport={{ margin: "-50px" }}
            >
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-2xl font-bold text-black mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-label mb-2">エクスポート</h3>
              <p className="text-sm text-label/70">
                マスクした色相環をPNG形式でダウンロードします
              </p>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              viewport={{ margin: "-50px" }}
            >
              <div className="w-16 h-16 bg-pink-400 rounded-full flex items-center justify-center text-2xl font-bold text-black mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold text-label mb-2">着彩に活用</h3>
              <p className="text-sm text-label/70">
                グラフィックソフトのスポイトツールで色を抽出して着彩します
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
          viewport={{ margin: "-100px" }}
        >
          <motion.h2
            className="text-2xl font-bold text-label mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            今すぐガマットマスクを作成してみませんか？
          </motion.h2>
          <motion.p
            className="text-label/70 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            登録不要で今すぐお試しいただけます。
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Button asChild size="lg" className="bg-cyan-400 hover:bg-cyan-500 text-black font-semibold">
              <Link href="/mask">
                マスクを作成する
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="border-gray-400">
              <Link href="/work">
                作品を見る
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
          viewport={{ margin: "-100px" }}
        >
          <motion.h2
            className="text-3xl font-bold text-label text-center mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            よくある質問
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="faq-1" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                ガマットマスクとは何ですか？
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <p className="leading-7">
                  ガマットマスクとは、色相環上に任意の形状のマスクを設置し、そのマスクの範囲内の色のみを使って着彩を行う手法で使用するマスクのことです。
                  これにより、色の統一感を保ちながら着彩を行うことができます。
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                未ログインでも使用できますか？
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <p className="leading-7">
                  はい。ガマットマスクの作成およびエクスポートは、未ログイン状態でもご使用いただけます。
                  ユーザー登録していただくと、マスクの保存や作品投稿などの追加機能をご利用いただけます。
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                どのようなグラフィックソフトで使用できますか？
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <p className="leading-7">
                  Clip Studio Paint、Photoshopなど、スポイトツールがあるグラフィックソフトであれば使用できます。
                  エクスポートした色相環画像からスポイトツールで色を抽出してご活用ください。
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                デジタルイラスト以外でも使えますか？
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <p className="leading-7">
                  本ツールは主にデジタルイラストの制作において真価を発揮します。
                  WebサイトのUIデザインなどには適していない場合がありますので、ご注意ください。
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5" className="bg-card border border-gray-400 rounded-lg px-6">
              <AccordionTrigger className="text-base text-label font-semibold hover:cursor-pointer">
                作成したマスクを保存できますか？
              </AccordionTrigger>
              <AccordionContent className="text-label">
                <p className="leading-7">
                  ユーザー登録していただくと、作成したマスクをプリセットとして保存できます。
                  保存したマスクは「Myマスク一覧」から再利用することができます。
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