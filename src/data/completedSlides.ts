import type { LoadingVariant } from "@/components/TeamLoading/TeamLoading";
import type { TeamSlug } from "@/data/finishedPosters";
import { LOADING_VARIANT_TO_TEAM_SLUG } from "@/data/posterPdfTypes";
import {
  COMPLETED_SLIDES,
  type CompletedSlideRecord,
} from "@/data/completedSlides.gen";
import { resolvedCompletedSlide } from "@/data/completedSlideDisplayMeta";
import {
  canonicalSlideSlug,
  legacySlideStaticParamExtras,
} from "@/data/slideLegacySlugAliases";
import {
  normalizeSlideSlugParam,
  slideSlugStaticParamVariants,
} from "@/utils/normalizeSlideSlug";

export type { CompletedSlideRecord };

/** 班ページ「解説資料」・articles 一覧用（`public/{teamSlug}` → `slides` URL） */
export function pdfSpotlightsFromCompletedSlides(
  variant: LoadingVariant,
): { title: string; href: string; summaryLines: string[] }[] {
  const teamSlug = LOADING_VARIANT_TO_TEAM_SLUG[variant];
  return completedSlidesForTeam(teamSlug).map((s) => ({
    title: s.title,
    href: `/teams/${teamSlug}/pdf/${s.slug}/`,
    summaryLines: [],
  }));
}

/** マルキー用ピックアップ（タイトル順・先頭 `limit` 件） */
export function marqueePosterPickupsFromCompleted(
  variant: LoadingVariant,
  limit = 5,
): {
  href: string;
  title: string;
  author: string;
  previewPdfPath: string;
}[] {
  const teamSlug = LOADING_VARIANT_TO_TEAM_SLUG[variant];
  return completedSlidesForTeam(teamSlug)
    .slice(0, limit)
    .map((s) => ({
      href: `/teams/${teamSlug}/pdf/${s.slug}/`,
      title: s.title,
      author: s.author ?? "",
      previewPdfPath: s.pdfPath,
    }));
}

export function completedSlideByTeamAndSlug(
  team: TeamSlug,
  slug: string,
): CompletedSlideRecord | undefined {
  const canonical = canonicalSlideSlug(team, slug);
  const raw = COMPLETED_SLIDES.find(
    (s) =>
      s.teamSlug === team &&
      normalizeSlideSlugParam(s.slug) === normalizeSlideSlugParam(canonical),
  );
  return raw ? resolvedCompletedSlide(raw) : undefined;
}

export function completedSlidesForTeam(team: TeamSlug): CompletedSlideRecord[] {
  return COMPLETED_SLIDES.filter((s) => s.teamSlug === team)
    .map(resolvedCompletedSlide)
    .sort((a, b) => a.title.localeCompare(b.title, "ja"));
}

export function completedSlidesStaticParams(): {
  team: TeamSlug;
  slug: string;
}[] {
  const fromSlides: { team: TeamSlug; slug: string }[] = [];
  for (const s of COMPLETED_SLIDES) {
    for (const slug of slideSlugStaticParamVariants(s.slug)) {
      fromSlides.push({ team: s.teamSlug, slug });
    }
  }
  const merged = [...fromSlides, ...legacySlideStaticParamExtras()];
  const seen = new Set<string>();
  const out: { team: TeamSlug; slug: string }[] = [];
  for (const p of merged) {
    const key = `${p.team}\0${p.slug}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }
  return out;
}
