// src/components/Layout/Footer.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className={styles.row}>
          {/* 左側：ロゴ + サイト名 */}
          <div className={styles.brand}>
            <div className={styles.logoWrap}>
              <Image
                src="/cat_nobi.png"
                alt="Physics Lab. ロゴの猫"
                width={42}
                height={42}
                className={styles.cat}
              />
            </div>
            <div className={styles.brandText}>
              <span className={styles.siteName}>Physics Lab. 2026</span>
              <span className={styles.caption}>
                Department of Physics, The University of Tokyo
              </span>
            </div>
          </div>

          {/* 右側：フッターナビ */}
          <nav className={styles.nav}>
            <Link href="/advent" className={styles.link}>
              アドベントカレンダー
            </Link>
            <Link href="/festival" className={styles.link}>
              五月祭ポスター
            </Link>
            <Link href="/talks" className={styles.link}>
              学生公演
            </Link>
            <Link href="/articles" className={styles.link}>
              解説記事
            </Link>
          </nav>
        </div>

        <div className={styles.copy}>
          © 2026 Physics Lab. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
