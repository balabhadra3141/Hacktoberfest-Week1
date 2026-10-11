import type { IssueCategory, Severity, ReportStatus } from '../types';

export const CATEGORY_CONFIG: Record<
  IssueCategory,
  { label: string; emoji: string; color: string; bgColor: string }
> = {
  litter: {
    label: 'Litter',
    emoji: '🗑️',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50 border-amber-200',
  },
  overflowing_bin: {
    label: 'Overflowing Bin',
    emoji: '♻️',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50 border-orange-200',
  },
  neglected_green_space: {
    label: 'Neglected Green Space',
    emoji: '🌿',
    color: 'text-green-700',
    bgColor: 'bg-green-50 border-green-200',
  },
  water_pollution: {
    label: 'Water Pollution',
    emoji: '💧',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-200',
  },
  illegal_dumping: {
    label: 'Illegal Dumping',
    emoji: '⚠️',
    color: 'text-red-700',
    bgColor: 'bg-red-50 border-red-200',
  },
  other: {
    label: 'Other Issue',
    emoji: '📍',
    color: 'text-stone-700',
    bgColor: 'bg-stone-50 border-stone-200',
  },
};

export const SEVERITY_CONFIG: Record<
  Severity,
  { label: string; color: string; dotColor: string }
> = {
  low: { label: 'Low', color: 'text-emerald-700 bg-emerald-50', dotColor: 'bg-emerald-500' },
  medium: { label: 'Medium', color: 'text-amber-700 bg-amber-50', dotColor: 'bg-amber-500' },
  high: { label: 'High', color: 'text-orange-700 bg-orange-50', dotColor: 'bg-orange-500' },
  critical: { label: 'Critical', color: 'text-red-700 bg-red-50', dotColor: 'bg-red-500' },
};

export const STATUS_CONFIG: Record<
  ReportStatus,
  { label: string; color: string; icon: string }
> = {
  open: { label: 'Open', color: 'text-sky-700 bg-sky-50 border-sky-200', icon: '🔵' },
  in_progress: { label: 'In Progress', color: 'text-violet-700 bg-violet-50 border-violet-200', icon: '🟣' },
  resolved: { label: 'Resolved', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', icon: '✅' },
};
