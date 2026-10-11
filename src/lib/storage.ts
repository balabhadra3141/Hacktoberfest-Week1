import { v4 as uuidv4 } from 'uuid';
import type { Report, ReportStatus, AIAnalysis } from '../types';

const STORAGE_KEY = 'ecoquest_reports_v1';

export function loadReports(): Report[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Report[];
  } catch {
    return [];
  }
}

export function saveReports(reports: Report[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

export function createReport(
  analysis: AIAnalysis,
  extras: {
    imageDataUrl?: string;
    imageMimeType?: string;
    location?: string;
    userNote?: string;
    isSampleData: boolean;
  }
): Report {
  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
    status: 'open',
    analysis,
    isSampleData: extras.isSampleData,
    imageDataUrl: extras.imageDataUrl,
    imageMimeType: extras.imageMimeType,
    location: extras.location,
    userNote: extras.userNote,
  };
}

export function updateReportStatus(
  reports: Report[],
  id: string,
  status: ReportStatus
): Report[] {
  return reports.map((r) =>
    r.id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r
  );
}

export function deleteReport(reports: Report[], id: string): Report[] {
  return reports.filter((r) => r.id !== id);
}
