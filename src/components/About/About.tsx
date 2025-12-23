'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './About.module.scss';
import Image from 'next/image';

export default function About() {
  const heroRef = useRef<HTMLElement | null>(null);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    // SPだけで動かす（PCは不要）
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(min-width: 769px)').matches) return;

    const el = heroRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Aboutがある程度見えている間だけ表示
        setShowHint(entry.isIntersecting && entry.intersectionRatio > 0.25);
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.aboutHero}>
      <div
        className={`mx-auto max-w-5xl px-4 pt-10 pb-10 ` + styles.aboutSection}
      >
        <div className={styles.titleRow}>
          <h2 className={styles.title}>Physics Labとは？</h2>
          <Image
            src="/cat_nobi.png"
            alt="伸びをしている猫のシルエット"
            width={60}
            height={60}
            className={styles.cat}
          />
        </div>

        <p className={styles.body}>
          Physics Lab.
          は東京大学理学部物理学科の学生有志による物理学系学術サークルで、
          本年度は「素粒子班」・「物性班」・「宇宙班」・「生物班」・「計算物理班」・
          「実験班」の6班から成ります。各班での自主ゼミを中心とした活動をもとに、
          五月祭でのポスター発表・演示実験・学生講演および本ホームページでの解説
          pdf の公開を行います。
          また、12月にはアドベントカレンダーを本ホームページで公開します。
          物理学の面白さを少しでも伝えることができれば幸いです。
        </p>
      </div>

      {/* SPだけ：スクロール促進（画像不要） */}
      <div
        className={`${styles.scrollHint} ${
          showHint ? styles.scrollHintVisible : styles.scrollHintHidden
        }`}
        aria-hidden="true"
      >
        <span className={styles.scrollText}>Scroll</span>
        <span className={styles.scrollIcon}>⌄</span>
      </div>
    </section>
  );
}
