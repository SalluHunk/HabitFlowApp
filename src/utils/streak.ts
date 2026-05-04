import { HabitLog } from '../types';

function parseDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function today(): string {
  return toDateStr(new Date());
}

export function addDays(dateStr: string, n: number): string {
  const d = parseDate(dateStr);
  d.setDate(d.getDate() + n);
  return toDateStr(d);
}

export function calculateStreak(logs: HabitLog[], referenceDate?: string): number {
  if (!logs.length) return 0;

  const ref = referenceDate ?? today();
  const dates = new Set(logs.map(l => l.date));

  let current: string;
  if (dates.has(ref)) {
    current = ref;
  } else if (dates.has(addDays(ref, -1))) {
    current = addDays(ref, -1);
  } else {
    return 0;
  }

  let streak = 0;
  while (dates.has(current)) {
    streak++;
    current = addDays(current, -1);
  }
  return streak;
}

export function calculateBestStreak(logs: HabitLog[]): number {
  if (!logs.length) return 0;

  const sorted = [...new Set(logs.map(l => l.date))].sort();
  if (!sorted.length) return 0;

  let best = 1, cur = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = parseDate(sorted[i - 1]);
    const curr = parseDate(sorted[i]);
    const diff = (curr.getTime() - prev.getTime()) / 86400000;
    if (diff === 1) {
      cur++;
      if (cur > best) best = cur;
    } else {
      cur = 1;
    }
  }
  return best;
}

export function getCalendarCells(logs: HabitLog[], weeks = 12) {
  const doneSet = new Set(logs.map(l => l.date));
  const cells: Array<{ date: string; done: boolean; wd: number }> = [];
  const t = new Date();
  const start = new Date(t);
  start.setDate(start.getDate() - weeks * 7);

  const cur = new Date(start);
  while (cur <= t) {
    const ds = toDateStr(cur);
    cells.push({ date: ds, done: doneSet.has(ds), wd: cur.getDay() });
    cur.setDate(cur.getDate() + 1);
  }
  return cells;
}
