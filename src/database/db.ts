import * as SQLite from 'expo-sqlite';
import { Habit, HabitLog, Milestone } from '../types';
import { CategoryColors, CategoryIcons, MILESTONE_THRESHOLDS } from '../theme';
import { today } from '../utils/streak';
import { calculateStreak } from '../utils/streak';

const db = SQLite.openDatabaseSync('habitflow.db');

// ── Schema ─────────────────────────────────────────────────

export function initDB(): void {
  db.execSync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS habits (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      name          TEXT    NOT NULL,
      description   TEXT    DEFAULT '',
      category      TEXT    DEFAULT 'general',
      frequency     TEXT    DEFAULT 'daily',
      target_value  INTEGER DEFAULT 1,
      unit          TEXT    DEFAULT 'times',
      color         TEXT    DEFAULT '#64748b',
      icon          TEXT    DEFAULT '✨',
      days_of_week  TEXT    DEFAULT '0,1,2,3,4,5,6',
      created_at    TEXT    NOT NULL,
      is_active     INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS habit_logs (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      habit_id   INTEGER NOT NULL,
      date       TEXT    NOT NULL,
      value      INTEGER DEFAULT 1,
      completed  INTEGER DEFAULT 1,
      notes      TEXT    DEFAULT '',
      logged_at  TEXT    NOT NULL,
      FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
      UNIQUE(habit_id, date)
    );

    CREATE TABLE IF NOT EXISTS milestones (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      habit_id     INTEGER NOT NULL,
      type         TEXT    NOT NULL,
      streak_count INTEGER DEFAULT 0,
      achieved_at  TEXT    NOT NULL,
      FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
      UNIQUE(habit_id, type)
    );
  `);
}

// ── Habits ─────────────────────────────────────────────────

export function getAllHabits(): Habit[] {
  return db.getAllSync<Habit>(
    'SELECT * FROM habits WHERE is_active = 1 ORDER BY name'
  );
}

export function getHabit(id: number): Habit | null {
  return db.getFirstSync<Habit>('SELECT * FROM habits WHERE id = ?', [id]) ?? null;
}

export function createHabit(params: {
  name: string;
  description?: string;
  category?: string;
  frequency?: string;
  target_value?: number;
  unit?: string;
  color?: string;
  icon?: string;
  days_of_week?: string;
}): number {
  const {
    name,
    description = '',
    category = 'general',
    frequency = 'daily',
    target_value = 1,
    unit = 'times',
    color = CategoryColors[category] ?? '#64748b',
    icon = CategoryIcons[category] ?? '✨',
    days_of_week = '0,1,2,3,4,5,6',
  } = params;

  const result = db.runSync(
    `INSERT INTO habits
     (name, description, category, frequency, target_value, unit, color, icon, days_of_week, created_at)
     VALUES (?,?,?,?,?,?,?,?,?,?)`,
    [name, description, category, frequency, target_value, unit, color, icon, days_of_week, new Date().toISOString()]
  );
  return result.lastInsertRowId as number;
}

export function updateHabit(id: number, params: Partial<{
  name: string;
  description: string;
  category: string;
  frequency: string;
  target_value: number;
  unit: string;
  color: string;
  icon: string;
  days_of_week: string;
  is_active: number;
}>): void {
  const entries = Object.entries(params);
  if (!entries.length) return;
  const set = entries.map(([k]) => `${k} = ?`).join(', ');
  const vals = [...entries.map(([, v]) => v), id];
  db.runSync(`UPDATE habits SET ${set} WHERE id = ?`, vals);
}

export function deleteHabit(id: number): void {
  db.runSync('DELETE FROM habits WHERE id = ?', [id]);
}

// ── Logs ───────────────────────────────────────────────────

export function logHabit(habitId: number, date?: string, value = 1, notes = ''): void {
  const d = date ?? today();
  const now = new Date().toISOString();
  db.runSync(
    `INSERT INTO habit_logs (habit_id, date, value, completed, notes, logged_at)
     VALUES (?,?,?,1,?,?)
     ON CONFLICT(habit_id, date) DO UPDATE SET
       value=excluded.value, completed=1,
       notes=excluded.notes, logged_at=excluded.logged_at`,
    [habitId, d, value, notes, now]
  );
}

export function unlogHabit(habitId: number, date?: string): void {
  db.runSync(
    'DELETE FROM habit_logs WHERE habit_id = ? AND date = ?',
    [habitId, date ?? today()]
  );
}

export function isLogged(habitId: number, date?: string): boolean {
  const row = db.getFirstSync<{ id: number }>(
    'SELECT id FROM habit_logs WHERE habit_id = ? AND date = ?',
    [habitId, date ?? today()]
  );
  return row !== null && row !== undefined;
}

export function getLogsForHabit(habitId: number, limit?: number): HabitLog[] {
  if (limit) {
    return db.getAllSync<HabitLog>(
      'SELECT * FROM habit_logs WHERE habit_id = ? ORDER BY date DESC LIMIT ?',
      [habitId, limit]
    );
  }
  return db.getAllSync<HabitLog>(
    'SELECT * FROM habit_logs WHERE habit_id = ? ORDER BY date DESC',
    [habitId]
  );
}

export function getAllLogs(): HabitLog[] {
  return db.getAllSync<HabitLog>('SELECT * FROM habit_logs ORDER BY date DESC');
}

// ── Toggle (returns new state) ─────────────────────────────

export function toggleLog(habitId: number): { logged: boolean; streak: number } {
  const logged = isLogged(habitId);
  if (logged) {
    unlogHabit(habitId);
  } else {
    logHabit(habitId);
  }
  const logs = getLogsForHabit(habitId);
  const streak = calculateStreak(logs);

  if (!logged) {
    // Check milestones
    const existing = new Set(getMilestones(habitId).map(m => m.type));
    for (const t of MILESTONE_THRESHOLDS) {
      const key = `streak_${t}`;
      if (streak >= t && !existing.has(key)) {
        db.runSync(
          'INSERT OR IGNORE INTO milestones (habit_id, type, streak_count, achieved_at) VALUES (?,?,?,?)',
          [habitId, key, streak, new Date().toISOString()]
        );
      }
    }
  }

  return { logged: !logged, streak };
}

// ── Milestones ─────────────────────────────────────────────

export function getMilestones(habitId: number): Milestone[] {
  return db.getAllSync<Milestone>(
    'SELECT * FROM milestones WHERE habit_id = ? ORDER BY streak_count',
    [habitId]
  );
}
