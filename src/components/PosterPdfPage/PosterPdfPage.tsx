import Link from "next/link";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import teamTheme from "@/components/TeamLoading/TeamLoading.module.scss";
import type { PosterPdfViewModel } from "@/data/posterPdfTypes";
import { fragmentsWithInlineMath } from "@/utils/fragmentsWithInlineMath";
import PosterPdfClientShell from "./PosterPdfClientShell";
import PosterPdfDownloadLinks from "./PosterPdfDownloadLinks";
import PosterPdfRelatedPosters from "./PosterPdfRelatedPosters";
import styles from "./PosterPdfPage.module.scss";

const TEAM_BG_CLASS: Record<PosterPdfViewModel["loadingVariant"], string> = {
  particle: teamTheme.bgParticle,
  condensedMatter: teamTheme.bgCondensedMatter,
  astrophysics: teamTheme.bgAstrophysics,
  computationalMath: teamTheme.bgComputationalMath,
  biophysics: teamTheme.bgBiophysics,
  experimental: teamTheme.bgExperimental,
};

type PosterPdfPageProps = {
  poster: PosterPdfViewModel;
  teamName: string;
};

export default function PosterPdfPage({ poster, teamName }: PosterPdfPageProps) {
  const isDark = poster.loadingVariant === "astrophysics";
  const bg = TEAM_BG_CLASS[poster.loadingVariant];
  const backHref = `/teams/${poster.teamSlug}/`;

  return (
    <div
      className={[styles.pageRoot, bg].join(" ").trim()}
    >
      <div className={styles.pageEnter}>
        <Header />
        <main
          className={[
            styles.pageMain,
            "mx-auto max-w-5xl min-w-0 px-3 pb-8 pt-6 min-[480px]:px-4 min-[480px]:pt-8",
          ]
            .join(" ")
            .trim()}
        >
          <div className={styles.backRow}>
            <Link
              href={backHref}
              prefetch={false}
              className={isDark ? styles.backLinkDark : styles.backLinkLight}
            >
              ← {teamName}に戻る
            </Link>
          </div>

          <header className={styles.heading}>
            <h1
              className={isDark ? styles.titleDark : styles.titleLight}
            >
              {fragmentsWithInlineMath(poster.title)}
            </h1>
            <p className={isDark ? styles.metaDark : styles.metaLight}>
              {poster.author ? `担当: ${poster.author}` : null}
              {poster.author ? " · " : ""}
              {teamName}
            </p>
          </header>

          <p
            className={
              isDark ? styles.disclaimerNoteDark : styles.disclaimerNoteLight
            }
          >
            内容は誤りを含む場合があり、今後更新される可能性があります。お気づきの際は
            <Link
              href="/contact"
              className={
                isDark ? styles.disclaimerLinkDark : styles.disclaimerLinkLight
              }
            >
              ご連絡ください
            </Link>
          </p>

          <div className={styles.pdfStack}>
            {poster.pdfPaths.map((rel, idx) => {
              const fileLabel =
                poster.pdfPaths.length > 1 ? `パート ${idx + 1}` : "PDF";
              return (
                <div
                  key={`${rel}-${idx}`}
                  className={
                    isDark ? styles.pdfFrameWrapDark : styles.pdfFrameWrap
                  }
                >
                  <div
                    className={
                      isDark ? styles.pdfLabelDark : styles.pdfLabel
                    }
                  >
                    {fileLabel}
                    （プレビューはブラウザ互換のため画像として表示しています。印刷・拡大はダウンロード版をご利用ください）
                  </div>
                  <PosterPdfClientShell
                    pdfPath={rel}
                    isDark={isDark}
                    docTitle={`${poster.title} ${fileLabel}`}
                  />
                </div>
              );
            })}
          </div>

          <PosterPdfDownloadLinks
            pdfPaths={poster.pdfPaths}
            isDark={isDark}
          />

          <PosterPdfRelatedPosters
            pageTitle={poster.title}
            teamSlug={poster.teamSlug}
            isDark={isDark}
          />
        </main>
        <Footer />
      </div>
    </div>
  );
}
