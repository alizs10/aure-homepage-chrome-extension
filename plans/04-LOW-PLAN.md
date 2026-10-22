# Plan 04: Low Severity & Maintenance Remediation

**Focus:** Code Cleanliness, Utility Reuse, Bug Fixes & Dead Code Elimination  
**Target Issues:**  
- [`DUP-005`](../ARCHITECTURE_AUDIT.md#dup-005-reimplemented-array-swap--order-mutators): Reimplemented Array Swap & Order Mutators  
- [`REUSE-001`](../ARCHITECTURE_AUDIT.md#reuse-001-bypassed-date-utility-abstractions): Bypassed Date Utility Abstractions  
- [`REUSE-002`](../ARCHITECTURE_AUDIT.md#reuse-002-reimplemented-classname-concatenation-cn): Reimplemented ClassName Concatenation (`cn`)  
- [`MAINT-002`](../ARCHITECTURE_AUDIT.md#maint-002-dead-code-obsolete-caching-layers-and-mutation-bugs): Dead Code, Obsolete Caching Layers & Domain Mutation Bugs  
**Estimated Time:** 2–3 hours  
**Status:** `[x] Completed`

---

## 1. Overview & Objective
Address residual code smells, dead code, subtle logic bugs, and inconsistent utility usage across the codebase:
1. Extract a generic `swapItemOrder` utility for array ordering in bookmarks and folders.
2. Unify date formatting across widgets and popups into `src/helpers/date.ts`.
3. Replace the private inline `cn` function in `ModalWrapper.tsx` with the project-wide `cn` utility.
4. Purge dead files (`UiShowcase.tsx`), remove obsolete `favicon_*` storage cleanup, correct the Pet House inventory removal bug, and fix accessibility/URL protocol inconsistencies in search input.

---

## 2. Affected Files & Tasks Matrix

| Target Issue | Affected Files | Scope of Change |
| :--- | :--- | :--- |
| **DUP-005** | `src/lib/util.ts`, `favorites.store.ts`, `folders.store.ts` | Implement `swapItemOrder<T>()` helper and replace duplicated sort routines. |
| **REUSE-001** | `src/helpers/date.ts`, `UpdatesPopup.tsx`, `Header.tsx` | Centralize date formatting; remove local formatting functions. |
| **REUSE-002** | `src/components/ui/modal/ModalWrapper.tsx` | Delete private `cn` function and import `@/lib/util`. |
| **MAINT-002 (Bug)** | `src/components/widgets/pet-house/store.ts` | Remove accidental `hasBeenFeedCount` increment on item deletion. |
| **MAINT-002 (Clean)** | `src/pages/UiShowcase.tsx`, `src/App.tsx` | Delete unused `UiShowcase.tsx` and commented route. |
| **MAINT-002 (Storage)** | `src/stores/settings.store.ts` | Remove obsolete `favicon_*` cleanup loop. |
| **MAINT-002 (ARIA/URL)**| `src/components/home/SearchInput.tsx` | Remove invalid `role="div"` and update URL fallback to `https://`. |
| **MAINT-002 (Naming)** | `useCurrentDateString.tsx`, `useWidth.tsx` | Rename non-JSX `.tsx` files to `.ts`. |

---

## 3. Step-by-Step Implementation Tasks

### Task 4.1: Extract Generic `swapItemOrder` Utility (DUP-005)
- [x] In [`src/lib/util.ts`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/lib/util.ts), implement `getAdjacentSwap<T extends OrderableItem>`
- [x] Refactor `favorites.store.ts` (`sortUp`, `sortDown`) to use `getAdjacentSwap`.
- [x] Refactor `folders.store.ts` (`sortUp`, `sortDown`, `sortWebsiteUp`, `sortWebsiteDown`) to use `getAdjacentSwap`.

---

### Task 4.2: Standardize Date Formatting (REUSE-001)
- [x] Review and expand [`src/helpers/date.ts`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/helpers/date.ts) to support application date formats with `formatDisplayDate`.
- [x] In [`src/components/updates/UpdatesPopup.tsx`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/components/updates/UpdatesPopup.tsx#L13) and `UpdateDetailModal.tsx`, remove the local `formatDate` helper and use `formatDisplayDate`.
- [x] In [`src/layouts/Header.tsx`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/layouts/Header.tsx), format the live date/time using `formatDisplayDate`.

---

### Task 4.3: Fix `ModalWrapper.tsx` `cn` Import (REUSE-002)
- [x] Open [`src/components/ui/modal/ModalWrapper.tsx`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/components/ui/modal/ModalWrapper.tsx).
- [x] Delete private inline `function cn(...)` on lines 42–44.
- [x] Add `import { cn } from '@/lib/util';` at the top of the file.

---

### Task 4.4: Fix Pet House Deletion Bug (MAINT-002)
- [x] Open [`src/components/widgets/pet-house/store.ts#L60`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/components/widgets/pet-house/store.ts#L60).
- [x] In `removeItem`, remove `hasBeenFeedCount: state.hasBeenFeedCount + 1`.

---

### Task 4.5: Clean Obsolete Code and File Naming (MAINT-002)
- [x] **Delete UiShowcase:** Remove `src/pages/UiShowcase.tsx` and delete the commented-out import and route in [`src/App.tsx#L12`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/App.tsx#L12).
- [x] **Clean Storage Cleanup Loop:** In [`src/stores/settings.store.ts#L60-L68`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/stores/settings.store.ts#L60-L68), remove the loop removing keys matching `/^favicon_/` from `chrome.storage.local`.
- [x] **Fix SearchInput ARIA & Fallback:**
  - In [`src/components/home/SearchInput.tsx#L199`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/components/home/SearchInput.tsx#L199), remove invalid attribute `role="div"`.
  - In line 44, change `http://` prefix fallback to `https://`.
- [x] **Rename Non-JSX Files:**
  - Rename `src/hooks/useCurrentDateString.tsx` to `src/hooks/useCurrentDateString.ts`.
  - Rename `src/components/settings/constants/tabs.tsx` and `src/components/widgets/notes-and-checklists/hooks/useNotesAndChecklists.tsx` to `.ts`.
  - In `src/components/widgets/counters/types/index.tsx` and `src/components/widgets/progresses/types/index.tsx`, extract the filter constants with Lucide JSX icons into separate `constants/filters.tsx` components and keep pure type definitions in `types/index.ts`.

---

## 4. Verification & Testing Checklist

- [x] **Build Check:** Run `npm run build` and ensure clean compile with zero errors.
- [ ] **Reordering Functionality:**
  1. Add 3 favorites.
  2. Click "Move Up" and "Move Down" buttons in Settings > Sites and Folders.
  3. Verify items swap positions and persist order on page refresh.
- [ ] **Pet House Inventory Test:**
  1. Add a food item in Pet House.
  2. Note the current `hasBeenFeedCount`.
  3. Delete the food item.
  4. Verify `hasBeenFeedCount` does **not** change.
- [ ] **Search Input Verification:**
  1. Enter a plain domain name without protocol (e.g. `example.com`) into search input.
  2. Press Enter; verify browser navigates to `https://example.com` (not `http://`).
- [ ] **Accessibility Inspection:**
  1. Inspect search input button with Chrome Lighthouse or accessibility inspector; verify no invalid ARIA role warning is reported.

---

## 5. Definition of Done
- No dead code files remain in `src/pages/`.
- Obsolete favicon storage cleanup removed from settings initialization.
- Pet House food item deletion no longer increments feeding count.
- Shared date and class merging utilities are used consistently.
- File extensions strictly reflect whether the file contains JSX.
