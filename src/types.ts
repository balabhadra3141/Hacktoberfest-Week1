export type IssueCategory =
  | 'litter'
  | 'overflowing_bin'
  | 'neglected_green_space'
  | 'water_pollution'
  | 'illegal_dumping'
  | 'other';

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export type ReportStatus = 'open' | 'in_progress' | 'resolved';

export interface AIAnalysis {
  category: IssueCategory;
  shortDescription: string;
  severity: Severity;
  confidence: number; // 0–1
  uncertaintyNote: string;
  safeNextAction: string;
  tags: string[];
}

export interface Report {
  id: string;
  createdAt: string; // ISO string
  updatedAt: string;
  status: ReportStatus;
  imageDataUrl?: string; // base64 data URL (stripped of EXIF)
  imageMimeType?: string;
  location?: string; // user-provided area name, never GPS coords
  analysis: AIAnalysis;
  userNote?: string;
  isSampleData: boolean;
}

export interface CreateReportPayload {
  imageDataUrl?: string;
  imageMimeType?: string;
  location?: string;
  userNote?: string;
}

/** Provider interface — swap for any open-weight model */
export interface AIProvider {
  name: string;
  isOpenWeight: boolean;
  licenseUrl?: string;
  analyze(payload: CreateReportPayload): Promise<AIAnalysis>;
}
