# Plan 02: High Severity Remediation

**Focus:** Domain Decoupling, Layer Inversion Resolution & HTML Link Architecture  
**Target Issues:**  
- [`ARCH-002`](../ARCHITECTURE_AUDIT.md#arch-002-deep-domain-entanglement-of-favorites-and-folders): Deep Domain Entanglement of Favorites and Folders  
- [`ARCH-003`](../ARCHITECTURE_AUDIT.md#arch-003-layer-inversion-global-lib-and-types-importing-from-widget-subdirectories): Layer Inversion (Global Lib and Types Importing from UI Widgets)  
- [`ARCH-007`](../ARCHITECTURE_AUDIT.md#arch-007-invalid-html-nesting--navigation-inconsistencies): Invalid HTML Element Nesting & Navigation Inconsistencies  
**Estimated Time:** 4–6 hours  
**Status:** `[x] Completed`

---

## 1. Overview & Objective
Establish correct architectural boundaries across the codebase:
1. Extract core navigation entities (`Favorite`, `Folder`, `Website`), repositories, and Zustand stores out of the nested Settings UI directory into a first-class feature domain (`src/features/bookmarks/`).
2. Hoist domain entities and types out of widget UI folders (`src/components/widgets/*`) into centralized type definitions (`src/types/entities/` and `src/types/widgets/`), ensuring `src/lib/db.ts` and `src/lib/backup.ts` never import from presentation layers.
3. Fix polymorphic navigation in `Button.tsx` to handle external protocols (`tg:`, `mailto:`, `https://`) via standard `<a>` tags and eliminate invalid nested `<button>` elements inside anchor tags in `TopSites.tsx` and `Favorites.tsx`.

---

## 2. Target Directory Restructuring

```
src/
├── features/                      <-- NEW: First-class domain features
│   └── bookmarks/
│       ├── types.ts               (Favorite, Folder, Website, etc.)
│       ├── db/
│       │   ├── favorites.repo.ts  (FavoritesRepository)
│       │   └── folders.repo.ts    (FoldersRepository)
│       └── stores/
│           ├── favorites.store.ts (useFavorites)
│           └── folders.store.ts   (useFolders)
├── types/
│   ├── entities/                  <-- NEW: Hoisted core database entity models
│   │   ├── calendar.ts
│   │   ├── counter.ts
│   │   ├── mood.ts
│   │   ├── note.ts
│   │   ├── pet.ts
│   │   ├── pomodoro.ts
│   │   └── progress.ts
│   └── settings.ts
```

---

## 3. Step-by-Step Implementation Tasks

### Task 2.1: Hoist Favorites & Folders to Feature Domain (ARCH-002)

- [x] **Create Directory Structure:** Create `src/features/bookmarks/db/` and `src/features/bookmarks/stores/`.
- [x] **Consolidate Types:** Create `src/features/bookmarks/types.ts` moving definitions from sites-and-folders.
- [x] **Move Repositories:** Created `src/features/bookmarks/db/favorites.repo.ts` and `folders.repo.ts`.
- [x] **Move Zustand Stores:** Created `src/features/bookmarks/stores/favorites.store.ts` and `folders.store.ts`.
- [x] **Move Custom Hooks:** Created `src/features/bookmarks/hooks/useFavorites.ts` and `useFolders.ts`.
- [x] **Update Import References Across the Codebase:**
  Updated all consumer files (`AppLoader`, `Suggestions`, `Favorites`, `Folders`, `db.ts`, `backup.ts`, `migrations.ts`).

---

### Task 2.2: Resolve Layer Inversion in Core Lib & Types (ARCH-003)

- [x] **Extract Widget Entity Types to `src/types/entities/`:**
  - Created entity models in `src/types/entities/` (`calendar.ts`, `counter.ts`, `mood.ts`, `note.ts`, `pet.ts`, `pomodoro.ts`, `progress.ts`, `index.ts`).
- [x] **Created Repositories in `src/features/widgets/`:**
  - Hoisted all 7 repositories to `src/features/widgets/<name>/repo.ts` with barrel export in `src/features/widgets/index.ts`.
- [x] **Refactor `src/types/settings.ts`:**
  - Hoisted `PomodoroSettings` to `@/types/entities/pomodoro`. 0 UI imports.
- [x] **Refactor `src/lib/db.ts`:**
  - Cleaned all type imports to import from `@/types/entities` and `@/features/bookmarks`. 0 UI imports.
- [x] **Refactor `src/lib/backup.ts`:**
  - Cleaned all type imports to import from `@/types/entities` and `@/features/bookmarks`. 0 UI imports.
- [x] **Refactor `src/lib/migrations.ts`:**
  - Cleaned imports to use `@/constants/defaultFolders`, `@/features/widgets`, and `@/types/entities`. 0 UI imports.
- [x] **Widget Subdirectory Re-exports:**
  - Re-exported entity models and repositories from widget directories for backwards compatibility.

---

### Task 2.3: Correct Link Architecture & HTML Element Nesting (ARCH-007)

- [x] **Refactor `src/components/ui/Button.tsx` for External Protocols:**
  - Added external protocol detection (`isExternal = /^(https?:\/\/|mailto:|tg:|chrome:)/i.test(href)`).
  - Rendered native `<a>` for external protocols with full anchor props, and `<Link>` for SPA routes.
- [x] **Fix Nested `<Button>` Inside `<a>` in `TopSites.tsx`:**
  - Removed outer `<a>` wrapper and passed `href={site.url}` directly to `<Button>`.
- [x] **Fix Nested `<Button>` Inside `<Link>` in `Favorites.tsx`:**
  - Removed outer `<Link>` wrapper and passed `href={site.url}` directly to `<Button>`.
- [x] **Fix `FolderModal.tsx` External Site Links:**
  - Rendered native `<a>` tag for folder websites.
- [x] **Verify `AboutTabDetails.tsx` Links:**
  - Added `target="_blank"` and `rel="noopener noreferrer"` to external links.

---

## 4. Verification & Testing Checklist

- [x] **Compile Verification:** Ran `npx tsc --noEmit` — 0 errors across entire codebase.
- [x] **Build Verification:** Ran `npm run build` — compiled cleanly in 432ms.
- [x] **Lint Import Boundaries:** Verified `src/lib/db.ts`, `src/lib/backup.ts`, `src/lib/migrations.ts`, and `src/types/settings.ts` have zero imports from `src/components/`.
- [ ] **Bookmark CRUD Regression Test:**
  1. Add a new Favorite from the Settings tab.
  2. Verify Favorite appears immediately on the Home page.
  3. Search for the Favorite using the omnibar search input (`Suggestions.tsx`).
  4. Create a folder, add a website to it, reorder items, and test modal edit.
- [ ] **Backup & Restore Test:**
  1. Export a JSON backup from Settings > Data Backup.
  2. Inspect JSON output to ensure `favorites`, `folders`, and widget tables are fully serialized.
  3. Reset data and restore the backup file; verify all data reloads without errors.
- [ ] **Navigation & Link Click Test:**
  1. Click Telegram support button in Settings > About; verify it prompts Telegram app or web url without changing SPA hash route.
  2. Inspect DOM in Chrome DevTools to ensure no `<button>` element is rendered inside an `<a>` element.

---

## 5. Definition of Done
- `Favorite` and `Folder` domains live under `src/features/bookmarks/` with zero dependency on Settings UI components.
- `src/lib/db.ts` imports purely from `src/types/` and domain models, completely decoupled from `src/components/`.
- `Button` gracefully handles both internal React Router paths and external protocols.
- HTML markup complies strictly with HTML5 specifications (no interactive button inside anchor tags).
