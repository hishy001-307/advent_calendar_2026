import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.scss";
import SocialLinks from "@/components/SocialLinks/SocialLinks";
import { publicPath } from "@/utils/publicPath";

export default function Footer() {
  const teamLinks = [
    { label: "素粒子物理班", href: "/teams/particle" },
    { label: "物性物理班", href: "/teams/condensed-matter" },
    { label: "宇宙物理班", href: "/teams/astrophysics" },
    { label: "計算・数理物理班", href: "/teams/computational-math" },
    { label: "生物物理班", href: "/teams/biophysics" },
    { label: "実験班", href: "/teams/experimental" },
  ];

  return (
    <footer className={styles.footer}>
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className={styles.row}>

          {/* ブランドロゴ部分 */}
          <div className={styles.brand}>
            <Image
              src={publicPath("/logo_monochrome.png")}
              alt="Physics Lab ロゴ"
              width={5165}
              height={1989}
              className={styles.logo}
            />
            {/* <span className={styles.siteName}>Physics Lab. 2026</span> */}
          </div>

          {/* ナビ */}
          <nav className={styles.nav}>
            <Link href="/" className={styles.link}>ホーム</Link>
            <Link href="/advent" className={styles.link} prefetch={false}>アドベント</Link>
            <div className={styles.teamColumn}>
              {teamLinks.map((item) => (
                <Link key={item.href} href={item.href} className={styles.link} prefetch={false}>
                  {item.label}
                </Link>
              ))}
            </div>
            <Link href="/performance" className={styles.link}>学生講演</Link>
            <Link href="/articles" className={styles.link}>解説記事</Link>
            <Link href="/contact" className={styles.link}>お問い合わせ</Link>
          </nav>

          <SocialLinks variant="onDarkFooter" className={styles.socialLinks} />
        </div>

        <div className={styles.copy}>
          © 2026 Physics Lab. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
