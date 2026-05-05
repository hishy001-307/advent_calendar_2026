import type { LoadingVariant } from "@/components/TeamLoading/TeamLoading";

export type PdfSpotlight = {
  title: string;
  href: string;
  summaryLines: string[];
};

const FIELD_SUMMARY: Record<LoadingVariant, string[]> = {
  particle: ["準備中です"],
  condensedMatter: ["準備中です"],
  astrophysics: ["準備中です"],
  computationalMath: ["準備中です"],
  biophysics: ["準備中です"],
  experimental: ["準備中です"],
};

const PDF_PLACEHOLDER_ITEM: PdfSpotlight = {
  title: "",
  href: "#",
  summaryLines: ["準備中です"],
};

const PDF_PLACEHOLDERS: Record<LoadingVariant, PdfSpotlight[]> = {
  particle: [PDF_PLACEHOLDER_ITEM],
  condensedMatter: [PDF_PLACEHOLDER_ITEM],
  astrophysics: [PDF_PLACEHOLDER_ITEM],
  computationalMath: [PDF_PLACEHOLDER_ITEM],
  biophysics: [PDF_PLACEHOLDER_ITEM],
  experimental: [PDF_PLACEHOLDER_ITEM],
};

export function defaultFieldSummary(variant: LoadingVariant): string[] {
  return FIELD_SUMMARY[variant];
}

export function defaultPdfSpotlights(variant: LoadingVariant): PdfSpotlight[] {
  return PDF_PLACEHOLDERS[variant];
}

/** ナビ・解説記事一覧・トップページ班紘介用：班とパス・ロゴの対応（班ページ TeamPage と同じ public 配下のアセット） */
export const TEAM_NAV: {
  variant: LoadingVariant;
  teamName: string;
  teamHref: string;
  logoSrc: string;
}[] = [
  {
    variant: "particle",
    teamName: "素粒子物理班",
    teamHref: "/teams/particle",
    logoSrc: "/particle.png",
  },
  {
    variant: "condensedMatter",
    teamName: "物性物理班",
    teamHref: "/teams/condensed-matter",
    logoSrc: "/solid.png",
  },
  {
    variant: "astrophysics",
    teamName: "宇宙物理班",
    teamHref: "/teams/astrophysics",
    logoSrc: "/space.png",
  },
  {
    variant: "computationalMath",
    teamName: "計算・数理物理班",
    teamHref: "/teams/computational-math",
    logoSrc: "/calc.png",
  },
  {
    variant: "biophysics",
    teamName: "生物物理班",
    teamHref: "/teams/biophysics",
    logoSrc: "/bio.png",
  },
  {
    variant: "experimental",
    teamName: "実験班",
    teamHref: "/teams/experimental",
    logoSrc: "/exp.png",
  },
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
