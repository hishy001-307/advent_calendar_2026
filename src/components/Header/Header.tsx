"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./Header.module.scss";

export default function Header() {
  const [isPosterMenuOpen, setIsPosterMenuOpen] = useState(false); // PC hover
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // SP menu
  const [isPosterMenuOpenMobile, setIsPosterMenuOpenMobile] = useState(false); // SP accordion

  const posterSubMenus = [
    { label: "素粒子物理班", href: "/poster/particle" },
    { label: "物性物理班", href: "/poster/condensed-matter" },
    { label: "宇宙物理班", href: "/poster/astrophysics" },
    { label: "生物物理班", href: "/poster/biophysics" },
    { label: "計算・数理物理班", href: "/poster/computational" },
    { label: "実験班", href: "/poster/experimental" },
  ];

  // SPでリンクを押したらメニューを閉じる（UX改善）
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsPosterMenuOpenMobile(false);
  };

  return (
    <header className={`sticky top-0 z-50 w-full ${styles.header}`}>
      <div className={styles.inner}>
        {/* ロゴ */}
        <Link href="/" className={styles.logoLink} onClick={closeMobileMenu}>
          <Image
            src="/header.png"
            alt="Physics Lab Logo"
            width={360}
            height={120}
            className={styles.logoImage}
            priority
          />
        </Link>

        {/* SP：ハンバーガー */}
        <button
          type="button"
          className={styles.hamburger}
          aria-label="メニューを開閉"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((v) => !v)}
        >
          {/* 文字で確実に表示（後でアイコンに差し替え可） */}
          {isMobileMenuOpen ? "×" : "≡"}
        </button>

        {/* PC：ナビ（既存を維持） */}
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            アドベントカレンダー
          </Link>

          <div
            className={styles.posterWrapper}
            onMouseEnter={() => setIsPosterMenuOpen(true)}
            onMouseLeave={() => setIsPosterMenuOpen(false)}
          >
            <button className={`${styles.navLink} ${styles.posterButton}`}>
              五月祭ポスター
              <svg
                className={`${styles.chevron} ${
                  isPosterMenuOpen ? styles.chevronOpen : ""
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
        </nav>
      </div>

      {/* SP：縦メニュー（ヘッダー直下） */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/" className={styles.mobileLink} onClick={closeMobileMenu}>
            アドベントカレンダー
          </Link>

          <button
            type="button"
            className={styles.mobileLink}
            aria-expanded={isPosterMenuOpenMobile}
            onClick={() => setIsPosterMenuOpenMobile((v) => !v)}
          >
            五月祭ポスター {isPosterMenuOpenMobile ? "▲" : "▼"}
          </button>

          {isPosterMenuOpenMobile && (
            <div className={styles.mobileSubMenu}>
              {posterSubMenus.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={styles.mobileSubLink}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          <Link
            href="/performance"
            className={styles.mobileLink}
            onClick={closeMobileMenu}
          >
            学生公演
          </Link>

          <Link
            href="/articles"
            className={styles.mobileLink}
            onClick={closeMobileMenu}
          >
            解説記事
          </Link>
        </div>
      )}
    </header>
  );
}
