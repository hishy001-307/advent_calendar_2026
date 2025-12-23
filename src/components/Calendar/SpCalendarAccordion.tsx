'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { getDateStatus } from '@/utils/date';
import NewBadge from '@/components/Badges/NewBadge';
import styles from './SpCalendarAccordion.module.scss';

type AdventEntry = {
  date: string;
  label: string;
  author?: string;
  href: string;
  seriesId: string;
  abstract?: string;
  externalLink?: string;
};

type Props = {
  weeks: {
    date: Date;
    inCurrentMonth: boolean;
  }[][];
  adventMap: Record<string, AdventEntry[]>;
  activeSeries: string;
  today: string | null;
};

function formatDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function SpCalendarAccordion({
  weeks,
  adventMap,
  activeSeries,
  today,
}: Props) {
  // week index: 0-based
  const initialOpenWeek = useMemo(() => {
    if (!today) return 0;

    const todayDate = new Date(today);
    const isAfterAdvent =
      todayDate.getMonth() === 11 && todayDate.getDate() >= 26;

    if (isAfterAdvent) return 0;

    for (let w = 0; w < weeks.length; w++) {
      if (
        weeks[w].some(
          ({ date, inCurrentMonth }) =>
            inCurrentMonth && formatDateKey(date) === today,
        )
      ) {
        return w;
      }
    }
    return 0;
  }, [today, weeks]);

  const [openWeek, setOpenWeek] = useState<number>(initialOpenWeek);

  useEffect(() => {
    setOpenWeek(initialOpenWeek);
  }, [initialOpenWeek]);

  return (
    <section className={styles.wrapper}>
      {weeks.slice(0, 4).map((week, wIndex) => (
        <div key={wIndex} className={styles.week}>
          <button
            type="button"
            className={styles.weekHeader}
            onClick={() =>
              setOpenWeek((prev) => (prev === wIndex ? -1 : wIndex))
            }
          >
            <span>Week {wIndex + 1}</span>
            <span>{openWeek === wIndex ? '▲' : '▼'}</span>
          </button>

          <div
            className={[
              styles.panel,
              openWeek === wIndex ? styles.panelOpen : '',
            ].join(' ')}
          >
            <div className={styles.weekBody}>
              {week.map(({ date, inCurrentMonth }) => {
                const key = formatDateKey(date);
                const day = date.getDate();

                if (!inCurrentMonth || day < 1 || day > 25) return null;

                const entries = adventMap[key] ?? [];
                const entry = entries.find((e) => e.seriesId === activeSeries);

                const status = today ? getDateStatus(key, today) : null;
                const isPublished = status === 'past' || status === 'today';
                const isNew = status === 'today' && !!entry && inCurrentMonth;

                return (
                  <div key={key} className={styles.dayRow}>
                    <span className={styles.day}>{day}</span>

                    <div className={styles.content}>
                      {entry && isPublished ? (
                        entry.externalLink ? (
                          <a
                            href={entry.externalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.label}
                          >
                            {entry.label}
                          </a>
                        ) : (
                          <Link href={entry.href} className={styles.label}>
                            {entry.label}
                          </Link>
                        )
                      ) : (
                        <span className={styles.comingSoon}>
                          {entry ? 'Coming Soon' : '—'}
                        </span>
                      )}

                      {entry?.author && isPublished && (
                        <div className={styles.author}>by {entry.author}</div>
                      )}
                    </div>

                    {isNew && <NewBadge />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
