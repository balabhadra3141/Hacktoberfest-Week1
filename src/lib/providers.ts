import type { AIAnalysis, AIProvider, CreateReportPayload } from '../types';
import { generateSampleAnalysis } from './sampleData';

/**
 * SampleProvider — used when no API key is available.
 * Produces clearly-labeled illustrative results with no external calls.
 * This is NOT an AI model. It is a deterministic fallback.
 */
export const SampleProvider: AIProvider = {
  name: 'Sample Data Mode',
  isOpenWeight: false,
  analyze: async (payload: CreateReportPayload): Promise<AIAnalysis> => {
    // Simulate a brief processing delay for UX realism
    await new Promise((r) => setTimeout(r, 1200));
    return generateSampleAnalysis(payload);
  },
};

/**
 * GeminiProvider — calls the local backend proxy, which reads GEMINI_API_KEY
 * from the server environment. The API key is NEVER sent to the frontend.
 *
 * This is an optional provider for prototyping. Gemini is a proprietary model,
 * not an open-weight model, and must not be presented as such.
 */
export const GeminiProvider: AIProvider = {
  name: 'Gemini 1.5 Flash (Prototype)',
  isOpenWeight: false,
  licenseUrl: 'https://ai.google.dev/gemini-api/terms',
  analyze: async (payload: CreateReportPayload): Promise<AIAnalysis> => {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageDataUrl: payload.imageDataUrl,
        imageMimeType: payload.imageMimeType,
        userNote: payload.userNote,
        location: payload.location,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(err.error || `API error ${response.status}`);
    }

    return response.json() as Promise<AIAnalysis>;
  },
};

/** Select provider based on env flag.
 *
 * Configuration lives in .env.local (gitignored — never committed).
 * Copy .env.example → .env.local and set VITE_USE_GEMINI=true.
 */
export function getProvider(): AIProvider {
  // VITE_USE_GEMINI=true  → real AI via backend proxy (requires GEMINI_API_KEY on server)
  // unset / false          → offline sample-data mode (no API calls, clearly labeled)
  if (import.meta.env.VITE_USE_GEMINI === 'true') {
    return GeminiProvider;
  }
  return SampleProvider;
}
