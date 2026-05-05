import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import {
  DAY1_SCHEDULE,
  DAY2_SCHEDULE,
  PERFORMANCE_DAY1_TITLE,
  PERFORMANCE_DAY2_TITLE,
  PERFORMANCE_PAGE_SUBTITLE,
  PERFORMANCE_SHOWS,
  SCHEDULE_TABLE_HEADING,
} from "./performanceData";
import styles from "./Performance.module.scss";

export default function PerformancePage() {
  return (
    <div className={styles.shell}>
      <Header />
      <div className={styles.mainColumn}>
        <div className={styles.page}>
          <main className={styles.inner}>
            <header className={styles.pageHeader}>
              <p className={styles.eyebrow}>Physics Lab. 2026</p>
              <h1 className={styles.title}>学生講演</h1>
              <p className={styles.subtitle}>{PERFORMANCE_PAGE_SUBTITLE}</p>
            </header>

            <section aria-labelledby="schedule-heading" className={styles.schedules}>
              <h2 id="schedule-heading" className={styles.srOnly}>
                タイムスケジュール
              </h2>

              <div className={styles.dayCard}>
                <h3 className={styles.dayLabel}>
                  Day 1・{PERFORMANCE_DAY1_TITLE}
                </h3>
                <p className={styles.scheduleTableTitle}>{SCHEDULE_TABLE_HEADING}</p>
                <ul className={styles.scheduleList}>
                  {DAY1_SCHEDULE.map((slot, index) => (
                    <li key={`d1-${index}`} className={styles.scheduleRow}>
                      <span className={styles.time}>{slot.time}</span>
                      <span className={styles.scheduleLabel}>{slot.title}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.dayCard}>
                <h3 className={styles.dayLabel}>
                  Day 2・{PERFORMANCE_DAY2_TITLE}
                </h3>
                <p className={styles.scheduleTableTitle}>{SCHEDULE_TABLE_HEADING}</p>
                <ul className={styles.scheduleList}>
                  {DAY2_SCHEDULE.map((slot, index) => (
                    <li key={`d2-${index}`} className={styles.scheduleRow}>
                      <span className={styles.time}>{slot.time}</span>
                      <span className={styles.scheduleLabel}>{slot.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section aria-labelledby="shows-heading">
              <h2 id="shows-heading" className={styles.showsSectionTitle}>
                プログラム紹介
              </h2>
              <div className={styles.shows}>
                {PERFORMANCE_SHOWS.map((show) => (
                  <article key={show.id} className={styles.showCard}>
                    <h3 className={styles.showTitle}>{show.title}</h3>
                    <div className={styles.showBody}>
                      {show.paragraphs.map((p, i) => (
                        <p key={`${show.id}-p-${i}`}>{p}</p>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </main>
        </div>

        <div className={styles.footerWrap}>
          <Footer />
        </div>
      </div>
    </div>
  );
}
