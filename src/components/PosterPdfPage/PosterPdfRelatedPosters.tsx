import Link from "next/link";
import { getRelatedPostersForPdfPage } from "@/data/posterGraphIndex";
import type { TeamSlug } from "@/data/finishedPosters";
import { fragmentsWithInlineMath } from "@/utils/fragmentsWithInlineMath";
import styles from "./PosterPdfPage.module.scss";

type PosterPdfRelatedPostersProps = {
  pageTitle: string;
  teamSlug: TeamSlug;
  isDark: boolean;
};

export default function PosterPdfRelatedPosters({
  pageTitle,
  teamSlug,
  isDark,
}: PosterPdfRelatedPostersProps) {
  const { related, subtag } = getRelatedPostersForPdfPage(
    pageTitle,
    teamSlug,
  );

  if (related.length === 0 && subtag.length === 0) return null;

  const sectionClass = isDark
    ? styles.relatedSectionDark
    : styles.relatedSectionLight;
  const headingClass = isDark
    ? styles.relatedHeadingDark
    : styles.relatedHeadingLight;
  const noteClass = isDark ? styles.relatedNoteDark : styles.relatedNoteLight;
  const subClass = isDark
    ? styles.relatedSubheadingDark
    : styles.relatedSubheadingLight;
  const itemClass = isDark ? styles.relatedItemDark : styles.relatedItemLight;
  const teamClass = isDark ? styles.relatedTeamDark : styles.relatedTeamLight;
  const linkClass = isDark
    ? styles.relatedInlineLinkDark
    : styles.relatedInlineLinkLight;

  return (
    <section className={sectionClass} aria-labelledby="related-posters-heading">
      <h2 id="related-posters-heading" className={headingClass}>
        関連するポスター
      </h2>
      <p className={noteClass}>
        トップページの
        <Link href="/" className={linkClass}>
          ポスター関係グラフ
        </Link>
        と同じデータです。
      </p>

      {related.length > 0 ? (
        <div>
          <h3 className={subClass}>関連ポスター</h3>
          <ul className={styles.relatedList}>
            {related.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={itemClass} prefetch={false}>
                  <span className={styles.relatedTitle}>
                    {fragmentsWithInlineMath(item.title)}
                  </span>
                  <span className={teamClass}>{item.teamLabel}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {subtag.length > 0 ? (
        <div
          className={related.length > 0 ? styles.relatedBlockGap : undefined}
        >
          <h3 className={subClass}>同じ班・テーマ</h3>
          <ul className={styles.relatedList}>
            {subtag.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={itemClass} prefetch={false}>
                  <span className={styles.relatedTitle}>
                    {fragmentsWithInlineMath(item.title)}
                  </span>
                  <span className={teamClass}>{item.teamLabel}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
