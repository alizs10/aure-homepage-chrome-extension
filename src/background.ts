// background.ts
import browser, { type Runtime } from 'webextension-polyfill';

const POMODORO_NOTIFICATION_PREFIX = 'aure-pomodoro-complete';
const LAST_NOTIFIED_STORAGE_KEY = 'pomodoroLastNotifiedEndTime';
let lastNotifiedSessionEndTime: number | null = null;

async function recordNotifiedSessionEndTime(sessionEndTime: number | null) {
    lastNotifiedSessionEndTime = sessionEndTime;
    if (sessionEndTime !== null) {
        await browser.storage.local.set({ [LAST_NOTIFIED_STORAGE_KEY]: sessionEndTime }).catch(() => {});
    } else {
        await browser.storage.local.remove(LAST_NOTIFIED_STORAGE_KEY).catch(() => {});
    }
}

async function wasSessionAlreadyNotified(sessionEndTime?: number): Promise<boolean> {
    if (!sessionEndTime) return false;
    if (lastNotifiedSessionEndTime === sessionEndTime) return true;

    try {
        const stored = await browser.storage.local.get(LAST_NOTIFIED_STORAGE_KEY);
        const persisted = stored[LAST_NOTIFIED_STORAGE_KEY];
        if (typeof persisted === 'number' && persisted === sessionEndTime) {
            lastNotifiedSessionEndTime = persisted;
            return true;
        }
    } catch {
        // Ignore storage read errors
    }

    return false;
}

function isPomodoroNotificationId(notificationId: string): boolean {
    return (
        notificationId === POMODORO_NOTIFICATION_PREFIX ||
        notificationId.startsWith(`${POMODORO_NOTIFICATION_PREFIX}-`)
    );
}

// Clear any previous Pomodoro notification and create one with a fresh ID so
// Firefox / macOS Notification Center never suppresses repeated alerts.
async function showPomodoroNotification(title: string, message: string) {
    try {
        const active = await browser.notifications.getAll();
        await Promise.all(
            Object.keys(active)
                .filter(isPomodoroNotificationId)
                .map((id) => browser.notifications.clear(id).catch(() => {}))
        );
    } catch {
        // Fallback: best-effort clear of legacy fixed ID
        await browser.notifications.clear(POMODORO_NOTIFICATION_PREFIX).catch(() => {});
    }

    const notificationId = `${POMODORO_NOTIFICATION_PREFIX}-${Date.now()}`;
    const iconUrl = browser.runtime.getURL('icon-128.png');

    try {
        await browser.notifications.create(notificationId, {
            type: 'basic',
            iconUrl,
            title,
            message,
        });
    } catch (error) {
        console.warn('Failed to create notification with icon, retrying without iconUrl:', error);
        await browser.notifications.create(notificationId, {
            type: 'basic',
            title,
            message,
        });
    }
}

// 🌟 Listen for the background alarm (fires even if tab is closed)
browser.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === 'pomodoro-session-end') {
        const result = await browser.storage.local.get('pomodoroAlarmContext');

        const context = result.pomodoroAlarmContext as {
            session: string;
            cyclePosition: number;
            longBreakInterval: number;
            notifications?: boolean;
            sessionEndTime?: number;
        } | undefined;

        await browser.storage.local.remove('pomodoroAlarmContext').catch(() => {});

        if (context && context.notifications !== false) {
            await recordNotifiedSessionEndTime(context.sessionEndTime ?? null);

            const { session, cyclePosition, longBreakInterval } = context;
            const sessionLabel =
                session === 'focus' ? 'Focus' : session === 'short-break' ? 'Short Break' : 'Long Break';

            let nextSession;
            if (session === 'focus') {
                nextSession = cyclePosition >= longBreakInterval ? 'long-break' : 'short-break';
            } else {
                nextSession = 'focus';
            }
            const nextLabel =
                nextSession === 'focus' ? 'Focus' : nextSession === 'short-break' ? 'Short Break' : 'Long Break';

            await showPomodoroNotification(
                `${sessionLabel} Complete!`,
                `Time for your ${nextLabel.toLowerCase()}.`
            );
        }
    }
});

