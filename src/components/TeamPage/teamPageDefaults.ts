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
