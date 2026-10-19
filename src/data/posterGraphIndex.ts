import fs from "node:fs";
import path from "node:path";
import {
  buildEdges,
  normalizeTitle,
  parsePostersCsv,
  type GraphEdge,
  type Poster,
} from "@/components/PosterGraph/posterGraphData";
import { COMPLETED_SLIDES } from "@/data/completedSlides.gen";
import { FINISHED_POSTERS, type TeamSlug } from "@/data/finishedPosters";
import {
  graphTitleLooseKey,
  graphTitleMatchKey,
  POSTER_GRAPH_CSV_TEAM_TO_SLUG,
  resolvePdfPageHrefForTitle,
  resolvePosterGraphInternalUrl,
  titleMatchScore,
} from "@/data/posterGraphUrlResolve";

export type RelatedPosterForPdf = {
  title: string;
  href: string;
  teamLabel: string;
  kind: "related" | "subtag";
};

type PosterGraphSnapshot = {
  posters: Poster[];
  edges: GraphEdge[];
  /** canonical PDF URL → CSV グラフ上のポスター id */
  posterIdByPdfHref: Map<string, number>;
};

let snapshot: PosterGraphSnapshot | null = null;

/** CSV 更新後に dev で古いグラフが残らないよう、本番のみスナップショットをキャッシュ */
function shouldUseCachedSnapshot(): boolean {
  return process.env.NODE_ENV === "production" && snapshot !== null;
}

function withTrailingSlash(path: string): string {
  return path.endsWith("/") ? path : `${path}/`;
}

function registerPdfHref(
  map: Map<string, number>,
  href: string,
  posterId: number,
): void {
  if (!href.includes("/pdf/")) return;
  const normalized = withTrailingSlash(href);
  if (!map.has(normalized)) map.set(normalized, posterId);
}

function buildPosterIdByPdfHref(posters: Poster[]): Map<string, number> {
  const map = new Map<string, number>();

  for (const p of posters) {
    const teamSlug = POSTER_GRAPH_CSV_TEAM_TO_SLUG[p.team];
    const csvKey = graphTitleMatchKey(p.title);
    const csvLoose = graphTitleLooseKey(p.title);

    if (p.team) {
      registerPdfHref(
        map,
        resolvePosterGraphInternalUrl(p.title, p.team),
        p.id,
      );
    }

    for (const row of COMPLETED_SLIDES) {
      if (teamSlug && row.teamSlug !== teamSlug) continue;
      if (!teamSlug && graphTitleLooseKey(row.title) !== csvLoose) continue;
      const slideKey = graphTitleMatchKey(row.title);
      const slideLoose = graphTitleLooseKey(row.title);
      const score = titleMatchScore(csvKey, slideKey);
      if (
        score >= 8 ||
        csvLoose === slideLoose ||
        normalizeTitle(p.title) === normalizeTitle(row.title)
      ) {
        registerPdfHref(
          map,
          withTrailingSlash(`/teams/${row.teamSlug}/pdf/${row.slug}`),
          p.id,
        );
      }
    }

    for (const fp of FINISHED_POSTERS) {
      if (teamSlug && fp.teamSlug !== teamSlug) continue;
      if (!teamSlug && graphTitleLooseKey(fp.title) !== csvLoose) continue;
      const fpKey = graphTitleMatchKey(fp.title);
      const fpLoose = graphTitleLooseKey(fp.title);
      const score = titleMatchScore(csvKey, fpKey);
      if (
        score >= 8 ||
        csvLoose === fpLoose ||
        normalizeTitle(p.title) === normalizeTitle(fp.title)
      ) {
        registerPdfHref(
          map,
          withTrailingSlash(`/teams/${fp.teamSlug}/pdf/${fp.slug}`),
          p.id,
        );
      }
    }
  }

  return map;
}

function loadSnapshot(): PosterGraphSnapshot {
  if (shouldUseCachedSnapshot()) return snapshot!;
  const csvPath = path.join(
    process.cwd(),
    "public",
    "poster_tags_export.csv",
  );
  const csv = fs.readFileSync(csvPath, "utf-8");
  const posters = parsePostersCsv(csv);
  snapshot = {
    posters,
    edges: buildEdges(posters),
    posterIdByPdfHref: buildPosterIdByPdfHref(posters),
  };
  return snapshot;
}

