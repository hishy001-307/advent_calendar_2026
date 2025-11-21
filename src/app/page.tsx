"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

// ==== 設定：どの年の12月か ====
const ADVENT_YEAR = 2025;
const ADVENT_MONTH = 11; // 0-based（11 = 12月）

// ==== シリーズ定義 ====
const SERIES = [
  { id: "series1", label: "シリーズ1" },
  { id: "series2", label: "シリーズ2" },
];

type AdventEntry = {
  date: string;      // "2026-12-01" 形式
  label: string;     // カレンダーに出す短いタイトル
  href: string;      // 記事ページへのリンク
  seriesId: string;  // "series1" | "series2"
};

// ==== 仮データ：あとで実データに差し替え ====
// seriesId だけ変えれば同じ日付に別シリーズも載せられる
const ADVENT_ENTRIES: AdventEntry[] = [
  // 1日
  {
    date: "2025-12-01",
    label: "1日目のタイトル（S1）",
    href: "/advent/series1/1",
    seriesId: "series1",
  },
  {
    date: "2025-12-01",
    label: "1日目のタイトル（S2）",
    href: "/advent/series2/1",
    seriesId: "series2",
  },
  // 2日
  {
    date: "2025-12-02",
    label: "2日目タイトル（S1）",
    href: "/advent/series1/2",
    seriesId: "series1",
  },
  // ...必要なだけ 25日まで埋める
];

// 日付文字列 → その日に属するエントリ一覧
const adventMap = ADVENT_ENTRIES.reduce<Record<string, AdventEntry[]>>(
  (acc, entry) => {
    if (!acc[entry.date]) acc[entry.date] = [];
    acc[entry.date].push(entry);
    return acc;
  },
  {}
);

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

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
        const day =
          daysInPrevMonth - (firstWeekday - 1) + cellIndex;
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
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function AdventCalendarPage() {
  // シリーズ切り替え
  const [activeSeries, setActiveSeries] = useState<string>("series1");

  // 月送りはしないので、ベースの月は固定（12月）
  const baseDate = useMemo(
    () => new Date(ADVENT_YEAR, ADVENT_MONTH, 1),
    []
  );
  const weeks = useMemo(() => buildMonthMatrix(baseDate), [baseDate]);

  const year = baseDate.getFullYear();
  const month = baseDate.getMonth() + 1;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      {/* ページヘッダ */}
      <header className="space-y-2 text-center">
        <p className="text-xs uppercase tracking-wide text-zinc-500">
          Advent Calendar {year}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">
          アドベントカレンダー {year}年12月
        </h1>
        <p className="text-xs text-zinc-500">
          記事が投稿されるのは 12/1 〜 12/25 のみ。
          シリーズを切り替えて各日の記事をチェックできます。
        </p>
      </header>

      {/* シリーズ切り替えボタン */}
      <div className="flex justify-center gap-2">
        {SERIES.map((s) => {
          const isActive = s.id === activeSeries;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveSeries(s.id)}
              className={[
                "rounded-full px-4 py-1 text-sm font-medium border transition",
                isActive
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : "bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50",
              ].join(" ")}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {/* 月タイトル（固定：12月） */}
      <div className="text-center text-lg font-medium text-zinc-800">
        {year}年{month}月
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 text-center text-xs font-medium text-zinc-500 mb-2">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-1">
            {w}
          </div>
        ))}
      </div>

      {/* 壁掛けカレンダー */}
      <div className="grid grid-rows-6 gap-1">
        {weeks.map((week, i) => (
          <div key={i} className="grid grid-cols-7 gap-1">
            {week.map(({ date, inCurrentMonth }) => {
              const key = formatDateKey(date);
              const day = date.getDate();

              // アドカレ範囲外は記事なし（リンクなし）
              const inAdventRange =
                inCurrentMonth && day >= 1 && day <= 25;

              // その日の activeSeries 用のエントリを探す
              const entries = adventMap[key] ?? [];
              const entry = entries.find(
                (e) => e.seriesId === activeSeries
              );

              const isToday =
                formatDateKey(date) === formatDateKey(new Date());

              // ベースのスタイル
              let className =
                "relative h-20 rounded-lg border text-xs flex flex-col justify-between px-2 py-1";

              if (!inCurrentMonth) {
                // 前後月
                className +=
                  " border-zinc-200 bg-zinc-50 text-zinc-300";
              } else if (entry && inAdventRange) {
                // 記事あり
                className +=
                  " border-pink-200 bg-pink-100 text-zinc-900";
              } else {
                // 当月だが記事なし
                className +=
                  " border-zinc-200 bg-white text-zinc-700";
              }

              if (isToday) {
                className += " ring-2 ring-zinc-800 ring-offset-2";
              }

              const inner = (
                <>
                  <div className="flex items-start justify-between">
                    <span className="text-sm font-medium">
                      {day}
                    </span>
                  </div>
                  {entry && inAdventRange && (
                    <div className="mt-1 text-[11px] leading-snug font-medium line-clamp-2">
                      {entry.label}
                    </div>
                  )}
                </>
              );

              // 12/1〜25 かつ entry がある日だけリンクにする
              if (entry && inAdventRange) {
                return (
                  <Link
                    key={key}
                    href={entry.href}
                    className={className}
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

      <p className="mt-3 text-xs text-zinc-400 text-center">
        ピンクのマスがこのシリーズのアドベント記事の日です。
      </p>
    </main>
  );
}
