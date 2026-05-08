export type CategoryKey =
  | 'general' | 'health' | 'fitness' | 'work'
  | 'learning' | 'mindfulness' | 'social' | 'finance';

export type FrequencyKey = 'daily' | 'weekly' | 'custom';

export interface Habit {
  id: number;
  name: string;
  description: string;
  category: CategoryKey;
  frequency: FrequencyKey;
  target_value: number;
  unit: string;
  color: string;
  icon: string;
  days_of_week: string;
  created_at: string;
  is_active: number;
}

export interface HabitWithStatus extends Habit {
  streak: number;
  logged_today: boolean;
}

export interface HabitLog {
  id: number;
  habit_id: number;
  date: string;
  value: number;
  completed: number;
  notes: string;
  logged_at: string;
}

export interface Milestone {
  id: number;
  habit_id: number;
  type: string;
  streak_count: number;
  achieved_at: string;
}

export interface MilestoneDisplay {
  key: string;
  label: string;
  icon: string;
  achieved: boolean;
  threshold: number;
}

export interface HabitStats {
  streak: number;
  best_streak: number;
  total_completions: number;
  completion_rate: number;
  milestones: MilestoneDisplay[];
}

export interface CalendarCell {
  date: string;
  done: boolean;
  wd: number;
}

export interface DashboardStats {
  total_habits: number;
  completed_today: number;
  completion_rate: number;
  best_streak: number;
  total_logs: number;
}

export type RootStackParamList = {
  MainTabs: undefined;
  HabitDetail: { habitId: number };
};

export type BottomTabParamList = {
  Dashboard: undefined;
  Analytics: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  ResetPassword: { email?: string };
};
