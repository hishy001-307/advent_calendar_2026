import type { LoadingVariant } from "@/components/TeamLoading/TeamLoading";

/** 班ページのパス用スラッグ（`app/teams/[team]/...` と一致） */
export type TeamSlug =
  | "particle"
  | "condensed-matter"
  | "astrophysics"
  | "computational-math"
  | "biophysics"
  | "experimental";

export type FinishedPoster = {
  slug: string;
  teamSlug: TeamSlug;
  loadingVariant: LoadingVariant;
  /** CSV と同一（グラフのタイトル・関連付けと一致） */
  title: string;
  author: string;
  /** `public/` からのパス（先頭 `/`） */
  pdfPaths: string[];
  summaryLines: string[];
};

function pdf(
  name: string,
): `/全ポスター格納/完成/${string}` {
  return `/全ポスター格納/完成/${name}` as `/全ポスター格納/完成/${string}`;
}

/**
 * `全ポスター格納/完成` にある PDF と CSV ポスター行の対応。
 * `main.pdf`・`Physlab2026__Copy_.pdf` は内容不明のため除外。
 */
export const FINISHED_POSTERS: FinishedPoster[] = [
  {
    slug: "akada-b0-cp-violation",
    teamSlug: "particle",
    loadingVariant: "particle",
    title: String.raw`$B^0$中間子の$CP$対称性を破るメカニズム`,
    author: "赤田虎太郎",
    pdfPaths: [pdf("Physlab2026__赤田虎太郎4_CP破れ_ver2.pdf")],
    summaryLines: ["担当: 赤田虎太郎", "ポスター PDF（完成稿）"],
  },
  {
    slug: "akada-qed-klein-nishina",
    teamSlug: "particle",
    loadingVariant: "particle",
    title: "QEDからKlein-Nishinaの公式を導く",
    author: "赤田虎太郎",
    pdfPaths: [pdf("Physlab2026__赤田虎太郎2_QEDからKlein_Nishina_ver3.pdf")],
    summaryLines: ["担当: 赤田虎太郎", "ポスター PDF（完成稿）"],
  },
  {
    slug: "akada-weak-helicity",
    teamSlug: "particle",
    loadingVariant: "particle",
    title: "弱い力は向きを選ぶ 〜ヘリシティに焦点を当てて〜",
    author: "赤田虎太郎",
    pdfPaths: [pdf("Physlab2026__赤田虎太郎4_weak_helicity_ver3.pdf")],
    summaryLines: ["担当: 赤田虎太郎", "ポスター PDF（完成稿）"],
  },
  {
    slug: "iwasaki-extra-dimensions",
    teamSlug: "particle",
    loadingVariant: "particle",
    title: "さようなら余剰次元",
    author: "岩嵜亘平",
    pdfPaths: [pdf("Physlab2026 さようなら余剰次元_岩嵜亘平.pdf")],
    summaryLines: ["担当: 岩嵜亘平", "ポスター PDF（完成稿）"],
  },
  {
    slug: "higashigawa-standard-model",
    teamSlug: "particle",
    loadingVariant: "particle",
    title: "世界を記述する式：標準模型",
    author: "東川レオン",
    pdfPaths: [pdf("Physlab2026_Higashigawa_1_revised.pdf")],
    summaryLines: ["担当: 東川レオン", "ポスター PDF（完成稿）"],
  },
  {
    slug: "ishikawa-scattering-qft",
    teamSlug: "particle",
    loadingVariant: "particle",
    title: "場の量子論で計算する散乱",
    author: "石川こすも",
    pdfPaths: [pdf("Physlab2026_石川こすも_1_レビュー後第2稿.pdf")],
    summaryLines: ["担当: 石川こすも", "ポスター PDF（完成稿）"],
  },
  {
    slug: "ui-neutrino-mass-term",
    teamSlug: "particle",
    loadingVariant: "particle",
    title: "ニュートリノの質量項",
    author: "宇井海翔",
    pdfPaths: [pdf("Physlab2026_KaitoUi_3.ver2_ニュートリノの質量項.pdf")],
    summaryLines: ["担当: 宇井海翔", "ポスター PDF（完成稿）"],
  },
  {
    slug: "kubo-energy-scale",
    teamSlug: "particle",
    loadingVariant: "particle",
    title: "エネルギースケールと有効理論",
    author: "久保厚誠",
    pdfPaths: [pdf("Physlab2026_久保厚誠_2_最終.pdf")],
    summaryLines: ["担当: 久保厚誠", "ポスター PDF（完成稿）"],
  },
  {
    slug: "kubo-neutrino-oscillation",
    teamSlug: "particle",
    loadingVariant: "particle",
    title: "ニュートリノはなぜ姿を変えるのか",
    author: "久保厚誠",
    pdfPaths: [pdf("Physlab2026_久保厚誠_3_最終.pdf")],
    summaryLines: ["担当: 久保厚誠", "ポスター PDF（完成稿）"],
  },
  {
    slug: "sakaki-wigner-one-particle",
    teamSlug: "particle",
    loadingVariant: "particle",
    title: "一粒子状態とは何か 　〜Wignerの分類〜",
    author: "榊千紗都",
    pdfPaths: [pdf("Physlab2026_Sakaki_1.pdf")],
    summaryLines: ["担当: 榊千紗都", "ポスター PDF（完成稿）"],
  },
  {
    slug: "sakaki-vacuum",
    teamSlug: "particle",
    loadingVariant: "particle",
    title: "真空とは何か",
    author: "榊千紗都",
    pdfPaths: [pdf("Physlab2026_Sakaki_2.pdf")],
    summaryLines: ["担当: 榊千紗都", "ポスター PDF（完成稿）"],
  },
  {
    slug: "sakaki-path-integral",
    teamSlug: "particle",
    loadingVariant: "particle",
    title: "経路積分と時間発展",
    author: "榊千紗都",
    pdfPaths: [pdf("Physlab2026_Sakaki_3.pdf")],
    summaryLines: ["担当: 榊千紗都", "ポスター PDF（完成稿）"],
  },
  {
    slug: "ogihara-catching-particles",
    teamSlug: "particle",
    loadingVariant: "particle",
    title: "素粒子を捉える",
    author: "荻原浩人",
    pdfPaths: [pdf("Physlab2026_荻原_素粒子を捉える.pdf")],
    summaryLines: ["担当: 荻原浩人", "ポスター PDF（完成稿）"],
  },
  {
    slug: "kimura-doppler-cooling",
    teamSlug: "condensed-matter",
    loadingVariant: "condensedMatter",
    title: "ドップラー効果でものを冷やそう",
    author: "木村綾汰",
    pdfPaths: [pdf("Physlab2026_木村綾汰_1.pdf")],
    summaryLines: ["担当: 木村綾汰", "ポスター PDF（完成稿）"],
  },
  {
    slug: "kimura-metal-cooling",
    teamSlug: "condensed-matter",
    loadingVariant: "condensedMatter",
    title: "金属を冷やしていくと何が起こるの？",
    author: "木村綾汰",
    pdfPaths: [pdf("Physlab2026_木村綾汰_2.pdf")],
    summaryLines: ["担当: 木村綾汰", "ポスター PDF（完成稿）"],
  },
  {
    slug: "sugihara-imaging-methods",
    teamSlug: "condensed-matter",
    loadingVariant: "condensedMatter",
    title: "モノのいろんな「写真」をとる方法",
    author: "杉原 & 岩沢",
    pdfPaths: [pdf("Physlab2026_杉原浩一_1.pdf")],
    summaryLines: ["担当: 杉原・岩沢", "ポスター PDF（完成稿）"],
  },
  {
    slug: "sugihara-anomalous-velocity",
    teamSlug: "condensed-matter",
    loadingVariant: "condensedMatter",
    title: "異常速度：位置演算子は非可換に？",
    author: "杉原浩一",
    pdfPaths: [pdf("Physlab2026_杉原浩一_3.pdf")],
    summaryLines: ["担当: 杉原浩一", "ポスター PDF（完成稿）"],
  },
  {
    slug: "chubachi-rubber-stat-mech",
    teamSlug: "condensed-matter",
    loadingVariant: "condensedMatter",
    title: "統計力学とゴム弾性の物理",
    author: "中鉢朝陽",
    pdfPaths: [pdf("Physlab2026_chubachiasahi_2.pdf")],
    summaryLines: ["担当: 中鉢朝陽", "ポスター PDF（完成稿）"],
  },
  {
    slug: "takaya-ads-cft-hawking-page",
    teamSlug: "computational-math",
    loadingVariant: "computationalMath",
    title: String.raw`AdS\CFT対応とHawking-Page相転移`,
    author: "高谷賢裕",
    pdfPaths: [pdf("Physicslab_takaya1.pdf")],
    summaryLines: ["担当: 高谷賢裕", "ポスター PDF（完成稿）"],
  },
  {
    slug: "numerical-computation-cool",
    teamSlug: "computational-math",
    loadingVariant: "computationalMath",
    title: "数値計算はカッコいい！",
    author: "桒田大幹",
    pdfPaths: [pdf("Physlab2026_hiroki_compmath_2.pdf")],
    summaryLines: ["担当: 桒田大幹", "ポスター PDF（完成稿）"],
  },
  {
    slug: "orihara-non-equilibrium-measurement",
    teamSlug: "biophysics",
    loadingVariant: "biophysics",
    title: "非平衡と生物測定",
    author: "折原和樹",
    pdfPaths: [
      pdf("Physlab2026__Kazuki_ORIHARA__1.pdf"),
      pdf("Physlab2026__Kazuki_ORIHARA__2.pdf"),
    ],
    summaryLines: [
      "担当: 折原和樹",
      "同一企画の分割 PDF（2 ファイル）をまとめて掲載しています。",
    ],
  },
  {
    slug: "tanaka-what-is-biophysics",
    teamSlug: "biophysics",
    loadingVariant: "biophysics",
    title: "生物物理学で、どんなことがわかる？",
    author: "田中千福",
    pdfPaths: [pdf("Physlab2026_hiroki_bio_1.pdf")],
    summaryLines: ["担当: 田中千福", "ポスター PDF（完成稿）"],
  },
  {
    slug: "tanaka-microbial-adaptation",
    teamSlug: "biophysics",
    loadingVariant: "biophysics",
    title: "微生物はどうやって環境に合わせて動くのか",
    author: "田中千福",
    pdfPaths: [pdf("Physlab2026_hiroki_bio_2.pdf")],
    summaryLines: ["担当: 田中千福", "ポスター PDF（完成稿）"],
  },
  {
    slug: "toshinari-cyclotron",
    teamSlug: "experimental",
    loadingVariant: "experimental",
    title: "サイクロトロンってなーんだ？",
    author: "俊成哲",
    pdfPaths: [pdf("Physlab2026_俊成哲_1.pdf")],
    summaryLines: ["担当: 俊成哲", "ポスター PDF（完成稿）"],
  },
  {
    slug: "zhang-cosmic-time-rewind",
    teamSlug: "astrophysics",
    loadingVariant: "astrophysics",
    title: "宇宙の時間を巻き戻す方法",
    author: "張皓勤",
    pdfPaths: [pdf("Physlab2026_張皓勤_2.pdf")],
    summaryLines: ["担当: 張皓勤", "ポスター PDF（完成稿）"],
  },
  {
    slug: "toshinari-cosmic-timeline",
    teamSlug: "astrophysics",
    loadingVariant: "astrophysics",
    title: "宇宙の誕生から現在まで",
    author: "俊成哲",
    pdfPaths: [pdf("Physlab2026_俊成哲_3.pdf")],
    summaryLines: ["担当: 俊成哲", "ポスター PDF（完成稿）"],
  },
  {
    slug: "kubota-hydrostatic-equilibrium",
    teamSlug: "astrophysics",
    loadingVariant: "astrophysics",
    title: "星の大きさはなぜ一定？-静水圧平衡-",
    author: "窪田剛大",
    pdfPaths: [pdf("Physlab2026_TakehiroKubota_2.pdf")],
    summaryLines: ["担当: 窪田剛大", "ポスター PDF（完成稿）"],
  },
];

export const POSTER_PAGE_TEAM_SLUGS = [
  "particle",
  "condensed-matter",
  "astrophysics",
  "computational-math",
  "biophysics",
  "experimental",
] as const satisfies readonly TeamSlug[];

export function isTeamSlug(s: string): s is TeamSlug {
  return (POSTER_PAGE_TEAM_SLUGS as readonly string[]).includes(s);
}

export function posterByTeamAndSlug(
  team: string,
  slug: string,
): FinishedPoster | undefined {
  return FINISHED_POSTERS.find(
    (p) => p.teamSlug === team && p.slug === slug,
  );
}
