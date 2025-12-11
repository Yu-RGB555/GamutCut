# GamutCut &nbsp; - ガマットカット -
### 🔗 &nbsp; [https://www.gamutcut.com](https://www.gamutcut.com)

<br>

![](https://www.gamutcut.com/opengraph-image.png)

<p align="right">オリキャラ：ガマットちゃん</p>


<br>

## 🎨 &nbsp; サービス概要
色相環上に円形や多角形の図形をマスクとして配置し、統一感を生み出せる色域に制限する「ガマットマスク」を作成できます。<br>
また、作成したマスクはPNG画像としてエクスポートでき、お使いのグラフィックソフトのスポイトツールで色を抽出して着彩にお使いいただけます。<br>
さらに、ガマットマスクを用いて制作したイラスト作品を投稿することも可能で、他のイラストレーターの皆様がどの色域で着彩を行なっているのか参考にすることもできます。

<br>

## 🎯 &nbsp; こんな人におすすめ！
> [!WARNING]
>本ツールは、主にデジタルイラストの制作において真価を発揮します。WebサイトのUIデザインなどにはあまり効果的ではないのでご注意ください。
- 着彩で統一感を出せず悩んでいる人
- バランスの取れた着彩をできるようになりたい人

<br>

## 🏡 &nbsp; 制作背景
私は「創作」が好きなので、プライベートではデジタルイラストを描いています。<br>

趣味とはいえ、日々上手くなるように練習をしているのですが、着彩がどうしても思うようにいかず悩んでいた中、統一感を出しやすくする方法の1つとして「**ガマットマッピング**」という手法があることを知りました。<br>

この着彩法は色相環上に三角形や四角形のマスクを設置し、その範囲内の色だけを使って着彩を行う手法で、このマスクのことを「**ガマットマスク**」と呼びます。<br>

|　　　　　　　　  　　　　　　　　   　　　　　　　　　　　　　　　　　　　　　|
|:-:|
|<img width="400" src="https://i.gyazo.com/3ea7a3580c28ff3f02d6275af7a7d966.png" loading="lazy">|
<font>ガマットマスク</font>

実は、ガマットマスクを作成できるサイトはすでにいくつか存在していました。<br>
しかし、採用されていた色相環モデルはアナログイラストに適したものであり、**デジタルイラストに適した色相環モデル** を扱った作成サイトは見当たりませんでした。<br>
イラスト界隈でもまだ認知度が低い着彩法ですが、これを機に広めていきたい想いも重なり、デジタルイラストに適したガマットマスクを作成できるサイトを開発することに決めました。

|　　　　　　　　  　　　　　　　　   　　　　　　　　　　　　　　　　　　　　　|
|:-:|
|<img width="400" src="https://i.gyazo.com/ae7b8f698f2f19c3858e4eb69103f63f.png" loading="lazy">|
<font>この色相環はアナログに適したYRMBCGモデル<br>（※画像引用元は[こちら](https://blog.itod.dev/story/gamut-color-mask-tool/)）</font>

<br>

## :art: &nbsp; 色相環
アナログは絵の具を重ねるほど濁っていく **減法混色の原理** に従うため、その色相環モデルの中心部分は中心に向かうほど彩度が低くなる表現を出すために直感的なグレーを使っています。一方で、デジタルはさまざまな色の光が混ざり合うほど白に近づく **加法混色の原理** に従います。<br>

デジタルイラストに使うのであれば、**加法混色の原理** に従って色相環モデルの中心に向かうほど白くなるべきということで、本サイトでは **HSV色相環モデル** を採用し、**色相環自体の明度も調整できる** ようにすることで色の三要素（色相、彩度、明度）が取りうるすべての色を抽出できるようにしました。<br>

|色相環（HSVモデル）　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　|
|:-:|
|<img width="600" src="https://i.gyazo.com/18d511af1e51efb9522a6e5e10065b24.gif">|
<font>色相環自体の明度も1〜100のスケールで調整できるようにすることで、<br>すべての色を再現できるようにしました。</tont>

<br>

## 💡 &nbsp; 使い方
1. イラスト作品で使用したいメインカラーを決めたら、そのメインカラーを頂点とする図形をマスクとして作成します。（例. メインカラーが4つの場合、四角形のマスクを作成）<br>

2. マスクした色相環をPNG形式でエクスポートします<br>

3. お使いのグラフィックソフトにて、エクスポートした色相環からスポイトツールで色を抽出することで着彩にお役立ていただけます。

4. マスクの作成およびエクスポートは、未ログイン状態でもご使用いただけます。

5. ユーザー登録していただくと、ガマットマッピングで着彩したイラスト作品を使用したマスクの設定と併せて投稿することができます。（※作品閲覧は、未ログイン状態でも可能です）

<br>

## 🔖 &nbsp; 本サービスの機能
# 5.&nbsp; 機能紹介
> [!TIP]
>機能名の横に（🔒）が付いている機能は、**ログインユーザーのみ**使用可能な機能です。

<table>
  <tr>
    <td><strong>:art: &nbsp; マスク追加機能</strong></td>
    <td><strong>:inbox_tray: &nbsp; ダウンロード機能</strong></td>
  </tr>
  <tr>
    <td>
        <img src="https://i.gyazo.com/3fe27264659b1dc193820aae01a879e5.gif" loading="lazy">
    </td>
    <td>
        <img src="https://i.gyazo.com/be46baa8f9fdb19fea5a30c3e758d4e6.gif" loading="lazy">
    </td>
  </tr>
  <tr>
    <td>色相環上にマスクを３つまで追加できます。大きさや位置の調整も可能です。</td>
    <td>作成したマスクをpng画像でダウンロードすることができます。</td>
  </tr>
</table>

<table>
  <tr>
    <td><strong>:floppy_disk: &nbsp; マスク保存機能（🔒）</strong></td>
    <td><strong>:rocket: &nbsp; オンボーディング機能</strong></td>
  </tr>
  <tr>
    <td>
        <img src="https://i.gyazo.com/8552e88f67e67f290eb5a2ed665d41cc.gif" loading="lazy">
    </td>
    <td>
        <img src="https://i.gyazo.com/eac071e94d603d122c1c52388e46b6da.gif" loading="lazy">
    </td>
  </tr>
  <tr>
    <td>作成したマスクをMyマスクとして保存できます</td>
    <td>使い方がわからない人に向けたクイックガイド機能です</td>
  </tr>
</table>

<table>
  <tr>
    <td><strong>🖋️ &nbsp; 作品投稿（🔒）</strong></td>
    <td><strong>:globe_with_meridians: &nbsp; 作品公開設定（🔒）</strong></td>
  </tr>
  <tr>
    <td>
        <img src="https://i.gyazo.com/213549e79c98616f4d9a42f96a3718ce.gif" loading="lazy">
    </td>
    <td>
        <img src="https://i.gyazo.com/bd2fe4d10aa7c962aaa86fbdcae35505.gif" loading="lazy">
    </td>
  </tr>
  <tr>
    <td>イラスト作品を投稿できます。<br>投稿した作品は、編集・削除することが可能です。</td>
    <td>投稿作品の公開設定を『下書き』『公開』で切り替えられます。</td>
  </tr>
</table>

<table>
  <tr>
    <td><strong>:satellite: &nbsp;  X（旧Twitter）シェア機能</strong></td>
    <td><strong>:speech_balloon: &nbsp; コメント機能（🔒）</strong></td>
  </tr>
  <tr>
    <td>
        <img src="https://i.gyazo.com/8b01d62acba7598df854ba966321b936.gif" loading="lazy">
    </td>
    <td>
        <img src="https://i.gyazo.com/4420f64fa9a41b3ae0bb32bf4d64f5d4.gif" loading="lazy">
    </td>
  </tr>
  <tr>
    <td>投稿した作品をXにシェアできます。<br>動的OGPの実装により、シェア時の表示内容は作品ごとに変化するようになります。</td>
    <td>投稿されている作品にコメントを投稿できます。更新、削除も可能です。</td>
  </tr>
</table>

<table>
  <tr>
    <td><strong>:pencil: &nbsp; コピーして編集</strong></td>
    <td><strong>:house: &nbsp; マイページ（🔒）</strong></td>
  </tr>
  <tr>
    <td>
        <img src="https://i.gyazo.com/a3418a2cd638bc2c8594c95d4782c9df.gif" loading="lazy">
    </td>
    <td>
        <img src="https://i.gyazo.com/0b076d32b0e9d8718389159ce7768dd6.gif" loading="lazy">
    </td>
  </tr>
  <tr>
    <td>他ユーザーが作成したマスクを使って着彩したい人向けの機能です。コピーしたマスクはすぐにダウンロード・Myマスクに保存できます。</td>
    <td>会員登録すると、マイページでアバターアイコン設定やプロフィール設定が可能になります。</td>
  </tr>
</table>

|:mag_right: &nbsp; リアルタイムサーチ機能　　　　　　　　  　　　　　　　　   　　　　　　　　　　　|
|:-:|
|<img width="400px" src="https://i.gyazo.com/278e043d4e48c82af9f752d683020ef9.gif" loading="lazy">|
<font>Reactの useEffect と検索機能を提供するGem「ransack」を組み合わせた機能。<br>入力するたびに部分一致による絞り込みを行い、作品を表示します。<br>入力中にデータを逐次取得するので、レスポンスの待機時間を感じさせません。</font>

<br>

## 🔱 &nbsp; 技術スタック

| カテゴリ | 採用技術 |
|:---|:-----|
| サーバーサイド言語	| Ruby 3.4.2 |
| サーバーサイドフレームワーク	| Rails 7.2.2 |
| クライアントサイド言語	| TypeScript 5.8.3 |
| クライアントサイドライブラリ | React 19.1.0 |
| クライアントサイドフレームワーク | Next.js 15.4.8 |
| サーバーランタイム | Node.js 22.16.0 |
| CSSフレームワーク | Tailwind CSS v4 |
| データベース	| PostgreSQL 16 |
| 外部ストレージ（本番環境） | Amazon S3 |
| 外部ストレージ（開発環境） | MinIO |
| API | Google API OAuth 2.0 / Twitter API |
| CDN | Cloudfrare |
| ホスティングプラットフォーム	| Vercel / Render |
| 開発環境構築ツール	| Docker |
| バージョン管理システム	| Git / GitHub |

<br>

### その他
・[Shadcn-UI](https://ui.shadcn.com/)（UIコンポーネントコレクション）

・[NextStep](https://nextstepjs.com/)（オンボーディングライブラリ）

・[Motion](https://motion.dev/?platform=react)（アニメーションライブラリ）

・[react-loader-spinner](https://mhnpd.github.io/react-loader-spinner/)（ローディングアニメーションコレクション）

・[ransack](https://github.com/activerecord-hackery/ransack)（検索・ソート・フィルター機能を提供するGem）

・[canvas API](https://developer.mozilla.org/ja/docs/Web/API/Canvas_API)（色相環、マスクの描画に使用）

<br>

## アプリケーション構成図
![alt アプリケーション構成図](https://github.com/user-attachments/assets/139f775c-bd39-4159-ae46-54abdabffd7e)

<br>

## 画面遷移図
### 🔗 &nbsp; [画面遷移図（Figma）](https://www.figma.com/design/L3rfddFQ4uDPR1rhKFgTxm/GamutCut_%E7%94%BB%E9%9D%A2%E9%81%B7%E7%A7%BB%E5%9B%B3?node-id=0-1&p=f&t=PX9CSdgK7AQqFl2P-0)

<br>

## ER図
![alt 卒制ER図](https://github.com/user-attachments/assets/c2aca4e2-38dc-4124-87b8-74d10e2e8436)
