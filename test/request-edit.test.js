import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createRequestSnapshot,
  enumerateDates,
  getRemovedRequestIds,
  getRequestChanges,
} from '../js/request-edit.js';

test('2日間の希望を1日に短縮すると、期間外になったレコードを削除対象にする', () => {
  const original = [
    { id: 'request-16', staff_id: 'staff-1', date: '2026-09-16' },
    { id: 'request-17', staff_id: 'staff-1', date: '2026-09-17' },
  ];

  assert.deepEqual(
    getRemovedRequestIds(original, 'staff-1', enumerateDates('2026-09-16', '2026-09-16')),
    ['request-17'],
  );
});

test('期間・希望区分・備考の変更内容を具体的に組み立てる', () => {
  const before = createRequestSnapshot(
    'staff-1',
    ['2026-09-16', '2026-09-17'],
    'off',
    null,
  );
  const after = createRequestSnapshot('staff-1', ['2026-09-16'], 'am', '午前のみ');

  assert.deepEqual(getRequestChanges(before, after), [
    '期間「9/16〜9/17」→「9/16」',
    '希望区分「休み希望」→「AM可」',
    '備考「なし」→「午前のみ」',
  ]);
});

test('同じ内容を保存した場合は変更なしと判定する', () => {
  const snapshot = createRequestSnapshot('staff-1', ['2026-09-16'], 'off', null);
  assert.deepEqual(getRequestChanges(snapshot, snapshot), []);
});
