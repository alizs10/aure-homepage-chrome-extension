# Plan 02: High Severity Remediation

**Focus:** Domain Decoupling, Layer Inversion Resolution & HTML Link Architecture  
**Target Issues:**  
- [`ARCH-002`](../ARCHITECTURE_AUDIT.md#arch-002-deep-domain-entanglement-of-favorites-and-folders): Deep Domain Entanglement of Favorites and Folders  
- [`ARCH-003`](../ARCHITECTURE_AUDIT.md#arch-003-layer-inversion-global-lib-and-types-importing-from-widget-subdirectories): Layer Inversion (Global Lib and Types Importing from UI Widgets)  
- [`ARCH-007`](../ARCHITECTURE_AUDIT.md#arch-007-invalid-html-nesting--navigation-inconsistencies): Invalid HTML Element Nesting & Navigation Inconsistencies  
**Estimated Time:** 4–6 hours  
**Status:** `[ ] Not Started`

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

- [ ] **Create Directory Structure:** Create `src/features/bookmarks/db/` and `src/features/bookmarks/stores/`.
- [ ] **Consolidate Types:** Create `src/features/bookmarks/types.ts` moving definitions from:
  - `src/components/settings/components/tabs-details/sites-and-folders/components/favorites/types.ts`
  - `src/components/settings/components/tabs-details/sites-and-folders/components/folders/types.ts`
- [ ] **Move Repositories:**
  - Move `.../favorites/db.ts` to `src/features/bookmarks/db/favorites.repo.ts`.
  - Move `.../folders/db.ts` to `src/features/bookmarks/db/folders.repo.ts`.
- [ ] **Move Zustand Stores:**
  - Move `.../favorites/store.ts` to `src/features/bookmarks/stores/favorites.store.ts`.
  - Move `.../folders/store.ts` to `src/features/bookmarks/stores/folders.store.ts`.
- [ ] **Update Import References Across the Codebase:**
  Update imports in all affected consumer files:
  - [`src/AppLoader.tsx`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/AppLoader.tsx)
  - [`src/lib/db.ts`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/lib/db.ts)
  - [`src/lib/migrations.ts`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/lib/migrations.ts)
  - [`src/lib/backup.ts`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/lib/backup.ts)
  - [`src/components/home/Suggestions.tsx`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/components/home/Suggestions.tsx)
  - [`src/components/home/favorites/Favorites.tsx`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/components/home/favorites/Favorites.tsx)
  - [`src/components/home/folders/Folders.tsx`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/components/home/folders/Folders.tsx)
  - [`src/components/settings/components/tabs-details/sites-and-folders/SitesAndFoldersContent.tsx`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/components/settings/components/tabs-details/sites-and-folders/SitesAndFoldersContent.tsx)
  - All modals and list items under `sites-and-folders/components/`.

---

### Task 2.2: Resolve Layer Inversion in Core Lib & Types (ARCH-003)

- [ ] **Extract Widget Entity Types to `src/types/entities/`:**
  - Create `src/types/entities/calendar.ts`: Export `CalendarEvent`, `CalendarStartDay`.
  - Create `src/types/entities/counter.ts`: Export `CounterItem`.
  - Create `src/types/entities/mood.ts`: Export `MoodItem`.
  - Create `src/types/entities/note.ts`: Export `NoteItem`, `ChecklistItem`.
  - Create `src/types/entities/pet.ts`: Export `PetItem`.
  - Create `src/types/entities/pomodoro.ts`: Export `PomodoroTask`, `PomodoroSession`, `PomodoroActiveState`.
  - Create `src/types/entities/progress.ts`: Export `ProgressItem`.
  - Create `src/types/entities/index.ts` re-exporting all entity models.
- [ ] **Refactor `src/types/settings.ts`:**
  - Change line 1 from importing `CalendarStartDay` from `@/components/widgets/calendar/types` to importing from `@/types/entities/calendar`.
- [ ] **Refactor `src/lib/db.ts`:**
  - Change all type imports (lines 1–8) to import from `@/types/entities` and `@/features/bookmarks/types`.
  - Ensure `src/lib/db.ts` contains **zero** imports pointing to `src/components/*`.
- [ ] **Refactor `src/lib/backup.ts`:**
  - Extract an abstract repository interface or relocate widget repositories to `@/features/widgets/*/repositories/` so that `backup.ts` does not depend on UI component hierarchies.
- [ ] **Widget Subdirectory Re-exports:**
  - In each widget's `types/index.ts`, re-export the entity types from `@/types/entities/*` to prevent breaking internal widget component imports.

---

### Task 2.3: Correct Link Architecture & HTML Element Nesting (ARCH-007)

- [ ] **Refactor `src/components/ui/Button.tsx` for External Protocols:**
  Update lines 127–133 to distinguish internal SPA client routes from external URLs and protocols:
  ```tsx
  if ("href" in props) {
    const { href, ...linkProps } = props;
    const isExternal = typeof href === 'string' && /^(https?:\/\/|mailto:|tg:|chrome:)/i.test(href);

    if (isExternal) {
      return (
        <a href={href} className={buttonVariants({ variant, size, className })} {...(linkProps as any)}>
          {content}
        </a>
      );
    }

    return (
      <Link to={href} className={buttonVariants({ variant, size, className })} {...(linkProps as any)}>
        {content}
      </Link>
    );
  }
  ```
- [ ] **Fix Nested `<Button>` Inside `<a>` in `TopSites.tsx`:**
  In [`src/components/home/TopSites.tsx#L48-L52`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/components/home/TopSites.tsx#L48-L52):
  - Remove outer `<a>` wrapper.
  - Pass `href={site.url}` and `target="_blank"` directly to `<Button>`.
- [ ] **Fix Nested `<Button>` Inside `<Link>` in `Favorites.tsx`:**
  In [`src/components/home/favorites/Favorites.tsx#L16-L20`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/components/home/favorites/Favorites.tsx#L16-L20):
  - Pass `href={favorite.url}` directly to `<Button>` rather than wrapping `<Button>` inside an anchor/Link tag.
- [ ] **Verify `AboutTabDetails.tsx` Links:**
  Ensure Telegram (`tg:resolve?domain=...`) and Email (`mailto:...`) buttons launch respective OS handler applications cleanly without altering hash route.

---

## 4. Verification & Testing Checklist

- [ ] **Compile Verification:** Run `npx tsc --noEmit` and confirm 0 type errors across the entire codebase.
- [ ] **Lint Import Boundaries:** Verify that no file in `src/lib/` or `src/types/` imports from `src/components/`.
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
