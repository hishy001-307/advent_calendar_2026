import Link from "next/link";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { getAllTeamsPdfSpotlights } from "@/components/TeamPage/teamPageDefaults";
import styles from "./Articles.module.scss";

export default function ArticlesPage() {
  const teams = getAllTeamsPdfSpotlights();

  return (
    <>
      <Header />
      <main className={styles.page}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Physics Lab. 2026</p>
          <h1 className={styles.title}>解説記事・資料</h1>
          <p className={styles.lead}>
            各班のページに掲載している解説資料（PDF）の一覧です。班の紹介ページと同じ内容をまとめて参照できます。
          </p>
        </header>

        {teams.map((team) => (
          <section
            key={team.variant}
            className={styles.teamSection}
            aria-labelledby={`team-${team.variant}`}
          >
            <div className={styles.teamHeading}>
              <h2 id={`team-${team.variant}`} className={styles.teamName}>
                {team.teamName}
              </h2>
              <Link href={team.teamHref} prefetch={false} className={styles.teamLink}>
                班ページを見る →
              </Link>
            </div>

            <div className={styles.cardGrid}>
              {team.items.map((item, itemIndex) => (
                <article
                  key={`${team.variant}-${itemIndex}`}
                  className={styles.card}
                >
                  <span className={styles.badge}>PDF</span>
                  {item.title.trim() ? (
                    <h3 className={styles.cardTitle}>
                      <Link href={item.href} prefetch={false}>
                        {item.title}
                      </Link>
                    </h3>
                  ) : null}
                  <div className={styles.summary}>
                    {item.summaryLines.map((line, i) => (
                      <p key={`${team.variant}-${itemIndex}-${i}`}>{line}</p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </main>
      <Footer />
    </>
  );
}
