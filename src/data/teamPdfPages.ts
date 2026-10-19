import type { PosterPdfViewModel } from "@/data/posterPdfTypes";
import {
  TEAM_SLUG_TO_DISPLAY_NAME,
  TEAM_SLUG_TO_LOADING_VARIANT,
} from "@/data/posterPdfTypes";
import {
  completedSlideByTeamAndSlug,
  completedSlidesStaticParams,
} from "@/data/completedSlides";
import {
  FINISHED_POSTERS,
  isTeamSlug,
  posterByTeamAndSlug,
  type TeamSlug,
} from "@/data/finishedPosters";
import { normalizeSlideSlugParam } from "@/utils/normalizeSlideSlug";

/** サイト内の PDF 閲覧ページ（解説資料 + 旧ポスター稿） */
export function resolveTeamPdfPage(
  team: TeamSlug,
  slug: string,
): PosterPdfViewModel | undefined {
  const slide = completedSlideByTeamAndSlug(team, slug);
  if (slide) {
    return {
      title: slide.title,
      author: slide.author ?? undefined,
      teamSlug: slide.teamSlug,
      loadingVariant: TEAM_SLUG_TO_LOADING_VARIANT[team],
      pdfPaths: [slide.pdfPath],
    };
  }

  const poster = posterByTeamAndSlug(team, slug);
  if (poster) return poster;

  return undefined;
}

export function teamPdfCanonicalSlug(team: TeamSlug, slug: string): string {
  const slide = completedSlideByTeamAndSlug(team, slug);
  if (slide) return slide.slug;
  const poster = posterByTeamAndSlug(team, slug);
  if (poster) return poster.slug;
  return normalizeSlideSlugParam(slug);
}

export function teamPdfPagePath(team: TeamSlug, slug: string): string {
  const canonical = teamPdfCanonicalSlug(team, slug);
  return `/teams/${team}/pdf/${encodeURIComponent(canonical)}/`;
}

export function teamPdfStaticParams(): { team: TeamSlug; slug: string }[] {
  const fromSlides = completedSlidesStaticParams();
  const fromPosters = FINISHED_POSTERS.map((p) => ({
    team: p.teamSlug,
    slug: p.slug,
  }));

  const seen = new Set<string>();
  const out: { team: TeamSlug; slug: string }[] = [];
  for (const p of [...fromSlides, ...fromPosters]) {
    if (!isTeamSlug(p.team)) continue;
    const key = `${p.team}\0${normalizeSlideSlugParam(p.slug)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ team: p.team, slug: p.slug });
  }
  return out;
}

/** 旧 `/slides/` URL 用（canonical へリダイレクト） */
export function teamSlidesLegacyStaticParams(): {
  team: TeamSlug;
  slug: string;
}[] {
  return completedSlidesStaticParams();
}

/** 旧 `/posters/` URL 用 */
export function teamPostersLegacyStaticParams(): {
  team: TeamSlug;
  slug: string;
}[] {
  return FINISHED_POSTERS.map((p) => ({ team: p.teamSlug, slug: p.slug }));
}

export { TEAM_SLUG_TO_DISPLAY_NAME };
