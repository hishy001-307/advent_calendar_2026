import type { CompletedSlideRecord } from "@/data/completedSlides.gen";
import { FINISHED_POSTERS, type TeamSlug } from "@/data/finishedPosters";

/**
 * 班・表題が一致するとき、`finishedPosters` の担当者名を補完（ファイル名表題と LaTeX 表記差は吸収しない）。
 */
function normalizeTitleKey(s: string): string {
  return s
    .normalize("NFKC")
    .replace(/\\/g, "")
    .replace(/\$/g, "")
    .replace(/\^/g, "")
    .replace(/_/g, "")
    .replace(/[〜～]/g, "〜")
    .replace(/[－﹣−—–]/g, "-")
    .replace(/[：﹕]/g, ":")
    .replace(/[\s\u3000]+/g, "")
    .toLowerCase();
}

function teamTitleKey(team: TeamSlug, title: string): string {
  return `${team}\0${normalizeTitleKey(title)}`;
}

/** 同一班・正規化同一タイトルの最初のエントリのみ */
const AUTHOR_BY_TEAM_AND_TITLE = new Map<string, string>();
for (const p of FINISHED_POSTERS) {
  const k = teamTitleKey(p.teamSlug, p.title);
  if (!AUTHOR_BY_TEAM_AND_TITLE.has(k)) {
    AUTHOR_BY_TEAM_AND_TITLE.set(k, p.author);
  }
}

export function resolvedCompletedSlide(row: CompletedSlideRecord): CompletedSlideRecord {
  const k = teamTitleKey(row.teamSlug, row.title);
  const fromFinished = AUTHOR_BY_TEAM_AND_TITLE.get(k);
  return {
    ...row,
    author: row.author ?? fromFinished ?? null,
  };
}
