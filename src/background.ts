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

// 🌟 Focus existing Aure tab or open new tab when notification is clicked
chrome.notifications.onClicked.addListener(async (notificationId) => {
    if (notificationId === 'aure-pomodoro-complete') {
        chrome.notifications.clear(notificationId);
        try {
            const extensionUrl = chrome.runtime.getURL('index.html');
            const tabs = await chrome.tabs.query({ url: [extensionUrl, 'chrome://newtab/*'] });
            if (tabs.length > 0 && tabs[0].id !== undefined) {
                await chrome.tabs.update(tabs[0].id, { active: true });
                if (tabs[0].windowId !== undefined) {
                    await chrome.windows.update(tabs[0].windowId, { focused: true });
                }
            } else {
                await chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
            }
        } catch (error) {
            console.error('Failed to focus or open Aure tab on notification click:', error);
        }
    }
});