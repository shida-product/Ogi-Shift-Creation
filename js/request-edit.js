export const REQUEST_TYPE_LABELS = {
  off: '休み希望',
  dispense: '調剤',
  am: 'AM可',
  pm: 'PM可',
  ringo: 'りんご',
  other: 'その他',
  work_ebisu: '勤務（恵比寿）',
  work_shibuya: '勤務（渋谷）',
};

export function enumerateDates(startStr, endStr) {
  const dates = [];
  const current = new Date(`${startStr}T00:00:00`);
  const end = new Date(`${endStr}T00:00:00`);

  while (current <= end) {
    dates.push(formatDate(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export function createRequestSnapshot(staffId, dates, requestType, note) {
  return {
    staff_id: staffId,
    dates: [...dates],
    request_type: requestType,
    note: note || null,
  };
}

export function getRequestChanges(before, after, getStaffName = id => id) {
  const changes = [];

  if (before.staff_id !== after.staff_id) {
    changes.push(`スタッフ「${getStaffName(before.staff_id)}」→「${getStaffName(after.staff_id)}」`);
  }
  if (before.dates.join(',') !== after.dates.join(',')) {
    changes.push(`期間「${formatPeriod(before.dates)}」→「${formatPeriod(after.dates)}」`);
  }
  if (before.request_type !== after.request_type) {
    changes.push(`希望区分「${REQUEST_TYPE_LABELS[before.request_type] || before.request_type}」→「${REQUEST_TYPE_LABELS[after.request_type] || after.request_type}」`);
  }
  if ((before.note || '') !== (after.note || '')) {
    changes.push(`備考「${before.note || 'なし'}」→「${after.note || 'なし'}」`);
  }

  return changes;
}

export function getRemovedRequestIds(originalRequests, targetStaffId, targetDates) {
  const targetDateSet = new Set(targetDates);
  return originalRequests
    .filter(request => request.staff_id !== targetStaffId || !targetDateSet.has(request.date))
    .map(request => request.id);
}

export function formatPeriod(dates) {
  if (!dates.length) return '';
  const first = formatShortDate(dates[0]);
  const last = formatShortDate(dates[dates.length - 1]);
  return first === last ? first : `${first}〜${last}`;
}

function formatShortDate(dateStr) {
  const [, month, day] = dateStr.split('-');
  return `${Number(month)}/${Number(day)}`;
}

function formatDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
