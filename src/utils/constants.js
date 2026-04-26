export const DEFAULT_CATEGORIES = [
  { id: 'cat-work', name: 'Work', color: '#3b82f6', icon: '🏢' },
  { id: 'cat-personal', name: 'Personal', color: '#ef4444', icon: '🏠' },
  { id: 'cat-shopping', name: 'Shopping', color: '#f59e0b', icon: '🛒' },
  { id: 'cat-health', name: 'Health', color: '#10b981', icon: '❤️' },
];

export const PRIORITIES = {
  HIGH: { label: 'High', color: 'red-500', icon: '🔴' },
  MEDIUM: { label: 'Medium', color: 'amber-500', icon: '🟡' },
  LOW: { label: 'Low', color: 'green-500', icon: '🟢' },
};

export const RECURRENCE_TYPES = {
  NONE: 'none',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
};

export const POMODORO_DEFAULTS = {
  WORK: 25,
  SHORT_BREAK: 5,
  LONG_BREAK: 15,
};

export const STORAGE_KEY = 'todoAppData';
