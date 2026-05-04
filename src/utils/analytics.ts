import { Habit, HabitLog } from '../types';
import { today, calculateStreak, calculateBestStreak, addDays } from './streak';

export function getDashboardStats(habits: Habit[], allLogs: Map<number, HabitLog[]>) {
  const t = today();
  let completed = 0, bestStreak = 0, totalLogs = 0;

  for (const h of habits) {
    const logs = allLogs.get(h.id) ?? [];
    totalLogs += logs.length;
    if (logs.some(l => l.date === t)) completed++;
    const s = calculateStreak(logs, t);
    if (s > bestStreak) bestStreak = s;
  }

  const n = habits.length;
  return {
    total_habits: n,
    completed_today: completed,
    completion_rate: n ? Math.round((completed / n) * 100) : 0,
    best_streak: bestStreak,
    total_logs: totalLogs,
  };
}

export function getWeeklyActivity(allLogs: HabitLog[]): Array<{ label: string; count: number }> {
  const t = today();
  const result: Record<string, number> = {};
  const dayLabels: Record<string, string> = {};
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 6; i >= 0; i--) {
    const d = addDays(t, -i);
    result[d] = 0;
    const date = new Date(d + 'T00:00:00');
    dayLabels[d] = days[date.getDay()];
  }
  for (const l of allLogs) {
    if (l.date in result) result[l.date]++;
  }
  return Object.entries(result).map(([d, count]) => ({ label: dayLabels[d], count }));
}

export function getCategoryBreakdown(habits: Habit[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const h of habits) {
    counts[h.category] = (counts[h.category] ?? 0) + 1;
  }
  return counts;
}

export function getTopHabits(habits: Habit[], allLogs: Map<number, HabitLog[]>) {
  const t = today();
  return habits
    .map(h => {
      const logs = allLogs.get(h.id) ?? [];
      return {
        ...h,
        current_streak: calculateStreak(logs, t),
        best_streak: calculateBestStreak(logs),
        total_completions: logs.length,
      };
    })
    .sort((a, b) => b.current_streak - a.current_streak || b.total_completions - a.total_completions);
}

export function getTrendData(logs: HabitLog[], weeks = 8): Array<{ label: string; count: number }> {
  const t = new Date();
  const result = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const ws = new Date(t);
    ws.setDate(t.getDate() - t.getDay() - 7 * i);
    const we = new Date(ws);
    we.setDate(ws.getDate() + 6);

    const count = logs.filter(l => {
      const d = new Date(l.date + 'T00:00:00');
      return d >= ws && d <= we;
    }).length;

    result.push({ label: i === 0 ? 'This wk' : `-${i}w`, count });
  }
  return result;
}

export function getAnnualHeatmap(allLogs: HabitLog[], weeks = 52) {
  const t = new Date();
  const start = new Date(t);
  start.setDate(t.getDate() - weeks * 7);

  const dayCounts: Record<string, number> = {};
  for (const l of allLogs) {
    dayCounts[l.date] = (dayCounts[l.date] ?? 0) + 1;
  }

  const cells: Array<{ date: string; count: number }> = [];
  const cur = new Date(start);
  while (cur <= t) {
    const ds = `${cur.getFullYear()}-${String(cur.getMonth()+1).padStart(2,'0')}-${String(cur.getDate()).padStart(2,'0')}`;
    cells.push({ date: ds, count: dayCounts[ds] ?? 0 });
    cur.setDate(cur.getDate() + 1);
  }
  return cells;
}
