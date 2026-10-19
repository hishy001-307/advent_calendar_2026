# Physics Lab. 2026 ウェブサイト

東京大学理学部物理学科の学園祭企画「Physics Lab.」向けの公式サイトです。  
[Next.js](https://nextjs.org)（App Router）で実装し、**静的エクスポート**（`output: "export"`）でビルドします。

## 技術スタック

| 用途 | 主な依存 |
|------|-----------|
| フレームワーク | Next.js 16、React 19 |
| 言語 | TypeScript |
| スタイル | Tailwind CSS 4、`globals.css`、Sass（`.module.scss`） |
| 記事 | MDX（`@next/mdx`、`next-mdx-remote`）、KaTeX（数式） |

フォントは `src/app/layout.tsx` で **Zen Maru Gothic**（Google Fonts）を読み込んでいます。

## ディレクトリ構成（概要）

```
physlab2026_web/
├── public/                 # 画像・SVG など静的ファイル（ビルドでそのまま出力）
├── src/
│   ├── app/                # App Router（ページとレイアウト）
│   │   ├── layout.tsx      # ルートレイアウト（フォント・グローバル CSS）
│   │   ├── page.tsx        # トップ（ホーム）
│   │   ├── globals.css
│   │   ├── advent/         # アドベントカレンダー（layout.tsx / page.tsx）
│   │   ├── articles/       # 解説記事・各班資料の一覧
│   │   ├── contact/        # お問い合わせ
│   │   ├── performance/    # 学生講演（スケジュール・紹介、performanceData.ts）
│   │   └── teams/          # 各班紹介（particle, condensed-matter など）
│   ├── components/         # 共通 UI
│   │   ├── Header/         # グローバルナビ
│   │   ├── Footer/
│   │   ├── About/          # ホーム用
│   │   ├── TeamPage/       # 各班ページ共通（TeamPage.tsx, teamPageDefaults.ts, TeamLogoMarquee など）
│   │   ├── TeamLoading/    # 班テーマ色・背景クラス（班ページのスタイルと共用）
│   │   ├── ScrollReveal/
│   │   └── TableOfContents.tsx
│   ├── content/            # MDX コンテンツ・registry 等
│   │   └── advent/         # アドカレ記事（例: series1/1.mdx）
│   ├── types/
│   └── utils/              # 日付ヘルパーなど（date.ts）
├── next.config.ts          # 静的 export、本番時 basePath など
├── package.json
├── DEPLOY.md               # デプロイ手順のメモ
├── Dockerfile / Dockerfile.dev / docker-compose.yml
└── deploy.sh
```

## 主なルート（URL）

| パス | 内容 |
|------|------|
| `/` | ホーム |
| `/advent` | アドベントカレンダー |
| `/articles` | 解説記事・資料一覧（各班ページの PDF 枠と同じデータを集約） |
| `/contact` | お問い合わせ |
| `/performance` | 学生講演（Day1 / Day2 スケジュール、プログラム紹介） |
| `/teams/particle` など | 各班紹介（6 班） |

各班の文言・「解説資料」枠の共通データは `src/components/TeamPage/teamPageDefaults.ts` を編集します。  
学生講演の時刻・講演リストは `src/app/performance/performanceData.ts` です。

## 開発手順

```bash
npm install
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

その他:

```bash
npm run build    # 静的サイトを out/ に生成
npm run start    # next start（静的 export 運用では主に build の確認用）
npm run lint
npm run format   # Prettier
```

## 本番ビルドと公開パス

`next.config.ts` では本番（`NODE_ENV === "production"`）時に `basePath: "/physlab2026"` を付与しています。  
静的ファイルの出力先・サーバへの配置は **`DEPLOY.md`** を参照してください。