// 🌟 Listen for runtime messages from pomodoro store
browser.runtime.onMessage.addListener(async (rawMessage: unknown, sender: Runtime.MessageSender) => {
    const message = (rawMessage || {}) as {
        type?: string;
        action?: string;
        endTime?: number;
        delayInMinutes?: number;
        sessionEndTime?: number;
        title?: string;
        body?: string;
        message?: string;
    };
    const action = message.type || message.action;

    if (action === 'SET_POMODORO_ALARM') {
        await recordNotifiedSessionEndTime(null);
        if (message.endTime) {
            const when = Math.max(message.endTime, Date.now() + 1000);
            await browser.alarms.create('pomodoro-session-end', { when });
        } else if (message.delayInMinutes) {
            const delayInMinutes = Math.max(message.delayInMinutes, 0.1);
            await browser.alarms.create('pomodoro-session-end', { delayInMinutes });
        }
        return { status: 'ok' };
    }

    if (action === 'CLEAR_POMODORO_ALARM') {
        const wasCleared = await browser.alarms.clear('pomodoro-session-end');
        return { status: 'ok', wasCleared };
    }

    if (action === 'CAPTURE_VISIBLE_TAB') {
        try {
            const win = await browser.windows.getLastFocused();
            const captureVisibleTab = browser.tabs.captureVisibleTab as unknown as (
                windowId: number | null,
                options: { format: 'png' }
            ) => Promise<string>;
            const dataUrl = await captureVisibleTab(win?.id ?? null, { format: 'png' });
            return { success: true, dataUrl };
        } catch (err: unknown) {
            console.error('Background captureVisibleTab failed', err);
            const errorMessage = err instanceof Error ? err.message : 'Capture failed';
            return { success: false, error: errorMessage };
        }
    }

    if (action === 'POMODORO_COMPLETE') {
        if (await wasSessionAlreadyNotified(message.sessionEndTime)) {
            return { status: 'ok', deduplicated: true };
        }

        await recordNotifiedSessionEndTime(message.sessionEndTime ?? null);
        await browser.alarms.clear('pomodoro-session-end').catch(() => {});
        await browser.storage.local.remove('pomodoroAlarmContext').catch(() => {});

        await showPomodoroNotification(
            message.title || 'Pomodoro Completed!',
            message.body || message.message || 'Your Pomodoro session has ended. Take a break!'
        );
        return { status: 'ok' };
    }

    // 🌟 Firefox New Tab Focus Swap: Firefox's browser chrome retains focus on the Awesomebar
    // during new-tab page loads and ignores page-level focus. Swapping to a freshly created tab
    // allows page content (the search input) to receive immediate focus.
    if (action === 'SWAP_FIREFOX_NEWTAB_FOR_FOCUS') {
        const sourceTab = sender?.tab;
        if (!sourceTab || sourceTab.id === undefined) {
            return { status: 'error', reason: 'no_source_tab' };
        }

        // Avoid swapping custom container tabs where cookieStoreId replication requires extra permissions
        if (sourceTab.cookieStoreId && sourceTab.cookieStoreId !== 'firefox-default') {
            return { status: 'skipped', reason: 'container_tab' };
        }

        try {
            const extensionUrl = browser.runtime.getURL('index.html#focused');
            const createProperties: {
                url: string;
                active: boolean;
                index?: number;
                windowId?: number;
            } = {
                url: extensionUrl,
                active: true,
            };

            if (typeof sourceTab.index === 'number') {
                createProperties.index = sourceTab.index;
            }
            if (typeof sourceTab.windowId === 'number') {
                createProperties.windowId = sourceTab.windowId;
            }

            const newTab = await browser.tabs.create(createProperties);

            const sourceTabId = sourceTab.id;
            const sourceTabWindowId = sourceTab.windowId;

            await browser.tabs.remove(sourceTabId);

            // Clean up the closed tab from "Recently Closed Tabs" so Cmd/Ctrl+Shift+T won't reopen it
            const sessionsApi = (browser as unknown as {
                sessions?: {
                    getRecentlyClosed?: (query?: unknown) => Promise<Array<{ tab?: { sessionId?: string; url?: string } }>>;
                    forgetClosedTab?: (windowId: number, sessionId: string) => Promise<void>;
                };
            }).sessions;

            const getRecentlyClosed = sessionsApi?.getRecentlyClosed?.bind(sessionsApi);
            const forgetClosedTab = sessionsApi?.forgetClosedTab?.bind(sessionsApi);

            if (getRecentlyClosed && forgetClosedTab) {
                setTimeout(async () => {
                    try {
                        const closed = await getRecentlyClosed({ maxResults: 5 });
                        const entry = closed.find(
                            (item) =>
                                item.tab &&
                                item.tab.sessionId &&
                                (item.tab.url?.includes('index.html') || item.tab.url?.includes('newtab'))
                        );
                        if (entry?.tab?.sessionId && sourceTabWindowId !== undefined) {
                            await forgetClosedTab(sourceTabWindowId, entry.tab.sessionId);
                        }
                    } catch {
                        // Best effort cleanup; safe to ignore errors
                    }
                }, 150);
            }

            return { status: 'ok', newTabId: newTab.id };
        } catch (error) {
            console.error('Failed to swap Firefox new tab for focus:', error);
            return { status: 'error', error: String(error) };
        }
    }
});

// 🌟 Helper: Focus existing Aure tab or open new tab (handles macOS minimized windows)
async function openOrFocusAureTab() {
    try {
        const extensionUrl = browser.runtime.getURL('index.html');
        // Safely query all tabs without browser-specific match patterns
        const tabs = await browser.tabs.query({});
        const targetTab = tabs.find(
            (t) => t.url && (t.url.startsWith(extensionUrl) || t.url === 'chrome://newtab/' || t.url === 'about:newtab')
        );

        // If an existing Aure tab is already open, activate it and unminimize/focus its window
        if (targetTab && targetTab.id !== undefined) {
            await browser.tabs.update(targetTab.id, { active: true });
            if (targetTab.windowId !== undefined) {
                const win = await browser.windows.get(targetTab.windowId);
                await browser.windows.update(targetTab.windowId, {
                    focused: true,
                    ...(win.state === 'minimized' ? { state: 'normal' } : {}),
                });
            }
            return;
        }

        // If no Aure tab exists, inspect existing windows
        const windows = await browser.windows.getAll();
        if (windows.length === 0) {
            // No windows exist (macOS dock only)
            await browser.windows.create({
                url: extensionUrl,
                focused: true,
                state: 'normal',
            });
            return;
        }

        // A window exists: unminimize if needed and focus
        const targetWindow = windows.find((w) => w.focused) || windows[0];
        if (targetWindow.id !== undefined) {
            await browser.windows.update(targetWindow.id, {
                focused: true,
                ...(targetWindow.state === 'minimized' ? { state: 'normal' } : {}),
            });

            await browser.tabs.create({
                windowId: targetWindow.id,
                url: extensionUrl,
                active: true,
            });
        }
    } catch (error) {
        console.error('Failed to focus or open Aure tab on notification click:', error);
    }
}

// 🌟 Focus existing Aure tab or open new tab when notification is clicked
browser.notifications.onClicked.addListener(async (notificationId) => {
    if (isPomodoroNotificationId(notificationId)) {
        await browser.notifications.clear(notificationId).catch(() => {});
        await openOrFocusAureTab();
    }
});