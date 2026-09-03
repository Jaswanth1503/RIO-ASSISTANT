# RIO — Production-Grade AI Representative for Annu Jaswanth

> **RIO** is an autonomous, consultative AI Representative representing **Annu Jaswanth** (AI Developer & Full Stack Architect). Built with Next.js 15, Gemini 2.5 Flash, Supabase, Resend, and Vapi.

---

## System Architecture

```
Portfolio Website (Next.js 15 + React 19)
       ↓
RIO Chat Assistant (Floating Widget + Streaming UI)
       ↓
Knowledge Base (9 Domain Markdown Documents)
       ↓
Gemini 2.5 Flash Brain (Consultative Persona & BANT Lead Qualification)
       ↓
Supabase Database (PostgreSQL 'leads' table)
       ↓
Resend Transactional Email (Alerts to annujaswanth15@gmail.com)
       ↓
Admin Executive Dashboard (/admin Protected Route)
       ↓
Voice Assistant (Whisper STT + F5-TTS Audio)
       ↓
Outbound Telephony (Vapi AI Automatic Calling)
```

---

## Features Across All Phases

- **Phase 1 (Knowledge System)**: 9 structured markdown knowledge base files in `knowledge/` covering Annu's background, education, services, pricing bands, projects (Veera RMC, PestRisk, RIO), sales rules, and FAQs.
- **Phase 2 (Consultative Personality)**: `src/lib/systemPrompt.ts` with strict guardrails (no binding quotes, no discounts, no contract finalization).
- **Phase 3 (Chat Experience)**: Floating chat widget with open/close/minimize, streaming responses, auto-scroll, suggested question pills, and voice toggle.
- **Phase 4 (Lead Collection)**: Dynamic lead capture storing Name, Email, Phone, Company, Project Type, Budget, Timeline, and Requirements into Supabase.
- **Phase 5 (Lead Qualification)**: `HOT`, `WARM`, `COLD` classification engine scoring budget (>₹20k), timeline, and decision-maker urgency.
- **Phase 6 (Email Automation)**: Instant transactional email alert sent to `annujaswanth15@gmail.com` via Resend with formatted lead cards.
- **Phase 7 (Admin Dashboard)**: Protected `/admin` portal (default passcode: `rio2026`) with lead search, score filters, CSV export, and Vapi call triggers.
- **Phase 8 & 9 (Voice Assistant & Cloning)**: Speech recognition, text-to-speech synthesis, and full F5-TTS training pipeline scripts in `voice/`.
- **Phase 10 (Automated Telephony)**: Vapi AI phone call automation triggered for hot leads or on-demand callback requests.
- **Phase 11 (Meeting Booking)**: Interactive Google Calendar meeting scheduler for 30-minute discovery strategy calls.
- **Phase 12 (Security)**: Zod validation schemas, safe sanitization, environment separation, and rate limit protections.
- **Phase 13 (Deployment)**: Ready for 1-click deployment on Vercel and Supabase.

---

## Quick Start (Development)

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local` and add your API keys:
   ```bash
   cp .env.example .env.local
   ```
   *(Note: The system includes intelligent local fallback mode so you can run and test all features immediately even before setting up cloud keys!)*

3. **Database Setup (Supabase)**:
   In your Supabase project SQL Editor, paste and run `supabase/schema.sql`.

4. **Run Dev Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

5. **Access Admin Portal**:
   Navigate to [http://localhost:3000/admin](http://localhost:3000/admin) and use the passcode: `rio2026`.
