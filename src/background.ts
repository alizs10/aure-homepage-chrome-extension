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