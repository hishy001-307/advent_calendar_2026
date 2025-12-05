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

          {/* ブランドロゴ部分 */}
          <div className={styles.brand}>
            <Image
              src="/logo_monochrome.png"  // ← ヘッダーと同じモノクロ版を使用
              alt="Physics Lab ロゴ"
              width={5165}
              height={1989}
              className={styles.logo}
            />
            {/* <span className={styles.siteName}>Physics Lab. 2026</span> */}
          </div>

          {/* ナビ */}
          <nav className={styles.nav}>
            <Link href="/advent" className={styles.link}>アドベント</Link>
            <Link href="/festival" className={styles.link}>五月祭</Link>
            <Link href="/talks" className={styles.link}>学生講演</Link>
            <Link href="/articles" className={styles.link}>記事一覧</Link>
          </nav>
        </div>

        <div className={styles.copy}>
          © 2026 Physics Lab. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
