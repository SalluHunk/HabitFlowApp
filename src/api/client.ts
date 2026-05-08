import AsyncStorage from '@react-native-async-storage/async-storage';

// IMPORTANT: replace this with your deployed Render URL once live.
// For local dev on Android emulator, use http://10.0.2.2:5000
// For physical device on same wifi, use http://<YOUR-LAN-IP>:5000
export const API_BASE_URL = 'https://habittracker-stim.onrender.com';

const TOKEN_KEY = 'habitflow.jwt';

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {}
): Promise<T> {
  const { method = 'GET', body, auth = true } = options;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (auth) {
    const token = await getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new ApiError(res.status, data?.error || `HTTP ${res.status}`);
  }
  return data as T;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  avatar_url: string | null;
}

export async function apiSignup(email: string, password: string, name?: string) {
  return request<{ token: string; user: AuthUser }>('/api/auth/signup', {
    method: 'POST',
    body: { email, password, name },
    auth: false,
  });
}

export async function apiLogin(email: string, password: string) {
  return request<{ token: string; user: AuthUser }>('/api/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  });
}

export async function apiGoogleLogin(idToken: string) {
  return request<{ token: string; user: AuthUser }>('/api/auth/google', {
    method: 'POST',
    body: { id_token: idToken },
    auth: false,
  });
}

export async function apiMe() {
  return request<{ user: AuthUser }>('/api/auth/me');
}

export async function apiForgotPassword(email: string) {
  return request<{ ok: boolean; message: string }>('/api/auth/forgot-password', {
    method: 'POST',
    body: { email },
    auth: false,
  });
}

export async function apiResetPassword(email: string, code: string, newPassword: string) {
  return request<{ ok: boolean; message: string }>('/api/auth/reset-password', {
    method: 'POST',
    body: { email, code, new_password: newPassword },
    auth: false,
  });
}

// ── Habits ────────────────────────────────────────────────────────────────────

export async function apiListHabits() {
  return request<{ habits: any[] }>('/api/habits');
}

export async function apiCreateHabit(data: {
  name: string;
  description?: string;
  category?: string;
  frequency?: string;
  target_value?: number;
  unit?: string;
  color?: string;
  icon?: string;
}) {
  return request<{ habit: any }>('/api/habits', { method: 'POST', body: data });
}

export async function apiGetHabitDetail(habitId: number) {
  return request<{ habit: any; stats: any; calendar: any[]; trend: any[]; logs: any[] }>(
    `/api/habits/${habitId}`
  );
}

export async function apiUpdateHabit(habitId: number, data: any) {
  return request<{ habit: any }>(`/api/habits/${habitId}`, { method: 'PUT', body: data });
}

export async function apiDeleteHabit(habitId: number) {
  return request<{ ok: boolean }>(`/api/habits/${habitId}`, { method: 'DELETE' });
}

export async function apiToggleLog(habitId: number) {
  return request<{ logged: boolean; streak: number }>(
    `/api/habits/${habitId}/log`,
    { method: 'POST' }
  );
}

// ── Analytics ─────────────────────────────────────────────────────────────────

export async function apiAnalytics() {
  return request<{
    stats: any;
    weekly: Record<string, number>;
    categories: Record<string, number>;
    heatmap: Array<{ date: string; count: number }>;
    leaders: any[];
  }>('/api/analytics');
}
