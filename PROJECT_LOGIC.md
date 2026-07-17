# Aure Homepage Chrome Extension - Logic & Architecture

## Overview
Chrome New Tab replacement extension built with React 19, TypeScript, Vite 8, and Chrome Extensions API.

## Technology Stack

### Core Libraries
- **React 19** - UI framework with concurrent features
- **TypeScript 6** - Type-safe JavaScript
- **Vite 8** - Build tool with HMR and optimized bundles
- **React Router 8** - Hash-based routing for Chrome extension compatibility

### State Management
- **Zustand 5** - Lightweight state management (single global store + per-widget stores)
- **React Context** - For settings tab navigation state

### Persistence Layer
- **Dexie 4** (IndexedDB wrapper) - Structured data storage for widgets
- **Chrome Storage API** - Settings and focus timer persistence

### Form Handling
- **React Hook Form 7** - Form state management
- **Zod 4** - Schema validation

### Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Animation library

## Architecture Pattern

### Data Flow
```
Types → Dexie Repository → Zustand Store → Hook (derived state) → Component
```

Each widget follows this consistent pattern:
1. **Types** define data shapes
2. **db.ts** provides thin Dexie table wrapper
3. **store.ts** manages in-memory state + async persistence
4. **hooks/** compute derived state from store
5. **Components** consume hooks

## Core Systems

### 1. Dual Persistence System

**Dexie/IndexedDB** (6 tables):
- `wallpapers` - Wallpaper images (string ID)
- `moods` - Mood tracker entries (numeric ID)
- `pets` - Virtual pets (numeric ID)
- `calendar` - Calendar notes (indexed on id + date)
- `notes` - Notes and checklists (numeric ID)
- `favorites` - Bookmarked sites (numeric ID)

**Chrome Storage** (2 keys):
- `settings` - User preferences object
- `focus_timer` - Focus timer state

### 2. Initialization Flow
1. `main.tsx` detects Chrome new tab and adds `?focused` query param
2. `AppLoader` triggers `initialize()` on all widget stores + `load()` on settings
3. If no settings exist, redirects to `/wizard` (first-run onboarding)
4. All stores hydrate from persistence before rendering

### 3. Settings System
**Settings object structure**:
```typescript
{
  name: string,
  theme: "dark" | "light" | "system",
  wallpaper: string,
  blur: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl",
  widgets: Record<WidgetId, boolean>,
  accent: "default" | "cherry" | "tangerine" | "lime" | "ocean" | "orchid",
  show_top_sites: boolean,
  show_favorites: boolean
}
```

**Theme system**:
- `ThemeProvider` toggles `dark` class on `document.documentElement`
- `useTheme` hook provides reactive theme state with system preference tracking
- Resolves "system" theme to actual preference via `window.matchMedia`

### 4. Widget Architecture

**Common pattern across all widgets**:
```typescript
// Store example (Calendar)
{
  data: CalendarNote[],
  loading: boolean,
  // Actions
  initialize: () => Promise<void>,  // Load from Dexie
  addItem: (item) => void,          // Add to state + Dexie
  removeItem: (id) => void,         // Remove from state + Dexie
  updateItem: (id, item) => void    // Update state + Dexie
}
```

**Widget-specific logic**:

#### Calendar Notes
- Notes stored by formatted date string (`yyyy-MM-dd`)
- Duplicate date prevention
- Indexed query by date

#### Mood Tracker
- 5 mood types: great, good, okay, meh, bad
- Score calculation (0-5 scale)
- Time-based filtering (last 30 days, week, month, year)
- History analysis with date buckets

#### Notes & Checklists
- Content-based type detection: `"[] "` prefix = checklist
- Toggle checkbox status
- Inline editing with cancel support

#### Pet House
- Virtual pet simulation with time-based mechanics
- **1 real day = 1 pet year** time scale
- 3 feeds per day required
- Death conditions: age limit (cat: 10y, dog: 15y) or starvation
- Max 4 alive pets
- Soft-delete with `deletedAt` timestamp

#### Favorites/Sites
- Order-based sorting with `sortUp`/`sortDown`
- Auto-incrementing order values
- Integration with Chrome `topSites` API

### 5. Background Script (Service Worker)
- Listens for `GET_FAVICON` messages
- Resolves page favicons by parsing HTML `<link>` tags
- Falls back to `/favicon.ico`
- Uses `fetch()` to retrieve page HTML

### 6. Search System
**Input handling**:
- Valid URL → navigate directly
- Domain-like input → prepend `https://`
- Other input → Google search URL

**Suggestions**:
- Google autocomplete API (debounced 300ms)
- Chrome top sites filtering
- Keyboard navigation (arrow keys, enter, escape)

### 7. Focus Timer
- Persistent via Chrome storage
- Tracks `isRunning`, `startedAt`, `elapsed`
- Reconciles time passed while extension was closed
- Updates display every second

### 8. Data Backup/Export
**Export**: Reads all Dexie tables + Chrome storage → JSON file download
**Import**: Validates JSON structure → clears existing data → bulk inserts → requires page reload

### 9. Update System
- Fetches latest `version.json` from GitHub
- Compares with `VITE_APP_VERSION`
- Opens update modal if different

## Routing

```
/ → Home (search, sites, widgets)
/wizard → First-run onboarding (3 steps)
/settings → Configuration (5 tabs)
```

## Build Configuration

**Vite config**:
- Multi-entry: `index.html` (new tab) + `src/background.ts`
- Output: `background.js` + `assets/[name].js`
- Path alias: `@` → `./src`

**TypeScript**: Strict mode with project references

## Key Patterns

1. **Store-per-widget**: Each widget has its own Zustand store
2. **Repository pattern**: Dexie tables wrapped in thin repository files
3. **Hook composition**: Derived state computed in hooks, not stores
4. **Dual persistence**: Structured data in IndexedDB, config in Chrome Storage
5. **Type-first development**: All data shapes defined in types/ directories

## Dependencies

### Production
- `@hookform/resolvers` - Zod integration for React Hook Form
- `clsx` + `tailwind-merge` - Class name utilities
- `date-fns` - Date manipulation
- `dexie` + `dexie-react-hooks` - IndexedDB wrapper
- `framer-motion` - Animations
- `lucide-react` - Icons
- `react-day-picker` - Calendar component
- `sonner` - Toast notifications
- `zustand` - State management

### Development
- `@types/chrome` - Chrome API types
- `eslint` + plugins - Code linting
- `typescript` - Type checking
- `vite` + plugins - Build tooling
