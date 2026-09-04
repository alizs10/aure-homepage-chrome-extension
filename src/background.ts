// background.ts

// Helper to convert ArrayBuffer to Base64 (Service Worker safe)
function arrayBufferToBase64(buffer: ArrayBuffer, contentType: string): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return `data:${contentType};base64,${btoa(binary)}`;
}

async function getFaviconAsBase64(domain: string): Promise<string | null> {
    if (!domain || typeof domain !== "string" || domain.trim() === "") {
        return null;
    }

    try {
        const safeDomain = encodeURIComponent(domain.trim());
        const googleFaviconUrl = `https://www.google.com/s2/favicons?sz=128&domain=${safeDomain}`;

        const imgRes = await fetch(googleFaviconUrl);
        if (!imgRes.ok) return null;

        const contentType = imgRes.headers.get("content-type") || "image/png";

        if (!contentType.startsWith("image/")) {
            return null;
        }

        const arrayBuffer = await imgRes.arrayBuffer();
        return arrayBufferToBase64(arrayBuffer, contentType);

    } catch (error) {
        console.warn(`Failed to fetch favicon for domain: ${domain}`, error);
        return null;
    }
}

// 🌟 Single, clean message listener
chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
    if (msg.type === "GET_FAVICON" && msg.domain) {
        getFaviconAsBase64(msg.domain).then((base64) => {
            sendResponse({ icon: base64 });
        });
        return true; // Keep the message channel open for async response
    }

    if (msg.type === 'SET_POMODORO_ALARM' && msg.endTime) {
        chrome.alarms.create('pomodoro-session-end', { when: msg.endTime });
        return false;
    }

    if (msg.type === 'CLEAR_POMODORO_ALARM') {
        chrome.alarms.clear('pomodoro-session-end');
        chrome.storage.local.remove('pomodoroAlarmContext');
        return false;
    }

    if (msg.type === 'POMODORO_COMPLETE') {
        // 🌟 FIX: Use a fixed notification ID to prevent duplicates from race conditions
        chrome.notifications.create('aure-pomodoro-complete', {
            type: 'basic',
            iconUrl: chrome.runtime.getURL('icon-128.png'),
            title: msg.title,
            message: msg.body,
        });
        return false;
    }

    return false;
});

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

            // 🌟 FIX: Use the exact same fixed notification ID
            chrome.notifications.create('aure-pomodoro-complete', {
                type: 'basic',
                iconUrl: chrome.runtime.getURL('icon-128.png'),
                title: `${sessionLabel} Complete!`,
                message: `Time for your ${nextLabel.toLowerCase()}.`,
            });
        }
    }
});