import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import type { LoadingVariant } from "@/components/TeamLoading/TeamLoading";
import teamTheme from "@/components/TeamLoading/TeamLoading.module.scss";
import TeamLogoMarquee from "./TeamLogoMarquee";
import styles from "./TeamPage.module.scss";
import {
  defaultFieldSummary,
  defaultPdfSpotlights,
  type PdfSpotlight,
} from "./teamPageDefaults";

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
    imageSrc: logoSrc,
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
          <main className="mx-auto max-w-5xl px-4 pt-8 pb-8 space-y-8">
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
                  src={logoSrc}
                  alt=""
                  width={64}
                  height={64}
                  className={styles.teamLogo}
                  priority
                  aria-hidden
                />
                <h1
                  className={[
                    "text-4xl font-semibold",
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
              className={[
                styles.summarySection,
                isDarkPage ? styles.summarySectionDark : "",
              ]
                .join(" ")
                .trim()}
              aria-labelledby="team-field-summary-heading"
            >
              <h2
                id="team-field-summary-heading"
                className={[
                  styles.summaryHeading,
                  isDarkPage ? styles.summaryHeadingDark : "",
                ]
                  .join(" ")
                  .trim()}
              >
                分野の概要
              </h2>
              <div
                className={[
                  styles.summaryBody,
                  isDarkPage ? styles.summaryBodyDark : "",
                ]
                  .join(" ")
                  .trim()}
              >
                {fieldSummaryLines.map((paragraph, index) => (
                  <p key={`summary-${index}`}>{paragraph}</p>
                ))}
              </div>
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
                {pdfSpotlights.map((item) => (
                  <article
                    key={item.title}
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
                          key={`${item.title}-${lineIndex}`}
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
