# Aure Homepage v0.0.6

This release introduces official **Mozilla Firefox** support, complete real-time cross-tab synchronization across widgets and settings, live public IP & country flag with privacy controls, a new detailed progress modal with custom sorting, and key usability refinements across all widgets.

## What's New

* **Multi-Browser Support (Firefox & Chrome)**:
  * Aure Homepage is now fully supported on **Mozilla Firefox** alongside **Google Chrome** with complete feature parity.
  * Cross-browser high-resolution favicon caching with automatic offline fallbacks.
  * Native new tab experience tailored for both browser ecosystems.
* **Real-Time Cross-Tab Sync**:
  * Every change you make updates across all open tabs instantly without needing a page refresh.
  * **Settings & Layout**: Appearance settings, theme accents, and dashboard arrangements stay synchronized in real time.
  * **Bookmarks & Folders**: Favorites, folders, and site ordering update smoothly across all open tabs.
  * **Interactive Widgets**: Notes & Tasks, Counters, Progresses, Mood Tracker, Pet House, and Calendar stay in sync everywhere.
  * **Custom Wallpapers**: Added or selected wallpapers apply immediately across all open tabs.
* **Live IP & Network Checker**:
  * Inspect your public IP address and country flag directly from the Network Status widget.
  * Automatic network health and connection quality monitoring.
* **Dedicated Privacy Settings**:
  * New **Privacy** tab in Settings to toggle IP inspection on or off and manage data preferences.
* **Progress Goals Details & Sorting**:
  * A new detail modal displaying full info and all actions for your progress cards.
  * Sort progress cards by Priority (High to Low / Low to High) or Date Created (Newest / Oldest first) with remembered preferences.
* **Mood Tracker Missed Days**:
  * You can now choose your mood for missed days directly in the tracker grid.

## Improvements

### Pomodoro Timer Safeguards
* Added protective confirmation dialogs before resetting cycles, ending sessions early, or handling overtime, preventing accidental timer resets.

### Counters & Countdowns
* Expired countdowns now display negative elapsed days (e.g., `-3d`) for clear visibility into how long ago a milestone was reached.
* Refined reset behavior: recurring countdowns and count-ups can be reset instantly while fixed milestones remain preserved.

### Notes & Checklists
* Pasting or dropping multi-line text into the quick note field automatically switches into multi-line mode without losing line breaks or cursor positioning.

### Pet House
* Added click-to-copy helpers for confirmation phrases in pet release and deletion dialogs to make actions faster and easier.

### Bookmarks Experience
* Renamed "Sites & Folders" to **Bookmarks** in Settings for a more natural and intuitive management experience.

### Performance & Polish
* **Faster & Lighter**: Extracted Clock rendering and optimized background processes for lower memory usage and smoother animations.
* **Unified Dates**: Standardized date and time formatting throughout all widgets for a clean, consistent design.
* **New Wallpapers**: New default wallpapers have replaced the old ones.

### Background & Alarms
* **Notification Focus**: Clicking a timer notification now smoothly unminimizes and brings your active browser window into focus.

## Fixes

* **Search Suggestions**: Prevented search suggestions from unexpectedly reappearing when returning to an open tab.

## Download & Installation

### Google Chrome
1. Download **`aure-homepage-chrome-v0.0.6.zip`** from the Assets section below.
2. Extract the ZIP file.
3. Navigate to `chrome://extensions`.
4. Enable **Developer mode** in the top-right corner.
5. Click **Load unpacked** and select the extracted folder.

### Mozilla Firefox
1. Download **`aure-homepage-firefox-v0.0.6.zip`** from the Assets section below.
2. Extract the ZIP file.
3. Navigate to `about:debugging#/runtime/this-firefox`.
4. Click **Load Temporary Add-on...** and select `manifest.json` from the extracted folder.

## Updating

Download the latest ZIP for your browser from the Assets section below and extract it over your existing installation folder, or reload the unpacked extension in your browser's extensions page. Your personal settings, bookmarks, and widget data are stored locally and will be preserved.

---

Thank you for using Aure Homepage! Feedback, bug reports, and feature requests are always welcome.
