import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Report, ReportStatus } from '../types';
import {
  loadReports,
  saveReports,
  updateReportStatus,
  deleteReport,
} from '../lib/storage';
import { getSampleAnalysis } from '../lib/sampleData';
import { v4 as uuidv4 } from 'uuid';

interface ReportsContextValue {
  reports: Report[];
  addReport: (report: Report) => void;
  setStatus: (id: string, status: ReportStatus) => void;
  removeReport: (id: string) => void;
  seedSampleData: () => void;
  hasSeedData: boolean;
}

const ReportsContext = createContext<ReportsContextValue | null>(null);

function buildSeedReports(): Report[] {
  const statuses: ReportStatus[] = ['open', 'in_progress', 'resolved', 'open', 'resolved'];
  const locations = [
    'Riverside Park, Bristol',
    'High Street, Manchester',
    'Victoria Gardens, Leeds',
    'Canal Path, Birmingham',
    'Seafront Promenade, Brighton',
  ];
  const daysAgo = [1, 3, 7, 14, 21];

  return statuses.map((status, i) => {
    const analysis = getSampleAnalysis(i);
    const createdAt = new Date(Date.now() - daysAgo[i] * 86_400_000).toISOString();
    return {
      id: uuidv4(),
      createdAt,
      updatedAt: createdAt,
      status,
      analysis,
      location: locations[i],
      isSampleData: true,
    };
  });
}

export function ReportsProvider({ children }: { children: React.ReactNode }) {
  const [reports, setReports] = useState<Report[]>(() => loadReports());

  useEffect(() => {
    saveReports(reports);
  }, [reports]);

  const addReport = useCallback((report: Report) => {
    setReports((prev) => [report, ...prev]);
  }, []);

  const setStatus = useCallback((id: string, status: ReportStatus) => {
    setReports((prev) => updateReportStatus(prev, id, status));
  }, []);

  const removeReport = useCallback((id: string) => {
    setReports((prev) => deleteReport(prev, id));
  }, []);

  const seedSampleData = useCallback(() => {
    const seeds = buildSeedReports();
    setReports((prev) => {
      const merged = [...seeds, ...prev.filter((r) => !r.isSampleData)];
      return merged;
    });
  }, []);

  const hasSeedData = reports.some((r) => r.isSampleData);

  return (
    <ReportsContext.Provider value={{ reports, addReport, setStatus, removeReport, seedSampleData, hasSeedData }}>
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports(): ReportsContextValue {
  const ctx = useContext(ReportsContext);
  if (!ctx) throw new Error('useReports must be used within ReportsProvider');
  return ctx;
}
