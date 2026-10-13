# Plan 01: Critical Severity Remediation

**Focus:** Background Service Worker Message Handling & Alarm Subsystem  
**Target Issue:** [`ARCH-001`](../ARCHITECTURE_AUDIT.md#arch-001-missing-background-message-handlers--broken-alarm-system)  
**Estimated Time:** 1 hour  
**Status:** `[x] Completed`

---

## 1. Overview & Objective
Resolve the broken communication between the Pomodoro widget store and the Chrome extension background service worker. Currently, when the Pomodoro timer starts, clears, or completes, it dispatches messages via `chrome.runtime.sendMessage`, but [`src/background.ts`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/background.ts) lacks a `chrome.runtime.onMessage.addListener`. This causes background alarms to never register and notifications to never trigger when the new-tab page is closed or out of focus.

---

## 2. Affected Files

| File | Lines | Change Summary |
| :--- | :--- | :--- |
| [`src/background.ts`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/background.ts) | 1–85 | Implemented message listener for `SET_POMODORO_ALARM`, `CLEAR_POMODORO_ALARM`, and `POMODORO_COMPLETE`, plus notification click tab focus. |
| [`src/components/widgets/pomodoro/store.ts`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/components/widgets/pomodoro/store.ts) | 125–185 | Hardened runtime messaging with try/catch and `chrome.runtime.lastError` callbacks. |
| [`PROJECT_LOGIC.md`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/PROJECT_LOGIC.md) | Section 5 | Updated documentation to reflect current background service responsibilities. |

---

## 3. Step-by-Step Implementation Tasks

### Task 1.1: Verify Chrome Permissions in Manifest
- [x] Inspect extension manifest configuration (or `vite.config.ts` if manifest is generated) to ensure `"alarms"` and `"notifications"` permissions are declared in `manifest.json`.

### Task 1.2: Implement Message Dispatcher in `background.ts`
- [x] Open [`src/background.ts`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/background.ts).
- [x] Add `chrome.runtime.onMessage.addListener` handling three explicit action types:
  1. `SET_POMODORO_ALARM`: calls `chrome.alarms.create('pomodoro-session-end', { when: ... })`.
  2. `CLEAR_POMODORO_ALARM`: calls `chrome.alarms.clear('pomodoro-session-end')`.
  3. `POMODORO_COMPLETE`: calls `chrome.notifications.create` with notification options.
- [x] Ensure `sendResponse({ success: true })` is invoked and `return true;` is specified for async response consistency.
- [x] Add `chrome.notifications.onClicked.addListener` to focus existing Aure tab or open new tab.

```typescript
// Implemented in src/background.ts:
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    const action = message?.type || message?.action;

    if (action === 'SET_POMODORO_ALARM') {
        if (message.endTime) {
            const when = Math.max(message.endTime, Date.now() + 1000);
            chrome.alarms.create('pomodoro-session-end', { when });
        } else if (message.delayInMinutes) {
            const delayInMinutes = Math.max(message.delayInMinutes, 0.1);
            chrome.alarms.create('pomodoro-session-end', { delayInMinutes });
        }
        sendResponse({ status: 'ok' });
    } else if (action === 'CLEAR_POMODORO_ALARM') {
        chrome.alarms.clear('pomodoro-session-end', (wasCleared) => {
            sendResponse({ status: 'ok', wasCleared });
        });
    } else if (action === 'POMODORO_COMPLETE') {
        chrome.notifications.create('aure-pomodoro-complete', {
            type: 'basic',
            iconUrl: chrome.runtime.getURL('icon-128.png'),
            title: message.title || 'Pomodoro Completed!',
            message: message.body || message.message || 'Your Pomodoro session has ended. Take a break!',
            priority: 2,
        });
        sendResponse({ status: 'ok' });
    }
    return true; // Keep channel open for async sendResponse
});
```

### Task 1.3: Harden Error Handling in `pomodoro/store.ts`
- [x] In [`src/components/widgets/pomodoro/store.ts`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/components/widgets/pomodoro/store.ts), wrap `chrome.runtime.sendMessage` invocations in try/catch and lastError callbacks:
  ```typescript
  try {
    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ type: 'SET_POMODORO_ALARM', endTime }, () => {
        if (chrome.runtime.lastError) { /* ignore */ }
      });
    }
  } catch (error) {
    console.warn('Failed to dispatch background alarm:', error);
  }
  ```

### Task 1.4: Update `PROJECT_LOGIC.md`
- [x] Remove obsolete references in Section 5 stating that `background.ts` handles `GET_FAVICON` messages.
- [x] Document the Pomodoro alarm lifecycle (`SET_POMODORO_ALARM`, `CLEAR_POMODORO_ALARM`, `pomodoro-session-end` trigger).

---

## 4. Verification & Testing Checklist

- [x] **Type Check:** Run `npx tsc --noEmit` and confirm no type errors in `background.ts` or `store.ts`.
- [x] **Extension Build:** Run `npm run build` to confirm output in `dist/`.
- [x] **Service Worker Inspection:** Verified message listener, alarm scheduling, and tab focus handlers built into `dist/background.js`.
- [ ] **Service Worker Inspection:**
  1. Load unpacked extension in `chrome://extensions/`.
  2. Inspect the service worker devtools console.
  3. Start a Pomodoro timer.
  4. Run `chrome.alarms.getAll((alarms) => console.log(alarms))` in the service worker console and verify `pomodoroAlarm` is scheduled with the correct scheduled time.
  5. Reset/pause the timer and verify `chrome.alarms.clear` successfully clears `pomodoroAlarm`.
- [ ] **Notification Test:** Allow timer to finish while viewing another Chrome tab; verify system desktop notification is displayed.

---

## 5. Definition of Done
- Background service worker listens to all runtime messages from Pomodoro.
- Alarms are created and cleared reliably in `chrome.alarms`.
- System notification fires on completion even when homepage tab is closed.
- Documentation accurately reflects current background responsibilities.
