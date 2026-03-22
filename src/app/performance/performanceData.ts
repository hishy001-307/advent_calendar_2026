/** Day1 / Day2 のタイムスケジュール（文言・時刻は随時更新） */

export type ScheduleSlot = {
  time: string;
  label: string;
};

export const DAY1_SCHEDULE: ScheduleSlot[] = [
  { time: "—:—", label: "開場・受付（例）" },
  { time: "—:—", label: "第1部（例）" },
  { time: "—:—", label: "休憩（例）" },
  { time: "—:—", label: "第2部（例）" },
];

export const DAY2_SCHEDULE: ScheduleSlot[] = [
  { time: "—:—", label: "開場・受付（例）" },
  { time: "—:—", label: "第1部（例）" },
  { time: "—:—", label: "休憩（例）" },
  { time: "—:—", label: "第2部（例）" },
];

/** 各公演のタイトルと紹介文の枠 */
export type PerformanceShow = {
  id: string;
  title: string;
  /** 複数段落可 */
  paragraphs: string[];
};

export const PERFORMANCE_SHOWS: PerformanceShow[] = [
  {
    id: "show-1",
    title: "公演タイトル（準備中）",
    paragraphs: [
      "ここに公演の紹介文を書きます。テーマや見どころ、対象となる観客などを数行でまとめてください。",
    ],
  },
  {
    id: "show-2",
    title: "公演タイトル（準備中）",
    paragraphs: [
      "紹介文の2つ目の枠です。必要に応じて段落を増やしたり、`performanceData.ts` に項目を追加してください。",
    ],
  },
  {
    id: "show-3",
    title: "公演タイトル（準備中）",
    paragraphs: [
      "Physics Lab. 学生公演のプログラム例です。正式な情報が決まり次第、こちらを更新します。",
    ],
  },
];
