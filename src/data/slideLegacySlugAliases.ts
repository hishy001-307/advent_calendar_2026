import type { TeamSlug } from "@/data/finishedPosters";
import {
  normalizeSlideSlugParam,
  slideSlugStaticParamVariants,
} from "@/utils/normalizeSlideSlug";

/**
 * ファイル名リネーム前の slides URL スラッグ → 現在の `completedSlides.gen` の slug。
 * `output: "export"` では `generateStaticParams` に無い `[slug]` は 500 になるため、
 * 旧 URL もプリレンダ対象に含め、ここで現行 slug に解決する。
 */
export const SLIDE_LEGACY_TO_CANONICAL_SLUG: Partial<
  Record<TeamSlug, Readonly<Record<string, string>>>
> = {
  particle: {
    "Physlab2026-Hattori-Ryoya-2-g-2測定": "g-2測定",
  },
};

function legacyTable(team: TeamSlug): Record<string, string> | undefined {
  const raw = SLIDE_LEGACY_TO_CANONICAL_SLUG[team];
  if (!raw) return undefined;
  const out: Record<string, string> = {};
  for (const [legacy, canonical] of Object.entries(raw)) {
    out[normalizeSlideSlugParam(legacy)] = normalizeSlideSlugParam(canonical);
  }
  return out;
}

export function canonicalSlideSlug(team: TeamSlug, slug: string): string {
  const s = normalizeSlideSlugParam(slug);
  const mapped = legacyTable(team)?.[s];
  return mapped ?? s;
}

export function legacySlideStaticParamExtras(): {
  team: TeamSlug;
  slug: string;
}[] {
  const out: { team: TeamSlug; slug: string }[] = [];
  for (const team of Object.keys(SLIDE_LEGACY_TO_CANONICAL_SLUG) as TeamSlug[]) {
    const m = SLIDE_LEGACY_TO_CANONICAL_SLUG[team];
    if (!m) continue;
    for (const legacySlug of Object.keys(m)) {
      for (const slug of slideSlugStaticParamVariants(legacySlug)) {
        out.push({ team, slug });
      }
    }
  }
  return out;
}
