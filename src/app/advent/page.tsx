'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import Header from '@/components/Header/Header';

import Footer from '@/components/Footer/Footer';

import { getDateStatus } from '@/utils/date';
import { ADVENT_ENTRIES, type AdventEntry } from '@/data/adventEntries';

// ==== 設定：どの年の12月か ====
const ADVENT_YEAR = 2025;
const ADVENT_MONTH = 11; // 0-based（11 = 12月）

// ==== シリーズ定義 ====
const SERIES = [
  { id: 'series1', label: 'シリーズ1' },
  { id: 'series2', label: 'シリーズ2' },
];

// 日付文字列 → その日に属するエントリ一覧
const adventMap = ADVENT_ENTRIES.reduce<Record<string, AdventEntry[]>>(
  (acc, entry) => {
    if (!acc[entry.date]) acc[entry.date] = [];
    acc[entry.date].push(entry);
    return acc;
  },
  {},
);

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

// 指定月の6週×7日グリッドを作る
function buildMonthMatrix(baseDate: Date) {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth(); // 0-based

  const firstOfMonth = new Date(year, month, 1);
  const firstWeekday = firstOfMonth.getDay(); // 0:日〜6:土

  const lastOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastOfMonth.getDate();

  const lastOfPrevMonth = new Date(year, month, 0);
  const daysInPrevMonth = lastOfPrevMonth.getDate();

  const weeks: {
    date: Date;
    inCurrentMonth: boolean;
  }[][] = [];

  let currentDay = 1;
  let nextMonthDay = 1;

  for (let week = 0; week < 6; week++) {
    const row: { date: Date; inCurrentMonth: boolean }[] = [];

    for (let weekday = 0; weekday < 7; weekday++) {
      const cellIndex = week * 7 + weekday;

      let date: Date;
      let inCurrentMonth = true;

      if (cellIndex < firstWeekday) {
        // 前月の日付
        const day = daysInPrevMonth - (firstWeekday - 1) + cellIndex;
        date = new Date(year, month - 1, day);
        inCurrentMonth = false;
      } else if (currentDay > daysInMonth) {
        // 翌月の日付
        date = new Date(year, month + 1, nextMonthDay++);
        inCurrentMonth = false;
      } else {
        // 当月
        date = new Date(year, month, currentDay++);
        inCurrentMonth = true;
      }

      row.push({ date, inCurrentMonth });
    }

    weeks.push(row);
  }

  return weeks;
}

function formatDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function AdventCalendarPage() {
  // シリーズ切り替え
  const [activeSeries, setActiveSeries] = useState<string>('series1');

  // クライアント側でのみ今日の日付を取得（Hydration mismatch回避）
  const [today, setToday] = useState<string | null>(null);

  // 月送りはしないので、ベースの月は固定（12月）
  const baseDate = useMemo(() => new Date(ADVENT_YEAR, ADVENT_MONTH, 1), []);
  const weeks = useMemo(() => buildMonthMatrix(baseDate), [baseDate]);

  // クライアント側マウント後に今日の日付を設定
  useEffect(() => {
    setToday(formatDateKey(new Date()));
  }, []);

  const year = baseDate.getFullYear();
  const month = baseDate.getMonth() + 1;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl min-w-0 px-3 pt-6 pb-8 space-y-5 min-[480px]:px-4 min-[480px]:pt-8 min-[480px]:space-y-6">
        {/* ページヘッダ */}
        <header className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Advent Calendar 2026
          </p>
          <h1 className="break-words px-1 text-2xl font-semibold text-[#444443] min-[480px]:text-3xl sm:text-4xl">
            Physics Lab. アドベントカレンダー
          </h1>
          <p className="text-xs text-zinc-500">
            記事が投稿されるのは 12/1 〜 12/25 までです。
          </p>
          <p className="text-xs text-zinc-500">
            シリーズを切り替えて各日の記事をチェックできます。
          </p>
          <p className="hidden text-xs text-zinc-500 sm:block">
            カーソルを近づけると詳細が表示されます。
          </p>
          <p className="text-xs text-zinc-500 sm:hidden">
            各マスをタップすると記事ページが開きます。
          </p>
        </header>

        {/* シリーズ切り替えボタン */}
        <div className="flex flex-wrap justify-center gap-2 px-1">
          {SERIES.map((s) => {
            const isActive = s.id === activeSeries;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveSeries(s.id)}
                className={[
                  'rounded-full px-4 py-1 text-sm font-medium border transition',
                  isActive
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50',
                ].join(' ')}
              >
                {s.label}
              </button>
            );
          })}
        </div>

        {/* 月タイトル（固定：12月） */}
        <div className="text-center text-base font-medium text-zinc-800 min-[480px]:text-lg">
          {year}年{month}月
        </div>

        {/* 狭い画面ではカレンダー全体を横スクロール（7列を読みやすく保つ） */}
        <div className="-mx-3 min-w-0 overflow-x-auto pb-1 min-[480px]:mx-0 min-[480px]:overflow-visible min-[480px]:pb-0">
          <div className="min-w-[36rem] min-[480px]:min-w-0">
            {/* 曜日ヘッダー */}
            <div className="mb-2 grid min-w-0 grid-cols-7 border-b text-center text-[0.65rem] font-medium text-zinc-500 min-[480px]:text-xs [grid-template-columns:repeat(7,minmax(0,1fr))]">
              {WEEKDAYS.map((w) => (
                <div key={w} className="py-1">
                  {w}
                </div>
              ))}
            </div>

            {/* 壁掛けカレンダー */}
            <div className="grid min-w-0 grid-rows-4 gap-1">
              {weeks.slice(0, 4).map((week, i) => (
                <div
                  key={i}
                  className="grid min-w-0 grid-cols-7 gap-1 border-b [grid-template-columns:repeat(7,minmax(0,1fr))]"
                >
                  {/* ↑カレンダーの線はこれ */}
                  {week.map(({ date, inCurrentMonth }) => {
                    const key = formatDateKey(date);
                    const day = date.getDate();

                    // アドカレ範囲外は記事なし（リンクなし）
                    const inAdventRange =
                      inCurrentMonth && day >= 1 && day <= 25;

                    // その日の activeSeries 用のエントリを探す
                    const entries = adventMap[key] ?? [];
                    const entry = entries.find(
                      (e) => e.seriesId === activeSeries,
                    );

                    const isToday =
                      today !== null && formatDateKey(date) === today;

                    const isFuture =
                      today !== null && formatDateKey(date) > today;

                    const status = today ? getDateStatus(key, today) : null;

                    // 26日以降は表示しない
                    if (inCurrentMonth && day > 25) {
                      return null;
                    }

                    // 1月（翌月）は表示しない
                    if (!inCurrentMonth && date.getMonth() === 0) {
                      return null;
                    }

                    const lockedByDate = isFuture;
                    const lockedByStatus =
                      Boolean(today) &&
                      inAdventRange &&
                      Boolean(status) &&
                      (status === 'tomorrow' || status === 'future');
                    const isLocked =
                      entry &&
                      inAdventRange &&
                      (lockedByDate || lockedByStatus);

                    let className =
                      'relative flex min-h-[5.5rem] min-w-0 flex-col justify-between rounded-none border px-1 py-1 text-xs min-[480px]:min-h-[6.25rem] sm:px-2';

                    if (!inCurrentMonth) {
                      className += ' border-zinc-200 bg-zinc-50 text-zinc-300';
                    } else if (!inAdventRange) {
                      className += ' border-zinc-200 bg-white text-zinc-700';
                    } else if (entry) {
                      if (isLocked) {
                        className +=
                          ' border-zinc-200 bg-zinc-100 text-zinc-500 opacity-80';
                        if (lockedByDate) {
                          className += ' cursor-not-allowed';
                        }
                      } else {
                        className +=
                          ' border-pink-200 bg-pink-100 text-zinc-900';
                      }
                    } else {
                      className += ' border-zinc-200 bg-white text-zinc-700';
                    }

                    if (isToday) {
                      className +=
                        ' ring-2 ring-zinc-800 ring-offset-1 sm:ring-offset-2';
                    }

                    const inner = (
                      <>
                        <div className="flex h-full flex-col items-center justify-center gap-0.5 min-[480px]:gap-1">
                          <span className="text-xs font-medium min-[480px]:text-sm">
                            {day}
                          </span>
                          <div className="h-[28px] overflow-hidden px-0.5 text-center text-[10px] font-medium leading-snug break-words min-[480px]:h-[32px] min-[480px]:text-[11px] sm:px-1">
                            {entry && inAdventRange && entry.label}
                          </div>
                          <div className="min-h-[12px] px-0.5 text-center text-[10px] font-medium leading-snug min-[480px]:min-h-[14px] min-[480px]:px-1 min-[480px]:text-[11px]">
                            {entry &&
                              inAdventRange &&
                              entry.author &&
                              'by ' + entry.author}
                          </div>
                        </div>

                        {/* ホバー時のツールチップ */}
                        {entry && inAdventRange && (
                          <div className="pointer-events-none invisible absolute bottom-full left-1/2 z-50 mb-2 max-sm:hidden w-[min(16rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-lg border-2 border-[#444443] bg-white p-3 text-left opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100 sm:p-4">
                            {isLocked ? (
                              // 公開前の記事
                              <div className="text-center">
                                <div className="text-sm font-bold text-[#444443] mb-2">
                                  {entry.label}
                                </div>
                                {entry.author && (
                                  <div className="text-xs font-medium text-gray-900 mb-2">
                                    by {entry.author}
                                  </div>
                                )}
                                <div className="text-xs text-gray-500 italic">
                                  🔒 {formatDateKey(date)}に公開予定
                                </div>
                              </div>
                            ) : (
                              // 公開済みの記事
                              <>
                                <div className="text-sm font-bold text-[#444443] mb-2">
                                  {entry.label}
                                </div>
                                {entry.author && (
                                  <div className="text-xs font-medium text-gray-900 mb-2">
                                    by {entry.author}
                                  </div>
                                )}
                                {entry.abstract && (
                                  <div className="text-xs text-gray-700 leading-relaxed">
                                    {entry.abstract}
                                  </div>
                                )}
                              </>
                            )}
                            {/* 吹き出しの三角形 */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[2px] w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#444443]"></div>
                          </div>
                        )}
                      </>
                    );

                    // 12/1〜25 かつ entry がある日だけリンクにする
                    if (entry && inAdventRange) {
                      if (isLocked) {
                        return (
                          <div
                            key={key}
                            className={`${className} group relative`}
                          >
                            {inner}
                          </div>
                        );
                      }

                      return (
                        <Link
                          key={key}
                          href={entry.href}
                          prefetch={false}
                          className={`${className} group relative`}
                        >
                          {inner}
                        </Link>
                      );
                    }

                    return (
                      <div key={key} className={className}>
                        {inner}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-3 px-1 text-center text-xs text-zinc-400">
          ピンクのマスがこのシリーズのアドベント記事の日です。
        </p>
      </main>
      <Footer />
    </>
  );
}
