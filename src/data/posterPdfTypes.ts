import type { LoadingVariant } from "@/components/TeamLoading/TeamLoading";
import type { TeamSlug } from "@/data/finishedPosters";

/** ポスター PDF 閲覧ページ用の最小データ（CSV 連携の FinishedPoster 含む） */
export type PosterPdfViewModel = {
  title: string;
  /** メタデータ等から推定。未設定なら表示しない */
  author?: string;
  teamSlug: TeamSlug;
  loadingVariant: LoadingVariant;
  pdfPaths: string[];
};

export const TEAM_SLUG_TO_LOADING_VARIANT: Record<TeamSlug, LoadingVariant> = {
  particle: "particle",
  "condensed-matter": "condensedMatter",
  astrophysics: "astrophysics",
  "computational-math": "computationalMath",
  biophysics: "biophysics",
  experimental: "experimental",
};

export const LOADING_VARIANT_TO_TEAM_SLUG: Record<
  LoadingVariant,
  TeamSlug
> = {
  particle: "particle",
  condensedMatter: "condensed-matter",
  astrophysics: "astrophysics",
  computationalMath: "computational-math",
  biophysics: "biophysics",
  experimental: "experimental",
};

/** 班ページ・PDF 閲覧の戻るリンクなどの表示名 */
export const TEAM_SLUG_TO_DISPLAY_NAME: Record<TeamSlug, string> = {
  particle: "素粒子物理班",
  "condensed-matter": "物性物理班",
  astrophysics: "宇宙物理班",
  "computational-math": "計算・数理物理班",
  biophysics: "生物物理班",
  experimental: "実験班",
};