function findCsvPosterId(
  posters: Poster[],
  posterIdByPdfHref: Map<string, number>,
  pageTitle: string,
  teamSlug: TeamSlug,
): number | null {
  const pageHref = resolvePdfPageHrefForTitle(teamSlug, pageTitle);
  if (pageHref) {
    const byHref = posterIdByPdfHref.get(withTrailingSlash(pageHref));
    if (byHref !== undefined) return byHref;
  }

  const pageKey = graphTitleMatchKey(pageTitle);
  const pageLoose = graphTitleLooseKey(pageTitle);
  const pageNorm = normalizeTitle(pageTitle);
  const teamLabel = Object.entries(POSTER_GRAPH_CSV_TEAM_TO_SLUG).find(
    ([, slug]) => slug === teamSlug,
  )?.[0];

  let best: { id: number; score: number } | null = null;

  for (const p of posters) {
    if (teamLabel && p.team !== teamLabel) continue;

    const posterKey = graphTitleMatchKey(p.title);
    if (posterKey === pageKey) return p.id;
    if (graphTitleLooseKey(p.title) === pageLoose) return p.id;
    if (normalizeTitle(p.title) === pageNorm) return p.id;

    const n = titleMatchScore(pageKey, posterKey);
    if (n >= 10 && (!best || n > best.score)) {
      best = { id: p.id, score: n };
    }
  }

  if (best) return best.id;

  // 班が CSV とずれている場合の最終手段（表題のみで照合）
  for (const p of posters) {
    if (graphTitleLooseKey(p.title) === pageLoose) return p.id;
    const n = titleMatchScore(pageKey, graphTitleMatchKey(p.title));
    if (n >= 14 && (!best || n > best.score)) {
      best = { id: p.id, score: n };
    }
  }

  return best?.id ?? null;
}

function neighborsForPoster(
  posterId: number,
  posters: Poster[],
  edges: GraphEdge[],
  pageLooseKey: string,
): RelatedPosterForPdf[] {
  const byId = new Map(posters.map((p) => [p.id, p]));
  const byHref = new Map<string, RelatedPosterForPdf>();

  for (const e of edges) {
    if (e.source !== posterId && e.target !== posterId) continue;
    const otherId = e.source === posterId ? e.target : e.source;
    const other = byId.get(otherId);
    if (!other) continue;

    const kind: RelatedPosterForPdf["kind"] =
      e.strength >= 1 ? "related" : "subtag";
    const href = resolvePosterGraphInternalUrl(other.title, other.team);
    const existing = byHref.get(href);
    if (existing) {
      if (existing.kind === "subtag" && kind === "related") {
        byHref.set(href, { ...existing, kind: "related" });
      }
      continue;
    }
    byHref.set(href, {
      title: other.title,
      href,
      teamLabel: other.team,
      kind,
    });
  }

  return [...byHref.values()]
    .filter((x) => graphTitleLooseKey(x.title) !== pageLooseKey)
    .sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === "related" ? -1 : 1;
      return a.title.localeCompare(b.title, "ja");
    });
}

/**
 * PDF 閲覧ページ用: グラフ（無向・相互）から関連ポスター一覧を返す。
 */
export function getRelatedPostersForPdfPage(
  pageTitle: string,
  teamSlug: TeamSlug,
): {
  related: RelatedPosterForPdf[];
  subtag: RelatedPosterForPdf[];
} {
  const { posters, edges, posterIdByPdfHref } = loadSnapshot();
  const posterId = findCsvPosterId(
    posters,
    posterIdByPdfHref,
    pageTitle,
    teamSlug,
  );
  if (posterId === null) return { related: [], subtag: [] };

  const pageLoose = graphTitleLooseKey(pageTitle);
  const all = neighborsForPoster(posterId, posters, edges, pageLoose);
  return {
    related: all.filter((x) => x.kind === "related"),
    subtag: all.filter((x) => x.kind === "subtag"),
  };
}

/** グラフのタイトル正規化（デバッグ・テスト用） */
// export { normalizeTitle };
