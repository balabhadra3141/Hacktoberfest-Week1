import type { AIAnalysis, IssueCategory, Severity, CreateReportPayload } from '../types';

/** Deterministic sample analysis based on a keyword hash of the userNote. */
const SAMPLE_ANALYSES: AIAnalysis[] = [
  {
    category: 'litter',
    shortDescription: 'Scattered plastic bottles and food wrappers along the footpath edge.',
    severity: 'medium',
    confidence: 0.82,
    uncertaintyNote: 'Image not provided — analysis is illustrative sample data only.',
    safeNextAction: "Use the local council's litter reporting portal or call 311 to log the location. Wear gloves if you choose to pick it up yourself.",
    tags: ['plastic', 'footpath', 'public space'],
  },
  {
    category: 'overflowing_bin',
    shortDescription: 'Public waste bin is overflowing onto the surrounding pavement.',
    severity: 'high',
    confidence: 0.91,
    uncertaintyNote: 'Image not provided — analysis is illustrative sample data only.',
    safeNextAction: 'Report to your local council waste management team for urgent collection.',
    tags: ['bin', 'overflow', 'hygiene'],
  },
  {
    category: 'neglected_green_space',
    shortDescription: 'Community park showing signs of neglect — overgrown grass and damaged benches.',
    severity: 'low',
    confidence: 0.74,
    uncertaintyNote: 'Image not provided — analysis is illustrative sample data only.',
    safeNextAction: 'Contact your local parks department or join a community clean-up group.',
    tags: ['park', 'maintenance', 'community'],
  },
  {
    category: 'water_pollution',
    shortDescription: 'Visible discoloration and foam on the surface of the stream.',
    severity: 'critical',
    confidence: 0.78,
    uncertaintyNote: 'Exact cause cannot be confirmed without water testing. Do not touch the water.',
    safeNextAction: 'Report immediately to the Environment Agency (UK) or EPA (US). Do not approach the water.',
    tags: ['water', 'stream', 'pollution'],
  },
  {
    category: 'illegal_dumping',
    shortDescription: 'Large pile of household waste and construction debris on public land.',
    severity: 'high',
    confidence: 0.87,
    uncertaintyNote: 'Image not provided — analysis is illustrative sample data only.',
    safeNextAction: 'Do not touch the waste. Report to local authorities with the approximate location.',
    tags: ['dumping', 'fly-tipping', 'public land'],
  },
];

export function getSampleAnalysis(index?: number): AIAnalysis {
  const i = index !== undefined ? index % SAMPLE_ANALYSES.length : Math.floor(Math.random() * SAMPLE_ANALYSES.length);
  return { ...SAMPLE_ANALYSES[i] };
}

/** Maps a rough keyword from userNote to a category for demo purposes */
export function guessCategoryFromNote(note: string): IssueCategory {
  const lower = note.toLowerCase();
  if (lower.includes('bin') || lower.includes('rubbish can') || lower.includes('trash can')) return 'overflowing_bin';
  if (lower.includes('park') || lower.includes('grass') || lower.includes('garden')) return 'neglected_green_space';
  if (lower.includes('water') || lower.includes('river') || lower.includes('stream') || lower.includes('lake')) return 'water_pollution';
  if (lower.includes('dump') || lower.includes('fly-tip') || lower.includes('flytip') || lower.includes('debris')) return 'illegal_dumping';
  if (lower.includes('litter') || lower.includes('plastic') || lower.includes('wrapper')) return 'litter';
  return 'other';
}

export function getCategoryLabel(category: IssueCategory): string {
  const labels: Record<IssueCategory, string> = {
    litter: 'Litter',
    overflowing_bin: 'Overflowing Bin',
    neglected_green_space: 'Neglected Green Space',
    water_pollution: 'Water Pollution',
    illegal_dumping: 'Illegal Dumping',
    other: 'Other Issue',
  };
  return labels[category];
}

export function getSeverityLabel(severity: Severity): string {
  return severity.charAt(0).toUpperCase() + severity.slice(1);
}

/** Generates analysis purely from note/image heuristics — no API call */
export function generateSampleAnalysis(payload: CreateReportPayload): AIAnalysis {
  const category = payload.userNote ? guessCategoryFromNote(payload.userNote) : 'litter';
  const baseAnalysis = SAMPLE_ANALYSES.find((a) => a.category === category) || SAMPLE_ANALYSES[0];
  return {
    ...baseAnalysis,
    uncertaintyNote: payload.imageDataUrl
      ? 'Sample-data mode: AI analysis was not run. Results are illustrative only and must not be treated as verified.'
      : 'No image provided and sample-data mode is active. Results are illustrative only.',
  };
}
