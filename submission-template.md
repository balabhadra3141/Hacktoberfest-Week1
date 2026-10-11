# EcoQuest — Community-Powered Environmental Action with Swappable AI

<!--
Cover Image: You can use the generated cover image located at `public/cover.jpg`
Tags: #devchallenge #hf26challenge #opensource #ai
Submission Type: Individual Submission
-->

*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 1: Touch Grass](https://dev.to/challenges/hacktoberfest-week1-2026-10-05)*

---

## What I Built

Every day, people walk through their neighbourhoods, local parks, and outdoor trails. They see overflowing bins, littered green spaces, illegal dumping, or polluted waterways — and usually do one of two things: scroll past it or feel helpless to fix it.

**EcoQuest** is a mobile-first, community-driven environmental action web app built for the **Hacktoberfest 2026 Week 1 "Touch Grass"** challenge. Its goal is simple: **help people turn outdoor observations into concrete, actionable community reports in under 30 seconds.**

Instead of leaving environmental stewardship to bureaucratic delay or passive social media complaints, EcoQuest provides an immediate bridge between noticing a problem and doing something about it safely.

### Key Features

* 📱 **Mobile-First Outdoor UX:** Built for real-world outdoor use with quick camera capture, drag-and-drop file uploads, responsive card layouts, and touch-friendly controls.
* 🌿 **Smart Categorisation:** Classifies reports into 5 key outdoor categories:
  * Litter & Debris
  * Overflowing Public Bins
  * Neglected Green Spaces
  * Water Pollution
  * Illegal Dumping
* 🛡️ **Confidence & Honest Uncertainty Disclaimers:** AI output is never treated as infallible truth. Every report displays an explicit confidence score and an uncertainty notice stating that results are automated suggestions and not independently verified.
* 👷 **Safe Next-Action Guidance:** Gives immediate, safety-first recommendations (e.g., *"Wear puncture-resistant gloves,"* *"Report hazardous bulk items to the municipal council,"* *"Organize a small neighborhood sweep"*).
* 🔄 **Community Action Workflow:** A live community feed that tracks issues across clear lifecycle statuses: **Open** ➔ **In Progress** ➔ **Resolved**, empowering neighbors to take ownership and celebrate resolved cleanups.
* 🔒 **Privacy-Preserving Architecture:** Strict client-side EXIF stripping via HTML5 Canvas prevents accidental leakage of home coordinates or camera metadata. Location is strictly general and user-described (no invasive GPS tracking).
* ⚡ **Zero-Barrier Sample Data Mode:** Works immediately offline out of the box with zero external API keys required, making the app 100% testable and demonstrable anywhere.

---

## Demo

* **Local Running App:** Accessible at `http://localhost:5173`
* **Cover Art & Visuals:** `public/cover.jpg` (included in repository)

To run the live interactive demo locally:
```bash
git clone <YOUR-GITHUB-REPO-URL>
cd Hacktoberfest-Week1
npm install
npm run dev
```
Visit `http://localhost:5173` and click **"Load samples"** to immediately populate the interactive feed, submit new camera reports, and test status transitions.

---

## Code

* **Repository:** [https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>](https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>)
* **License:** [MIT License](LICENSE)

---

## How I Built It

EcoQuest is engineered with modern, performant, and privacy-first web tools:

### Tech Stack
* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, `date-fns`
* **Backend Proxy:** Lightweight Node.js server (keeps API keys completely server-side)
* **Storage:** Browser LocalStorage with persistent CRUD state management

### Swappable AI Architecture (`AIProvider` Pattern)
A core design tenet of EcoQuest is that **the UI is completely decoupled from the AI provider**. In `src/lib/providers.ts`, all model interaction adheres to a strict contract:

```typescript
export interface AIProvider {
  name: string;
  isOpenWeight: boolean;
  licenseUrl?: string;
  analyze: (payload: CreateReportPayload) => Promise<AIAnalysis>;
}
```

This interface enables two swappable operational modes:
1. **Sample Provider (Default):** A deterministic, zero-dependency offline engine that simulates realistic analysis without any API keys or network latency.
2. **Vision-Language Provider (Prototype):** A lightweight proxy calling Google Gemini 1.5 Flash via a backend server. The API key is stored securely in `.env.local` and never exposed to the client.
3. **Pluggable Open-Weight Models:** Designed specifically to be swapped out for self-hosted open-weight vision models such as **LLaVA-1.6**, **InternVL2**, or **CLIP**.

---

## Why Does Open Innovation Matter?

Environmental challenges are fundamentally local, shared, and community-owned. Building environmental infrastructure on closed, proprietary AI creates severe risks:

1. **Community Data Sovereignty:** When citizens document civic issues, that data should belong to the community and local authorities — not be funneled into proprietary training datasets or held hostage behind commercial paywalls.
2. **Auditability & Algorithmic Trust:** If an AI model prioritizes or deprioritizes reports, citizens have a right to inspect the prompts and weights. With open-weight models, community members can audit the system to ensure it doesn't bias against underserved neighborhoods.
3. **Longevity & Independence:** Commercial API endpoints can be deprecated, rate-limited, or price-hiked at any moment. Open-weight models ensure that community tools will continue running decades from now on local hardware.
4. **Zero-Telemetry Privacy:** Environmental reports frequently contain background imagery of public roads or parks. Running open-weight vision models locally or on community servers means sensitive spatial imagery never leaves the municipal boundary.

Open innovation ensures that technology serves as public infrastructure, not private gatekeeping.

---

## My Agent Session

This project was built iteratively using an advanced agentic coding pair-programming workflow:
* Rapid architecture design, domain model drafting, and schema definitions.
* Developing robust validation, error states, and EXIF-stripping sanitization.
* Implementing a strict separation between frontend state and backend proxy inference.
* Testing and validating builds with full TypeScript checking and zero warnings.

---

## Prize Categories

* **Primary:** Hacktoberfest Open-Source AI Challenge Week 1: "Touch Grass"
* **Individual Submission:** Created and submitted individually.

---

*Thank you to the Hacktoberfest and DEV teams for promoting open-source innovation and inspiring developers to get outside and touch grass!*
