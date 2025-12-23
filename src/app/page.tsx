"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header/Header";

import About from "@/components/About/About";

import Footer from "@/components/Footer/Footer";

import { getDateStatus } from "@/utils/date";

import NewBadge from "@/components/Badges/NewBadge";

import SpCalendarAccordion from "@/components/Calendar/SpCalendarAccordion";

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
  author?: string;    // 著者名
  href: string;      // 記事ページへのリンク
  seriesId: string;  // "series1" | "series2"
  abstract?: string; // アブストラクト（オプション）
  externalLink?: string; // 外部リンク（mathlog等）
};

// ==== 記事データ ====
const ADVENT_ENTRIES: AdventEntry[] = [
  // ==== シリーズ1のデータ（CSVより） ====
  // 1日
  {
    date: "2025-12-01",
    label: "Physlab2026挨拶",
    author: "Hiro",
    href: "/advent/series1/1",
    seriesId: "series1",
    externalLink: "https://mathlog.info/articles/fftYodHsDAp74ymsbyIG",
  },
  // 2日
  {
    date: "2025-12-02",
    label: "運営紹介と理物生の1日",
    href: "/advent/series1/2",
    seriesId: "series1",
    externalLink: "https://mathlog.info/articles/Dk02hUxpTV1TGNUP2C3L",
  },
  // 3日
  {
    date: "2025-12-03",
    label: "素粒子物理班紹介",
    href: "/advent/series1/3",
    seriesId: "series1",
    externalLink: "https://mathlog.info/articles/8FdaNR1R5ulpsyls5qWN",
  },
  // 4日
  {
    date: "2025-12-04",
    label: "物性物理班紹介",
    href: "/advent/series1/4",
    seriesId: "series1",
    externalLink: "https://mathlog.info/articles/9E7Qdcuk2sYGiHlMM9et",
  },
  // 5日
  {
    date: "2025-12-05",
    label: "宇宙物理班紹介",
    href: "/advent/series1/5",
    seriesId: "series1",
    externalLink: "https://mathlog.info/articles/sIZnNTlwcCFGcqu3Lqi2",
  },
  // 6日
  {
    date: "2025-12-06",
    label: "生物物理班紹介",
    href: "/advent/series1/6",
    seriesId: "series1",
  },
  // 7日
  {
    date: "2025-12-07",
    label: "計算数理物理班紹介",
    href: "/advent/series1/7",
    seriesId: "series1",
  },
  // 8日
  {
    date: "2025-12-08",
    label: "実験班紹介",
    author: "メラゾーマ",
    href: "/advent/series1/8",
    seriesId: "series1",
  },
  // 9日
  {
    date: "2025-12-09",
    label: "テンソルネットワーク1「ising模型と行列積」",
    author: "Hiro",
    href: "/advent/series1/9",
    seriesId: "series1",
    abstract: "転送行列の議論からはじめてテンソルネットワークの基本的な概念について紹介します",
  },
  // 10日
  {
    date: "2025-12-10",

    label: "宇宙の時間を巻き戻す方法 — Λ-CDMモデルで知る宇宙の広さと年齢",
    author: "ほるみる",
    href: "/advent/series1/10",
    seriesId: "series1",
    abstract: "宇宙の年齢と広さはどうやって計算できるのか　Λ-CDM model",
  },
  // 11日
  {
    date: "2025-12-11",
    label: "誤差解析論考1",
    author: "Physixしあ",
    href: "/advent/series1/11",
    seriesId: "series1",
    abstract: "誤差の重要性、誤差の表記法、不一致とは何か、統計誤差と系統誤差の違いなど誤差解析を行う上で基礎的な事柄について述べる。",
  },
  // 12日
  {
    date: "2025-12-12",
    label: "波数空間はともだち：量子論の基礎から理解する固体物理学への入門",
    href: "/advent/series1/12",
    seriesId: "series1",
    abstract: "自由粒子→TB ハミルトニアン　空間並進対称性が破れると波数空間が「おりたたまれる」ことを理解する。",
  },
  // 13日
  {
    date: "2025-12-13",
    label: "極座標ラプラシアンと友達になろう",
    author: "なべ",
    href: "/advent/series1/13",
    seriesId: "series1",
  },
  // 14日
  {
    date: "2025-12-14",
    label: "微分方程式の数値解法とその実装",
    href: "/advent/series1/14",
    seriesId: "series1",
    abstract: "微分方程式をオイラー法やルンゲクッタ法で解く方法の基礎付けとパイソンでの実装を軽く紹介したいと考えています。",
  },
  // 15日
  {
    date: "2025-12-15",
    label: "テンソルネットワーク2「繰り込み群の数理と応用」",
    author: "Hiro",
    href: "/advent/series1/15",
    seriesId: "series1",
    abstract: "テンソルネットワークにおける\"繰り込み\"の概念について紹介し、代表的な計算手法とその応用について扱います",
  },
  // 16日
  {
    date: "2025-12-16",
    label: "仮:曲がった時空の場の量子論",
    author: "RelLim",
    href: "/advent/series1/16",
    seriesId: "series1",
    abstract: "Unruh effect書くかもしれません。全然変わるかもしれません。",
  },
  // 17日
  {
    date: "2025-12-17",
    label: "加速器紹介~サイクロトロン実験によせて~",
    href: "/advent/series1/17",
    seriesId: "series1",
    abstract: "恐らく加速器の種類とか原理とかを書く予定ですが、場合によっては検出器周りを書いたり、過去の有名な実験を書くかもです。",
  },
  // 18日
  {
    date: "2025-12-18",
    label: "ソリトン、古典可積分系(仮題)",
    href: "/advent/series1/18",
    seriesId: "series1",
    abstract: "KdV方程式から始めてソリトンとその周辺について書こうと思います",
  },
  // 19日
  {
    date: "2025-12-19",
    label: "誤差解析論考2",
    author: "Physixしあ",
    href: "/advent/series1/19",
    seriesId: "series1",
    abstract: "平均、重み付き平均に対する標準偏差(SDOM)はどう計算されるかを述べ、それを応用して最小二乗法及び重み付き最小二乗法によるフィッティングのパラメタが持つ誤差について解説する。できればその際の系統誤差の扱いにも触れたい。",
  },
  // 20日
  {
    date: "2025-12-20",
    label: "OISTリサーチインターンの紹介",
    author: "Bundes",
    href: "/advent/series1/20",
    seriesId: "series1",
    abstract: "自分のOISTリサーチインターンの経験を勝手気ままにご紹介します",
  },
  // 21日
  {
    date: "2025-12-21",
    label: "(量子100年&)ビスマルク生誕210周年なのでドイツの話をする",
    author: "Bundes",
    href: "/advent/series1/21",
    seriesId: "series1",
    abstract: "「統一後のドイツ」を楽しく読むための予備知識として、前半部でBundestagswahl 2025について振り返り、後半部でドイツ再統一過程について簡単にご紹介し、ドイツ史・ドイツ政治の魅力を語ります！！！！！",
  },
  // 22日
  {
    date: "2025-12-22",
    label: "テンソルネットワーク3「ブラックホールと誤り訂正符号」",
    author: "Hiro",
    href: "/advent/series1/22",
    seriesId: "series1",
    abstract: "MERAネットワークと共形場理論からAdS/CFT対応について議論し、ブラックホールの誤り訂正符号としての解釈を目指します",
  },
  // 23日
  {
    date: "2025-12-23",
    label: "HGP codeとして高次元表面符号を構成しよう！",
    author: "Jimmy",
    href: "/advent/series1/23",
    seriesId: "series1",
    abstract: "HGP codeから高次元の表面符号を構成します。量子エラー訂正符号の話です。",
  },
  // 24日
  {
    date: "2025-12-24",
    label: "クリスマスの夜空にオーロラを作り出す方法",
    author: "K-2",
    href: "/advent/series1/24",
    seriesId: "series1",
    abstract: "数十億円使って空にロケット打ちあげて電子ビームを放出すれば何とかなるのではという話",
  },
  // 25日
  {
    date: "2025-12-25",
    label: "クリスマスなのでスパニングツリーの話をする",
    author: "さみだれ",
    href: "/advent/series1/25",
    seriesId: "series1",
    abstract: "行列木定理の周辺でも書こうかなあ",
  },

  // ==== シリーズ2のデータ（CSVより） ====
  // 3日
  {
    date: "2025-12-03",
    label: "【共形場理論】Virasoro代数のつくりかた",
    author: "Jimmy",
    href: "/advent/series2/3",
    seriesId: "series2",
    abstract: "Virasoro代数がLie代数の中心拡大として得られることを頑張って書きます。",
    externalLink: "https://mathlog.info/articles/vC7gEcCnikTwz6myYlKK",
  },
  // 7日
  {
    date: "2025-12-07",
    label: "LaTeXの表を整える",
    author: "Physixしあ",
    href: "/advent/series2/7",
    seriesId: "series2",
    abstract: "siunitxとbooktabsで表を整えよう、という話。",
  },
  // 12日
  {
    date: "2025-12-12",
    label: "経路積分(量子力学)",
    href: "/advent/series2/12",
    seriesId: "series2",
    abstract: "量子力学の範疇での経路積分をまとめたい",
  },
  // 13日
  {
    date: "2025-12-13",
    label: "トポロジカル超伝導体入門",
    author: "soleil",
    href: "/advent/series2/13",
    seriesId: "series2",
    abstract: "トポロジカル超伝導体についてMajorana fermionとかの話をしたいです",
  },
  // 17日
  {
    date: "2025-12-17",
    label: "ChantoGPT~一般確率論ことはじめ~",
    href: "/advent/series2/17",
    seriesId: "series2",
    abstract: "ちゃんとGPTをやります",
  },
  // 19日
  {
    date: "2025-12-19",
    label: "共形場理論と一般化対称性",
    author: "soleil",
    href: "/advent/series2/19",
    seriesId: "series2",
    abstract: "CFTのfusion則と一般化対称性におけるfusion則について議論します",
  },
  // 21日
  {
    date: "2025-12-21",
    label: "Ising model × Origami。",
    href: "/advent/series2/21",
    seriesId: "series2",
    abstract: "イジングモデルと折り紙の関連性について述べたい",
  },
  // 22日
  {
    date: "2025-12-22",
    label: "トポロジカル周期表",
    author: "soleil",
    href: "/advent/series2/22",
    seriesId: "series2",
    abstract: "トポロジカル周期表について解説します。どれかの記事は書くのが遅れてしまうかもしれません🙏",
  },
  // 23日
  {
    date: "2025-12-23",
    label: "誤差解析論考3",
    author: "Physixしあ",
    href: "/advent/series2/23",
    seriesId: "series2",
    abstract: "1と2で書ききれなかったところや気付いたところ、あと誤差に関する愚痴を喋る。",
  },
  // 24日
  {
    date: "2025-12-24",
    label: "フ。~フンボルトペンギンの糞の運動について~",
    author: "さみだれ",
    href: "/advent/series2/24",
    seriesId: "series2",
    abstract: "arxiv:2007.00926 のレビューと、その拡張を議論したい",
  },
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

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

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
  
  // クライアント側でのみ今日の日付を取得（Hydration mismatch回避）
  const [today, setToday] = useState<string | null>(null);

  // 月送りはしないので、ベースの月は固定（12月）
  const baseDate = useMemo(
    () => new Date(ADVENT_YEAR, ADVENT_MONTH, 1),
    []
  );
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
      <main className="mx-auto max-w-5xl px-4 pt-8 pb-8 space-y-6">
        {/* Aboutをここに表示 */}
        <About />
        {/* ページヘッダ */}
        <header className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Advent Calendar 2026
          </p>
          <h1 className="text-4xl font-semibold text-[#444443]">
            Physics Lab. アドベントカレンダー
          </h1>
          <p className="text-xs text-zinc-500">
            記事が投稿されるのは 12/1 〜 12/25 までです。
          </p>
          <p className="text-xs text-zinc-500">
            シリーズを切り替えて各日の記事をチェックできます。
          </p>
          <p className="text-xs text-zinc-500">
            カーソルを近づけると詳細が表示されます。
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

        {/* ===== SP用カレンダー（週アコーディオン） ===== */}
        <div className="block md:hidden">
          <SpCalendarAccordion
            weeks={weeks}
            adventMap={adventMap}
            activeSeries={activeSeries}
            today={today}
          />
        </div>

      
          
{/* ===== PC用カレンダー（7列壁掛け） ===== */}
<div className="hidden md:block">
        {/* 曜日ヘッダー */}
        <div className="grid grid-cols-7 border-b text-center text-xs font-medium text-zinc-500 mb-2">
          {WEEKDAYS.map((w) => (
            <div key={w} className="py-1">
              {w}
            </div>
          ))}
        </div>

        {/* 壁掛けカレンダー */}
        <div className="grid grid-rows-4 gap-1">
          {weeks.slice(0, 4).map((week, i) => (
            <div key={i} className="grid border-b grid-cols-7 gap-1">
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
                  (e) => e.seriesId === activeSeries
                );

                const isToday = today !== null && formatDateKey(date) === today;
                const status = today ? getDateStatus(key, today) : null;
                const isNew = status === "today" && !!entry && inAdventRange;

                // 26日以降は表示しない
                if (inCurrentMonth && day > 25) {
                  return null;
                }

                // 1月（翌月）は表示しない
                if (!inCurrentMonth && date.getMonth() === 0) {
                  return null;
                }

                // ベースのスタイル
let className =
  "relative h-25 rounded-none text-xs flex flex-col justify-between px-2 py-1";

if (!inCurrentMonth) {
  // 前後月
  className += " border-zinc-200 bg-zinc-50 text-zinc-300";
} else if (inAdventRange && status && (status === "tomorrow" || status === "future")) {
  // 未来（明日含む）：グレー（ロック）
  className += " border-zinc-200 bg-zinc-100 text-zinc-500";
} else if (entry && inAdventRange) {
  // 公開済み記事あり：ピンク
  className += " border-pink-200 bg-pink-100 text-zinc-900";
} else {
  // 当月だが記事なし
  className += " border-zinc-200 bg-white text-zinc-700";
}

if (isToday) {
  className += " ring-2 ring-zinc-800 ring-offset-2";
}

                const inner = (
                  <>
                  {isNew && (
  <NewBadge className="absolute top-1 right-1" />
)}
                    <div className="flex items-center justify-center h-full flex-col gap-1">
                      <span className="text-sm font-medium">
                        {day}
                      </span>
                      <div className="text-[11px] leading-snug font-medium text-center px-1 h-[32px] overflow-hidden">
  {inAdventRange && (
    status === "past" || status === "today"
      ? entry?.label ?? null
      : status === "tomorrow"
        ? entry?.label ?? "Coming Soon"
        : "Coming Soon"
  )}
</div>
                      <div className="text-[11px] leading-snug font-medium text-center px-1 min-h-[14px]">
  {inAdventRange && (status === "past" || status === "today") && entry?.author
    ? `by ${entry.author}`
    : null}
</div>
                    </div>

                    {/* ホバー時のツールチップ */}
                    {entry && inAdventRange && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-white border-2 border-[#444443] rounded-lg shadow-xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
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
                        {/* 吹き出しの三角形 */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[2px] w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#444443]"></div>
                      </div>
                    )}
                  </>
                );

                const isPublished = status === "past" || status === "today";

                // 12/1〜25 かつ entry がある、かつ 公開済みだけリンクにする
                if (entry && inAdventRange && isPublished) {
                  // 外部リンクがある場合はそちらを優先
                  if (entry.externalLink) {
                    return (
                      <a
                        key={key}
                        href={entry.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${className} group relative`}
                      >
                        {inner}
                      </a>
                    );
                  }

                  // 内部リンク
                  return (
                    <Link
                      key={key}
                      href={entry.href}
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

        <p className="mt-3 text-xs text-zinc-400 text-center">
          ピンクのマスがこのシリーズのアドベント記事の日です。
        </p>
      </main>
      <Footer />
    </>
  );
}
