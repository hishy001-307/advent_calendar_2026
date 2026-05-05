import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import type { LoadingVariant } from "@/components/TeamLoading/TeamLoading";
import teamTheme from "@/components/TeamLoading/TeamLoading.module.scss";
import TeamLogoMarquee from "./TeamLogoMarquee";
import { publicPath } from "@/utils/publicPath";
import styles from "./TeamPage.module.scss";
import {
  defaultFieldSummary,
  defaultPdfSpotlights,
  type PdfSpotlight,
} from "./teamPageDefaults";
import { fragmentsWithInlineMath } from "@/utils/fragmentsWithInlineMath";

type TeamPageProps = {
  teamName: string;
  description: string;
  loadingVariant: LoadingVariant;
  fieldSummaryLines?: string[];
  pdfSpotlights?: PdfSpotlight[];
};

const TEAM_BG_CLASS: Record<LoadingVariant, string> = {
  particle: teamTheme.bgParticle,
  condensedMatter: teamTheme.bgCondensedMatter,
  astrophysics: teamTheme.bgAstrophysics,
  computationalMath: teamTheme.bgComputationalMath,
  biophysics: teamTheme.bgBiophysics,
  experimental: teamTheme.bgExperimental,
};

const TEAM_LOGO_SRC: Record<LoadingVariant, string> = {
  particle: "/particle.png",
  condensedMatter: "/solid.png",
  astrophysics: "/space.png",
  computationalMath: "/calc.png",
  biophysics: "/bio.png",
  experimental: "/exp.png",
};

const MARQUEE_CYCLE = 5;

export default async function TeamPage({
  teamName,
  description,
  loadingVariant,
  fieldSummaryLines: fieldSummaryLinesProp,
  pdfSpotlights: pdfSpotlightsProp,
}: TeamPageProps) {
  const isDarkPage = loadingVariant === "astrophysics";
  const fieldSummaryLines =
    fieldSummaryLinesProp ?? defaultFieldSummary(loadingVariant);
  const pdfSpotlights =
    pdfSpotlightsProp ?? defaultPdfSpotlights(loadingVariant);

  const logoSrc = TEAM_LOGO_SRC[loadingVariant];
  const marqueeSlides = Array.from({ length: MARQUEE_CYCLE }, () => ({
    href: "#",
    imageSrc: publicPath(logoSrc),
  }));

  return (
    <div
      className={[
        styles.pageRoot,
        TEAM_BG_CLASS[loadingVariant],
        isDarkPage ? styles.pageRootDark : "",
      ]
        .join(" ")
        .trim()}
    >
      <div className={styles.pageEnter}>
          <Header />
          <main
            className={[
              styles.pageMain,
              "mx-auto max-w-5xl min-w-0 space-y-6 px-3 pb-8 pt-6 min-[480px]:space-y-8 min-[480px]:px-4 min-[480px]:pt-8",
            ]
              .join(" ")
              .trim()}
          >
            <header className="space-y-2 text-center">
              <p
                className={[
                  "text-xs uppercase tracking-wide",
                  isDarkPage ? styles.eyebrowDark : "text-zinc-500",
                ]
                  .join(" ")
                  .trim()}
              >
                Physics Lab. 2026
              </p>
              <div className={styles.titleRow}>
                <Image
                  src={publicPath(logoSrc)}
                  alt=""
                  width={64}
                  height={64}
                  className={styles.teamLogo}
                  priority
                  aria-hidden
                />
                <h1
                  className={[
                    "max-w-full min-w-0 break-words text-2xl font-semibold min-[480px]:text-3xl sm:text-4xl",
                    isDarkPage ? styles.teamNameDark : "text-[#444443]",
                  ]
                    .join(" ")
                    .trim()}
                >
                  {teamName}
                </h1>
              </div>
              <p
                className={[
                  "text-sm",
                  isDarkPage ? styles.descriptionDark : "text-zinc-600",
                ]
                  .join(" ")
                  .trim()}
              >
                {description}
              </p>
            </header>

            <section
              aria-labelledby="team-field-summary-heading"
              className={[styles.summarySection, isDarkPage ? styles.summarySectionDark : ""].join(" ").trim()}
            >
              <details className={styles.summaryDetails}>
                <summary className={[styles.summaryToggle, isDarkPage ? styles.summaryToggleDark : ""].join(" ").trim()}>
                  <span
                    className={[styles.summaryChevron].join(" ")}
                    aria-hidden
                  />
                  <h2
                    id="team-field-summary-heading"
                    className={[styles.summaryHeading, isDarkPage ? styles.summaryHeadingDark : ""].join(" ").trim()}
                  >
                    分野の概要
                  </h2>
                </summary>
                <div
                  className={[
                    styles.summaryBody,
                    isDarkPage ? styles.summaryBodyDark : "",
                  ]
                    .join(" ")
                    .trim()}
                >
                  {fieldSummaryLines.map((paragraph, index) => (
                    <p key={`summary-${index}`}>
                      {fragmentsWithInlineMath(paragraph)}
                    </p>
                  ))}
                </div>
              </details>
            </section>

            <TeamLogoMarquee
              slides={marqueeSlides}
              isDark={isDarkPage}
              cycleLength={MARQUEE_CYCLE}
            />

            <section aria-labelledby="team-pdf-heading">
              <h2
                id="team-pdf-heading"
                className={[
                  styles.pdfSectionTitle,
                  isDarkPage ? styles.pdfSectionTitleDark : "",
                ]
                  .join(" ")
                  .trim()}
              >
                解説資料（PDF）
              </h2>
              <div className={styles.pdfGrid}>
                {pdfSpotlights.map((item, itemIndex) => (
                  <article
                    key={`pdf-${loadingVariant}-${itemIndex}`}
                    className={[
                      styles.pdfCard,
                      isDarkPage ? styles.pdfCardDark : "",
                    ]
                      .join(" ")
                      .trim()}
                  >
                    <span
                      className={[
                        styles.pdfBadge,
                        isDarkPage ? styles.pdfBadgeDark : "",
                      ]
                        .join(" ")
                        .trim()}
                    >
                      PDF
                    </span>
                    {item.title.trim() ? (
                      <Link
                        href={item.href}
                        prefetch={false}
                        className={[
                          styles.pdfTitleLink,
                          isDarkPage ? styles.pdfTitleLinkDark : "",
                        ]
                          .join(" ")
                          .trim()}
                      >
                        {item.title}
                      </Link>
                    ) : null}
                    <div
                      className={[
                        styles.pdfSummary,
                        isDarkPage ? styles.pdfSummaryDark : "",
                      ]
                        .join(" ")
                        .trim()}
                    >
                      {item.summaryLines.map((line, lineIndex) => (
                        <p
                          key={`pdf-${loadingVariant}-${itemIndex}-${lineIndex}`}
                          className="mb-2 last:mb-0"
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </main>
        <Footer />
      </div>
    </div>
  );
}
