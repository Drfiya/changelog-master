# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-01-11

### Added

- **Martini Racing design system** - Complete UI redesign inspired by the iconic Martini Racing livery
- **Martini stripe bar** - Horizontal stripe bar at top of page with navy/blue/red/blue/navy pattern
- **Martini stripe icon** - Small logo icon in header showing the racing stripe motif
- **Multi-segment progress bars** - Progress indicators with Martini color segments
- **Light mode default** - Clean, professional light background as primary theme

### Changed

- **Complete color palette overhaul**:
  - Base background: `#F8FAFC` (light gray-white)
  - Primary accent: Navy blue `#002B5C` (Martini navy)
  - Secondary accent: Light blue `#4A90D9` (Martini blue)
  - Tertiary accent: Red `#E4002B` (Martini red)
  - Preserved teal `#14B8A6` for success states
- **Removed glassmorphism** - Replaced blur effects with clean, minimal shadows
- **Removed gradient blobs** - Replaced animated background with solid color + stripe accents
- **Updated all components** to use new CSS variable system:
  - Header.tsx - Martini stripe icon, navy-based styling
  - TabNav.tsx - Clean tab design with navy accents
  - ChangelogView.tsx - Light cards with blue accents
  - MattersView.tsx - Multi-color progress bars, navy/red section accents
  - AudioPlayer.tsx - Navy play button, gradient progress bar
  - SettingsPanel.tsx - Complete rewrite with CSS variables
  - SourcesPanel.tsx - Complete rewrite with CSS variables
  - ChatPanel.tsx - Complete rewrite with navy message bubbles
  - LoadingSkeleton.tsx - Light theme shimmer
  - Toast.tsx - Uses CSS variables for theming
- **index.html** - Removed `dark` class from html, updated theme-color to `#F8FAFC`
- **index.css** - Complete rewrite with Martini Racing design tokens

### Technical Details

**Martini Racing Color Palette:**
- Navy (Primary): `#002B5C`
- Navy Light: `#0A3A6B`
- Blue (Secondary): `#4A90D9`
- Blue Light: `#6BA8E8`
- Red (Accent): `#E4002B`
- Teal (Success): `#14B8A6`

**Background Colors:**
- Base: `#F8FAFC`
- Primary: `#FFFFFF`
- Secondary: `#F1F5F9`
- Tertiary: `#E2E8F0`

**Key CSS Classes:**
- `.martini-stripe-bar` - Horizontal racing stripe bar
- `.martini-stripe-icon` - Small stripe logo
- `.progress-multi` - Multi-segment progress container
- `.progress-segment-navy/blue/red/teal` - Progress segment colors
- `.section-card-navy/blue/red/teal` - Card accent borders
- `.badge-navy/blue/red/teal` - Pill badge variants
- `.icon-btn-navy/blue/red` - Icon button hover states

**Dark Mode Support:**
- CSS variables automatically adjust for `.dark` class
- Dark mode available via theme toggle in header

---

## [1.1.0] - 2026-01-11

### Added

- **CLAUDE.md** - Added Claude Code guidance file for future development sessions
- **Custom typography** - Sora font for headings, Plus Jakarta Sans for body text, JetBrains Mono for code
- **Animated gradient blobs** - Three floating gradient blobs (ember/cyan/teal) with smooth animations
- **Glassmorphism design system** - New `.glass-card` and `.glass-card-elevated` classes with blur effects
- **CSS custom properties** - Comprehensive design token system for colors, shadows, and transitions
- **Section cards** - Color-coded accent borders (`.section-card-ember`, `.section-card-cyan`, etc.)
- **Badge components** - `.badge-ember`, `.badge-cyan`, `.badge-teal` pill styles
- **Glow effects** - `.glow-ember`, `.glow-cyan` box shadows for emphasis
- **Skeleton loading** - Shimmer animation for loading states
- **Staggered animations** - `.stagger-1` through `.stagger-5` for sequential reveals

### Changed

- **Complete UI redesign** - Transformed from Anthropic-inspired warm theme to modern dark SaaS aesthetic
- **index.html** - Added Google Fonts imports, set default to dark mode, updated theme-color meta
- **index.css** - Complete rewrite with new design system:
  - Deep dark palette (#030303 base, #0a0a0a primary)
  - Ember (#ff7a45) and Cyan (#22d3ee) accent colors
  - Glass borders with rgba transparency
  - New button styles (`.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-glow-cyan`)
  - Icon button variants (`.icon-btn`, `.icon-btn-ember`, `.icon-btn-cyan`)
  - Tab navigation system (`.tab-nav`, `.tab-item`)
  - Audio player bar styles (`.audio-bar`, `.progress-track`, `.progress-fill`)
  - Dropdown menu styles (`.dropdown-menu`, `.dropdown-item`)
- **App.tsx** - Added gradient blob background container, updated error state styling
- **Header.tsx** - Glassmorphism header with new icon buttons and version badge
- **TabNav.tsx** - Pill-style tab navigation with sticky positioning
- **MattersView.tsx** - Section cards with colored accent borders, new badge styles for removals
- **ChangelogView.tsx** - Glass cards with staggered fade-in animations, updated hover states
- **AudioPlayer.tsx** - Gradient progress bar (ember to cyan), glowing cyan play button
- **LoadingSkeleton.tsx** - New shimmer animation effect
- **Toast.tsx** - Gradient backgrounds with colored glow shadows

### Technical Details

**Color Palette:**
- Base: `#030303` (void-950)
- Primary: `#0a0a0a` (void-900)
- Elevated: `#1a1a1a` (void-700)
- Ember accent: `#ff7a45`
- Cyan accent: `#22d3ee`
- Teal accent: `#14b8a6`

**Typography Stack:**
- Display: `'Sora', sans-serif`
- Body: `'Plus Jakarta Sans', sans-serif`
- Mono: `'JetBrains Mono', monospace`

**Key CSS Classes:**
- `.gradient-bg` - Fixed background container for blobs
- `.gradient-blob-1/2/3` - Animated gradient circles
- `.glass-card` - Backdrop blur card with subtle border
- `.section-card` - Card with left accent border
- `.icon-btn` - 40x40px icon button base
- `.progress-track/.progress-fill` - Audio progress bar

### Where We Left Off

The UI redesign is complete and functional. The dev servers are running:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

**Next steps for future development:**
1. Test all features with the new design (audio playback, chat panel, settings)
2. Update SettingsPanel.tsx and SourcesPanel.tsx to match new design (not yet updated)
3. Update ChatPanel.tsx to match new design (not yet updated)
4. Consider adding light mode support (CSS variables are set up but components use dark mode)
5. Add responsive design improvements for mobile viewports
6. Consider adding more animation polish (page transitions, micro-interactions)

---

## [1.0.0] - Initial Release

### Features
- Multi-source changelog monitoring
- AI-powered analysis with Gemini 3 Flash
- Text-to-speech audio summaries with Gemini 2.5 Flash TTS
- Email notifications via Resend API
- Chat interface for changelog Q&A
- SQLite caching for audio and analysis
- Scheduled version checking with node-cron
