export const Colors = {
  primary:       '#6366f1',
  primaryHover:  '#4f46e5',
  primaryLight:  '#eef2ff',
  success:       '#10b981',
  successLight:  '#ecfdf5',
  warning:       '#f59e0b',
  danger:        '#ef4444',
  dangerLight:   '#fef2f2',
  bg:            '#f1f5f9',
  card:          '#ffffff',
  sidebar:       '#18181b',
  text:          '#0f172a',
  text2:         '#475569',
  text3:         '#94a3b8',
  border:        '#e2e8f0',
  white:         '#ffffff',
};

export const CategoryColors: Record<string, string> = {
  general:     '#64748b',
  health:      '#10b981',
  fitness:     '#f59e0b',
  work:        '#6366f1',
  learning:    '#3b82f6',
  mindfulness: '#8b5cf6',
  social:      '#ec4899',
  finance:     '#14b8a6',
};

export const CategoryIcons: Record<string, string> = {
  general:     '✨',
  health:      '💊',
  fitness:     '💪',
  work:        '💼',
  learning:    '📚',
  mindfulness: '🧘',
  social:      '👥',
  finance:     '💰',
};

export const CategoryBadgeColors: Record<string, { bg: string; text: string }> = {
  general:     { bg: '#f1f5f9', text: '#64748b' },
  health:      { bg: '#d1fae5', text: '#065f46' },
  fitness:     { bg: '#fef3c7', text: '#92400e' },
  work:        { bg: '#ede9fe', text: '#4c1d95' },
  learning:    { bg: '#dbeafe', text: '#1e40af' },
  mindfulness: { bg: '#f3e8ff', text: '#6b21a8' },
  social:      { bg: '#fce7f3', text: '#9d174d' },
  finance:     { bg: '#ccfbf1', text: '#134e4a' },
};

export const MILESTONE_THRESHOLDS = [3, 7, 14, 21, 30, 60, 100, 200, 365];

export const MILESTONE_LABELS: Record<number, string> = {
  3:   '3 Days',
  7:   '7 Days',
  14:  '2 Weeks',
  21:  '21 Days',
  30:  '30 Days',
  60:  '2 Months',
  100: '100 Days',
  200: '200 Days',
  365: '1 Year',
};

export const MILESTONE_ICONS: Record<number, string> = {
  3:   '⭐',
  7:   '🥉',
  14:  '🥈',
  21:  '🥇',
  30:  '🥇',
  60:  '💎',
  100: '🏆',
  200: '🏆',
  365: '👑',
};

export const Spacing = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  20,
  xxl: 28,
};

export const Radius = {
  sm:  8,
  md:  12,
  lg:  16,
  xl:  20,
  full: 999,
};

export const FontSize = {
  xs:   11,
  sm:   13,
  base: 15,
  md:   16,
  lg:   18,
  xl:   22,
  xxl:  28,
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
};
