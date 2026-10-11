# 🌿 EcoQuest — Touch Grass, Make Change

**Hacktoberfest 2026 · Week 1 Challenge: "Touch Grass"**

EcoQuest is a community-powered environmental reporting app. It turns outdoor observations into structured, actionable reports — helping people go from noticing a problem to taking a real next step in under 30 seconds.

---

## Features

| Feature | Status |
|---|---|
| Mobile-first responsive UI | ✅ |
| Camera capture + file upload | ✅ |
| AI-assisted categorization (5 categories) | ✅ |
| Confidence score & uncertainty disclaimer | ✅ |
| Safe next-action recommendation | ✅ |
| Report feed with status filters | ✅ |
| Open / In Progress / Resolved workflow | ✅ |
| Sample-data mode (no API key needed) | ✅ |
| LocalStorage persistence | ✅ |
| Loading, error, empty & offline states | ✅ |
| Privacy-preserving (no GPS, EXIF stripped) | ✅ |

---

## Quick Start (Sample Mode — zero configuration)

```bash
# 1. Clone the repository
git clone <repo-url>
cd Hacktoberfest-Week1

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The app works out of the box in **Sample Data Mode** with no API key or external service needed. Click **Load samples** on the dashboard to populate the feed with community reports!

---

## Enabling Real AI Analysis (Optional)

EcoQuest includes a lightweight Node.js proxy server so your API key **never touches the browser client**.

### 1. Configure `.env.local`
```bash
# Copy the template — .env.local is automatically gitignored by *.local rule
cp .env.example .env.local
```

In `.env.local`, set:
```env
VITE_USE_GEMINI=true
GEMINI_API_KEY=AIzaSyYourKeyHere
```
*(You can get a free Google Gemini API key with no credit card at [Google AI Studio](https://aistudio.google.com/app/apikey))*

### 2. Start the Backend Proxy
In your terminal:
```bash
# From the project root:
npm run server
```
*(Or `cd server && npm install && npm start`)*

### 3. Start the Frontend
In a second terminal:
```bash
npm run dev
```

The Vite dev server automatically proxies `/api/analyze` requests to `http://localhost:3001`.

---

## Environment Variables

| Variable | Location | Description |
|---|---|---|
| `VITE_USE_GEMINI` | **`.env.local`** | Set to `true` to enable real AI via backend, or `false` for offline sample mode |
| `GEMINI_API_KEY` | **`.env.local`** or Shell | Google Gemini API key (starts with `AIzaSy...`), kept strictly server-side |
| `PORT` | **`.env.local`** or Shell | Backend server port (default `3001`) |

> 🔒 **Security Notice:**
> Always use `.env.local`. It is covered by gitignore and will **never** be committed to your repository.
> The backend server reads `.env.local` directly and keeps credentials isolated from the browser bundle.

---

## AI Model Details

### Current Implementation

| Provider | Type | Used When |
|---|---|---|
| **Sample Data** (default) | Deterministic fallback — no model | `VITE_USE_GEMINI=false` |
| **Gemini 1.5 Flash** | Proprietary (Google) | `VITE_USE_GEMINI=true` |

### Important Honesty Statement

Gemini is a **proprietary** model, not an open-weight model. It is included as an **optional prototype provider only**. The default mode of this app uses a deterministic sample-data fallback with no AI model at all.

### Replacing with an Open-Weight Model

The backend is designed for easy model replacement. To swap in an open-weight vision-language model (e.g., [LLaVA](https://llava-vl.github.io/), [InternVL](https://internvl.github.io/), [MiniCPM-V](https://github.com/OpenBMB/MiniCPM-V)):

1. Open `server/server.js`
2. Replace the `analyzeWithGemini()` function body with your model call
3. Ensure your function returns an object matching the `AnalysisResult` schema
4. The `validateAndClean()` sanitizer will handle the rest

The frontend `AIProvider` interface in `src/lib/providers.ts` defines the same contract for frontend-side providers.

### Recommended Open-Weight Alternatives

| Model | License | Notes |
|---|---|---|
| [LLaVA-1.6](https://huggingface.co/liuhaotian/llava-v1.6-mistral-7b) | Apache 2.0 | Strong vision-language, 7B params |
| [InternVL2-8B](https://huggingface.co/OpenGVLab/InternVL2-8B) | MIT | Excellent image classification |
| [MiniCPM-V-2.6](https://huggingface.co/openbmb/MiniCPM-V-2_6) | Apache 2.0 | Lightweight, mobile-friendly |
| [CLIP](https://github.com/openai/CLIP) | MIT | Zero-shot image classification |

---

## Architecture

```
Hacktoberfest-Week1/
├── src/
│   ├── types.ts              # Domain types + AIProvider interface
│   ├── context/
│   │   └── ReportsContext.tsx # Global report state + localStorage
│   ├── lib/
│   │   ├── constants.ts      # Display config for categories/statuses
│   │   ├── providers.ts      # AI provider implementations
│   │   ├── sampleData.ts     # Offline demo data
│   │   └── storage.ts        # CRUD for local report store
│   ├── components/
│   │   ├── Header.tsx        # Navigation
│   │   ├── ReportCard.tsx    # Feed item
│   │   └── States.tsx        # Loading/error/empty/offline
│   └── pages/
│       ├── Dashboard.tsx     # Feed + hero + filters
│       ├── ReportForm.tsx    # Submit new report
│       └── ReportDetail.tsx  # Full report view + actions
└── server/
    └── server.js             # Node.js backend (API proxy)
```

---

## Limitations

- **Not independently verified**: AI categorisation is a suggestion. Always apply your own judgement.
- **LocalStorage only**: Reports are stored in your browser. Clearing storage removes all reports. A shared database backend is a planned upgrade path.
- **No GPS / location verification**: Location is a free-text field to protect user privacy.
- **Image privacy**: Images are compressed locally. EXIF stripping is handled via canvas re-encoding. Original GPS metadata from image files is not transmitted.
- **Sample mode accuracy**: Sample data is illustrative and does not reflect any real-world analysis.
- **Gemini provider**: Subject to Google's API terms of service and rate limits.

---

## Why Open Innovation Matters

Environmental issues are everywhere, but reporting them effectively is still too hard. Proprietary AI systems create two problems: they lock communities into platforms that may disappear or change their terms, and they make it impossible to audit how decisions are made.

EcoQuest is built on the principle that environmental data should empower communities, not corporations. By defining a clean provider interface, we make it straightforward to replace any AI component with an open-weight model that communities can run, inspect, and improve themselves.

Open-weight vision-language models have reached the quality needed for basic environmental classification. Choosing them for this app means:
1. **Auditability** — anyone can inspect how a report was categorised
2. **Longevity** — the tool works even if a company shuts down their API
3. **Trust** — communities can verify the system isn't biased against certain issue types
4. **Local deployment** — sensitive location data never has to leave the community's own infrastructure

This is why Hacktoberfest's open-source spirit and environmental action are a natural fit: both are about giving people real agency over something that affects their lives.

---

## Tech Stack

- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS v4
- **Backend**: Node.js (stdlib only — no framework)
- **AI**: Provider interface (sample mode default; Gemini optional)
- **Fonts**: Inter + Sora (Google Fonts)
- **Icons**: Lucide React
- **Routing**: React Router v7
- **Date formatting**: date-fns

---

## Contributing

Contributions welcome! Especially appreciated:
- Integration of an open-weight vision-language model
- Shared database backend (Supabase / PocketBase)
- PWA / offline-first improvements
- Accessibility audit

---

## License

MIT — see [LICENSE](LICENSE) for details.
