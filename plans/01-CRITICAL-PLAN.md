# Plan 01: Critical Severity Remediation

**Focus:** Background Service Worker Message Handling & Alarm Subsystem  
**Target Issue:** [`ARCH-001`](../ARCHITECTURE_AUDIT.md#arch-001-missing-background-message-handlers--broken-alarm-system)  
**Estimated Time:** 1 hour  
**Status:** `[ ] Not Started`

---

## 1. Overview & Objective
Resolve the broken communication between the Pomodoro widget store and the Chrome extension background service worker. Currently, when the Pomodoro timer starts, clears, or completes, it dispatches messages via `chrome.runtime.sendMessage`, but [`src/background.ts`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/background.ts) lacks a `chrome.runtime.onMessage.addListener`. This causes background alarms to never register and notifications to never trigger when the new-tab page is closed or out of focus.

---

## 2. Affected Files

| File | Lines | Change Summary |
| :--- | :--- | :--- |
| [`src/background.ts`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/background.ts) | 1–13 | Implement message listener for `SET_POMODORO_ALARM`, `CLEAR_POMODORO_ALARM`, and `POMODORO_COMPLETE`. |
| [`src/components/widgets/pomodoro/store.ts`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/components/widgets/pomodoro/store.ts) | 135, 170, 180 | Harden message sending with error handling and fallback checks. |
| [`PROJECT_LOGIC.md`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/PROJECT_LOGIC.md) | Section 5 | Update documentation to reflect current background service responsibilities. |

---

## 3. Step-by-Step Implementation Tasks

### Task 1.1: Verify Chrome Permissions in Manifest
- [ ] Inspect extension manifest configuration (or `vite.config.ts` if manifest is generated) to ensure `"alarms"` and `"notifications"` permissions are declared in `manifest.json`.

### Task 1.2: Implement Message Dispatcher in `background.ts`
- [ ] Open [`src/background.ts`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/background.ts).
- [ ] Add `chrome.runtime.onMessage.addListener` handling three explicit action types:
  1. `SET_POMODORO_ALARM`: calls `chrome.alarms.create('pomodoroAlarm', { delayInMinutes: message.delayInMinutes })`.
  2. `CLEAR_POMODORO_ALARM`: calls `chrome.alarms.clear('pomodoroAlarm')`.
  3. `POMODORO_COMPLETE`: calls `chrome.notifications.create` with notification options.
- [ ] Ensure `sendResponse({ success: true })` is invoked and `return true;` is specified for async response consistency.

```typescript
// Proposed Implementation in src/background.ts:
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === 'SET_POMODORO_ALARM') {
    const delayInMinutes = Math.max(message.delayInMinutes, 0.1); // Prevent 0/negative delays
    chrome.alarms.create('pomodoroAlarm', { delayInMinutes });
    sendResponse({ status: 'ok', delayInMinutes });
  } else if (message.action === 'CLEAR_POMODORO_ALARM') {
    chrome.alarms.clear('pomodoroAlarm', (wasCleared) => {
      sendResponse({ status: 'ok', wasCleared });
    });
  } else if (message.action === 'POMODORO_COMPLETE') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon128.png',
      title: 'Pomodoro Completed!',
      message: 'Your Pomodoro session has ended. Take a break!',
      priority: 2,
    });
    sendResponse({ status: 'ok' });
  }
  return true; // Keep channel open for async sendResponse
});
```

### Task 1.3: Harden Error Handling in `pomodoro/store.ts`
- [ ] In [`src/components/widgets/pomodoro/store.ts`](file:///Users/alizs/Documents/codes/aure-homepage-chrome-extention/src/components/widgets/pomodoro/store.ts), wrap `chrome.runtime.sendMessage` invocations in safe guards:
  ```typescript
  try {
    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ action: 'SET_POMODORO_ALARM', delayInMinutes: targetMinutes });
    }
  } catch (error) {
    console.warn('Failed to dispatch background alarm:', error);
  }
  ```
  This prevents runtime unhandled rejection crashes when running in development/preview environments outside Chrome extension context.

### Task 1.4: Update `PROJECT_LOGIC.md`
- [ ] Remove obsolete references in Section 5 stating that `background.ts` handles `GET_FAVICON` messages.
- [ ] Document the Pomodoro alarm lifecycle (`SET_POMODORO_ALARM`, `CLEAR_POMODORO_ALARM`, `pomodoroAlarm` trigger).

---

## 4. Verification & Testing Checklist

- [ ] **Type Check:** Run `npx tsc --noEmit` and confirm no type errors in `background.ts` or `store.ts`.
- [ ] **Extension Build:** Run `npm run build` to confirm output in `dist/`.
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
