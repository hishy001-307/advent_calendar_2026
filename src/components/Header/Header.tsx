"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./Header.module.scss";
import { publicPath } from "@/utils/publicPath";

export default function Header() {
  const [isPosterMenuOpen, setIsPosterMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobileMenuOpen]);

  const posterSubMenus = [
    { label: "素粒子物理班", href: "/teams/particle" },
    { label: "物性物理班", href: "/teams/condensed-matter" },
    { label: "宇宙物理班", href: "/teams/astrophysics" },
    { label: "生物物理班", href: "/teams/biophysics" },
    { label: "計算・数理物理班", href: "/teams/computational-math" },
    { label: "実験班", href: "/teams/experimental" },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className={`sticky top-0 z-50 w-full ${styles.header}`}>
        <div className={styles.inner}>
          <Link href="/" className={styles.logoLink} onClick={closeMobileMenu}>
            <Image
              src={publicPath("/header.png")}
              alt="Physics Lab Logo"
              width={360}
              height={120}
              className={styles.logoImage}
              priority
            />
          </Link>

          <button
            type="button"
            className={styles.menuToggle}
            aria-expanded={isMobileMenuOpen}
            aria-controls="site-navigation-mobile"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
          >
            <span className="sr-only">メニューを開く</span>
            <span className={styles.menuToggleIcon} aria-hidden>
              <span className={styles.menuToggleBar} />
              <span className={styles.menuToggleBar} />
              <span className={styles.menuToggleBar} />
            </span>
          </button>

          <nav className={styles.navDesktop} aria-label="メインナビゲーション">
            <Link href="/" className={styles.navLink}>
              ホーム
            </Link>
            <Link href="/advent" className={styles.navLink} prefetch={false}>
              アドベントカレンダー
            </Link>

            <div
              className={styles.posterWrapper}
              onMouseEnter={() => setIsPosterMenuOpen(true)}
              onMouseLeave={() => setIsPosterMenuOpen(false)}
            >
              <button className={`${styles.navLink} ${styles.posterButton}`}>
                班紹介
                <svg
                  className={`${styles.chevron} ${isPosterMenuOpen ? styles.chevronOpen : ""
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isPosterMenuOpen && (
                <div className={styles.posterMenu}>
                  <div className={styles.posterMenuPanel}>
                    {posterSubMenus.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        prefetch={false}
                        className={styles.posterMenuItem}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/performance" className={styles.navLink}>
              学生公演
            </Link>

            <Link href="/articles" className={styles.navLink}>
              解説記事
            </Link>

            <Link href="/contact" className={styles.navLink}>
              お問い合わせ
            </Link>
          </nav>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div
          className={styles.mobileOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="サイトメニュー"
        >
          <div className={styles.mobileOverlayTop}>
            <Link href="/" className={styles.logoLink} onClick={closeMobileMenu}>
              <Image
                src={publicPath("/header.png")}
                alt="Physics Lab Logo"
                width={360}
                height={120}
                className={styles.logoImage}
              />
            </Link>
            <button
              type="button"
              className={styles.overlayClose}
              onClick={closeMobileMenu}
              aria-label="メニューを閉じる"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav
            id="site-navigation-mobile"
            className={styles.mobileNav}
            aria-label="メインナビゲーション"
          >
            <Link href="/" className={styles.mobileNavLink} onClick={closeMobileMenu}>
              ホーム
            </Link>
            <Link href="/advent" className={styles.mobileNavLink} prefetch={false} onClick={closeMobileMenu}>
              アドベントカレンダー
            </Link>

            <p className={styles.mobileTeamHeading}>班紹介</p>
            {posterSubMenus.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className={styles.mobileTeamLink}
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            ))}

            <Link href="/performance" className={styles.mobileNavLink} onClick={closeMobileMenu}>
              学生公演
            </Link>
            <Link href="/articles" className={styles.mobileNavLink} onClick={closeMobileMenu}>
              解説記事
            </Link>
            <Link href="/contact" className={styles.mobileNavLink} onClick={closeMobileMenu}>
              お問い合わせ
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
