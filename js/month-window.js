/**
 * 希望休・シフト生成の月窓
 * - 閲覧下限: 2026-04（運用開始）
 * - 閲覧上限: 今日の年月 + 3ヶ月（例: 9/1 → 12月まで、10/1 → 翌1月まで）
 * - 初期表示: 1〜15日→翌月、16日以降→翌々月（編集ロックはしない）
 */

export const MONTH_ARCHIVE_START = { year: 2026, month: 3 }; // 0-indexed = 4月

export function addMonths(year, month, delta) {
  const d = new Date(year, month + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() };
}

export function compareYearMonth(a, b) {
  if (a.year !== b.year) return a.year - b.year;
  return a.month - b.month;
}

export function getMonthWindow(now = new Date()) {
  const max = addMonths(now.getFullYear(), now.getMonth(), 3);
  return { min: { ...MONTH_ARCHIVE_START }, max };
}

export function isMonthInWindow(year, month, now = new Date()) {
  const { min, max } = getMonthWindow(now);
  const cur = { year, month };
  return compareYearMonth(cur, min) >= 0 && compareYearMonth(cur, max) <= 0;
}

export function clampToMonthWindow(year, month, now = new Date()) {
  const { min, max } = getMonthWindow(now);
  const cur = { year, month };
  if (compareYearMonth(cur, min) < 0) return { ...min };
  if (compareYearMonth(cur, max) > 0) return { ...max };
  return cur;
}

/** 希望休の受付対象月（表示用）。1〜15日=翌月、16日以降=翌々月 */
export function getDefaultViewMonth(now = new Date()) {
  const offset = now.getDate() <= 15 ? 1 : 2;
  const target = addMonths(now.getFullYear(), now.getMonth(), offset);
  return clampToMonthWindow(target.year, target.month, now);
}

/** カレンダー上の「今月」（窓内にクランプ） */
export function getCalendarMonthClamped(now = new Date()) {
  return clampToMonthWindow(now.getFullYear(), now.getMonth(), now);
}
