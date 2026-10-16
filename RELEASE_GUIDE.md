# Aure Homepage — Release & Versioning Guide

This document establishes the official procedure, rules, and guardrails for preparing, updating, and publishing a new release of the **Aure Homepage** extension for both **Google Chrome** and **Mozilla Firefox**.

---

## 1. Release Files Matrix

Every new release requires updating or creating **5 specific files**:

| File | Type | Purpose | Key Fields / Elements |
| :--- | :--- | :--- | :--- |
| [`.env`](file:///.env) | Configuration | Application build environment constants | `VITE_APP_VERSION`, `VITE_VERSION_DATE`, `VITE_VERSION_NAME` |
| [`manifest.base.json`](file:///manifest.base.json) | Manifest | Base extension metadata (shared across Chrome & Firefox) | `"version"` |
| [`version.json`](file:///version.json) | Remote Manifest | In-app auto-update check endpoint | `"latestVersion"`, `"releaseDate"`, `"downloadUrl"`, `"releasePage"`, `"notes"` |
| [`RELEASE_NOTES.md`](file:///RELEASE_NOTES.md) | Release Notes | GitHub Release body (used by GitHub Actions) | Release summary, What's New, Improvements, Fixes, Download & Installation instructions |
| [`src/components/features/updates/changelog/<version>.md`](file:///src/components/features/updates/changelog/) | Changelog | In-app changelog modal and update indicators | YAML frontmatter (`version`, `date`, `title`), markdown changelog sections |

---

## 2. Core Rules & Guardrails

### 2.1 Public-Facing Tone & Plain Language
* **Target Audience:** All changelog documents and release notes are read by everyday end-users.
* **Keep it Simple & Summarized:** Avoid low-level internal jargon, architectural file paths, library names, or developer-specific terminology (e.g., do not say *"Implemented cross-tab BroadcastChannel sync in Zustand stores with Dexie liveQuery hooks"*; instead say *"All settings, bookmarks, and widgets now sync automatically across all open tabs without refreshing"*).
* **Focus on User Value:** Explain *what* changed and *how it benefits* the user experience (e.g., smoother navigation, faster startup, more responsive interactions).

### 2.2 Version Code Name Convention
* **Format:** `<codename>_stable_release` (always lowercase with underscores, ending in `_stable_release`).
* **Thematic Alignment:** Choose the code name based on the key theme or standout improvements of the release:
  * `0.0.4` &rarr; `bold_forward_stable_release` (Folders, Pomodoro, UI refresh)
  * `0.0.5` &rarr; `toward_perfection_stable_release` (Organize pages, new widgets, responsive design)
  * `0.0.6` &rarr; `seamless_harmony_stable_release` (Real-time cross-tab sync, architectural harmony & stability)

### 2.3 Date Format Consistency
Ensure dates match across all modified files:
* **Human-readable date format** for [`.env`](file:///.env): `DD Mon YYYY` (e.g., `16 Oct 2026`).
* **ISO 8601 date format** for [`version.json`](file:///version.json) and changelog frontmatter: `YYYY-MM-DD` (e.g., `2026-10-16`).

### 2.4 Consistent URLs and Asset Filenames
* **Release Tag:** `vX.Y.Z` (e.g., `v0.0.6`).
* **Zip Asset Names:**
  * Chrome: `aure-homepage-chrome-v<version>.zip`
  * Firefox: `aure-homepage-firefox-v<version>.zip`
* **Download URLs:**
  * `https://github.com/alizs10/aure-homepage-chrome-extension/releases/download/v<version>/aure-homepage-chrome-v<version>.zip`
  * `https://github.com/alizs10/aure-homepage-chrome-extension/releases/download/v<version>/aure-homepage-firefox-v<version>.zip`
* **Release Page URL:** `https://github.com/alizs10/aure-homepage-chrome-extension/releases/tag/v<version>`.

### 2.5 In-App Changelog Preview Consideration
The application's changelog system automatically extracts the first 140 plain-text characters of the markdown body as the summary card snippet in the Updates popup. Make sure the very first bullet point or opening sentence is crisp, engaging, and summarizes the release highlight.

---

## 3. Step-by-Step Preparation Workflow

### Step 1: Update Environment & Manifest

1. **[`.env`](file:///.env)**:
   ```env
   VITE_APP_VERSION="0.0.6"
   VITE_VERSION_DATE="16 Oct 2026"
   VITE_VERSION_NAME="seamless_harmony_stable_release"
   ```

2. **[`manifest.base.json`](file:///manifest.base.json)**:
   ```json
   {
       "manifest_version": 3,
       "name": "Aure Homepage",
       "version": "0.0.6",
       ...
   }
   ```

### Step 2: Create the In-App Changelog
Create a new file under `src/components/features/updates/changelog/<version>.md` (e.g., [`src/components/features/updates/changelog/0.0.6.md`](file:///src/components/features/updates/changelog/0.0.6.md)):

```markdown
---
version: 0.0.6
date: 2026-10-16
title: seamless_harmony_stable_release
---

## New Features

### Feature Name
* **Highlight**: Plain-language description of feature and user benefit.

## Improvements

### Category Name
* **Highlight**: Description of visual or performance improvement.

## Bug Fixes

### Category Name
* Description of resolved issue.
```

### Step 3: Update GitHub Release Notes
Edit [`RELEASE_NOTES.md`](file:///RELEASE_NOTES.md). This file serves directly as the GitHub release body generated by the automated release pipeline:
* Include `# Aure Homepage v<version>`.
* Provide a concise 1–2 sentence introduction.
* Structure into `## What's New`, `## Improvements`, `## Fixes`.
* Include download links for both Chrome (`aure-homepage-chrome-v<version>.zip`) and Firefox (`aure-homepage-firefox-v<version>.zip`).

### Step 4: Update Remote Auto-Update Endpoint
Update [`version.json`](file:///version.json):
* Set `"latestVersion": "<version>"`.
* Set `"releaseDate": "YYYY-MM-DD"`.
* Update `"downloadUrl"` and `"releasePage"`.
* In `"notes"`, supply bullet points written in simple, user-friendly language.

---

## 4. Pre-Release Verification & Quality Checklist

Before tagging or creating a release, run through this verification checklist:

```bash
# 1. Typecheck and build both Chrome and Firefox distributions
bun run build

# 2. Package both release archives
bun run package

# 3. Run linter
bun run lint
```

- [ ] **Build Integrity:** `bun run build` succeeds without TypeScript or bundling errors.
- [ ] **Manifest Checks:**
  - Verify `dist/chrome/manifest.json` contains the updated `"version"` and Chrome-specific fields (`service_worker`, `favicon` permission, `_favicon/*` resource, `key`).
  - Verify `dist/firefox/manifest.json` contains the updated `"version"` and Firefox-specific fields (`browser_specific_settings.gecko.id: "aure-homepage@auredev.ir"`, `background.scripts`).
- [ ] **Chrome Testing:** Load unpacked from `dist/chrome` in `chrome://extensions`.
- [ ] **Firefox Testing:** Load temporary add-on from `dist/firefox/manifest.json` in `about:debugging#/runtime/this-firefox`.
- [ ] **Changelog Rendering:** Open the Updates modal to ensure the new version is detected, badge displays correctly, and markdown renders cleanly without formatting glitches.
- [ ] **Cross-Tab Verification:** Confirm basic settings and widget changes persist and sync across tabs smoothly.

---

## 5. Publishing Automation

The repository includes an automated GitHub Actions workflow at [`.github/workflows/release.yml`](file:///.github/workflows/release.yml).

When you are ready to publish:

1. Commit all prepared release files:
   ```bash
   git add .env manifest.base.json version.json RELEASE_NOTES.md src/components/features/updates/changelog/0.0.6.md RELEASE_GUIDE.md
   git commit -m "[RELEASE] prepare version 0.0.6"
   git push origin main
   ```
2. Create and push a version tag:
   ```bash
   git tag v0.0.6
   git push origin v0.0.6
   ```
3. GitHub Actions will automatically:
   - Validate the version format and ensure [`RELEASE_NOTES.md`](file:///RELEASE_NOTES.md) exists.
   - Run `bun run build` to generate `dist/chrome` and `dist/firefox`.
   - Verify both manifests match the tagged version.
   - Package `aure-homepage-chrome-v0.0.6.zip` and `aure-homepage-firefox-v0.0.6.zip`.
   - Publish a GitHub Release with both zip assets and notes from [`RELEASE_NOTES.md`](file:///RELEASE_NOTES.md).
