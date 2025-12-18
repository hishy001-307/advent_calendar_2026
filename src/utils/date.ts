// src/utils/date.ts

export type DateStatus =
  | "past"
  | "today"
  | "tomorrow"
  | "future";

function toDate(dateKey: string): Date {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function getDateStatus(
  dateKey: string,
  todayKey: string
): DateStatus {
  const date = toDate(dateKey);
  const today = toDate(todayKey);

  // 時刻差を完全に無視する
  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffDays =
    (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

  if (diffDays < 0) return "past";
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "tomorrow";
  return "future";
}
