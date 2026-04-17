"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./TeamLogoMarquee.module.scss";

export type TeamMarqueeSlide = {
  href: string;
  imageSrc: string;
};

type TeamLogoMarqueeProps = {
  slides: TeamMarqueeSlide[];
  isDark?: boolean;
  /** 1周分のスライド枚数（デフォルト5）。`slides.length` と一致させてください。 */
  cycleLength?: number;
};

export default function TeamLogoMarquee({
  slides,
  isDark = false,
  cycleLength = 5,
}: TeamLogoMarqueeProps) {
  const loopSlides = [...slides, ...slides];

  return (
    <section
      className={[styles.wrap, isDark ? styles.wrapDark : ""].join(" ").trim()}
      aria-label="班のビジュアルスライド"
    >
      <div className={styles.viewport}>
        <div
          className={styles.track}
          style={
            {
              "--marquee-cycle": cycleLength,
            } as CSSProperties
          }
        >
          {loopSlides.map((slide, index) => (
            <Link
              key={`${slide.href}-${slide.imageSrc}-${index}`}
              href={slide.href}
              className={styles.slide}
              prefetch={false}
            >
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
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
