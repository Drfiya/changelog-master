# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Changelog Master is a React + Express application that tracks software changelogs, provides AI-powered analysis using Gemini, generates TTS audio summaries, and sends email notifications.

## Commands

```bash
# Start both frontend and backend (recommended for development)
npm run dev:all

# Run separately
npm run dev          # Frontend only (Vite) - http://localhost:5173
npm run dev:server   # Backend only (Express) - http://localhost:3001

# Build for production
npm run build
```

## Architecture

**Frontend (React 19 + TypeScript + Vite)**
- `src/App.tsx` - Main application component, orchestrates all panels
- `src/components/` - UI components (Header, TabNav, ChangelogView, MattersView, AudioPlayer, ChatPanel, SettingsPanel, SourcesPanel)
- `src/hooks/` - Custom hooks for changelog data (`useChangelog`), audio playback (`useAudio`), and theming (`useTheme`)
- `src/services/` - API integrations: Gemini AI analysis (`geminiService`), TTS generation (`ttsService`), changelog parsing (`changelogService`), IndexedDB caching (`cacheService`)

**Backend (Express + TypeScript)**
- `server/index.ts` - Single file containing all Express routes, SQLite database setup, cron scheduling, and email generation
- Uses `better-sqlite3` for persistent storage (audio cache, analysis cache, chat history, settings)
- Uses `node-cron` for scheduled changelog checks

**Data Flow**
1. Frontend fetches changelog markdown via backend proxy or direct URL
2. `changelogService` parses markdown into structured version entries
3. `geminiService` sends content to Gemini 3 Flash for analysis
4. `ttsService` generates audio using Gemini 2.5 Flash TTS
5. Backend caches analysis/audio in SQLite, sends email notifications via Resend API

## Environment Variables

Copy `.env.example` to `.env` and configure:
- `VITE_GEMINI_API_KEY` - Required for AI analysis and TTS
- `RESEND_API_KEY` - Optional, for email notifications
- `NOTIFY_EMAIL` - Recipient email address

## Key Patterns

- All backend API routes are in `server/index.ts` under `/api/*` namespace
- Frontend services check backend cache first, fall back to direct API calls
- Audio is generated as PCM from Gemini TTS, converted to WAV in `ttsService.ts`
- Chat context is built from selected changelog versions passed to Gemini

## Design System (v1.2.0 - Martini Racing)

The UI uses a clean, professional light theme inspired by the iconic Martini Racing livery. Key CSS classes in `src/index.css`:

**Martini Racing Color Palette (CSS variables):**
- `--bg-base: #F8FAFC` - Light base background
- `--bg-primary: #FFFFFF` - Primary background
- `--bg-secondary: #F1F5F9` - Secondary background
- `--accent-navy: #002B5C` - Primary accent (Martini navy)
- `--accent-blue: #4A90D9` - Secondary accent (Martini blue)
- `--accent-red: #E4002B` - Tertiary accent (Martini red)
- `--accent-teal: #14B8A6` - Success/status accent

**Typography:**
- Headings: `font-display` (Sora)
- Body: `font-body` (Plus Jakarta Sans)
- Code: `font-mono` (JetBrains Mono)

**Martini Stripe Components:**
- `.martini-stripe-bar` - Horizontal racing stripe bar (navy/blue/red/blue/navy)
- `.martini-stripe-icon` - Small logo icon with stripe pattern
- `.martini-stripe-diagonal` - Diagonal stripe variant

**Cards:**
- `.card` / `.glass-card` - Clean card with subtle shadow
- `.section-card` + `.section-card-navy/blue/red/teal` - Cards with colored left border

**Buttons:**
- `.btn-primary` - Navy background button
- `.btn-secondary` - Outlined button
- `.btn-ghost` - Transparent button
- `.btn-red` - Red accent button
- `.icon-btn` + `.icon-btn-navy/blue/red` - 40x40 icon buttons

**Progress Bars:**
- `.progress-track` / `.progress-fill` - Standard progress bar
- `.progress-multi` - Multi-segment container
- `.progress-segment-navy/blue/red/teal` - Colored segments

**Badges:**
- `.badge-navy/blue/red/teal` - Pill badges with accent colors
- `.version-badge` - Navy version tag

**Other Components:**
- `.tab-nav`, `.tab-item` - Tab navigation
- `.dropdown-menu`, `.dropdown-item` - Dropdown styles

**Theme Support:**
- Light mode is default
- Dark mode available via `.dark` class on html element
- All CSS variables adapt automatically for dark mode

## Current State

All components have been updated to the v1.2.0 Martini Racing design system:
- App, Header, TabNav, ChangelogView, MattersView, AudioPlayer, LoadingSkeleton, Toast
- SettingsPanel, SourcesPanel, ChatPanel - fully updated with CSS variables
