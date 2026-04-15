/** Day1 / Day2 のタイムスケジュール */

export type ScheduleSlot = {
  time: string;
  label: string;
};

export const DAY1_SCHEDULE: ScheduleSlot[] = [
  { time: "—", label: "準備中です" },
];

export const DAY2_SCHEDULE: ScheduleSlot[] = [
  { time: "—", label: "準備中です" },
];

/** 各公演のタイトルと紹介文 */
export type PerformanceShow = {
  id: string;
  title: string;
  /** 複数段落可 */
  paragraphs: string[];
};

export const PERFORMANCE_SHOWS: PerformanceShow[] = [
  {
    id: "show-1",
    title: "準備中です",
    paragraphs: ["準備中です"],
  },
];
