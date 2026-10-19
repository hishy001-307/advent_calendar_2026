"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import PdfMarqueeThumb from "./PdfMarqueeThumb";
import styles from "./TeamLogoMarquee.module.scss";

export type TeamMarqueeSlide = {
  href: string;
  /** 班ロゴスライド用 */
  imageSrc?: string;
  /** 設定時は PDF ピックアップカードとして表示 */
  pdfTitle?: string;
  pdfAuthor?: string;
  /** 先頭ページプレビュー用 `public/` パス（先頭 `/`） */
  pdfPreviewPath?: string;
};

type TeamLogoMarqueeProps = {
  slides: TeamMarqueeSlide[];
  isDark?: boolean;
  /** 1周分のスライド枚数。`slides.length` と一致させてください。 */
  cycleLength?: number;
  /** セクションの `aria-label`（未指定時は汎用ラベル） */
  ariaLabel?: string;
};

export default function TeamLogoMarquee({
  slides,
  isDark = false,
  cycleLength,
  ariaLabel = "班のビジュアルスライド",
}: TeamLogoMarqueeProps) {
  const cycle = Math.max(1, cycleLength ?? slides.length);
  const loopSlides = slides.length > 0 ? [...slides, ...slides] : [];

  return (
    <section
      className={[styles.wrap, isDark ? styles.wrapDark : ""].join(" ").trim()}
      aria-label={ariaLabel}
    >
      <div className={styles.viewport}>
        <div
          className={styles.track}
          style={
            {
              "--marquee-cycle": cycle,
            } as CSSProperties
          }
        >
          {loopSlides.map((slide, index) => (
            <Link
              key={`${slide.href}-${slide.pdfPreviewPath ?? slide.pdfTitle ?? slide.imageSrc ?? "x"}-${index}`}
              href={slide.href}
              className={styles.slide}
              prefetch={false}
              title={
                slide.pdfTitle
                  ? `${slide.pdfTitle}${slide.pdfAuthor ? `（${slide.pdfAuthor}）` : ""}`
                  : undefined
              }
            >
              {slide.pdfTitle ? (
                <span
                  className={
                    slide.pdfPreviewPath
                      ? styles.pdfShellVisual
                      : styles.pdfShellText
                  }
                >
                  {slide.pdfPreviewPath ? (
                    <>
                      <PdfMarqueeThumb
                        pdfPath={slide.pdfPreviewPath}
                        className={styles.pdfThumb}
                      />
                      <span
                        className={styles.pdfCaptionGradient}
                        aria-hidden
                      />
                      <span className={styles.pdfBadge}>PDF</span>
                      <span className={styles.pdfTitleOverlay}>
                        {slide.pdfTitle}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className={styles.pdfBadge}>PDF</span>
                      <span className={styles.pdfTitle}>{slide.pdfTitle}</span>
                      {slide.pdfAuthor ? (
                        <span className={styles.pdfAuthor}>
                          {slide.pdfAuthor}
                        </span>
                      ) : null}
                    </>
                  )}
                </span>
              ) : slide.imageSrc ? (
                <span className={styles.imageShell}>
                  <Image
                    src={slide.imageSrc}
                    alt=""
                    width={160}
                    height={160}
                    className={styles.image}
                    draggable={false}
                    aria-hidden
                  />
                </span>
              ) : null}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
