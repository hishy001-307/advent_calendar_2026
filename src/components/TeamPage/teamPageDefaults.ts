import type { LoadingVariant } from "@/components/TeamLoading/TeamLoading";

export type PdfSpotlight = {
  title: string;
  href: string;
  summaryLines: string[];
};

const FIELD_SUMMARY: Record<LoadingVariant, string[]> = {
  particle: [
    "素粒子物理学は、物質と力の最も小さな構成単位と、その相互作用の法則を探る分野です。加速器実験や精密測定を通じて、標準模型を超える新物理の兆候を追い求めます。",
    "対称性の破れや高エネルギー現象を手がかりに、宇宙の初期から今日までを一つの枠組みで理解することを目指します。",
  ],
  condensedMatter: [
    "物性物理学は、多体系における電子・スピン・格子の協同現象を研究し、超伝導や磁性、トポロジカル相などの創発的性質を明らかにします。",
    "理論・数値・実験が連携し、新しい材料設計や量子デバイスの基盤となる原理探索につなげていきます。",
  ],
  astrophysics: [
    "宇宙物理学は、星・銀河・宇宙の大規模構造を観測と理論の両面から捉え、宇宙の形成と進化の物語を解き明かします。",
    "電磁波や重力波、粒子観測など多様なメッセンジャーを組み合わせ、ダークマターや初期宇宙の謎に迫ります。",
  ],
  computationalMath: [
    "計算・数理物理は、物理現象を数式とアルゴリズムでモデル化し、厳密解析と大規模シミュレーションで予測と理解を深めます。",
    "機械学習や確率モデルも活用し、複雑系のパターン発見やデータ駆動の理論構築へと展開していきます。",
  ],
  biophysics: [
    "生物物理学は、生命の仕組みを物理の視点から捉え、分子から細胞・個体スケールまでのダイナミクスを定量的に説明します。",
    "実験手法と理論モデルを組み合わせ、生命現象の普遍性と多様性の両面にアプローチします。",
  ],
  experimental: [
    "実験物理は、理論の予言を検証し、新しい現象を発見するための装置づくりと精密測定の現場です。",
    "センサー、光学系、低温・真空環境など幅広い技術を統合し、再現性の高いデータ取得に取り組みます。",
  ],
};

