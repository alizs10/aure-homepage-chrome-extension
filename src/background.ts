// background.ts

// 🌟 Listen for the background alarm (fires even if tab is closed)
chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === 'pomodoro-session-end') {
        const result = await chrome.storage.local.get('pomodoroAlarmContext');

        const context = result.pomodoroAlarmContext as {
            session: string;
            cyclePosition: number;
            longBreakInterval: number
        } | undefined;

        if (context) {
            const { session, cyclePosition, longBreakInterval } = context;
            const sessionLabel = session === 'focus' ? 'Focus' : session === 'short-break' ? 'Short Break' : 'Long Break';

            let nextSession;
            if (session === 'focus') {
                nextSession = cyclePosition >= longBreakInterval ? 'long-break' : 'short-break';
            } else {
                nextSession = 'focus';
            }
            const nextLabel = nextSession === 'focus' ? 'Focus' : nextSession === 'short-break' ? 'Short Break' : 'Long Break';

            // 🌟 Use fixed notification ID so multiple alerts don't stack up
            chrome.notifications.create('aure-pomodoro-complete', {
                type: 'basic',
                iconUrl: chrome.runtime.getURL('icon-128.png'),
                title: `${sessionLabel} Complete!`,
                message: `Time for your ${nextLabel.toLowerCase()}.`,
                priority: 2,
            });
        }
    }
});

// 🌟 Listen for runtime messages from pomodoro store
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
    return true; // Keep channel open for asynchronous sendResponse
});

// 🌟 Helper: Focus existing Aure tab or open new tab (handles macOS minimized windows)
async function openOrFocusAureTab() {
    try {
        const extensionUrl = chrome.runtime.getURL('index.html');
        const tabs = await chrome.tabs.query({ url: [extensionUrl, 'chrome://newtab/*'] });

        // If an existing Aure tab is already open, activate it and unminimize/focus its window
        if (tabs.length > 0 && tabs[0].id !== undefined) {
            const tab = tabs[0];
            await chrome.tabs.update(tab.id, { active: true });
            if (tab.windowId !== undefined) {
                const win = await chrome.windows.get(tab.windowId);
                await chrome.windows.update(tab.windowId, {
                    focused: true,
                    ...(win.state === 'minimized' ? { state: 'normal' } : {}),
                });
            }
            return;
        }

        // If no Aure tab exists, inspect existing Chrome windows
        const windows = await chrome.windows.getAll();
        if (windows.length === 0) {
            // No Chrome windows exist (macOS dock only)
            await chrome.windows.create({
                url: extensionUrl,
                focused: true,
                state: 'normal',
            });
            return;
        }

        // A window exists: unminimize if needed and focus
        const targetWindow = windows.find((w) => w.focused) || windows[0];
        if (targetWindow.id !== undefined) {
            await chrome.windows.update(targetWindow.id, {
                focused: true,
                ...(targetWindow.state === 'minimized' ? { state: 'normal' } : {}),
            });

            await chrome.tabs.create({
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
chrome.notifications.onClicked.addListener(async (notificationId) => {
    if (notificationId === 'aure-pomodoro-complete') {
        chrome.notifications.clear(notificationId);
        await openOrFocusAureTab();
    }
});