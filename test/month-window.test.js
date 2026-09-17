import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getDefaultViewMonth,
  getDefaultGenerateMonth,
  getMonthWindow,
} from '../js/month-window.js';

test('シフト希望ページ(getDefaultViewMonth): 1〜15日は翌月を初期表示', () => {
  // 2026年9月1日
  const earlySep = new Date(2026, 8, 1);
  assert.deepEqual(getDefaultViewMonth(earlySep), { year: 2026, month: 9 }); // 10月 (0-indexed: 9)

  // 2026年9月15日
  const midSep = new Date(2026, 8, 15);
  assert.deepEqual(getDefaultViewMonth(midSep), { year: 2026, month: 9 }); // 10月
});

test('シフト希望ページ(getDefaultViewMonth): 16日以降は翌々月を初期表示', () => {
  // 2026年9月16日
  const afterMidSep = new Date(2026, 8, 16);
  assert.deepEqual(getDefaultViewMonth(afterMidSep), { year: 2026, month: 10 }); // 11月 (0-indexed: 10)

  // 2026年9月30日
  const endSep = new Date(2026, 8, 30);
  assert.deepEqual(getDefaultViewMonth(endSep), { year: 2026, month: 10 }); // 11月
});

test('シフト生成ページ(getDefaultGenerateMonth): 15日以前・以降を問わず常に翌月を初期表示', () => {
  // 2026年9月1日（1〜15日）
  const earlySep = new Date(2026, 8, 1);
  assert.deepEqual(getDefaultGenerateMonth(earlySep), { year: 2026, month: 9 }); // 10月

  // 2026年9月15日
  const midSep = new Date(2026, 8, 15);
  assert.deepEqual(getDefaultGenerateMonth(midSep), { year: 2026, month: 9 }); // 10月

  // 2026年9月16日（15日締め切り後・シフト作成期間）
  const afterMidSep = new Date(2026, 8, 16);
  assert.deepEqual(getDefaultGenerateMonth(afterMidSep), { year: 2026, month: 9 }); // 10月 (翌月のまま)

  // 2026年9月30日
  const endSep = new Date(2026, 8, 30);
  assert.deepEqual(getDefaultGenerateMonth(endSep), { year: 2026, month: 9 }); // 10月 (翌月のまま)

  // 年跨ぎ（2026年12月16日）→ 2027年1月
  const midDec = new Date(2026, 11, 16);
  assert.deepEqual(getDefaultGenerateMonth(midDec), { year: 2027, month: 0 }); // 翌年1月
});
