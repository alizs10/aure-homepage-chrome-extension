# Aure Homepage v0.2.0

Aure Homepage v0.2.0 introduces customizable search engine selection, on-the-fly `@<engine>` search commands, configurable new-tab opening behaviors for searches and bookmarks, optional countdown start dates with smarter recurrence scheduling, a visual Pomodoro daily time breakdown ring, cleaner IPv4 network status display, proper text wrapping in notes and checklists, and a smoother hover experience on Mozilla Firefox.

## What's New

### Search Engine Selection

- **Multiple Search Providers**: You can now choose your preferred default search engine directly from a dedicated **Search** tab in Settings.
- **Supported Engines**: Out-of-the-box support for Google, DuckDuckGo, Brave, Bing, Yandex, Gerdoo, and ChatGPT.
- **Dynamic Search Routing**: Homepage search queries and instant completions seamlessly route to your selected engine.

### Quick Search Engine Commands

- **On-the-Fly Engine Queries**: Type `@` in the search bar to browse available search engines, or use `@<engine> <query>` (e.g., `@chatgpt`, `@brave`, `@duckduckgo`, `@bing`) to quickly search using a specific engine without changing your default settings.
- **Adaptive Suggestions**: Search suggestions dynamically route through your targeted engine command in real time.

### Flexible Opening Behaviors

- **Open Search in New Tab**: Configure web searches launched from your homepage search bar to open in a new tab or replace the current tab.
- **Open Bookmarks in New Tab**: Choose whether favorites, folder websites, and top sites shortcuts open in a fresh new tab or the active tab.

## Improvements

### Bookmarks Settings

- **More Organized**: Bookmarks settings are now more organized, making it simpler to manage your shortcuts, folders, and display options.

### Pomodoro Daily Summary

- **Visual Time Breakdown**: The Daily Summary popup now wraps your total focus time in an intuitive multi-segment circular progress ring, distinctly separating your focus sessions, short breaks, and long breaks.

### Countdown Start Dates & Smarter Cycles

- **Custom Start Date**: You can now specify an optional start date when creating or editing countdowns. The circular progress ring accurately reflects elapsed time across your full schedule, while automatically defaulting to the current day if left blank.
- **Smarter Recurrence Logic**: Added intelligent validation for recurring countdowns to ensure your repeat interval matches or exceeds your cycle duration, keeping recurring schedules consistent and reliable.

## Fixes

### Notes & Checklists Text Wrapping

- **Proper Text Wrapping**: Fixed an issue where long continuous text or unbroken words in notes, tasks, and checklist items would overflow outside their cards instead of wrapping properly.

### Network Status IP Display

- **Clean IPv4 Display**: The Network Status widget now prioritizes standard IPv4 detection, preventing long IPv6 addresses from taking up excessive space in the header bar.

### Firefox Smoothness

- **Smoother Hover Experience**: Refined bookmark and shortcut animations to make the hover experience feel much smoother and more responsive in Firefox.

## Download & Installation

### Google Chrome

1. Download **`aure-homepage-chrome-v0.2.0.zip`** from the Assets section below.
2. Extract the ZIP file.
3. Navigate to `chrome://extensions`.
4. Enable **Developer mode** in the top-right corner.
5. Click **Load unpacked** and select the extracted folder.

### Mozilla Firefox

1. Download **`aure-homepage-firefox-v0.2.0.zip`** from the Assets section below.
2. Extract the ZIP file.
3. Navigate to `about:debugging#/runtime/this-firefox`.
4. Click **Load Temporary Add-on...** and select `manifest.json` from the extracted folder.

## Updating

Download the latest ZIP for your browser from the Assets section below and extract it over your existing installation folder, or reload the unpacked extension in your browser's extensions page. Your personal settings, bookmarks, and widget data are stored locally and will be preserved.

---

Thank you for using Aure Homepage! Feedback, bug reports, and feature requests are always welcome.