const PDF_PLACEHOLDERS: Record<LoadingVariant, PdfSpotlight[]> = {
  particle: [
    {
      title: "班紹介スライド（準備中）",
      href: "#",
      summaryLines: [
        "研究テーマと活動の概要をまとめたスライド資料の置き場です。公開準備が整い次第、ここからダウンロードできるようにします。",
      ],
    },
    {
      title: "加速器・検出器ミニ講義（準備中）",
      href: "#",
      summaryLines: [
        "実験の見方を学ぶための短い解説資料です。図版と用語集を中心に、初めての方にも読みやすい構成を予定しています。",
      ],
    },
    {
      title: "よくある質問（準備中）",
      href: "#",
      summaryLines: [
        "説明会やブースで寄せられた質問を整理したQ&A資料です。更新しながら厚みを増やしていきます。",
      ],
    },
  ],
  condensedMatter: [
    {
      title: "班紹介スライド（準備中）",
      href: "#",
      summaryLines: [
        "物性班の研究領域とキーワードを紹介する資料です。公開時期は追ってお知らせします。",
      ],
    },
    {
      title: "固体物理学いろは（準備中）",
      href: "#",
      summaryLines: [
        "バンド、フォノン、相転移など基本概念をコンパクトにまとめた入門メモです。",
      ],
    },
    {
      title: "おすすめレビュー論文リスト（準備中）",
      href: "#",
      summaryLines: [
        "学びを深めたい方向けに、分野の概観が掴めるレビュー論文をピックアップする予定です。",
      ],
    },
  ],
  astrophysics: [
    {
      title: "班紹介スライド（準備中）",
      href: "#",
      summaryLines: [
        "観測・理論の両面から宇宙班の活動を紹介するスライドです。",
      ],
    },
    {
      title: "観測データの見方（準備中）",
      href: "#",
      summaryLines: [
        "スペクトルや画像データをどう解釈するか、具体例つきで解説する資料を用意します。",
      ],
    },
    {
      title: "宇宙論キーワード集（準備中）",
      href: "#",
      summaryLines: [
        "専門用語を短い説明とともに一覧化し、自主学習の入口にします。",
      ],
    },
  ],
  computationalMath: [
    {
      title: "班紹介スライド（準備中）",
      href: "#",
      summaryLines: [
        "シミュレーション・数理モデリング・データ解析の役割分担を整理した紹介資料です。",
      ],
    },
    {
      title: "数値計算ワークフロー（準備中）",
      href: "#",
      summaryLines: [
        "再現性のある計算環境と検証の進め方をまとめたガイドを掲載予定です。",
      ],
    },
    {
      title: "参考となる教科書・ノート（準備中）",
      href: "#",
      summaryLines: [
        "計算物理と数理手法の学習に役立つ文献リストを公開します。",
      ],
    },
  ],
  biophysics: [
    {
      title: "班紹介スライド（準備中）",
      href: "#",
      summaryLines: [
        "分子スケールからシステム生物学まで、生物物理班の幅広い関心を紹介します。",
      ],
    },
    {
      title: "実験手法ガイド（準備中）",
      href: "#",
      summaryLines: [
        "蛍光顕微鏡や単分子測定など、代表的な手法の原理と注意点を短く解説します。",
      ],
    },
    {
      title: "モデリング入門（準備中）",
      href: "#",
      summaryLines: [
        "反応拡散系やネットワークモデルなど、生物現象の数理モデル入門資料を用意します。",
      ],
    },
  ],
  experimental: [
    {
      title: "班紹介スライド（準備中）",
      href: "#",
      summaryLines: [
        "実験班のプロジェクトと使用装置の概要をまとめた資料です。",
      ],
    },
    {
      title: "安全と運用チェックリスト（準備中）",
      href: "#",
      summaryLines: [
        "実験室での作業前後に確認したい項目を一覧化したPDFを掲載予定です。",
      ],
    },
    {
      title: "データ取得ノウハウ集（準備中）",
      href: "#",
      summaryLines: [
        "ノイズ対策、校正、ログ管理など、良いデータを残すための実務Tipsを共有します。",
      ],
    },
  ],
};

export function defaultFieldSummary(variant: LoadingVariant): string[] {
  return FIELD_SUMMARY[variant];
}

export function defaultPdfSpotlights(variant: LoadingVariant): PdfSpotlight[] {
  return PDF_PLACEHOLDERS[variant];
}

/** ナビ・解説記事一覧用：班とパスの対応 */
export const TEAM_NAV: {
  variant: LoadingVariant;
  teamName: string;
  teamHref: string;
}[] = [
  { variant: "particle", teamName: "素粒子物理班", teamHref: "/teams/particle" },
  {
    variant: "condensedMatter",
    teamName: "物性物理班",
    teamHref: "/teams/condensed-matter",
  },
  { variant: "astrophysics", teamName: "宇宙物理班", teamHref: "/teams/astrophysics" },
  {
    variant: "computationalMath",
    teamName: "計算・数理物理班",
    teamHref: "/teams/computational-math",
  },
  { variant: "biophysics", teamName: "生物物理班", teamHref: "/teams/biophysics" },
  { variant: "experimental", teamName: "実験班", teamHref: "/teams/experimental" },
];

/** 各班ページの「解説資料（PDF）」と同一データを一覧用にまとめる */
export function getAllTeamsPdfSpotlights(): {
  variant: LoadingVariant;
  teamName: string;
  teamHref: string;
  items: PdfSpotlight[];
}[] {
  return TEAM_NAV.map(({ variant, teamName, teamHref }) => ({
    variant,
    teamName,
    teamHref,
    items: PDF_PLACEHOLDERS[variant],
  }));
}
