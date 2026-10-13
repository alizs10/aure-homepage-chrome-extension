# Plan 03: Medium Severity Remediation

**Focus:** Duplication Elimination, State Architecture, Theme Coordination & Dependency Hygiene  
**Target Issues:**  
- [`ARCH-004`](../ARCHITECTURE_AUDIT.md#arch-004-wallpaper-entity-bypasses-repository--store-architecture): Wallpaper Entity Bypasses Repository & Store Architecture  
- [`ARCH-005`](../ARCHITECTURE_AUDIT.md#arch-005-dual-competing-system-theme-observers): Dual Competing System Theme Observers  
- [`ARCH-006`](../ARCHITECTURE_AUDIT.md#arch-006-cross-store-tight-coupling--ui-side-effects-in-stores): Cross-Store Tight Coupling & UI Side Effects in Stores  
- [`ARCH-008`](../ARCHITECTURE_AUDIT.md#arch-008-uncoordinated-window-resize--breakpoint-listeners): Uncoordinated Window Resize & Breakpoint Listeners  
- [`DUP-001`](../ARCHITECTURE_AUDIT.md#dup-001-exact-duplicate-default-widget-layout): Duplicate Default Widget Layout Structure  
- [`DUP-002`](../ARCHITECTURE_AUDIT.md#dup-002-duplicate-wallpaper-selection--upload-ui): Duplicate Wallpaper Selection & Upload Grid  
- [`DUP-003`](../ARCHITECTURE_AUDIT.md#dup-003-duplicate-semantic-version-comparison): Duplicate Semantic Version Comparison  
- [`DUP-004`](../ARCHITECTURE_AUDIT.md#dup-004-duplicate-remote-update-checker-logic): Duplicate Remote Update Checker Flow  
- [`MAINT-001`](../ARCHITECTURE_AUDIT.md#maint-001-dependency-bloat-ghost-packages-and-version-mismatches): Dependency Bloat & Version Mismatches in `package.json`  
**Estimated Time:** 6–8 hours  
**Status:** `[ ] Not Started`

---

## 1. Overview & Objective
Eliminate code duplication across core features, bring wallpapers into compliance with the documented Dexie/Zustand architecture, consolidate competing theme listeners, decouple cross-store side effects, optimize window resize events, and cleanse `package.json` of phantom packages and version discrepancies.

---

## 2. Affected Files & Tasks Matrix

| Issue ID | Affected Files | Scope of Refactoring |
| :--- | :--- | :--- |
| **ARCH-004** | `src/features/wallpapers/`, `useWallpaperBackground.ts`, `WallpapersSection.tsx`, `ChooseWallpaper.tsx` | Create `WallpaperRepository` & `useWallpaperStore`. Replace raw `db.wallpapers` calls. |
| **ARCH-005** | `src/providers/ThemeProvider.tsx`, `src/hooks/useTheme.ts` | Consolidate `matchMedia` listener in `ThemeProvider`; make `useTheme` a pure hook. |
| **ARCH-006** | `mood-tracker/store.ts`, `notes-and-checklists/store.ts`, `commands.ts` | Remove cross-store mutations and toast calls from store actions; move to UI callers. |
| **ARCH-008** | `useWidth.tsx`, `useWidgetPagination.ts`, `LayoutCustomizer.tsx` | Centralize window resize handling with debouncing. |
| **DUP-001** | `src/pages/Wizard.tsx`, `src/lib/migrations.ts`, `src/constants/widget-weights.ts` | Extract `DEFAULT_WIDGET_LAYOUT` constant. |
| **DUP-002** | `src/components/common/WallpaperPicker.tsx`, `WallpapersSection.tsx`, `ChooseWallpaper.tsx` | Extract reusable `<WallpaperPicker>` component. |
| **DUP-003** | `src/lib/version.ts`, `src/lib/changelog.ts` | Unify semver parsing and comparison in `version.ts`. |
| **DUP-004** | `src/hooks/useUpdateChecker.ts`, `HeaderUpdateChecker.tsx`, `CheckForUpdate.tsx` | Extract `useUpdateChecker` custom hook. |
| **MAINT-001** | `package.json`, `package-lock.json` | Remove `npm`, `i`, `react-scan`, `react-moment`; align `react-router` versions. |

---

## 3. Step-by-Step Implementation Tasks

### Task 3.1: Cleanse `package.json` Dependencies (MAINT-001)
- [ ] Uninstall accidental and ghost packages:
  ```bash
  npm uninstall i npm react-scan
  ```
- [ ] Align React Router versions so both `react-router` and `react-router-dom` match the same major/minor release (`^7.18.1`).
- [ ] Replace any residual usage of `react-moment` in `Header.tsx` with `date-fns` / `src/helpers/date.ts`, then run:
  ```bash
  npm uninstall react-moment
  ```
- [ ] Verify `npm run build` succeeds cleanly with smaller bundle size.

---

### Task 3.2: Implement Wallpaper Repository & Store (ARCH-004)
- [ ] Create `src/features/wallpapers/wallpaper.repo.ts`:
  ```typescript
  export class WallpaperRepository {
    async getAll(): Promise<WallpaperItem[]> {
      return db.wallpapers.toArray();
    }
    async add(wallpaper: Omit<WallpaperItem, 'id'>): Promise<number> {
      return db.wallpapers.add(wallpaper as WallpaperItem);
    }
    async delete(id: number): Promise<void> {
      await db.wallpapers.delete(id);
    }
  }
  export const wallpaperRepository = new WallpaperRepository();
  ```
- [ ] Create `src/features/wallpapers/wallpaper.store.ts`:
  ```typescript
  export const useWallpaperStore = create<WallpaperState>((set, get) => ({
    wallpapers: [],
    loading: false,
    fetchWallpapers: async () => {
      set({ loading: true });
      const wallpapers = await wallpaperRepository.getAll();
      set({ wallpapers, loading: false });
    },
    addWallpaper: async (data) => {
      const id = await wallpaperRepository.add(data);
      await get().fetchWallpapers();
      return id;
    },
    deleteWallpaper: async (id) => {
      await wallpaperRepository.delete(id);
      await get().fetchWallpapers();
    },
  }));
  ```
- [ ] Replace direct `useLiveQuery` and raw `db.wallpapers` calls in `useWallpaperBackground.ts`, `WallpapersSection.tsx`, and `ChooseWallpaper.tsx` with `useWallpaperStore`.

---

### Task 3.3: Consolidate Theme Observers (ARCH-005)
- [ ] Retain the system theme media query listener solely inside [`src/providers/ThemeProvider.tsx`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/providers/ThemeProvider.tsx).
- [ ] Refactor [`src/hooks/useTheme.ts`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/hooks/useTheme.ts):
  - Remove redundant `window.matchMedia('(prefers-color-scheme: dark)')` listener and duplicate `document.documentElement.classList.toggle('dark', ...)` call.
  - Make `useTheme()` read theme state directly from `useSettingsStore` and calculate `isDark` synchronously.

---

### Task 3.4: Decouple Cross-Store Mutations & Remove Toasts from Stores (ARCH-006)
- [ ] In [`mood-tracker/store.ts`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/components/widgets/mood-tracker/store.ts#L111-L122):
  - Remove direct `useSettingsStore.getState().update(...)` call from `setActiveView`.
  - Let the component calling `setActiveView` update widget settings via `useSettingsStore` if persistence is desired.
- [ ] In [`notes-and-checklists/store.ts`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/components/widgets/notes-and-checklists/store.ts#L174,L203,L406):
  - Remove `import { toast } from '@/stores/useToastStore'`.
  - Remove `toast.info(...)` and `toast.success(...)` calls from internal store mutators (`moveToTrash`, `deletePermanent`, etc.).
  - Dispatch toast notifications in the UI component event handlers instead.

---

### Task 3.5: Consolidate Window Resize & Breakpoint Listeners (ARCH-008)
- [ ] Rename `src/hooks/useWidth.tsx` to `src/hooks/useWidth.ts`.
- [ ] Implement debounced resize handler (100ms) in `useWidth.ts` using `requestAnimationFrame` or `setTimeout`.
- [ ] Update [`useWidgetPagination.ts`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/components/home/hooks/useWidgetPagination.ts) to consume `useWidth()` instead of attaching a separate raw `resize` event listener.

---

### Task 3.6: Extract Reusable Components & Constants (DUP-001, DUP-002, DUP-003, DUP-004)

- [ ] **Default Widget Layout (DUP-001):**
  - In `src/constants/widget-weights.ts`, define and export:
    ```typescript
    export const DEFAULT_WIDGET_LAYOUT = {
      left: [
        { id: 'calendar', order: 0 },
        { id: 'notes-and-checklists', order: 1 },
        { id: 'mood-tracker', order: 2 },
      ],
      right: [
        { id: 'pomodoro', order: 0 },
        { id: 'counters', order: 1 },
        { id: 'progresses', order: 2 },
        { id: 'pet-house', order: 3 },
      ],
    } as const;
    ```
  - Reference `DEFAULT_WIDGET_LAYOUT` in [`src/pages/Wizard.tsx`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/pages/Wizard.tsx) and [`src/lib/migrations.ts`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/lib/migrations.ts).

- [ ] **Shared Wallpaper Picker (DUP-002):**
  - Create `src/components/common/WallpaperPicker.tsx` containing the grid rendering, selection state, delete action, and upload trigger.
  - Refactor [`WallpapersSection.tsx`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/components/settings/components/tabs-details/preferences-tab-details/WallpapersSection.tsx) and [`ChooseWallpaper.tsx`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/components/wizard/components/ChooseWallpaper.tsx) to consume `<WallpaperPicker>`.

- [ ] **Unified Semantic Version Utility (DUP-003):**
  - In [`src/lib/version.ts`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/lib/version.ts), export canonical `compareVersions(v1: string, v2: string): number`.
  - Re-implement `isVersionHigher(v1, v2): boolean` as `compareVersions(v1, v2) > 0`.
  - Update [`src/lib/changelog.ts`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/lib/changelog.ts) to import `compareVersions` from `@/lib/version`.

- [ ] **Unified Update Checker Hook (DUP-004):**
  - Create `src/hooks/useUpdateChecker.ts` encapsulating:
    - Version checking state (`isChecking`, `hasUpdate`, `latestVersion`, `error`)
    - Remote fetch request to `UPDATE_CHECK_URL`
    - Caching / manual check trigger function
  - Refactor [`HeaderUpdateChecker.tsx`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/components/layouts/HeaderUpdateChecker.tsx) and [`CheckForUpdate.tsx`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/components/settings/components/tabs-details/about-tab-details/CheckForUpdate.tsx) to use `useUpdateChecker()`.

---

## 4. Verification & Testing Checklist

- [ ] **Build Validation:** Run `npm run build` and ensure clean output with zero TypeScript or bundling errors.
- [ ] **Dependency Sanity:** Verify `npm ls` shows no missing peer dependencies or version conflicts.
- [ ] **Wallpaper Management:**
  1. Add a custom wallpaper in Settings > Preferences.
  2. Verify it is immediately selectable in both Settings and Wizard.
  3. Delete a custom wallpaper and verify state synchronizes across components.
- [ ] **Theme Switching:**
  1. Toggle system dark/light mode in OS settings; verify UI transitions smoothly without flickering.
  2. Switch theme manually to "Dark", "Light", and "System"; verify correct class toggles on `document.documentElement`.
- [ ] **Update Notification Check:**
  1. Trigger "Check for Update" in Settings > About.
  2. Verify badge updates in the Header simultaneously.

---

## 5. Definition of Done
- `package.json` contains only necessary, compatible production dependencies.
- Wallpapers are fully managed via dedicated repository and Zustand store.
- Reusable `<WallpaperPicker>`, `useUpdateChecker`, and `DEFAULT_WIDGET_LAYOUT` eliminate duplicate code blocks.
- Stores are isolated from UI toasts and cross-store side-effects.
