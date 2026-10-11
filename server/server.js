/**
 * EcoQuest Backend Server
 * Handles AI analysis requests, keeping GEMINI_API_KEY server-side only.
 *
 * Provider interface: swap the analyzeWithGemini function for any open-weight
 * model (e.g., a local Llama/CLIP endpoint) without changing the API contract.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';

// ─── Load .env.local from the project root (one level up) ────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
function loadEnvFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (key && !process.env[key]) process.env[key] = val; // shell wins
    }
  } catch { /* file not found — rely on shell env */ }
}
loadEnvFile(path.join(__dirname, '..', '.env.local'));
loadEnvFile(path.join(__dirname, '..', '.env'));

const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// ─── AI Provider Interface ────────────────────────────────────────────────────

/**
 * @typedef {Object} AnalysisResult
 * @property {string} category
 * @property {string} shortDescription
 * @property {string} severity
 * @property {number} confidence
 * @property {string} uncertaintyNote
 * @property {string} safeNextAction
 * @property {string[]} tags
 */

const VALID_CATEGORIES = ['litter', 'overflowing_bin', 'neglected_green_space', 'water_pollution', 'illegal_dumping', 'other'];
const VALID_SEVERITIES = ['low', 'medium', 'high', 'critical'];

function validateAndClean(raw) {
  const category = VALID_CATEGORIES.includes(raw.category) ? raw.category : 'other';
  const severity = VALID_SEVERITIES.includes(raw.severity) ? raw.severity : 'medium';
  const confidence = typeof raw.confidence === 'number'
    ? Math.max(0, Math.min(1, raw.confidence))
    : 0.5;
  return {
    category,
    shortDescription: String(raw.shortDescription || '').slice(0, 280),
    severity,
    confidence,
    uncertaintyNote: String(raw.uncertaintyNote || 'AI-generated — not independently verified.').slice(0, 400),
    safeNextAction: String(raw.safeNextAction || 'Report to your local council.').slice(0, 400),
    tags: Array.isArray(raw.tags) ? raw.tags.map(String).slice(0, 6) : [],
  };
}

/**
 * Gemini provider — prototype only.
 * Replace this function to use an open-weight model (e.g. LLaVA, CLIP+LLM).
 */
async function analyzeWithGemini({ imageDataUrl, imageMimeType, userNote, location }) {
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not set on server');

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  const systemPrompt = `You are an environmental issue classifier for a community reporting app.
Analyze the image and/or description and return ONLY a JSON object with these fields:
- category: one of "litter" | "overflowing_bin" | "neglected_green_space" | "water_pollution" | "illegal_dumping" | "other"
- shortDescription: 1-2 sentences describing the specific issue visible (max 280 chars)
- severity: one of "low" | "medium" | "high" | "critical"
- confidence: float 0.0–1.0 reflecting your certainty
- uncertaintyNote: brief honest note about what you cannot confirm (max 200 chars) — ALWAYS state results are not independently verified
- safeNextAction: specific, actionable advice for a member of the public — prioritize safety (max 300 chars)
- tags: array of 2–5 lowercase keyword strings

IMPORTANT rules:
- Never claim to verify facts you cannot confirm
- Never identify people in images
- Never state exact GPS locations
- If no image is provided, reduce confidence significantly
- Always mention that AI categorisation is a suggestion only`;

  const parts = [];
  if (imageDataUrl) {
    const base64 = imageDataUrl.replace(/^data:[^;]+;base64,/, '');
    parts.push({ inlineData: { mimeType: imageMimeType || 'image/jpeg', data: base64 } });
  }
  parts.push({
    text: `${systemPrompt}\n\nUser note: ${userNote || '(none)'}\nGeneral location: ${location || '(not provided)'}`,
  });

  const response = await ai.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: [{ role: 'user', parts }],
    config: { responseMimeType: 'application/json' },
  });

  const text = response.text();
  const raw = JSON.parse(text);
  return validateAndClean(raw);
}

// ─── HTTP Server ──────────────────────────────────────────────────────────────

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString())); }
      catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}

function json(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:5173',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    json(res, 204, {});
    return;
  }

  if (req.method === 'POST' && req.url === '/api/analyze') {
    try {
      const body = await readBody(req);
      const result = await analyzeWithGemini(body);
      json(res, 200, result);
    } catch (err) {
      console.error('[EcoQuest API error]', err.message);
      json(res, 500, { error: err.message || 'Analysis failed' });
    }
    return;
  }

  json(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`\n🌿 EcoQuest API server running on http://localhost:${PORT}`);
  console.log(`   GEMINI_API_KEY: ${GEMINI_API_KEY ? '✓ set' : '✗ not set (set in .env)'}`);
  console.log(`   To use: set GEMINI_API_KEY in your environment, then run 'npm start'\n`);
});
